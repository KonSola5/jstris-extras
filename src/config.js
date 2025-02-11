/**
 * @typedef {object} Config
 * @prop {boolean} isFirstOpen
 *
 * @prop {boolean} lineClearAnimationEnabled
 * @prop {number} lineClearAnimationLength
 *
 * @prop {boolean} lineClearShakeEnabled
 * @prop {number} lineClearShakeStrength
 * @prop {number} lineClearShakeLength
 *
 * @prop {boolean} piecePlacementAnimationEnabled
 * @prop {number} piecePlacementAnimationOpacity
 * @prop {number} piecePlacementAnimationLength
 *
 * @prop {boolean} actionTextEnabled
 *
 * @prop {string} backgroundURL
 * @prop {string} customSkinURL
 * @prop {string} customGhostSkinURL
 * @prop {boolean} customSkinInReplays
 *
 * @prop {boolean} keyboardOSD
 *
 * @prop {boolean} opponentSFXEnabled
 * @prop {number} opponentSFXVolumeMultiplier
 *
 * @prop {boolean} customSFXEnabled
 * @prop {string} customSFX_JSON
 * @prop {boolean} customPieceSpawnSFXEnabled
 *
 * @prop {boolean} statAPPEnabled
 * @prop {boolean} statPPDEnabled
 * @prop {boolean} statCheeseRacePiecePaceEnabled
 * @prop {boolean} statCheeseRaceTimePaceEnabled
 * @prop {boolean} statUltraSPPEnabled
 * @prop {boolean} statUltraScorePaceEnabled
 * @prop {boolean} statPCNumberEnabled
 *
 * @prop {boolean} automaticReplayCodesEnabled
 * @prop {boolean} chatTimestampsEnabled
 *
 * @prop {string | null} toggleChatKey
 * @prop {string | null} closeChatKey
 * @prop {string | null} undoKey
 *
 * @prop {number} keyboardOSDViewportX
 * @prop {number} keyboardOSDViewportY
 * @prop {number} keyboardOSDWidthPx
 * @prop {number} keyboardOSDHeightPx
 *
 * @prop {string} customPlusSFX_JSON
 * @prop {boolean} thirdPartyMatchmakingEnabled
 */

/** @type {Config} */
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

  // Config not settable via sidebar
  keyboardOSDViewportX: 10,
  keyboardOSDViewportY: 10,
  keyboardOSDWidthPx: 250,
  keyboardOSDHeightPx: 124,
  // To be removed
  customPlusSFX_JSON: "",
  thirdPartyMatchmakingEnabled: true,
};

/**
 * Manages Jstris Extras configs.
 */
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

  /**
   * Sets the given config to the desired value.
   * @param {keyof Config} name The name of the config to set.
   * @param {*} value The value to set.
   */
  set(name, value) {
    this.settings[name] = value;
    localStorage.setItem(name, JSON.stringify(value));
    for (let [event, listener] of this.listeners) {
      if (event == name) listener(value);
    }
  }

  /**
   * Resets the given config field.
   * @param {keyof Config} name The name of the config to reset.
   */
  reset(name) {
    this.set(name, defaultConfig[name]);
  }

  onChange(event, listener) {
    this.listeners.push([event, listener]);
  }
}
