import { Config } from "../jstris-extras.js";

// expands object types one level deep
type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

// expands object types recursively
type ExpandRecursively<T> = T extends object
  ? T extends infer O ? { [K in keyof O]: ExpandRecursively<O[K]> } : never
  : T;

// Really hacky way to tell TypeScipt that _idHash exists on CreateJS static object.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare class IDHash {
  static _idHash: { [name: string]: {
    sndObj: object;
    src: string
  } }
}
type SoundWithIDHash = createjs.Sound & typeof IDHash

interface VanillaSFXEvents {
  /** Sound played when the player holds a piece. */
  hold?: string;
  /**
   * Sound played when:
   * - any amount of lines are cleared,
   * - there are **no** defined combo tones.
   */
  linefall?: string;
  /** Sound played when the piece locks by itself due to lock delay. */
  lock?: string;
  /** Sound played when the piece locks because of a hard drop. */
  harddrop?: string;
  /**
   * Sound played when:
   * - rotation sounds are enabled in Jstris settings,
   * - the player rotates a piece.
   */
  rotate?: string;
  /** Sound played when the player completes a usermode. */
  success?: string;
  /**
   * Currently unused.
   *
   * Sound played when the player tanks garbage.
   */
  garbage?: string;
  /** Sound played alongside the usual line clear sound if it's a Back-to-back clear. */
  b2b?: string;
  /** Sound played when the piece lands on a stack. */
  land?: string;
  /** Sound played when the piece moves left/right. */
  move?: string;
  /** Sound played when the player tops out. */
  died?: string;
  /** Sound played during the "READY?" phase. */
  ready?: string;
  /** Sound played during the "GO!" phase during the singleplayer mode countdown. */
  go?: string;
  /** Sound played during the "GO!" phase during the multiplayer mode countdown. */
  golive?: string;
  /** Sound played when join sound notifications are enabled and the player joins the room. */
  ding?: string;
  /** Sound played when a friend messages you. */
  msg?: string;
  /**
   * Sound played when:
   * - finesse fault sounds are enabled in Jstris settings,
   * - the player performs a finesse fault.
   */
  fault?: string;
  /** Sound played when a player uses an April Fools item. */
  item?: string;
  /** Sound played when a player collects an April Fools item by clearing the [?] block. */
  pickup?: string;
}

interface CustomScoringDefinition {
  /** Soft drop */
  SOFT_DROP?: string;
  /** Hard drop */
  HARD_DROP?: string;
  /** Single  */
  CLEAR1?: string;
  /** Double */
  CLEAR2?: string;
  /** Triple */
  CLEAR3?: string;
  /** Quadruple */
  CLEAR4?: string;
  /** Mini T-spin (or mini spin in general if All-spin is enabled) */
  TSPIN_MINI?: string;
  /** T-spin zero (or spin zero in general if All-spin is enabled) */
  TSPIN?: string;
  /** Mini T-spin Single (or mini spin Single in general if All-spin is enabled) */
  TSPIN_MINI_SINGLE?: string;
  /** T-spin Single (or mini spin Single in general if All-spin is enabled) */
  TSPIN_SINGLE?: string;
  /** T-spin Double (or spin Double in general if All-spin is enabled) */
  TSPIN_DOUBLE?: string;
  /** T-spin Triple or better (or spin Triple+ in general if All-spin is enabled) */
  TSPIN_TRIPLE?: string;
  /** Perfect Clear */
  PERFECT_CLEAR?: string;
  /** Combo (practically unusued) */
  COMBO?: string;
  /** Quintuple or better */
  CLEAR5?: string;
}

interface CustomSpawnDefinition {
  I?: string;
  O?: string;
  T?: string;
  L?: string;
  J?: string;
  S?: string;
  Z?: string;
  // Maybe I can expand this to non-tetrominoes?
}

interface SpecialScoring {
  // Scoring extensions
  SOFT_DROP?: SpecialScoringDefinition[];
  HARD_DROP?: SpecialScoringDefinition[];
  CLEAR1?: SpecialScoringDefinition[];
  CLEAR2?: SpecialScoringDefinition[];
  CLEAR3?: SpecialScoringDefinition[];
  CLEAR4?: SpecialScoringDefinition[];
  TSPIN_MINI?: SpecialScoringDefinition[];
  TSPIN?: SpecialScoringDefinition[];
  TSPIN_MINI_SINGLE?: SpecialScoringDefinition[];
  TSPIN_SINGLE?: SpecialScoringDefinition[];
  TSPIN_DOUBLE?: SpecialScoringDefinition[];
  TSPIN_TRIPLE?: SpecialScoringDefinition[];
  PERFECT_CLEAR?: SpecialScoringDefinition[];
  COMBO?: SpecialScoringDefinition[];
  CLEAR5?: SpecialScoringDefinition[];
  // New events
  ALLSPIN?: SpecialScoringDefinition[];
  TSPINORTETRIS?: SpecialScoringDefinition[];
  ANY?: SpecialScoringDefinition[];
}

