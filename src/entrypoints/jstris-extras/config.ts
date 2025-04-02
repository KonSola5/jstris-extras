interface ConfigBooleans {
  isFirstOpen: boolean;

  lineClearAnimationEnabled: boolean;
  lineClearShakeEnabled: boolean;
  piecePlacementAnimationEnabled: boolean;
  actionTextEnabled: boolean;
  customSkinInReplays: boolean;
  keyboardOSD: boolean;

  opponentSFXEnabled: boolean;

  customSFXEnabled: boolean;
  customPieceSpawnSFXEnabled: boolean;
  statAPPEnabled: boolean;
  statPPDEnabled: boolean;
  statCheeseRacePiecePaceEnabled: boolean;
  statCheeseRaceTimePaceEnabled: boolean;
  statUltraSPPEnabled: boolean;
  statUltraScorePaceEnabled: boolean;
  statPCNumberEnabled: boolean;

  automaticReplayCodesEnabled: boolean;
  chatTimestampsEnabled: boolean;
  thirdPartyMatchmakingEnabled: boolean;
}

interface ConfigNumbers {
  lineClearAnimationLength: number;

  lineClearShakeStrength: number;
  lineClearShakeLength: number;

  piecePlacementAnimationOpacity: number;
  piecePlacementAnimationLength: number;

  opponentSFXVolumeMultiplier: number;

  keyboardOSDViewportX: number;
  keyboardOSDViewportY: number;
  keyboardOSDWidthPx: number;
  keyboardOSDHeightPx: number;
}

interface ConfigStringNullables {
  toggleChatKey: string | null;
  closeChatKey: string | null;
  undoKey: string | null;
}

interface ConfigStrings {
  backgroundURL: string;
  customSkinURL: string;
  customGhostSkinURL: string;
  customSFX_JSON: string;
  customPlusSFX_JSON: string;
}

interface Config extends ConfigBooleans, ConfigNumbers, ConfigStringNullables, ConfigStrings {}

const defaultConfig: Config = {
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

type ValueType<T> = T extends keyof ConfigBooleans
  ? boolean
  : T extends keyof ConfigNumbers
  ? number
  : T extends keyof ConfigStringNullables
  ? string | null
  : T extends keyof ConfigStrings
  ? string
  : unknown;

/**
 * Manages Jstris Extras configs.
 */
export class ConfigManager {
  settings: Config;
  // No idea what the type of the listener callback should be.
  listeners: [configName: keyof Config, listener: (value: any) => void][]; // eslint-disable-line
  constructor() {
    this.settings = structuredClone(defaultConfig);
    this.listeners = [];
    const settings = Object.keys(this.settings) as (keyof Config)[];
    settings.forEach(<K extends keyof Config>(setting: K): void => {
      //const value = JSON.parse(localStorage.getItem(setting) || "null");
      //this.settings[setting] = value;
    });
  }

  /**
   * Sets the given config to the desired value.
   * @param name The name of the config to set.
   * @param value The value to set.
   */
  set<T extends keyof Config>(name: T, value: Config[T]): void {
    this.settings[name] = value;
    //localStorage.setItem(name, JSON.stringify(value));
    for (const [event, listener] of this.listeners) {
      if (event == name) listener(value);
    }
  }

  /**
   * Resets the given config field.
   * @param name The name of the config to reset.
   */
  reset(name: keyof Config): void {
    this.set(name, defaultConfig[name]);
  }

  onChange<T extends keyof Config>(configName: T, listener: (value: ValueType<T>) => void): void {
    this.listeners.push([configName, listener]);
  }
}
