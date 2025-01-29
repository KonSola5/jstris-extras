/// <reference types="../jstris-typings/jstris_typings.d.ts" />
"use strict";

import { initActionText } from "./actiontext";
import { initFX } from "./jstris-fx";
import { initChat } from "./chat.js";
import { ConfigManager } from "./config";

import css from "./style.css";
import { initModal } from "./settingsModal";
import { initLayout } from "./layout";
import { initStats } from "./stats";
import { initReplayerSFX } from "./replayer-sfx";
import { initKeyboardDisplay } from "./keyboardDisplay";
import { initCustomSkin } from "./skin";
import { initCustomSFX } from "./sfxLoader";
//import { initConnectedSkins } from './connectedSkins';
import { initReplayManager } from "./replayManager";
import { initPracticeUndo } from "./practiceUndo";
import { initPracticeSurvivalMode } from "./practiceSurvivalMode";
import { fixTeamsMode } from "./teamsMode";
import { initPracticeFumen, initReplayerSnapshot } from "./practiceFumen";
import { authNotification, playSound, notify, setPlusSfx } from "./util";
import { initAutomaticReplayCodes } from "./automatic_replay_codes.js";
import { initSkins } from "./skin_new.js";
import { initTamper } from "./tamper.js";
import { initSidebar } from "./settingsSidebar.js";
// inject style
var styleSheet = document.createElement("style");
styleSheet.innerText = css;
document.body.appendChild(styleSheet);

export const Config = new ConfigManager();
// initModal();
initSidebar();
if (Config.settings.isFirstOpen) {
  alert(
    "Hi! Thank you for installing Jstris Extras! Remember to turn off all other userscripts and refresh the page before trying to play. Enjoy!"
  );
  Config.set("isFirstOpen", false);
}

authNotification();
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
  initStats();
  initCustomSFX();

  initPracticeSurvivalMode();
}
if (typeof Game == "function") {
  initLayout();
  initPracticeUndo();
  initPracticeFumen();
  setPlusSfx(Config.settings.customPlusSFX_JSON);
  let pbListener = GameCaption.prototype.newPB;
  GameCaption.prototype.newPB = function () {
    playSound("PB");
    let val = pbListener.apply(this, arguments);
    return val;
  };
  let oldBeforeReset = Live.prototype.beforeReset;
  Live.prototype.beforeReset = function () {
    if (!this.p.isTabFocused) {
      notify("Jstris", "⚠ New game starting! ⚠");
    }
    return oldBeforeReset.apply(this, arguments);
  };
  fixTeamsMode();
  initAutomaticReplayCodes();
}
if (typeof Live == "function") initChat();
initReplayerSFX();
