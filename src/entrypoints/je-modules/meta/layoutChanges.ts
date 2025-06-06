import { assert } from "$/utils/HTML-utils";

interface IconSelection {
  [number: string]: string;
}

export function initLayoutChanges() {
  const mains: NodeListOf<HTMLDivElement> = document.querySelectorAll("#main");
  mains.forEach((main: HTMLDivElement) => {
    // There can be 1 or 2 divs with "main" IDs, gotta love that
    const mstage: HTMLDivElement = document.createElement("div");
    mstage.id = "mstage";
    const holdOutOfDiv: Element | null = main.querySelector("#main > .holdCanvas");
    const stage = assert(main.querySelector("#stage"), HTMLDivElement);
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

    const statsDiv: HTMLDivElement | null = main.querySelector("#main > div:not([class]):not([id])");
    if (statsDiv) {
      statsDiv.classList.add("hidden");
      bstage.append(...statsDiv.children);
    }
  });

  if (mains.length == 2) {
    const twoBoards: HTMLDivElement = document.createElement("div");
    twoBoards.classList.add("two-boards");
    assert(document.getElementById("replayerGameFrame"), HTMLDivElement).prepend(twoBoards);
    twoBoards.append(...mains);
  }

  const emoteSelector = document.querySelector(".chatInputC .emSel");
  if (emoteSelector) emoteSelector.classList.add("hidden");

  const speedChart = document.querySelector("#speedChart");
  if (speedChart) assert(speedChart.parentElement, HTMLDivElement).classList.add("stack");

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
        const totalWidth: number = 1.1 * assert(this.stats.statsDiv.childNodes[0], HTMLDivElement).clientWidth;
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
    RoomInfo.prototype.displayLimit = function (roomDetails: Jstris.RoomDetails) {
      if (!roomDetails.l) {
        hideElem(this.rdParts.limit);
        return;
      }
      const limit: HTMLDivElement = this.rdParts.limit;
      limit.replaceChildren();
      const roomJoinLimits = roomDetails.l;
      const isEligible: boolean | undefined = roomJoinLimits.r;
      const limits: Jstris.Limits | undefined = roomJoinLimits.l;
      const currentStats: Jstris.CurrentStats = roomJoinLimits.s || ({} as Jstris.CurrentStats);
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

    RoomInfo.prototype.displayConfig = function (roomDetails: Jstris.RoomDetails) {
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

    RoomInfo.prototype.displayPlayers = function (roomDetails: Jstris.RoomDetails) {
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

  if (typeof StatLine !== "undefined") {
    StatLine.prototype.enable = function (): StatLine {
      this.enabled = true;
      this.label.classList.remove("hidden");
      this.label.style.removeProperty("display");
      return this;
    };
  }
}
