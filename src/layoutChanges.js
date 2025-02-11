export function initLayoutChanges() {
  let mains = document.querySelectorAll("#main");
  mains.forEach((main) => {
    // There can be 1 or 2 divs with "main" IDs, gotta love that
    let mstage = document.createElement("div");
    mstage.id = "mstage";
    let holdOutOfDiv = main.querySelector("#main > .holdCanvas")
    let stage = main.querySelector("#stage");
    if (holdOutOfDiv) {
      let lstage = document.createElement("div");
      lstage.classList.add("lstage")
      lstage.appendChild(holdOutOfDiv);
      main.insertBefore(lstage, stage)
    }
    mstage.appendChild(stage);
    main.insertBefore(mstage, main.querySelector("#rstage"));

    let bstage = document.createElement("div")
    bstage.id = "bstage"
    main.append(bstage);

    let statsDiv = main.querySelector("#main > div:not([class]):not([id])");
    statsDiv.classList.add("hidden")
    bstage.append(...statsDiv.children);
  });

  if (mains.length == 2) {
    let twoBoards = document.createElement("div");
    twoBoards.classList.add("two-boards")
    document.getElementById("replayerGameFrame").prepend(twoBoards);
    twoBoards.append(...mains);
  }

  let emoteSelector = document.querySelector(".chatInputC .emSel");
  if (emoteSelector) emoteSelector.classList.add("hidden");

  let speedChart = document.querySelector("#speedChart");
  if (speedChart) speedChart.parentElement.classList.add("stack");

  window.showElem = function (element) {
    if (element) {
      element.classList.remove("hidden");
      element.style.removeProperty("display");
    }
  };

  window.hideElem = function (element) {
    if (element) {
      element.classList.add("hidden");
      element.style.removeProperty("display");
    }
  };

  window.toggleElem = function (element) {
    if (element.style.display == "none") element.classList.add("hidden");
    element.style.removeProperty("display");
    if (element.classList.contains("hidden")) {
      element.classList.remove("hidden");
      return true;
    } else {
      element.classList.add("hidden");
      return false;
    }
  };

  function getSVGSymbol(svgSrc, symbolToUse, CSSClasses) {
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add(...CSSClasses.split(" "));
    let use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", `/svg/${symbolToUse}.svg#${svgSrc}`);
    svg.append(use);
    return svg;
  }

  /**
   *
   * @param {string} clientName
   * @param {number} clientType
   * @param {Client} client
   */
  function getAuthorizedNameLinkElement(clientName, clientType, client) {
    let link = document.createElement("a");
    link.href = `/u/${clientName}`;
    link.classList.add("ut");
    let icon;
    if (client?.color) link.style.color = client.color;
    if (client?.bold) link.style.fontWeight = "bold";
    if (clientName.length >= 16) clientName = clientName.slice(0, 15) + "…";
    switch (true) {
      case clientType == 100: {
        icon = new Image();
        icon.src = "/res/crown.png";
        icon.classList.add("nameIcon");
        link.title = "Champion";
        break;
      }
      case clientType == 101: {
        icon = new Image();
        icon.src = CDN_URL("/res/ield.png");
        icon.alt = "Mod";
        icon.classList.add("nameIcon");
        link.title = "Moderator";
        break;
      }
      case clientType >= 110 && clientType <= 118: {
        icon = new Image();
        let iconSelection = {
          110: "gstr", // Star
          111: "jsT", // Jstris logo
          112: "blt", // T piece
          113: "blo", // O piece
          114: "bls", // S piece
          115: "blz", // Z piece
          116: "bll", // L piece
          117: "blj", // J piece
          118: "bli", // I piece
        };
        icon.src = CDN_URL(`/res/${iconSelection[clientType]}.png`);
        icon.alt = "D";
        icon.classList.add("nameIcon");
        link.title = "Jstris Supporter";
        break;
      }
      case clientType >= 1000 && clientType <= 2000: {
        clientType -= 1000;
        let iconToChoose =
          String.fromCharCode(65 + ((992 & clientType) >> 5)) + String.fromCharCode(65 + (31 & clientType));
        icon = new Image();
        icon.src = `https://jstris.jezevec10.com/vendor/countries/flags/${iconToChoose}.png`;
        icon.alt = iconToChoose;
        icon.classList.add("nameIcon");
        link.title = "Jstris Supporter";
        break;
      }
      case clientType == 999 && client?.icon: {
        icon = new Image();
        icon.src = CDN_URL(`/res/oe/${client.icon}.svg`);
        icon.classList.add("nameIcon_oe");
        link.title = "Jstris Supporter";
        break;
      }
    }
    link.target = "_blank";
    link.textContent = clientName;
    if (icon) link.insertAdjacentElement("beforebegin", icon);
    return link;
  }

  if (typeof Slot !== "undefined") {
    Slot.prototype.init = function () {
      this.slotDiv.className = "slot";
      this.slotDiv.style.left = `${this.x}px`;
      this.slotDiv.style.top = `${this.y}px`;
      this.name.style.width = `${this.gs.matrixWidth + 2}px`;
      this.name.style.height = `${this.gs.nameHeight}px`;
      this.name.style.fontSize = `${this.gs.nameFontSize}px`;
      this.pCan.width = this.bgCan.width = this.gs.matrixWidth;
      this.pCan.height = this.bgCan.height = this.gs.matrixHeight;
      this.queueCan.width = this.holdCan.width = 4 * this.gs.holdQueueBlockSize;
      this.holdCan.height = 4 * this.gs.holdQueueBlockSize;
      this.queueCan.height = 15 * this.gs.holdQueueBlockSize;
      this.pCan.style.top =
        this.bgCan.style.top =
        this.holdCan.style.top =
        this.queueCan.style.top =
          `${this.gs.nameHeight}px`;
      this.holdCan.style.left = "0px";
      var holdBlockSize = 0.8 * this.gs.holdQueueBlockSize;
      var offsetLeft = 4 * this.gs.holdQueueBlockSize + holdBlockSize;
      this.name.style.left = `${offsetLeft}px`;
      this.pCan.style.left = this.bgCan.style.left = `${offsetLeft}px`;
      this.queueCan.style.left = `${offsetLeft + this.pCan.width + holdBlockSize}px`;
      if (this.gs.slotStats && this.gs.matrixWidth >= 50) {
        this.stats.init();
        this.stats.statsDiv.style.left = `${offsetLeft}px`;
        this.slotDiv.append(this.stats.statsDiv);
        let totalWidth = 1.1 * this.stats.statsDiv.childNodes[0].clientWidth;
        let shouldDisplayWinCounter =
          2 * totalWidth < 0.85 * this.gs.matrixWidth || totalWidth > 0.6 * this.gs.matrixWidth;
        this.stats.winCounter.style.display = shouldDisplayWinCounter ? null : "none";
      } else {
        this.stats.disable();
      }
      this.slotDiv.append(this.name, this.bgCan, this.pCan, this.holdCan, this.queueCan);
      this.slotDiv.classList.remove("hidden");
      this.slotDiv.style.removeProperty("display");
      this.gs.gsDiv.appendChild(this.slotDiv);
      this.v.onResized();
    };

    Slot.prototype.hide = function () {
      this.slotDiv.classList.add("hidden");
    };
  }

  if (typeof RoomInfo !== "undefined") {
    /** @param {RoomDetails2} roomDetails */
    RoomInfo.prototype.displayLimit = function (roomDetails) {
      if (roomDetails.l === null) return void hideElem(this.rdParts.limit);
      let limit = this.rdParts.limit;
      limit.replaceChildren();
      let isEligible = roomDetails.l.r;
      let limits = roomDetails.l.l;
      let currentStats = roomDetails.l.s || {};
      this.rdParts.limit.classList.remove("hidden");
      // this.rdParts.limit.style.display = "flex";
      let limitInfoDiv = this.createElement("div", ["rdLimitInf"], null);
      if (isEligible) {
        limit.classList.add("rdOK");
        limit.classList.remove("rdF");
        limit.append(getSVGSymbol("s-unlocked", "dark", "lIcn"));
        let header = document.createElement("h1");
        header.textContent = i18n.joinPossible;
        limitInfoDiv.append(header);
      } else {
        limit.classList.add("rdF");
        limit.classList.remove("rdOK");
        limit.append(getSVGSymbol("s-locked", "dark", "lIcn"));
        let header = document.createElement("h1");
        header.textContent = i18n.notEligible;
        limitInfoDiv.append(header);
      }
      let getFormattedRange = (min = 0, max = "\u221E") => `⟨${min}, ${max}⟩`;
      let getEligibilityChar = function (current, min, max) {
        if (current) {
          if (
            (!min && !max) ||
            (!min && current <= max) ||
            (!max && current >= min) ||
            (current <= max && current >= min)
          )
            return "✓";
          else return "✗";
        }
      };
      let descList = document.createElement("dl");
      let descs = [];
      for (let currentLimit in limits) {
        let descTerm = document.createElement("dt");
        descTerm.textContent = `${this.LIMIT_NAMES[currentLimit].n}: ${getFormattedRange(...limits[currentLimit])}`;
        let currentStat = currentStats[currentLimit];
        let unit = this.LIMIT_NAMES[currentLimit].u;
        let descDetails = document.createElement("dd");
        let eligibilityChar = getEligibilityChar(currentStats[currentLimit], ...limits[currentLimit]);
        let currentStatFormatted = currentStat ? `${currentStat} ${unit}` : "None";
        descDetails.textContent = `${eligibilityChar} ${currentStatFormatted}`;
        descs.push(descTerm, descDetails);
      }
      descList.append(...descs);
      limitInfoDiv.append(descList);
      limit.append(limitInfoDiv);
    };

    /** @param {RoomDetails2} roomDetails */
    RoomInfo.prototype.displayConfig = function (roomDetails) {
      let done = 0;
      let settingsContent = this.rdParts.settingsContent;
      settingsContent.replaceChildren();
      for (let setting in roomDetails.s) {
        if (!(setting in this.CONF_NAMES)) {
          continue;
        }
        let isObject = typeof this.CONF_NAMES[setting] == "object";
        let value = "";
        let bulletPoint = "• " + (isObject ? this.CONF_NAMES[setting].n : this.CONF_NAMES[setting]);
        if (typeof roomDetails.s[setting] == "boolean") {
          value = this.ON_OFF[roomDetails.s[setting] + 0];
        } else {
          if (isObject && "v" in this.CONF_NAMES[setting]) {
            let arrayValue = this.CONF_NAMES[setting].v[roomDetails.s[setting]];
            if (!arrayValue) {
              continue;
            }
            arrayValue = arrayValue || "?";
            value = arrayValue;
          } else {
            value = roomDetails.s[setting];
          }
          if (isObject && "u" in this.CONF_NAMES[setting]) {
            value += this.CONF_NAMES[setting].u;
          }
        }
        let configValueSpan;
        if (value) {
          bulletPoint += ": ";
          configValueSpan = document.createElement("span");
          configValueSpan.textContent = value;
          configValueSpan.classList.add("confVal");
        }
        let rdItem = this.createElement("div", ["rdItem"], settingsContent);
        rdItem.textContent = bulletPoint;
        if (configValueSpan) rdItem.insertAdjacentElement("beforeend", configValueSpan);
        ++done;
      }
      if (done) {
        showElem(this.rdParts.settings);
      }
    };

    /** @param {RoomDetails2} roomDetails */
    RoomInfo.prototype.displayPlayers = function (roomDetails) {
      this.rdParts.content.classList.remove("hidden");
      let countedPlayers = 0;
      roomDetails.p.p.forEach((item, i) => {
        if (!item.hasOwnProperty("ti")) roomDetails.p.p[i].ti = 0;
      });
      roomDetails.p.p.sort((player1, player2) => {
        if (player1.type && !player2.type) return -1;
        else if (!player1.type && player2.type) return 1;
        else if (player1.type && player2.type && player1.ti != player2.ti) {
          if (player1.ti > player2.ti) return -1;
          else return 1;
        } else return player1.n.localeCompare(player2.n);
      });
      let nodesToAdd = [];
      let lastPlayerName = null;
      for (let player of roomDetails.p.p) {
        if (lastPlayerName !== null && lastPlayerName === player.n) {
          continue;
        }
        let playerType = player.type || 0;
        let supporterStyle = {
          color: player.col || null,
          icon: player.icn || null,
          bold: player.ti >= 2,
        };
        nodesToAdd.push(getAuthorizedNameLinkElement(player.n, playerType, supporterStyle));
        countedPlayers++;
        lastPlayerName = player.n;
        if (countedPlayers >= 21) {
          break;
        }
      }
      if (roomDetails.p.c > 21) {
        let span = document.createElement("span");
        span.classList.add("pInfo");
        span.textContent = `+${trans(i18n.cntMore, { cnt: roomDetails.p.c - 21 })}`;
        nodesToAdd.push(span);
        countedPlayers++;
      } else if (roomDetails.p.g) {
        let span = document.createElement("span");
        span.classList.add("pInfo");
        span.textContent = `+${trans(i18n.cntGuests, { cnt: roomDetails.p.g })}`;
        nodesToAdd.push(span);
        countedPlayers++;
      } else if (roomDetails.p.c + roomDetails.p.s === 0) {
        let span = document.createElement("span");
        span.classList.add("pInfo");
        span.textContent = i18n.noPlayers;
        nodesToAdd.push(span);
      }
      if (roomDetails.p.s && countedPlayers < 22) {
        let span = document.createElement("span");
        span.classList.add("pInfo");
        span.textContent = `+${trans(i18n.cntSpec, { cnt: roomDetails.p.s })}`;
        nodesToAdd.push(span);
        countedPlayers++;
      }
      this.rdParts.content.replaceChildren(...nodesToAdd);
    };

    RoomInfo.prototype.displayRoomDetail = function (id) {
      if (this.roomDetailBox.dataset.id === id && !this.roomDetailBox.classList.contains("hidden")) {
        var roomDetails = this.roomDetails[id];
        hideElem(this.rdParts.spinner);
        this.displayPlayers(roomDetails);
        this.displayConfig(roomDetails);
        this.displayLimit(roomDetails);
        // this.rdParts.content.classList.remove("hidden");
        // this.rdParts.limit.classList.remove("hidden");
      }
    };
  }

  if (typeof GameCaption !== "undefined") {
    /* Game Captions */
    GameCaption.prototype.create = function () {
      let caption = document.createElement("div");
      this.parent.appendChild(caption);
      caption.classList.add("gCapt");
      return caption;
    };
    GameCaption.prototype.hide = function (captionType) {
      if (!captionType) {
        for (let caption in this.captions) this.captions[caption].classList.add("hidden");
      } else if (captionType in this.captions) {
        this.captions[captionType].classList.add("hidden");
      }
    };
    GameCaption.prototype.hideExcept = function (captionType) {
      for (let caption in this.captions)
        if (caption != captionType) {
          this.captions[caption].classList.add("hidden");
        }
    };
    GameCaption.prototype.spectatorMode = function () {
      this.hide();
      if (this.SPECTATOR_MODE in this.captions) {
        this.captions[this.SPECTATOR_MODE].classList.remove("hidden");
      } else {
        let spectatorCaption = (this.captions[this.SPECTATOR_MODE] = this.create());
        spectatorCaption.classList.add("spectator-mode");
        let specMode = document.createElement("div");
        let endSpec = document.createElement("div");
        specMode.textContent = i18n.specMode;
        specMode.classList.add("spec-mode");
        endSpec.textContent = i18n.endSpec;
        endSpec.classList.add("end-spec");
        spectatorCaption.append(specMode, endSpec);
      }
    };
    GameCaption.prototype.outOfFocus = function (topOffset) {
      if (this.GAME_PLACE in this.captions && !this.captions[this.GAME_PLACE].classList.contains("hidden")) {
        return;
      }
      if (this.OUT_OF_FOCUS in this.captions) {
        this.captions[this.OUT_OF_FOCUS].classList.remove("hidden");
        return;
      }
      let outOfFocusCaption = (this.captions[this.OUT_OF_FOCUS] = this.create());
      outOfFocusCaption.classList.add("out-of-focus");
      let notFocused = document.createElement("div");
      let clickToFocus = document.createElement("div");
      notFocused.textContent = i18n.notFocused;
      notFocused.classList.add("not-focused");
      clickToFocus.textContent = i18n.clickToFocus;
      clickToFocus.classList.add("click-to-focus");
      outOfFocusCaption.append(notFocused, clickToFocus);
    };
    GameCaption.prototype.readyGo = function (state) {
      let readyGoCaption;
      this.hideExcept(this.MODE_INFO);
      if (this.READY_GO in this.captions) {
        this.captions[this.READY_GO].classList.remove("hidden");
      } else {
        (readyGoCaption = this.captions[this.READY_GO] = this.create()).classList.add("ready-go");
      }
      (readyGoCaption = this.captions[this.READY_GO]).textContent = "";
      var readyOrGo = document.createElement("div");
      readyOrGo.classList.add("ready-or-go");
      readyOrGo.textContent = state === 0 ? i18n.ready : i18n.go;
      readyGoCaption.appendChild(readyOrGo);
    };
    GameCaption.prototype.modeInfo = function (text, mode) {
      if (text) {
        let modeInfoCaption;
        if (this.MODE_INFO in this.captions) {
          this.captions[this.MODE_INFO].classList.remove("hidden");
        } else {
          (modeInfoCaption = this.captions[this.MODE_INFO] = this.create()).classList.add("mode-info");
        }
        (modeInfoCaption = this.captions[this.MODE_INFO]).textContent = "";
        if (mode.t == 0) {
          let task = document.createElement("div");
          task.classList.add("task");
          task.textContent = "TASK:";
          modeInfoCaption.appendChild(task);
        }
        let taskDesc = document.createElement("div");
        taskDesc.classList.add("task-desc");
        taskDesc.textContent = text;
        modeInfoCaption.appendChild(taskDesc);
        if (mode.t == 1) {
          modeInfoCaption.classList.add("fading", "transitionCaption");
          this._fadeOut(modeInfoCaption, 4000);
        }
      } else {
        this.hide(this.MODE_INFO);
      }
    };
    GameCaption.prototype.modeComplete = function (isPlaylistEnd) {
      let modeCompleteCaption;
      this.hide();
      if (this.MODE_COMPLETE in this.captions) {
        this.captions[this.MODE_COMPLETE].classList.remove("hidden");
      } else {
        (modeCompleteCaption = this.captions[this.MODE_COMPLETE] = this.create()).classList.add("mode-complete");
      }
      (modeCompleteCaption = this.captions[this.MODE_COMPLETE]).textContent = "";
      let completedText = document.createElement("div");
      completedText.classList.add("completed-text");
      if (isPlaylistEnd) {
        if (isPlaylistEnd == 1) completedText.textContent = "✔ All done! Nice.";
      } else completedText.textContent = "✔ Completed";
      modeCompleteCaption.appendChild(completedText);
      completedText.classList.add("fadeInTop");
    };
    // Paused caption is unique, as it does not display on board. Leaving it unchanged.
    GameCaption.prototype.mapLoading = function (isUsermode) {
      let mapLoadingCaption;
      this.hide();
      if (this.MAP_LOADING in this.captions) {
        this.captions[this.MAP_LOADING].classList.remove("hidden");
      } else {
        (mapLoadingCaption = this.captions[this.MAP_LOADING] = this.create()).classList.add("map-loading");
      }
      (mapLoadingCaption = this.captions[this.MAP_LOADING]).textContent = "";
      let spinner = document.createElement("img");
      spinner.src = CDN_URL("/res/svg/spinWhite.svg");
      spinner.classList.add("spinner");
      mapLoadingCaption.appendChild(spinner);
      let loadingText = document.createElement("div");
      loadingText.classList.add("loading-text");
      loadingText.textContent = isUsermode ? "Custom mode loading" : i18n.mapLoading;
      mapLoadingCaption.appendChild(loadingText);
    };
    // Usermode buttons are also special, why are they in the Game**Caption** class though?
    GameCaption.prototype.gamePlace = function (game) {
      let gamePlaceCaption;
      this.hide(this.OUT_OF_FOCUS);
      this.hide(this.SPEED_LIMIT);
      if (this.GAME_PLACE in this.captions) {
        this.captions[this.GAME_PLACE].classList.remove("hidden");
        this.captions[this.GAME_PLACE].textContent = "";
      } else {
        (gamePlaceCaption = this.captions[this.GAME_PLACE] = this.create()).classList.add("game-place");
      }
      gamePlaceCaption = this.captions[this.GAME_PLACE];
      let place = document.createElement("div");
      let instructions = document.createElement("div");
      place.textContent = game.getPlaceColor(game.place).str;
      place.dataset.place = game.place;
      place.classList.add("place");
      instructions.dataset.gameOngoing = game.Live.LiveGameRunning;
      instructions.classList.add("instructions");
      if (game.Live.LiveGameRunning) {
        instructions.textContent = i18n.waitNext;
      } else {
        instructions.textContent = i18n.pressStart;
      }
      gamePlaceCaption.append(place, instructions);
    };
    GameCaption.prototype.speedWarning = function (PPSLimit) {
      if (!(this.GAME_PLACE in this.captions) || this.captions[this.GAME_PLACE].classList.contains("hidden")) {
        let speedLimitCaption;
        if (this.SPEED_LIMIT in this.captions) {
          this.captions[this.SPEED_LIMIT].classList.remove("hidden");
        } else {
          (speedLimitCaption = this.captions[this.SPEED_LIMIT] = this.create()).classList.add(
            "speed-warning",
            "transitionCaption"
          );
          let slowDown = document.createElement("div");
          slowDown.classList.add("slow-down");
          slowDown.textContent = i18n.slowDown;
          let speedLimit = document.createElement("div");
          speedLimit.id = "slSubT";
          speedLimit.classList.add("speed-limit");
          let b = document.createElement("b");
          speedLimit.append(`${i18n.speedLimitIs} `, b, " PPS");
          speedLimitCaption.append(slowDown, speedLimit);
        }
        (speedLimitCaption = this.captions[this.SPEED_LIMIT]).querySelector("#slSubT > b").textContent =
          PPSLimit.toFixed(1);
        if (this.speedTimout) {
          window.clearTimeout(this.speedTimout);
        }
        this._fadeOut(speedLimitCaption, 300);
      }
    };
    GameCaption.prototype.newPB = function (PBinfo) {
      let PBcaption;
      this.hide();
      if (this.NEW_PERSONAL_BEST in this.captions) {
        this.captions[this.NEW_PERSONAL_BEST].classList.remove("hidden");
      } else {
        (PBcaption = this.captions[this.NEW_PERSONAL_BEST] = this.create()).classList.add("pb", "transitionCaption");
        let time = document.createElement("div");
        time.classList.add("time");
        let yourNewPB = document.createElement("div");
        yourNewPB.classList.add("your-new-pb");
        yourNewPB.textContent = i18n.newPB;
        let improvement = document.createElement("div");
        improvement.id = "slSubT";
        improvement.classList.add("improvement");
        let modeInfo = document.createElement("div");
        modeInfo.classList.add("gCapt", "mode-info");
        PBcaption.append(time, yourNewPB, improvement, modeInfo);
      }
      PBcaption = this.captions[this.NEW_PERSONAL_BEST];
      let [time, yourNewPB, improvement, modeInfo] = PBcaption.children;
      if (PBinfo === true) {
        PBcaption.dataset.firstGame = true;
        improvement.textContent = i18n.firstPB;
        hideElem(time);
        hideElem(modeInfo);
      } else if (PBinfo) {
        PBcaption.dataset.firstGame = false;
        time.textContent = PBinfo.newS;
        let replacements = {
          prevPB: "<b>" + PBinfo.prevS + "</b>",
          prevAgo: "<b>" + PBinfo.days + " " + i18n.daysAgo + "</b>",
          PBdiff: "<b>" + PBinfo.diffS + "</b>",
        };
        improvement.innerHTML = trans(i18n.infoPB, replacements);
        modeInfo.innerHTML = PBinfo.modeTitle;
        showElem(time);
        showElem(modeInfo);
      }
    };
    GameCaption.prototype.loading = function (captionText, imageType = 0) {
      let loadingCaption;
      this.hide();
      if (this.LOADING in this.captions) {
        this.captions[this.LOADING].classList.remove("hidden");
        if (this.captions[this.LOADING].style) {
          this.captions[this.LOADING].classList.add("loading");
          this.captions[this.LOADING].removeAttribute("style");
        }
      } else {
        (loadingCaption = this.captions[this.LOADING] = this.create()).classList.add("loading");
      }
      (loadingCaption = this.captions[this.LOADING]).textContent = "";
      let image = document.createElement("img");
      switch (imageType) {
        case 1: {
          image.src = CDN_URL("/res/svg/cancel.svg");
          break;
        }
        case 2: {
          image.src = CDN_URL("/res/img/i/troll.png");
          break;
        }
        default: {
          image.src = CDN_URL("/res/svg/spinWhite.svg");
          break;
        }
      }
      image.classList.add("image");
      loadingCaption.appendChild(image);
      let loadingText = document.createElement("div");
      loadingText.classList.add("loading-text");
      loadingText.innerHTML = captionText; // One caption uses <br> in it, so innerHTML must remain.
      loadingCaption.appendChild(loadingText);
    };
    GameCaption.prototype.liveRaceFinished = function () {
      if (this.RACE_FINISHED in this.captions) {
        this.captions[this.RACE_FINISHED].classList.remove("hidden");
        return void this._fadeOut(this.captions[this.RACE_FINISHED], 5000, 3, 0.85);
      }
      let raceFinishedCaption = (this.captions[this.RACE_FINISHED] = this.create());
      raceFinishedCaption.classList.add("race-finished");
      let raceFinishedText = document.createElement("div");
      let raceFinishedInfo = document.createElement("div");
      raceFinishedText.textContent = i18n.raceFin;
      raceFinishedText.classList.add("race-finished-text");
      raceFinishedInfo.textContent = i18n.raceFinInfo;
      raceFinishedInfo.classList.add("race-finished-info");
      raceFinishedCaption.append(raceFinishedText, raceFinishedInfo);
      this._fadeOut(raceFinishedCaption, 5000, 3, 0.85);
    };
    GameCaption.prototype.gameWarning = function (warningTitle, warningDescription, options) {
      let fadeTimer_ms = 3000;
      if (options?.fade_after) fadeTimer_ms = options.fade_after;
      if (!warningDescription) warningDescription = "";
      if (this.GAME_WARNING in this.captions) {
        this.captions[this.GAME_WARNING].classList.remove("hidden");
        this.captions[this.GAME_WARNING].children[0].textContent = warningTitle;
        this.captions[this.GAME_WARNING].children[1].textContent = warningDescription;
        return void this._fadeOut(this.captions[this.GAME_WARNING], fadeTimer_ms, 2, 0.85);
      }
      let warningCaption = (this.captions[this.GAME_WARNING] = this.create());
      warningCaption.classList.add("warning", "transitionCaption");
      let warningTitleDiv = document.createElement("div");
      warningTitleDiv.classList.add("title");
      warningTitleDiv.textContent = warningTitle;
      let warningDescriptionDiv = document.createElement("div");
      warningDescriptionDiv.id = "slSubT";
      warningDescriptionDiv.classList.add("description");
      warningDescriptionDiv.textContent = warningDescription;
      warningCaption.append(warningTitleDiv, warningDescriptionDiv);
      this._fadeOut(warningCaption, fadeTimer_ms, 2, 0.85);
    };
  }

  if (typeof StatLine !== "undefined") {
    StatLine.prototype.enable = function () {
      this.enabled = true;
      this.label.classList.remove("hidden");
      this.label.style.display = null;
      return this;
    };
  }

  // statsDiv.children.forEach(element => {

  // });

  // Watch for `.gcapt` elements being added and give 'em unique classes

  // let statsDiv = document.querySelector("#main div:not([class]):not([id])");
}
