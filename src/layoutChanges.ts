interface IconSelection {
  [number: string]: string;
}

export function initLayoutChanges() {
  const mains = document.querySelectorAll("#main") as NodeListOf<HTMLDivElement>;
  mains.forEach((main: HTMLDivElement) => {
    // There can be 1 or 2 divs with "main" IDs, gotta love that
    const mstage: HTMLDivElement = document.createElement("div");
    mstage.id = "mstage";
    const holdOutOfDiv: Element | null = main.querySelector("#main > .holdCanvas");
    const stage = main.querySelector("#stage") as HTMLDivElement;
    if (holdOutOfDiv) {
      const lstage: HTMLDivElement = document.createElement("div");
      lstage.classList.add("lstage");
      lstage.appendChild(holdOutOfDiv);
      main.insertBefore(lstage, stage);
    }
    mstage.appendChild(stage);
    main.insertBefore(mstage, main.querySelector("#rstage"));

    const bstage: HTMLDivElement = document.createElement("div");
    bstage.id = "bstage";
    main.append(bstage);

    const statsDiv = main.querySelector("#main > div:not([class]):not([id])") as HTMLDivElement;
    statsDiv.classList.add("hidden");
    bstage.append(...statsDiv.children);
  });

  if (mains.length == 2) {
    const twoBoards: HTMLDivElement = document.createElement("div");
    twoBoards.classList.add("two-boards");
    (document.getElementById("replayerGameFrame") as HTMLDivElement).prepend(twoBoards);
    twoBoards.append(...mains);
  }

  const emoteSelector = document.querySelector(".chatInputC .emSel") as SVGElement;
  if (emoteSelector) emoteSelector.classList.add("hidden");

  const speedChart = document.querySelector("#speedChart") as HTMLCanvasElement;
  if (speedChart) (speedChart.parentElement as HTMLDivElement).classList.add("stack");

  window.showElem = function (element: HTMLElement) {
    if (element) {
      element.classList.remove("hidden");
      element.style.removeProperty("display");
    }
  };

  window.hideElem = function (element: HTMLElement) {
    if (element) {
      element.classList.add("hidden");
      element.style.removeProperty("display");
    }
  };

  window.toggleElem = function (element: HTMLElement) {
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

  function getSVGSymbol(svgSrc: string, symbolToUse: string, CSSClasses: string): SVGSVGElement {
    const svg: SVGSVGElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add(...CSSClasses.split(" "));
    const use: SVGUseElement = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", `/svg/${symbolToUse}.svg#${svgSrc}`);
    svg.append(use);
    return svg;
  }

  function isKey<T extends object>(object: T, key: PropertyKey): key is keyof T {
    return key in object;
  }

  function getAuthorizedNameLinkElement(
    clientName: string,
    clientType: number,
    client: { color: string | null; icon: number | null; bold: boolean }
  ): HTMLAnchorElement {
    const link: HTMLAnchorElement = document.createElement("a");
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
        const iconSelection: IconSelection = {
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
        const iconToChoose: string =
          String.fromCharCode(65 + ((992 & clientType) >> 5)) + String.fromCharCode(65 + (31 & clientType));
        icon = new Image();
        icon.src = `https://jstris.jezevec10.com/vendor/countries/flags/${iconToChoose}.png`;
        icon.alt = iconToChoose;
        icon.classList.add("nameIcon");
        link.title = "Jstris Supporter";
        break;
      }
      case (clientType == 999 && client?.icon) as boolean: {
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
      const holdBlockSize: number = 0.8 * this.gs.holdQueueBlockSize;
      const offsetLeft: number = 4 * this.gs.holdQueueBlockSize + holdBlockSize;
      this.name.style.left = `${offsetLeft}px`;
      this.pCan.style.left = this.bgCan.style.left = `${offsetLeft}px`;
      this.queueCan.style.left = `${offsetLeft + this.pCan.width + holdBlockSize}px`;
      if (this.gs.slotStats && this.gs.matrixWidth >= 50) {
        this.stats.init();
        this.stats.statsDiv.style.left = `${offsetLeft}px`;
        this.slotDiv.append(this.stats.statsDiv);
        const totalWidth: number = 1.1 * (this.stats.statsDiv.childNodes[0] as HTMLDivElement).clientWidth;
        const shouldDisplayWinCounter: boolean =
          2 * totalWidth < 0.85 * this.gs.matrixWidth || totalWidth > 0.6 * this.gs.matrixWidth;
        if (shouldDisplayWinCounter) this.stats.winCounter.style.removeProperty("display");
        else this.stats.winCounter.style.display = "none";
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
    RoomInfo.prototype.displayLimit = function (roomDetails: RoomDetails) {
      if (!roomDetails.l) {
        hideElem(this.rdParts.limit);
        return;
      }
      const limit: HTMLDivElement = this.rdParts.limit;
      limit.replaceChildren();
      const roomJoinLimits = roomDetails.l;
      const isEligible: boolean | undefined = roomJoinLimits.r;
      const limits: Limits | undefined = roomJoinLimits.l;
      const currentStats: CurrentStats = roomJoinLimits.s || ({} as CurrentStats);
      this.rdParts.limit.classList.remove("hidden");
      // this.rdParts.limit.style.display = "flex";
      const limitInfoDiv: HTMLDivElement = this.createElement("div", ["rdLimitInf"], null);
      if (isEligible) {
        limit.classList.add("rdOK");
        limit.classList.remove("rdF");
        limit.append(getSVGSymbol("s-unlocked", "dark", "lIcn"));
        const header: HTMLHeadingElement = document.createElement("h1");
        header.textContent = i18n.joinPossible;
        limitInfoDiv.append(header);
      } else {
        limit.classList.add("rdF");
        limit.classList.remove("rdOK");
        limit.append(getSVGSymbol("s-locked", "dark", "lIcn"));
        const header: HTMLHeadingElement = document.createElement("h1");
        header.textContent = i18n.notEligible;
        limitInfoDiv.append(header);
      }
      const getFormattedRange = (min: number | string | null = 0, max: number | string | null = "\u221E"): string =>
        `⟨${min}, ${max}⟩`;
      const getEligibilityChar = function (current: number, min: number | null, max: number | null) {
        if (!max) max = Number.MAX_SAFE_INTEGER;
        if (!min) min = 0;
        if (
          (!min && !max) ||
          (!min && current <= max) ||
          (!max && current >= min) ||
          (current <= max && current >= min)
        )
          return "✓";
        else return "✗";
      };
      const descList: HTMLDListElement = document.createElement("dl");
      const descs: HTMLElement[] = [];
      if (limits) {
        for (const currentLimit in limits) {
          if (isKey(limits, currentLimit)) {
            const descTerm: HTMLElement = document.createElement("dt");
            const minMaxRange: [min: number | null, max: number | null] = limits[currentLimit]!;
            descTerm.textContent = `${this.LIMIT_NAMES[currentLimit].n}: ${getFormattedRange(...minMaxRange)}`;
            const currentStat = currentStats[currentLimit];
            const unit: string = this.LIMIT_NAMES[currentLimit].u;
            const descDetails: HTMLElement = document.createElement("dd");
            const eligibilityChar: "✓" | "✗" = getEligibilityChar(currentStats[currentLimit], ...minMaxRange);
            const currentStatFormatted: string = currentStat ? `${currentStat} ${unit}` : "None";
            descDetails.textContent = `${eligibilityChar} ${currentStatFormatted}`;
            descs.push(descTerm, descDetails);
          }
        }
      }

      descList.append(...descs);
      limitInfoDiv.append(descList);
      limit.append(limitInfoDiv);
    };

    RoomInfo.prototype.displayConfig = function (roomDetails: RoomDetails) {
      let done: number = 0;
      const settingsContent: HTMLDivElement = this.rdParts.settingsContent;
      settingsContent.replaceChildren();
      for (const setting in roomDetails.s) {
        if (isKey(this.CONF_NAMES, setting)) {
          const currentSetting = this.CONF_NAMES[setting] as string | { n: string; v?: (string | null)[]; u?: string };
          let settingName: string;
          if (typeof currentSetting == "object") {
            settingName = currentSetting.n;
          } else if (typeof currentSetting == "string") {
            settingName = currentSetting;
          } else throw new Error("Setting name is neither a string nor an object.");
          let value: string = "";
          // let name: string;
          let bulletPoint: string = "• " + settingName;
          if (typeof roomDetails.s[setting] == "boolean") {
            value = this.ON_OFF[roomDetails.s[setting] ? 1 : 0];
          } else {
            if (!Array.isArray(roomDetails.s[setting])) {
              if (typeof currentSetting == "object" && "v" in currentSetting) {
                const modifiedSetting = roomDetails.s[setting]!;
                if (typeof modifiedSetting == "number") {
                  let arrayValue = currentSetting.v?.[modifiedSetting];
                  if (!arrayValue) {
                    continue;
                  }
                  arrayValue = arrayValue || "?";
                  value = arrayValue;
                }
              } else {
                value = String(roomDetails.s[setting]);
              }
              if (typeof currentSetting == "object" && "u" in currentSetting) {
                value += currentSetting.u;
              }
            }
          }
          let configValueSpan;
          if (value) {
            bulletPoint += ": ";
            configValueSpan = document.createElement("span");
            configValueSpan.textContent = value;
            configValueSpan.classList.add("confVal");
          }
          const rdItem: HTMLDivElement = this.createElement("div", ["rdItem"], settingsContent);
          rdItem.textContent = bulletPoint;
          if (configValueSpan) rdItem.insertAdjacentElement("beforeend", configValueSpan);
          ++done;
        } else {
          continue;
        }
      }
      if (done) {
        showElem(this.rdParts.settings);
      }
    };

    RoomInfo.prototype.displayPlayers = function (roomDetails: RoomDetails) {
      this.rdParts.content.classList.remove("hidden");
      let countedPlayers: number = 0;
      roomDetails.p.p.forEach((item, i) => {
        if (!Object.prototype.hasOwnProperty.call(item, "ti")) roomDetails.p.p[i].ti = 0;
      });
      roomDetails.p.p.sort((player1, player2) => {
        if (player1.type && !player2.type) return -1;
        else if (!player1.type && player2.type) return 1;
        else if (player1.type && player2.type && player1.ti != player2.ti) {
          if (player1.ti! > player2.ti!) return -1;
          else return 1;
        } else return player1.n.localeCompare(player2.n);
      });
      const nodesToAdd: HTMLElement[] = [];
      let lastPlayerName: string | null = null;
      for (const player of roomDetails.p.p) {
        if (lastPlayerName !== null && lastPlayerName === player.n) {
          continue;
        }
        const playerType: number = player.type || 0;
        const supporterStyle = {
          color: player.col || null,
          icon: player.icn || null,
          bold: (player.ti || 0) >= 2,
        };
        nodesToAdd.push(getAuthorizedNameLinkElement(player.n, playerType, supporterStyle));
        countedPlayers++;
        lastPlayerName = player.n;
        if (countedPlayers >= 21) {
          break;
        }
      }
      if (roomDetails.p.c > 21) {
        const span: HTMLSpanElement = document.createElement("span");
        span.classList.add("pInfo");
        span.textContent = `+${trans(i18n.cntMore, { cnt: roomDetails.p.c - 21 })}`;
        nodesToAdd.push(span);
        countedPlayers++;
      } else if (roomDetails.p.g) {
        const span: HTMLSpanElement = document.createElement("span");
        span.classList.add("pInfo");
        span.textContent = `+${trans(i18n.cntGuests, { cnt: roomDetails.p.g })}`;
        nodesToAdd.push(span);
        countedPlayers++;
      } else if (roomDetails.p.c + roomDetails.p.s === 0) {
        const span: HTMLSpanElement = document.createElement("span");
        span.classList.add("pInfo");
        span.textContent = i18n.noPlayers;
        nodesToAdd.push(span);
      }
      if (roomDetails.p.s && countedPlayers < 22) {
        const span: HTMLSpanElement = document.createElement("span");
        span.classList.add("pInfo");
        span.textContent = `+${trans(i18n.cntSpec, { cnt: roomDetails.p.s })}`;
        nodesToAdd.push(span);
        countedPlayers++;
      }
      this.rdParts.content.replaceChildren(...nodesToAdd);
    };

    RoomInfo.prototype.displayRoomDetail = function (id) {
      if (this.roomDetailBox!.dataset.id === id && !this.roomDetailBox!.classList.contains("hidden")) {
        const roomDetails = this.roomDetails[id];
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
      const caption: HTMLDivElement = document.createElement("div");
      this.parent.appendChild(caption);
      caption.classList.add("gCapt");
      return caption;
    };
    GameCaption.prototype.hide = function (captionType: number) {
      if (!captionType) {
        for (const caption in this.captions) {
          if (isKey(this.captions, caption)) this.captions[caption]!.classList.add("hidden");
        }
      } else {
        const captionString: string = String(captionType);
        if (isKey(this.captions, captionString)) this.captions[captionString]!.classList.add("hidden");
      }
    };
    GameCaption.prototype.hideExcept = function (captionType: number) {
      for (const caption in this.captions) {
        if (isKey(this.captions, caption)) {
          if (Number(caption) != captionType) {
            this.captions[caption]!.classList.add("hidden");
          }
        }
      }
    };
    GameCaption.prototype.spectatorMode = function () {
      this.hide();
      if (this.SPECTATOR_MODE in this.captions) {
        this.captions[this.SPECTATOR_MODE]!.classList.remove("hidden");
      } else {
        const spectatorCaption: HTMLDivElement = (this.captions[this.SPECTATOR_MODE] = this.create());
        spectatorCaption.classList.add("spectator-mode");
        const specMode: HTMLDivElement = document.createElement("div");
        const endSpec: HTMLDivElement = document.createElement("div");
        specMode.textContent = i18n.specMode;
        specMode.classList.add("spec-mode");
        endSpec.textContent = i18n.endSpec;
        endSpec.classList.add("end-spec");
        spectatorCaption.append(specMode, endSpec);
      }
    };
    GameCaption.prototype.outOfFocus = function (/*topOffset*/) {
      if (this.GAME_PLACE in this.captions && !this.captions[this.GAME_PLACE]!.classList.contains("hidden")) {
        return;
      }
      if (this.OUT_OF_FOCUS in this.captions) {
        this.captions[this.OUT_OF_FOCUS]!.classList.remove("hidden");
        return;
      }
      const outOfFocusCaption: HTMLDivElement = (this.captions[this.OUT_OF_FOCUS] = this.create());
      outOfFocusCaption.classList.add("out-of-focus");
      const notFocused: HTMLDivElement = document.createElement("div");
      const clickToFocus: HTMLDivElement = document.createElement("div");
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
        this.captions[this.READY_GO]!.classList.remove("hidden");
      } else {
        (readyGoCaption = this.captions[this.READY_GO] = this.create()).classList.add("ready-go");
      }
      (readyGoCaption = this.captions[this.READY_GO])!.textContent = "";
      const readyOrGo: HTMLDivElement = document.createElement("div");
      readyOrGo.classList.add("ready-or-go");
      readyOrGo.textContent = state === 0 ? i18n.ready : i18n.go;
      readyGoCaption!.appendChild(readyOrGo);
    };
    GameCaption.prototype.modeInfo = function (text: string, mode) {
      if (text) {
        let modeInfoCaption;
        if (this.MODE_INFO in this.captions) {
          this.captions[this.MODE_INFO]!.classList.remove("hidden");
        } else {
          (modeInfoCaption = this.captions[this.MODE_INFO] = this.create()).classList.add("mode-info");
        }
        (modeInfoCaption = this.captions[this.MODE_INFO])!.textContent = "";
        if (mode.t == 0) {
          const task = document.createElement("div");
          task.classList.add("task");
          task.textContent = "TASK:";
          modeInfoCaption!.appendChild(task);
        }
        const taskDesc: HTMLDivElement = document.createElement("div");
        taskDesc.classList.add("task-desc");
        taskDesc.textContent = text;
        modeInfoCaption!.appendChild(taskDesc);
        if (mode.t == 1) {
          modeInfoCaption!.classList.add("fading", "transitionCaption");
          this._fadeOut(modeInfoCaption!, 4000);
        }
      } else {
        this.hide(this.MODE_INFO);
      }
    };
    GameCaption.prototype.modeComplete = function (isPlaylistEnd) {
      let modeCompleteCaption;
      this.hide();
      if (this.MODE_COMPLETE in this.captions) {
        this.captions[this.MODE_COMPLETE]!.classList.remove("hidden");
      } else {
        (modeCompleteCaption = this.captions[this.MODE_COMPLETE] = this.create()).classList.add("mode-complete");
      }
      (modeCompleteCaption = this.captions[this.MODE_COMPLETE])!.textContent = "";
      const completedText: HTMLDivElement = document.createElement("div");
      completedText.classList.add("completed-text");
      if (isPlaylistEnd) {
        if (isPlaylistEnd == 1) completedText.textContent = "✔ All done! Nice.";
      } else completedText.textContent = "✔ Completed";
      modeCompleteCaption!.appendChild(completedText);
      completedText.classList.add("fadeInTop");
    };
    // Paused caption is unique, as it does not display on board. Leaving it unchanged.
    GameCaption.prototype.mapLoading = function (isUsermode) {
      let mapLoadingCaption;
      this.hide();
      if (this.MAP_LOADING in this.captions) {
        this.captions[this.MAP_LOADING]!.classList.remove("hidden");
      } else {
        (mapLoadingCaption = this.captions[this.MAP_LOADING] = this.create()).classList.add("map-loading");
      }
      (mapLoadingCaption = this.captions[this.MAP_LOADING])!.textContent = "";
      const spinner: HTMLImageElement = document.createElement("img");
      spinner.src = CDN_URL("/res/svg/spinWhite.svg");
      spinner.classList.add("spinner");
      mapLoadingCaption!.appendChild(spinner);
      const loadingText: HTMLDivElement = document.createElement("div");
      loadingText.classList.add("loading-text");
      loadingText.textContent = isUsermode ? "Custom mode loading" : i18n.mapLoading;
      mapLoadingCaption!.appendChild(loadingText);
    };
    // Usermode buttons are also special, why are they in the Game**Caption** class though?
    GameCaption.prototype.gamePlace = function (game: Game) {
      let gamePlaceCaption;
      this.hide(this.OUT_OF_FOCUS);
      this.hide(this.SPEED_LIMIT);
      if (this.GAME_PLACE in this.captions) {
        this.captions[this.GAME_PLACE]!.classList.remove("hidden");
        this.captions[this.GAME_PLACE]!.textContent = "";
      } else {
        (gamePlaceCaption = this.captions[this.GAME_PLACE] = this.create()).classList.add("game-place");
      }
      gamePlaceCaption = this.captions[this.GAME_PLACE];
      const place: HTMLDivElement = document.createElement("div");
      const instructions: HTMLDivElement = document.createElement("div");
      place.textContent = game.getPlaceColor(game.place!).str;
      place.dataset.place = String(game.place);
      place.classList.add("place");
      instructions.dataset.gameOngoing = String(game.Live.LiveGameRunning);
      instructions.classList.add("instructions");
      if (game.Live.LiveGameRunning) {
        instructions.textContent = i18n.waitNext;
      } else {
        instructions.textContent = i18n.pressStart;
      }
      gamePlaceCaption!.append(place, instructions);
    };
    GameCaption.prototype.speedWarning = function (PPSLimit) {
      if (!(this.GAME_PLACE in this.captions) || this.captions[this.GAME_PLACE]!.classList.contains("hidden")) {
        let speedLimitCaption;
        if (this.SPEED_LIMIT in this.captions) {
          this.captions[this.SPEED_LIMIT]!.classList.remove("hidden");
        } else {
          (speedLimitCaption = this.captions[this.SPEED_LIMIT] = this.create()).classList.add(
            "speed-warning",
            "transitionCaption"
          );
          const slowDown: HTMLDivElement = document.createElement("div");
          slowDown.classList.add("slow-down");
          slowDown.textContent = i18n.slowDown;
          const speedLimit: HTMLDivElement = document.createElement("div");
          speedLimit.id = "slSubT";
          speedLimit.classList.add("speed-limit");
          const b: HTMLElement = document.createElement("b");
          speedLimit.append(`${i18n.speedLimitIs} `, b, " PPS");
          speedLimitCaption.append(slowDown, speedLimit);
        }
        (
          (speedLimitCaption = this.captions[this.SPEED_LIMIT]!).querySelector("#slSubT > b") as HTMLDivElement
        ).textContent = PPSLimit.toFixed(1);
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
        this.captions[this.NEW_PERSONAL_BEST]!.classList.remove("hidden");
      } else {
        (PBcaption = this.captions[this.NEW_PERSONAL_BEST] = this.create()).classList.add("pb", "transitionCaption");
        const time = document.createElement("div");
        time.classList.add("time");
        const yourNewPB: HTMLDivElement = document.createElement("div");
        yourNewPB.classList.add("your-new-pb");
        yourNewPB.textContent = i18n.newPB;
        const improvement: HTMLDivElement = document.createElement("div");
        improvement.id = "slSubT";
        improvement.classList.add("improvement");
        const modeInfo: HTMLDivElement = document.createElement("div");
        modeInfo.classList.add("gCapt", "mode-info");
        PBcaption.append(time, yourNewPB, improvement, modeInfo);
      }
      PBcaption = this.captions[this.NEW_PERSONAL_BEST];
      if (!PBcaption) throw new Error("PB caption is null!");
      const [time /*yourNewPB*/, , improvement, modeInfo] = PBcaption.children as HTMLCollectionOf<HTMLDivElement>;
      if (PBinfo === true) {
        PBcaption.dataset.firstGame = String(true);
        improvement.textContent = i18n.firstPB;
        hideElem(time);
        hideElem(modeInfo);
      } else if (PBinfo) {
        PBcaption.dataset.firstGame = String(false);
        time.textContent = String(PBinfo.newS);
        const replacements = {
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
    GameCaption.prototype.loading = function (captionText: string, imageType = 0) {
      let loadingCaption;
      this.hide();
      if (this.LOADING in this.captions) {
        this.captions[this.LOADING]!.classList.remove("hidden");
        if (this.captions[this.LOADING]!.style) {
          this.captions[this.LOADING]!.classList.add("loading");
          this.captions[this.LOADING]!.removeAttribute("style");
        }
      } else {
        (loadingCaption = this.captions[this.LOADING] = this.create()).classList.add("loading");
      }
      loadingCaption = this.captions[this.LOADING];
      if (!loadingCaption) throw new Error("Loading caption is null!");
      loadingCaption.textContent = "";
      const image: HTMLImageElement = document.createElement("img");
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
      const loadingText: HTMLDivElement = document.createElement("div");
      loadingText.classList.add("loading-text");
      loadingText.innerHTML = captionText; // One caption uses <br> in it, so innerHTML must remain.
      loadingCaption.appendChild(loadingText);
    };
    GameCaption.prototype.liveRaceFinished = function () {
      if (this.RACE_FINISHED in this.captions) {
        this.captions[this.RACE_FINISHED]!.classList.remove("hidden");
        return void this._fadeOut(this.captions[this.RACE_FINISHED]!, 5000, 3, 0.85);
      }
      const raceFinishedCaption: HTMLDivElement = (this.captions[this.RACE_FINISHED] = this.create());
      raceFinishedCaption.classList.add("race-finished");
      const raceFinishedText: HTMLDivElement = document.createElement("div");
      const raceFinishedInfo: HTMLDivElement = document.createElement("div");
      raceFinishedText.textContent = i18n.raceFin;
      raceFinishedText.classList.add("race-finished-text");
      raceFinishedInfo.textContent = i18n.raceFinInfo;
      raceFinishedInfo.classList.add("race-finished-info");
      raceFinishedCaption.append(raceFinishedText, raceFinishedInfo);
      this._fadeOut(raceFinishedCaption, 5000, 3, 0.85);
    };
    GameCaption.prototype.gameWarning = function (warningTitle, warningDescription, options) {
      let fadeTimer_ms: number = 3000;
      if (options?.fade_after) fadeTimer_ms = options.fade_after;
      if (!warningDescription) warningDescription = "";
      if (this.GAME_WARNING in this.captions) {
        this.captions[this.GAME_WARNING]!.classList.remove("hidden");
        this.captions[this.GAME_WARNING]!.children[0].textContent = warningTitle;
        this.captions[this.GAME_WARNING]!.children[1].textContent = warningDescription;
        return void this._fadeOut(this.captions[this.GAME_WARNING]!, fadeTimer_ms, 2, 0.85);
      }
      const warningCaption: HTMLDivElement = (this.captions[this.GAME_WARNING] = this.create());
      warningCaption.classList.add("warning", "transitionCaption");
      const warningTitleDiv: HTMLDivElement = document.createElement("div");
      warningTitleDiv.classList.add("title");
      warningTitleDiv.textContent = warningTitle;
      const warningDescriptionDiv: HTMLDivElement = document.createElement("div");
      warningDescriptionDiv.id = "slSubT";
      warningDescriptionDiv.classList.add("description");
      warningDescriptionDiv.textContent = warningDescription;
      warningCaption.append(warningTitleDiv, warningDescriptionDiv);
      this._fadeOut(warningCaption, fadeTimer_ms, 2, 0.85);
    };
  }

  if (typeof StatLine !== "undefined") {
    StatLine.prototype.enable = function (): StatLine {
      this.enabled = true;
      this.label.classList.remove("hidden");
      this.label.style.removeProperty("display");
      return this;
    };
  }

  // statsDiv.children.forEach(element => {

  // });

  // Watch for `.gcapt` elements being added and give 'em unique classes

  // let statsDiv = document.querySelector("#main div:not([class]):not([id])");
}
