import { Config } from "jstris-extras";
import { CustomSFXDefinition, loadCustomSFX } from "$/custom-music/sfxLoader.js";
import { Modes } from "$/utils/enums.js";

function shouldRenderEffectsOnView(view: SlotView) {
  return view.holdCanvas && view.holdCanvas.width >= 70;
}

export const initReplayerSFX = () => {
  if (typeof View == "function" && typeof Live != "function" && !location.href.includes("export"))
    initCustomReplaySFX();
  if (typeof SlotView == "function") initOpponentSFX();
};

export const initCustomReplaySFX = () => {
  console.log("init replayer sfx");
  const json = Config.get("customSFX_JSON");
  let sfx: CustomSFXDefinition = {};
  if (json) {
    try {
      sfx = JSON.parse(json);
      // document.getElementById("customSFX_JSON_err").textContent = "Loaded " + (sfx.name || "custom sounds");
    } catch (_error) {
      console.log("SFX json was invalid.");
      // document.getElementById("customSFX_JSON_err").textContent = "SFX json is invalid.";
    }
  } else {
    // document.getElementById("customSFX_JSON_err").textContent = "";
  }

  if (!Config.get("customSFXEnabled") || !Config.get("customSFX_JSON")) {
    return;
  }

  const customSFXSet = loadCustomSFX(sfx);
  console.log(customSFXSet);
  const oldOnReady = View.prototype.onReady;
  View.prototype.onReady = function (...args) {
    this.changeSFX(customSFXSet);
    return oldOnReady.apply(this, args);
  };

  // spectator replayer sfx

  View.prototype.onLinesCleared = function (_attack, _comboAttack, scoringOptions) {
    if (!scoringOptions) return;
    const {type, b2b, cmb} = scoringOptions;
    const suhrit: [number, number, boolean, number] = [type, type, b2b && this.g.isBack2Back, cmb];
    const sounds = this.SFXset!.getClearSFX(...suhrit);

    if (Array.isArray(sounds)) sounds.forEach((sound) => this.SEenabled && createjs.Sound.play(sound));
    else this.playReplayerSound(sounds);

    // --- old onLinesCleared code ---

    // don't need this line anymore
    // this.SEenabled && createjs.Sound.play(this.SFXset.getComboSFX(this.g.comboCounter));
    if (this.g.pmode) {
      switch (this.g.pmode) {
        case Modes.TSD20: {
          this.lrem.textContent = String(this.g.gamedata.TSD);
          break;
        }
        case Modes.PC_MODE: {
          this.lrem.textContent = String(this.g.gamedata.PCs);
          break;
        }
        case Modes.ULTRA:
          break;
        default: {
          this.lrem.textContent = String(this.g.linesRemaining);
          break;
        }
      }
    }
  };
};
const initOpponentSFX = () => {
  // spectator replayer sfx

  console.log("init opponent sfx");
  SlotView.prototype.playReplayerSound = function (soundOrSounds) {
    let volume = Config.get("opponentSFXVolumeMultiplier") || 0;

    if (!shouldRenderEffectsOnView(this)) {
      volume /= 4;
    }
    const enabled = !!localStorage.getItem("SE") && Config.get("opponentSFXEnabled");
    if (enabled) {
      if (Array.isArray(soundOrSounds)) {
        soundOrSounds.forEach((sound) => {
          const instance = createjs.Sound.play(sound);
          instance.volume = volume;
        });
      } else {
        const instance = createjs.Sound.play(soundOrSounds);
        instance.volume = volume;
      }
    }
  };
  const oldOnBlockHold = SlotView.prototype.onBlockHold;
  SlotView.prototype.onBlockHold = function (...args) {
    this.playReplayerSound("hold");
    oldOnBlockHold.apply(this, args);
  };

  const oldOnBlockMove = SlotView.prototype.onBlockMove;
  SlotView.prototype.onBlockMove = function (...args) {
    this.playReplayerSound("move");
    oldOnBlockMove.apply(this, args);
  };
  const oldOnGameOver = SlotView.prototype.onGameOver;
  SlotView.prototype.onGameOver = function (...args) {
    if (this.g.queue.length !== 0)
      // ignore bugged top outs from static queues ending in map vs. change this when jez fixes that
      this.playReplayerSound("died");
    oldOnGameOver.apply(this, args);
  };
  const oldOnBlockLocked = SlotView.prototype.onBlockLocked;
  SlotView.prototype.onBlockLocked = function (...args) {
    this.playReplayerSound("lock");
    oldOnBlockLocked.apply(this, args);
  };
  const oldOnLinesCleared = SlotView.prototype.onLinesCleared;
  SlotView.prototype.onLinesCleared = function (attack, comboAttack, { type, b2b, cmb }, ...args) {
    const game = this.slot.gs.p;
    const suhrit: [number, number, boolean, number] = [type, type, b2b && this.g.isBack2Back, cmb];
    const sounds = game.SFXset!.getClearSFX(...suhrit);

    if (Array.isArray(sounds)) sounds.forEach((sound) => this.playReplayerSound(sound));
    else this.playReplayerSound(sounds);

    oldOnLinesCleared.apply(this, [attack, comboAttack, { type, b2b, cmb }, ...args]);
  };
  if (typeof Game == "function") {
    const oldReadyGo = Game.prototype.readyGo;

    // bot sfx
    Game.prototype.readyGo = function (...args) {
      const returnValue = oldReadyGo.apply(this, args);
      console.log("injected bot sfx");
      if (this.Bots && this.Bots.bots) {
        this.Bots.bots.forEach((bot) => {
          if (bot.g) {
            bot.g.SFXset = this.SFXset;
            bot.g.playSound = (sound) => {
              if (sound) {
                SlotView.prototype.playReplayerSound(sound);
              }
            };
            const botProto: typeof bot = Object.getPrototypeOf(bot);

            const oldOnBotMove = botProto.onBotMove;
            botProto.onBotMove = function (...args) {
              const returnValue = oldOnBotMove.apply(this, args);
              SlotView.prototype.playReplayerSound("harddrop");
              return returnValue;
            };
            const oldOnBotGameOver = botProto.onGameOver;
            botProto.onGameOver = function (...args) {
              const returnValue = oldOnBotGameOver.apply(this, args);
              // when you restart the game, all the bots get gameovered
              if (!bot.p.p.gameEnded) SlotView.prototype.playReplayerSound("died");
              return returnValue;
            };
          }
        });
      }

      return returnValue;
    };
  }

  // replay replayer sfx
};
