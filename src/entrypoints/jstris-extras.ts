/// <reference types="../../jstris-typings/index.d.ts" />
/// <reference types="./je-modules/types/global-typings.d.ts" />

//import { initActionText } from "./actiontext.js";
import { initFX } from "$/extra-visuals/jstris-fx.js";
import { initChat } from "$/chat-extras/chat.js";
import { ConfigManager, IConfig } from "$/meta/config.js";

// import css from "./css/style.css";
// import customGameCSS from "./css/custom-game-style.css";
//import { initModal } from "./settingsModal.js";
import { initCustomBackground } from "$/extra-visuals/custom-background.js";
//import { initStats } from "./stats.js";
import { initReplayerSFX } from "$/replayer-improvements/replayer-sfx.js";
import { initKeyboardDisplay } from "$/extra-visuals/keyboardDisplay.js";
//import { initCustomSkin } from "./skin.js";
import { initCustomSFX } from "$/custom-music/sfxLoader.js";
//import { initConnectedSkins } from './connectedSkins';
import { initReplayManager } from "$/replayer-improvements/replayManager.js";
import { initPracticeUndo } from "$/practice-tweaks/practiceUndo.js";
//import { initPracticeSurvivalMode } from "./practiceSurvivalMode.js";
import { fixTeamsMode } from "$/team-improvements/teamsMode.js";
import { initPracticeFumen, initReplayerSnapshot } from "$/practice-tweaks/practiceFumen.js";
//import { authNotification, playSound, notify, setPlusSfx } from "./util.js";
import { initAutomaticReplayCodes } from "$/chat-extras/automatic_replay_codes.js";
import { initSkins } from "$/extra-visuals/skin_new.js";
import { initTamper } from "$/meta/tamper.js";
import { initSidebar } from "$/meta/settingsSidebar.js";
import { initLayoutChanges } from "$/meta/layoutChanges.js";
import { initCustomStats } from "$/extra-visuals/stats_new.js";
import { notify } from "$/utils/util.js";
import { initActionText } from "$/extra-visuals/action-text.js";
import { assert, getLogDiv } from "$/utils/HTML-utils";
import { getNativeMap } from "$/meta/nativeMap";
import { multiline } from "$/utils/multiline";
import { initRawSpinMethods } from "$/utils/rawSpinMethods";
import { initSpinSFX } from "$/custom-music/spinSFX";
import { initEnhancedBaseSFX } from "$/custom-music/enhancedBaseSFX";
import { initGarbageSFX } from "$/custom-music/garbageSFX";

export let Config: ConfigManager;

let showInChat: typeof Live.prototype.showInChat | undefined;

export default defineUnlistedScript(async () => {
  try {
    const startTime = performance.now();

    getNativeMap();

    // Wait to get stored config from extension
    const settings: Partial<IConfig> = await new Promise<Partial<IConfig>>(
      (resolve: (value: Partial<IConfig>) => void, reject) => {
        window.addEventListener(
          "getStorageResponse",
          (event: Event) => {
            if (!(event instanceof CustomEvent)) return;
            if (event.detail instanceof Error) {
              reject(event.detail);
            } else if (typeof event.detail == "string") resolve(JSON.parse(event.detail)); // Firefox
            else if (typeof event.detail == "object") resolve(event.detail); // Chromium
            else reject(new Error("The response is neither a string nor an object."));
          },
          { once: true }
        );
        window.dispatchEvent(new CustomEvent("getStorageRequest", { detail: null }));
      }
    );

    Config = new ConfigManager(settings);

    if (typeof Live == "function") {
      showInChat = Live.prototype.showInChat.bind({
      chatBox: assert(document.getElementById("ch1"), HTMLDivElement),
      clearOldChatIfNeeded() {},
      Friends: { friendsOpened: false },
      scrollOnMessage() {},
    });
    }
    

    initLayoutChanges();

    // const customGameStylesheet = document.createElement("style");
    // customGameStylesheet.innerText = customGameCSS;
    // document.body.appendChild(customGameStylesheet);

    // initModal();
    initSidebar();
    initCustomBackground();
    if (Config.get("isFirstOpen")) {
      showInChat?.(
        "",
        getLogDiv(
          "info",
          "Jstris Extras",
          multiline`Thanks for installing Jstris Extras!
        Remember to turn off all other userscripts/extensions and refresh the page before trying to play.
        Enjoy!`
        )
      );
      Config.set("isFirstOpen", false);
    }

    // authNotification();
    initTamper();

    if (typeof ReplayController == "function" && location.href.includes("replay")) {
      initReplayManager();
      initReplayerSnapshot();
    }

    if (typeof GameCore == "function") {
      initEnhancedBaseSFX();
      initRawSpinMethods();
      initGarbageSFX();
      initSkins();
      // initCustomSkin();
      if (!location.href.includes("export")) {
        initActionText();
        initFX();
        initKeyboardDisplay();
      }
      // initStats();
      initCustomStats();
      initCustomSFX();

      // initPracticeSurvivalMode();
    }
    if (typeof Game == "function") {
      initSpinSFX();
      initPracticeUndo();
      initPracticeFumen();
      // setPlusSfx(Config.get("customPlusSFX_JSON"));
      // const oldNewPB = GameCaption.prototype.newPB;
      // GameCaption.prototype.newPB = function (...args) {
      //   playSound("PB");
      //   const returnValue = oldNewPB.apply(this, args);
      //   return returnValue;
      // };
      const oldBeforeReset = Live.prototype.beforeReset;
      Live.prototype.beforeReset = function (...args) {
        if (!this.p.isTabFocused) {
          notify("Jstris", "⚠ New game starting! ⚠");
        }
        return oldBeforeReset.apply(this, args);
      };
      fixTeamsMode();
      initAutomaticReplayCodes();
    }
    if (typeof Live == "function") initChat();
    initReplayerSFX();
    console.log(`Everything initialized in ${Math.round(performance.now() - startTime) / 1000} s.`);
  } catch (error) {
    if (error instanceof Error) {
      const details = document.createElement("details");
      const summary = document.createElement("summary");
      const text = document.createElement("span");

      summary.textContent = `${error.name}: ${error.message}`;
      text.textContent = error.stack ?? null;

      details.append(summary, text);

      showInChat?.("", getLogDiv("error", "Startup failed!", details));

      throw error;
    }
  }
});
