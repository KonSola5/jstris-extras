// // these are default values
// var config = {
//   FIRST_OPEN: true,

//   lineClearAnimationEnabled: true,
//   lineClearShakeEnabled: true,
//   piecePlacementAnimationEnabled: true,
//   actionTextEnabled: true,

//   piecePlacementAnimationOpacity: 0.5,
//   piecePlacementAnimationLength: 0.5,
//   lineClearAnimationLength: 0.5,
//   lineClearShakeStrength: 1,
//   lineClearShakeLength: 1,

//   backgroundURL: "",
//   customSkinURL: "",
//   customGhostSkinURL: "",
//   customSkinInReplays: true,
//   keyboardOSD: false,

//   opponentSFXEnabled: true,
//   opponentSFXVolumeMultiplier: 0.5,
//   customPieceSpawnSFXEnabled: false,
//   customSFXEnabled: false,
//   customSFX_JSON: "",
//   customPlusSFX_JSON: "",

//   statAPPEnabled: false,
//   statPPDEnabled: false,
//   statCheeseRacePiecePaceEnabled: false,
//   statCheeseRaceTimePaceEnabled: false,
//   statUltraSPPEnabled: false,
//   statUltraScorePaceEnabled: false,
//   statPCNumberEnabled: false,

//   automaticReplayCodesEnabled: false,
//   chatTimestampsEnabled: true,
//   SHOW_QUEUE_INFO: true,
//   SHOW_MM_BUTTON: true,
//   toggleChatKey: null,
//   closeChatKey: null,
//   SCREENSHOT_KEY: null,

//   undoKey: null,
// };

// const defaultConfig = { ...config };

// var listeners = [];

// export const initConfig = () => {
//   // Remove keycodes from local storage
//   localStorage.removeItem("toggleChatKeyCODE");
//   localStorage.removeItem("closeChatKeyCODE");
//   localStorage.removeItem("SCREENSHOT_KEYCODE");
//   localStorage.removeItem("undoKeyCODE");
//   for (var i in config) {
//     var val = JSON.parse(localStorage.getItem(i));
//     if (val != undefined && val != null) {
//       config[i] = val;
//     }
//   }
// };

// const set = function (name, val) {
//   config[name] = val;
//   localStorage.setItem(name, JSON.stringify(val));
//   for (var { event, listener } of listeners) {
//     if (event == name) listener(val);
//   }
// };

// const reset = function (name) {
//   set(name, defaultConfig[name]);
// };

// const onChange = (event, listener) => {
//   listeners.push({ event, listener });
// };

// export const Config = () => ({ ...config, set, onChange, reset });

const defaultConfig = {
  isFirstOpen: false,

  lineClearAnimationEnabled: true,
  lineClearAnimationLength: 0.5,

  lineClearShakeEnabled: true,
  lineClearShakeStrength: 1,
  lineClearShakeLength: 1,

  piecePlacementAnimationEnabled: true,
  piecePlacementAnimationOpacity: 0.5,
  piecePlacementAnimationLength: 0.5,

  actionTextEnabled: true,

  backgroundURL: "",
  customSkinURL: "",
  customGhostSkinURL: "",
  customSkinInReplays: true,

  keyboardOSD: false,

  opponentSFXEnabled: true,
  opponentSFXVolumeMultiplier: 0.5,

  customSFXEnabled: false,
  customSFX_JSON: "",
  customPieceSpawnSFXEnabled: false,

  statAPPEnabled: false,
  statPPDEnabled: false,
  statCheeseRacePiecePaceEnabled: false,
  statCheeseRaceTimePaceEnabled: false,
  statUltraSPPEnabled: false,
  statUltraScorePaceEnabled: false,
  statPCNumberEnabled: false,

  automaticReplayCodesEnabled: false,
  chatTimestampsEnabled: false,

  toggleChatKey: null,
  closeChatKey: null,
  undoKey: null,

  // To be removed
  customPlusSFX_JSON: "",
  thirdPartyMatchmakingEnabled: true,
};

export class ConfigManager {
  constructor() {
    this.settings = structuredClone(defaultConfig);
    this.listeners = [];
    for (let setting in this.settings) {
      let value = JSON.parse(localStorage.getItem(setting));
      if (value != null) {
        this.settings[setting] = value;
      }
    }
  }

  set(name, value) {
    this.settings[name] = value;
    localStorage.setItem(name, JSON.stringify(value));
    for (let [event, listener] of this.listeners) {
      if (event == name) listener(value);
    }
  }

  reset(name) {
    this.set(name, defaultConfig[name]);
  }

  onChange(event, listener) {
    this.listeners.push([event, listener]);
  }
}
