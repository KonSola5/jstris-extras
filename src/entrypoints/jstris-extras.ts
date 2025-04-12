/// <reference types="../../jstris-typings/index.d.ts" />
/// <reference types="./jstris-extras/global-typings.ts" />

//import { initActionText } from "./actiontext.js";
import { initFX } from "./jstris-extras/jstris-fx.js";
import { initChat } from "./jstris-extras/chat.js";
import { ConfigManager, IConfig } from "./jstris-extras/config.js";

// import css from "./css/style.css";
// import customGameCSS from "./css/custom-game-style.css";
//import { initModal } from "./settingsModal.js";
import { initLayout } from "./jstris-extras/layout.js";
//import { initStats } from "./stats.js";
import { initReplayerSFX } from "./jstris-extras/replayer-sfx.js";
import { initKeyboardDisplay } from "./jstris-extras/keyboardDisplay.js";
//import { initCustomSkin } from "./skin.js";
import { initCustomSFX } from "./jstris-extras/sfxLoader.js";
//import { initConnectedSkins } from './connectedSkins';
import { initReplayManager } from "./jstris-extras/replayManager.js";
import { initPracticeUndo } from "./jstris-extras/practiceUndo.js";
//import { initPracticeSurvivalMode } from "./practiceSurvivalMode.js";
import { fixTeamsMode } from "./jstris-extras/teamsMode.js";
import { initPracticeFumen, initReplayerSnapshot } from "./jstris-extras/practiceFumen.js";
//import { authNotification, playSound, notify, setPlusSfx } from "./util.js";
import { initAutomaticReplayCodes } from "./jstris-extras/automatic_replay_codes.js";
import { initSkins } from "./jstris-extras/skin_new.js";
import { initTamper } from "./jstris-extras/tamper.js";
import { initSidebar } from "./jstris-extras/settingsSidebar.js";
import { initLayoutChanges } from "./jstris-extras/layoutChanges.js";
import { initCustomStats } from "./jstris-extras/stats_new.js";
import { getLogDiv, notify } from "./jstris-extras/util.js";

export let Config: ConfigManager;

export default defineUnlistedScript(async () => {
  try {
    const startTime = performance.now();

  // Wait to get stored config from extension
  const settings: Partial<IConfig> = await new Promise<Partial<IConfig>>(
    (resolve: (value: Partial<IConfig>) => void, reject) => {
      window.addEventListener(
        "getStorageResponse",
        (event: Event) => {
          if (!(event instanceof CustomEvent)) return;
          if (event.detail instanceof Error) {
            reject(event.detail);
          }
          else if (typeof event.detail == "string") resolve(JSON.parse(event.detail))  // Firefox
          else if (typeof event.detail == "object") resolve(event.detail);             // Chromium
          else reject(new Error("The response is neither a string nor an object."));
        },
        { once: true }
      );
      window.dispatchEvent(new CustomEvent("getStorageRequest", { detail: null }));
    }
  );

  Config = new ConfigManager(settings);

  initLayoutChanges();

  // const customGameStylesheet = document.createElement("style");
  // customGameStylesheet.innerText = customGameCSS;
  // document.body.appendChild(customGameStylesheet);

  // initModal();
  initSidebar();
  if (Config.get("isFirstOpen")) {
    alert(
      "Hi! Thank you for installing Jstris Extras! Remember to turn off all other userscripts and refresh the page before trying to play. Enjoy!"
    );
    Config.set("isFirstOpen", false);
  }

  // authNotification();
  initTamper();

  if (typeof ReplayController == "function") {
    initReplayManager();
    initReplayerSnapshot();
  }

  if (typeof GameCore == "function") {
    initSkins();
    // initCustomSkin();
    if (!location.href.includes("export")) {
      // initActionText();
      initFX();
      initKeyboardDisplay();
    }
    // initStats();
    initCustomStats();
    initCustomSFX();

    // initPracticeSurvivalMode();
  }
  if (typeof Game == "function") {
    initLayout();
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
      const chatDiv: HTMLDivElement | null = document.querySelector("#chatContent");
      if (chatDiv) {
        const chatMessage = document.createElement("div");
        chatMessage.classList.add("chl", "srv");

        const details = document.createElement("details");
        const summary = document.createElement("summary");
        const text = document.createElement("span");

        summary.textContent = `${error.name}: ${error.message}`;
        text.textContent = error.stack ?? null;

        details.append(summary, text)

        chatMessage.append(getLogDiv("error", "Startup failed!", details));
        chatDiv.append(chatMessage);
      }
    }
  }
  
});