interface SpecialScoringDefinition {
  url: string;
  combo?: number;
  b2b?: boolean;
  override?: boolean;
  /** Name of the custom sound event. Inserted programatically. */
  name?: string;
}

interface BestFit {
  score: number;
  sound?: string | null;
  combo: number;
}

function attemptLoadSFX(sfx: BaseSFXset, useVoice?: 0 | 1) {
  if (typeof loadSFX == "function") {
    loadSFX(sfx, useVoice);
  } else {
    setTimeout(() => attemptLoadSFX(sfx, useVoice), 200);
  }
};
function loadSound<T extends {url: string}>(name: string, sound: T) {
  if (!name || !sound) {
    return;
  }
  const soundURL: string = sound.url;
  if (soundURL) {
    const registeredSound = createjs.Sound.registerSound(soundURL, name);
      if (!registeredSound || !(createjs.Sound as unknown as SoundWithIDHash)._idHash[name]) {
        console.error(
        "loadSounds error: src parse / cannot init plugins, id=" +
          name + (registeredSound === false ? ", rs=false" : ", no _idHash"));
      return;
    }
    (createjs.Sound as unknown as SoundWithIDHash)._idHash[name].sndObj = sound;
  }
};

function loadDefaultSFX(){
  console.log("loading default sfx");
  try {
    loadSFX(new SFXsets[localStorage["SFXset"]].data(), 0);
  } catch (e) {
    // just in case
    console.log("failed loading default sfx: " + e);
  }
  return;
};

function changeSFX() {
  const sfx: CustomSFXDefinition | null = Config.settings.get("customSFX");

  if (typeof Game == "function") {
    if (!Config.settings.get("customSFXEnabled") || !sfx) {
      loadDefaultSFX();
    } else {
      console.log("Changing SFX...");
      console.log(sfx);

      const customSFX = loadCustomSFX(sfx);
      attemptLoadSFX(customSFX);
    }
  }
};

export const initCustomSFX = () => {
  if (!createjs) return;

  if (typeof Game == "function") {
    const oldGetNextBlock = Game.prototype.getNextBlock;
    Game.prototype.getNextBlock = function (...args) {
      if (Config.settings.get("customPieceSpawnSFXEnabled")) {
        this.playCurrentPieceSound();
      }
      const val = oldGetNextBlock.apply(this, args);
      return val;
    };
    const oldHoldBlock = Game.prototype.holdBlock;
    Game.prototype.holdBlock = function (...args) {
      if (Config.settings.get("customPieceSpawnSFXEnabled")) {
        this.playCurrentPieceSound();
      }
      const val = oldHoldBlock.apply(this, args);
      return val;
    };
  }

  /*   let onPlay = createjs.Sound.play
       createjs.Sound.play = function () {
           console.log(arguments[0])
           let val = onPlay.apply(this, arguments)
           return val
       }*/
  changeSFX();
  Config.onChange("customSFX", changeSFX);
  Config.onChange("customSFXEnabled", changeSFX);
  Config.onChange("customPieceSpawnSFXEnabled", changeSFX);
  return true;
};

export interface CustomSFXDefinition extends VanillaSFXEvents {
  /** Name of the custom SFX pack. */
  name?: string;
  comboTones?: (string | null)[] | Jstris.SFXDefinition;
  scoring?: CustomScoringDefinition;
  spawns?: CustomSpawnDefinition;
  specialScoring?: SpecialScoring;
}

const SpecialScoringKeys = [
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
  "ALLSPIN",
  "TSPINORTETRIS",
  "ANY",
];

