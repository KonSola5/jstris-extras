import { Config } from "./index.ts";

const attemptLoadSFX = function () {
  if (typeof loadSFX == "function") {
    loadSFX(...arguments);
  } else {
    setTimeout(() => attemptLoadSFX(...arguments), 200);
  }
};
const loadSound = (name, url) => {
  if (!name || !url) {
    return;
  }
  let soundURL = url.url;
  if (soundURL) {
    let registeredSound = createjs.Sound.registerSound(soundURL, name);
    if (!registeredSound || !createjs.Sound._idHash[name]) {
      return void console.error(
        "loadSounds error: src parse / cannot init plugins, id=" +
          name +
          (false === registeredSound ? ", rs=false" : ", no _idHash")
      );
    }
    createjs.Sound._idHash[name].sndObj = url;
  }
};

const loadDefaultSFX = () => {
  console.log("loading default sfx");
  try {
    loadSFX(new window.SFXsets[localStorage["SFXset"]].data());
  } catch (e) {
    // just in case
    console.log("failed loading default sfx: " + e);
  }
  return;
};

const changeSFX = () => {
  var json = Config.settings.customSFX_JSON;
  let sfx = null;

  if (json) {
    try {
      sfx = JSON.parse(json);
      // document.getElementById("customSFX_JSON_err").textContent = "Loaded " + (sfx.name || "custom sounds");
    } catch (e) {
      console.log("SFX json was invalid.");
      // document.getElementById("customSFX_JSON_err").textContent = "SFX json is invalid.";
    }
  } else {
    // document.getElementById("customSFX_JSON_err").textContent = "";
  }
  if (typeof Game == "function") {
    if (!Config.settings.customSFXEnabled || !sfx) {
      loadDefaultSFX();
    } else {
      console.log("Changing SFX...");
      console.log(sfx);

      let csfx = loadCustomSFX(sfx);
      attemptLoadSFX(csfx);
    }
  }

  /*
    // functionality here now addressed in replayer-sfx.js
    if (typeof window.View == "function" && typeof window.Live != "function") { //force sfx on replayers
        let onready = View.prototype.onReady
        View.prototype.onReady = function () {
            let val = onready.apply(this, arguments);
            let csfx = loadCustomSFX(sfx)
            this.SFXset = csfx
            //   loadReplayerSFX(csfx)
            //   console.log(this.SFXset)
            return val
        }
    }
    */
};

export const initCustomSFX = () => {
  if (!createjs) return;

  if (typeof Game == "function") {
    let onnextblock = Game.prototype.getNextBlock;
    Game.prototype.getNextBlock = function () {
      if (Config.settings.customPieceSpawnSFXEnabled) {
        this.playCurrentPieceSound();
      }
      let val = onnextblock.apply(this, arguments);
      return val;
    };
    let onholdblock = Game.prototype.holdBlock;
    Game.prototype.holdBlock = function () {
      if (Config.settings.customPieceSpawnSFXEnabled) {
        this.playCurrentPieceSound();
      }
      let val = onholdblock.apply(this, arguments);
      return val;
    };
  }

  /*   let onPlay = createjs.Sound.play
       createjs.Sound.play = function () {
           console.log(arguments[0])
           let val = onPlay.apply(this, arguments)
           return val
       }*/
  changeSFX(Config.settings.customSFX_JSON);
  Config.onChange("customSFX_JSON", changeSFX);
  Config.onChange("customSFXEnabled", changeSFX);
  Config.onChange("customPieceSpawnSFXEnabled", changeSFX);
  return true;
};

