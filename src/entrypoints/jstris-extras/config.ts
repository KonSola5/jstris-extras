import { CustomSFXDefinition } from "./sfxLoader";

export interface IConfig {
  isFirstOpen: boolean;

  lineClearAnimationEnabled: boolean;
  lineClearAnimationLength: number;

  lineClearShakeEnabled: boolean;
  lineClearShakeStrength: number;
  lineClearShakeLength: number;

  piecePlacementAnimationEnabled: boolean;
  piecePlacementAnimationOpacity: number;
  piecePlacementAnimationLength: number;

  actionTextEnabled: boolean;

  backgroundURL: string;
  customSkinURL: string;
  customGhostSkinURL: string;
  customSkinInReplays: boolean;

  keyboardOSD: boolean;

  opponentSFXEnabled: boolean;
  opponentSFXVolumeMultiplier: number;

  customSFXEnabled: boolean;
  customSFX_JSON: string;
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

  toggleChatKey: string | null;
  closeChatKey: string | null;
  undoKey: string | null;

  // Config not settable via sidebar
  keyboardOSDViewportX: number;
  keyboardOSDViewportY: number;
  keyboardOSDWidthPx: number;
  keyboardOSDHeightPx: number;
  // To be removed
  customPlusSFX_JSON: string;
  thirdPartyMatchmakingEnabled: boolean;
}

const defaultConfig: IConfig = {
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
  customSFX_JSON: "{}",
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


interface ListenerMap<Props extends { [key in keyof Props]: Props[key] }>
  extends Map<keyof Props, (value: Props[keyof Props]) => void> {
  get<K extends keyof Props>(key: K): (value: Props[K]) => void;
  set<K extends keyof Props>(key: K, value: (value: Props[K]) => void): this;
  has<K extends keyof Props>(key: K): boolean;
  delete<K extends keyof Props>(key: K): boolean;
  forEach<K extends keyof Props>(
    callbackfn: (value: (value: Props[K]) => void, key: K, map: Map<K, (value: Props[K]) => void>) => void,
    thisArg?: unknown
  ): void;
  clear(): void;
  entries<K extends keyof Props>(): MapIterator<[K, (value: Props[K]) => void]>;
  keys<K extends keyof Props>(): MapIterator<K>;
  values<K extends keyof Props>(): MapIterator<(value: Props[K]) => void>;
  [Symbol.iterator]<K extends keyof Props>(): MapIterator<[K, (value: Props[K]) => void]>;
}

interface ConfigMap<Props extends { [key in keyof Props]: Props[key] }>
  extends Map<keyof Props, Props[keyof Props]> {
  get<K extends keyof Props>(key: K): Props[K]
  set<K extends keyof Props>(key: K, value: Props[K]): this;
  has<K extends keyof Props>(key: K): boolean;
  delete<K extends keyof Props>(key: K): boolean;
  forEach<K extends keyof Props>(
    callbackfn: (value: Props[K], key: K, map: Map<K, Props[K]>) => void,
    thisArg?: unknown
  ): void;
  clear(): void;
  entries<K extends keyof Props>(): MapIterator<[K, Props[K]]>;
  keys<K extends keyof Props>(): MapIterator<K>;
  values<K extends keyof Props>(): MapIterator<Props[K]>;
  [Symbol.iterator]<K extends keyof Props>(): MapIterator<[K, Props[K]]>;
}

/**
 * Manages Jstris Extras configs.
 */
export class ConfigManager {
  // No idea what the type of the listener callback should be.
  settings: ConfigMap<IConfig>;
  // listeners: [configName: keyof IConfig, listener: (value: any) => void][]; // eslint-disable-line
  listeners: ListenerMap<IConfig>;
  constructor(storedSettings: Partial<IConfig>) {
    this.settings = new Map(Object.entries(structuredClone(defaultConfig))) as unknown as ConfigMap<IConfig>;
    this.listeners = new Map();
    for (const pair of Object.entries(storedSettings)) {
      const setting: keyof IConfig = pair[0] as keyof IConfig;
      const value: IConfig[keyof IConfig] = pair[1];
      this.settings.set(setting, value)
    }
  }

  /**
   * Sets the given config to the desired value.
   * @param name The name of the config to set.
   * @param value The value to set.
   */
  set<T extends keyof IConfig>(name: T, value: IConfig[T]): void {
    this.settings.set(name, value)
    document.dispatchEvent(
      new CustomEvent("setStorageRequest", {
        detail: {
          key: name,
          value: value,
        },
        bubbles: true
      })
    );
    this.listeners.forEach((listener, event) => {
      if (event == name) listener(value)
    })
  }

  /**
   * Resets the given config field.
   * @param name The name of the config to reset.
   */
  reset(name: keyof IConfig): void {
    this.set(name, defaultConfig[name]);
  }

  onChange<T extends keyof IConfig>(configName: T, listener: (value: IConfig[T]) => void): void {
    this.listeners.set(configName, listener);
  }
}
