/// <reference types="../jstris-typings/jstris_typings.d.ts" />
"use strict";

//import { initActionText } from "./actiontext.js";
import { initFX } from "./jstris-fx.js";
import { initChat } from "./chat.js";
import { ConfigManager } from "./config.js";

import css from "./style.css";
import customGameCSS from "./custom-game-style.css";
//import { initModal } from "./settingsModal.js";
import { initLayout } from "./layout.js";
//import { initStats } from "./stats.js";
import { initReplayerSFX } from "./replayer-sfx.js";
import { initKeyboardDisplay } from "./keyboardDisplay.js";
//import { initCustomSkin } from "./skin.js";
import { initCustomSFX } from "./sfxLoader.js";
//import { initConnectedSkins } from './connectedSkins';
import { initReplayManager } from "./replayManager.js";
import { initPracticeUndo } from "./practiceUndo.js";
//import { initPracticeSurvivalMode } from "./practiceSurvivalMode.js";
import { fixTeamsMode } from "./teamsMode.js";
import { initPracticeFumen, initReplayerSnapshot } from "./practiceFumen.js";
//import { authNotification, playSound, notify, setPlusSfx } from "./util.js";
import { initAutomaticReplayCodes } from "./automatic_replay_codes.js";
import { initSkins } from "./skin_new.js";
import { initTamper } from "./tamper.js";
import { initSidebar } from "./settingsSidebar.js";
import { initLayoutChanges } from "./layoutChanges.js";
import { initCustomStats } from "./stats_new.js";
import { notify } from "./util.js";
// inject style
const styleSheet = document.createElement("style");
styleSheet.innerText = css;
document.body.appendChild(styleSheet);

initLayoutChanges();

const customGameStylesheet = document.createElement("style");
customGameStylesheet.innerText = customGameCSS;
document.body.appendChild(customGameStylesheet);

export const Config: ConfigManager = new ConfigManager();
// initModal();
initSidebar();
if (Config.settings.isFirstOpen) {
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
  // setPlusSfx(Config.settings.customPlusSFX_JSON);
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