export const loadCustomSFX = (sfx: CustomSFXDefinition = {}) => {
  const SOUNDS: (keyof Required<VanillaSFXEvents>)[] = [
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
  ] as const;
  const SCORES: (keyof Required<CustomScoringDefinition>)[] = [
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
  ] as const;

  class CustomSFXset extends BaseSFXset {
    volume: number;
    specialScoring?: SpecialScoring;
    constructor() {
      super();
      this.volume = 1;
    }

    getSoundUrlFromObj = (obj: Jstris.SFXDefinition | null) => {
      return obj!.url;
    };

    getClearSFX = (scoring: number, scoreToAdd: number, isBackToBack: boolean, currentCombo: number) => {
      const sounds: string[] = [];
      const prefix = "";
      let specialSound: string | null = null;
      let override: boolean = false;
      if (this.specialScoring) {
        const scorings: (SpecialScoringDefinition[] | undefined)[] = [this.specialScoring[SCORES[scoreToAdd]]];
        if ((scoreToAdd > 4 && scoreToAdd <= 11) || scoreToAdd == 14) {
          if (this.specialScoring.TSPINORTETRIS) {
            scorings.push(this.specialScoring.TSPINORTETRIS);
          }
        } else if (scoreToAdd == 127) {
          if (this.specialScoring.ALLSPIN) {
            scorings.push(this.specialScoring.ALLSPIN);
          }
        }
        for (const scoring of scorings) {
          if (Array.isArray(scoring)) {
            let bestFit: BestFit = { score: 0.5, sound: null, combo: -1 };
            for (const sfx of scoring) {
              let score = 0;
              if ("b2b" in sfx && sfx.b2b && sfx.b2b == isBackToBack) {
                score += 1;
              }
              if ("combo" in sfx && sfx.combo && sfx.combo <= currentCombo) {
                score += 1;
              }
              if (bestFit.score < score) {
                override = sfx.override ?? false;
                bestFit = { score: score, sound: sfx.name, combo: currentCombo };
              } else if (bestFit.score == score) {
                if (sfx.combo && currentCombo > bestFit.combo) {
                  override = sfx.override ?? false;
                  bestFit = { score: score, sound: sfx.name, combo: currentCombo };
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
          let bestFit: BestFit = { score: 0, sound: null, combo: -1 };

          for (const sfx of this.specialScoring.ANY) {
            let score = 0;
            if ("b2b" in sfx) {
              if (sfx.b2b == isBackToBack) score += 1;
              else continue;
            }

            if ("combo" in sfx) {
              if (sfx.combo && sfx.combo <= currentCombo) score += 1;
              else continue;
            }
            if (bestFit.score < score) {
              override = sfx.override ?? false;
              bestFit = { score: score, sound: sfx.name, combo: currentCombo };
            } else if (bestFit.score == score) {
              if (sfx.combo && currentCombo > bestFit.combo) {
                override = sfx.override ?? false;
                bestFit = { score: score, sound: sfx.name, combo: currentCombo };
              }
            }
          }
          if (bestFit.sound != null) {
            specialSound = bestFit.sound;
            sounds.push(specialSound);
          }
        }
      }
      if ("b2b" in sfx && isBackToBack) {
        sounds.push("b2b");
      }
      if (currentCombo >= 0) {
        sounds.push(this.getComboSFX(currentCombo));
      }
      if (this.scoring && (!specialSound || override == false)) {
        sounds.push(prefix + this.getScoreSFX(scoreToAdd));
      }
      if (scoring == Score.A.PERFECT_CLEAR) {
        sounds.push(prefix + this.getScoreSFX(scoring));
      }
      //   console.log(sounds)
      return sounds;
    };
  }

  const customSFX = new CustomSFXset();

  for (const name of SOUNDS) {
    if (name in sfx) {
      customSFX[name] = {
        url: sfx[name]!,
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
      for (const tone of sfx.comboTones) {
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
    for (const key in sfx.specialScoring) {
      if (!Array.isArray(sfx.specialScoring[key as keyof SpecialScoring])) continue;
      sfx.specialScoring[key as keyof SpecialScoring]!.forEach((sound: SpecialScoringDefinition, i: number) => {
        sound.name = "CUSTOMSFX" + key + i;
        loadSound(sound.name, sound);
      });
    }
    customSFX.specialScoring = sfx.specialScoring;
  }
  if (sfx.scoring && typeof sfx.scoring == "object") {
    customSFX.scoring = Array(15) as typeof customSFX.scoring;

    for (const key of SCORES) {
      if (key in sfx.scoring && sfx.scoring[key]) {
        const i = SCORES.indexOf(key);
        customSFX.scoring![i] = { url: sfx.scoring[key] };
      }
    }
  }
  if (sfx.spawns && typeof sfx.spawns == "object") {
    const pieces: (keyof CustomSpawnDefinition)[] = ["I", "O", "T", "L", "J", "S", "Z"] as const;
    for (const key of pieces) {
      if (key in sfx.spawns && sfx.spawns[key]) {
        loadSound("b_" + key, { url: sfx.spawns[key] });
      }
    }
  } else {
    const pieces: (keyof CustomSpawnDefinition)[] = ["I", "O", "T", "L", "J", "S", "Z"] as const;
    for (const key of pieces) {
      loadSound("b_" + key, { url: "null.wav" });
    }
  }
  return customSFX;
  //    attemptLoadSFX(customSFX);
};