export const loadCustomSFX = (sfx = {}) => {
  const SOUNDS = [
    "hold",
    "linefall",
    "lock",
    "harddrop",
    "rotate",
    "success",
    "garbage",
    "b2b",
    "land",
    "move",
    "died",
    "ready",
    "go",
    "golive",
    "ding",
    "msg",
    "fault",
    "item",
    "pickup",
  ];
  let SCORES = [
    "SOFT_DROP",
    "HARD_DROP",
    "CLEAR1",
    "CLEAR2",
    "CLEAR3",
    "CLEAR4",
    "TSPIN_MINI",
    "TSPIN",
    "TSPIN_MINI_SINGLE",
    "TSPIN_SINGLE",
    "TSPIN_DOUBLE",
    "TSPIN_TRIPLE",
    "PERFECT_CLEAR",
    "COMBO",
    "CLEAR5",
  ];
  function CustomSFXset() {
    this.volume = 1;
  }
  CustomSFXset.prototype = new BaseSFXset();
  CustomSFXset.prototype.getSoundUrlFromObj = function (obj) {
    return obj.url;
  };

  CustomSFXset.prototype.getClearSFX = function (altClearType, clearType, b2b, combo) {
    let sounds = [],
      prefix = "";
    let specialSound = null;
    let override = false;
    if (this.specialScoring) {
      let scorings = [this.specialScoring[SCORES[clearType]]];
      if ((clearType > 4 && clearType <= 11) || clearType == 14) {
        if (this.specialScoring.TSPINORTETRIS) {
          scorings.push(this.specialScoring.TSPINORTETRIS);
        }
      } else if (clearType == 127) {
        if (this.specialScoring.ALLSPIN) {
          scorings.push(this.specialScoring.ALLSPIN);
        }
      }
      for (let scoring of scorings) {
        if (Array.isArray(scoring)) {
          let bestFit = { score: 0.5, sound: null, combo: -1 };
          for (let sfx of scoring) {
            let score = 0;
            if (sfx.hasOwnProperty("b2b") && sfx.b2b == b2b) {
              score += 1;
            }
            if (sfx.hasOwnProperty("combo") && sfx.combo <= combo) {
              score += 1;
            }
            if (bestFit.score < score) {
              override = sfx.override;
              bestFit = { score: score, sound: sfx.name, combo: combo };
            } else if (bestFit.score == score) {
              if (sfx.combo && combo > bestFit.combo) {
                override = sfx.override;
                bestFit = { score: score, sound: sfx.name, combo: combo };
              }
            }
          }
          if (bestFit.sound != null) {
            specialSound = bestFit.sound;
            sounds.push(specialSound);
          }
        }
      }

      if (this.specialScoring.ANY) {
        let bestFit = { score: 0, sound: null, combo: -1 };

        for (let sfx of this.specialScoring.ANY) {
          let score = 0;
          if (sfx.hasOwnProperty("b2b")) {
            if (sfx.b2b == b2b) score += 1;
            else continue;
          }

          if (sfx.hasOwnProperty("combo")) {
            if (sfx.combo <= combo) score += 1;
            else continue;
          }
          if (bestFit.score < score) {
            override = sfx.override;
            bestFit = { score: score, sound: sfx.name, combo: combo };
          } else if (bestFit.score == score) {
            if (sfx.combo && combo > bestFit.combo) {
              override = sfx.override;
              bestFit = { score: score, sound: sfx.name, combo: combo };
            }
          }
        }
        if (bestFit.sound != null) {
          specialSound = bestFit.sound;
          sounds.push(specialSound);
        }
      }
    }
    if (sfx.hasOwnProperty(b2b) && b2b) {
      sounds.push("b2b");
    }
    if (combo >= 0) {
      sounds.push(this.getComboSFX(combo));
    }
    if (this.scoring && (!specialSound || override == false)) {
      sounds.push(prefix + this.getScoreSFX(clearType));
    }
    if (altClearType == Score.A.PERFECT_CLEAR) {
      sounds.push(prefix + this.getScoreSFX(altClearType));
    }
    //   console.log(sounds)
    return sounds;
  };
  let customSFX = new CustomSFXset();

  /*    function CustomVFXset() {
            this.volume = 1
        }
        CustomVFXset.prototype = new NullSFXset
        CustomVFXset.prototype.getSoundUrlFromObj = function (obj) {
            return obj.url
        }
        let customVFX = new CustomVFXset*/

  for (let name of SOUNDS) {
    if (sfx.hasOwnProperty(name)) {
      customSFX[name] = {
        url: sfx[name],
      };
    } else {
      customSFX[name] = {
        url: "null.wav",
      };
    }
  }
  if (sfx.comboTones) {
    if (Array.isArray(sfx.comboTones)) {
      customSFX.comboTones = [];
      for (let tone of sfx.comboTones) {
        if (typeof tone === "string") {
          customSFX.comboTones.push({ url: tone });
        } else {
          customSFX.comboTones.push({ url: "null.wav" });
        }
      }
    } else if (typeof sfx.comboTones == "object") {
      if (sfx.comboTones.duration && sfx.comboTones.spacing && sfx.comboTones.cnt) {
        customSFX.comboTones = {
          url: sfx.comboTones.url,
          duration: sfx.comboTones.duration,
          spacing: sfx.comboTones.spacing,
          cnt: sfx.comboTones.cnt,
        };
      }
    }
  }
  if (sfx.specialScoring && typeof sfx.specialScoring == "object") {
    for (let key in sfx.specialScoring) {
      if (!Array.isArray(sfx.specialScoring[key])) continue;
      for (let i in sfx.specialScoring[key]) {
        let sound = sfx.specialScoring[key][i];
        sound.name = "CUSTOMSFX" + key + i;
        loadSound(sound.name, sound);
      }
    }
    customSFX.specialScoring = sfx.specialScoring;
  }
  if (sfx.scoring && typeof sfx.scoring == "object") {
    customSFX.scoring = Array(15);

    for (let key in sfx.scoring) {
      let i = SCORES.indexOf(key);
      if (i < 0) continue;
      customSFX.scoring[i] = { url: sfx.scoring[key] };
    }
  }
  if (sfx.spawns && typeof sfx.spawns == "object") {
    let scores = ["I", "O", "T", "L", "J", "S", "Z"];
    for (let key in sfx.spawns) {
      let i = scores.indexOf(key);
      if (i > 0) {
        loadSound("b_" + key, { url: sfx.spawns[key] });
      }
    }
  } else {
    let scores = ["I", "O", "T", "L", "J", "S", "Z"];
    for (var key of scores) {
      loadSound("b_" + key, { url: "null.wav" });
    }
  }
  return customSFX;
  //    attemptLoadSFX(customSFX);
};
