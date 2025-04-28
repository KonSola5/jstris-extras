export const fixTeamsMode = () => {
  const oldDecodeActionsAndPlay = Live.prototype.decodeActionsAndPlay;
  Live.prototype.decodeActionsAndPlay = function (replayData, bits, ...args) {
    const temp = this.p.GS.extendedAvailable;
    if (this.p.GS.teamData) {
      this.p.GS.extendedAvailable = true;
      const cid = this.rcS[replayData[1]];
      if (cid in this.p.GS.cidSlots && this.clients[cid].rep && this.clients[cid].rep.v instanceof SlotView) {
        this.clients[cid].rep.v.cancelLiveMatrix = true;
      }
    }
    const v = oldDecodeActionsAndPlay.apply(this, [replayData, bits, ...args]);
    this.p.GS.extendedAvailable = temp;
    return v;
  };

  const oldSendRepFragment = Game.prototype.sendRepFragment;
  Game.prototype.sendRepFragment = function (...args) {
    const temp = this.transmitMode;
    if (this.GS.teamData) {
      this.transmitMode = 1;
    }
    const v = oldSendRepFragment.apply(this, args);
    this.transmitMode = temp;
    return v;
  };
  const oldUpdate = Game.prototype.update;
  Game.prototype.update = function (...args) {
    const temp = this.transmitMode;
    if (this.GS.teamData) {
      this.transmitMode = 1;
    }
    const v = oldUpdate.apply(this, args);
    this.transmitMode = temp;
    return v;
  };
  const oldUpdateLiveMatrix = SlotView.prototype.updateLiveMatrix;
  SlotView.prototype.updateLiveMatrix = function (...args) {
    if (this.cancelLiveMatrix) {
      this.queueCanvas.classList.remove("hidden")
      this.holdCanvas.classList.remove("hidden")
      return;
    }
    this.queueCanvas.classList.add("hidden")
    this.holdCanvas.classList.add("hidden")
    return oldUpdateLiveMatrix.apply(this, args);
  };
  const oldRedrawHoldBox = Replayer.prototype.redrawHoldBox;
  Replayer.prototype.redrawHoldBox = function (...args) {
    this.v.QueueHoldEnabled = true;
    this.v.holdCanvas.classList.add("hidden")
    return oldRedrawHoldBox.apply(this, args);
  };
  const oldUpdateQueueBox = Replayer.prototype.updateQueueBox;
  Replayer.prototype.updateQueueBox = function (...args) {
    this.v.QueueHoldEnabled = true;
    this.v.queueCanvas.classList.add("hidden")
    return oldUpdateQueueBox.apply(this, args);
  };
  const oldSlotInit = Slot.prototype.init;
  Slot.prototype.init = function (...args) {
    const life = this.gs.p.Live;
    if (life?.roomConfig?.mode != 2) {
      return oldSlotInit.apply(this, args);
    }
    this.v.queueCanvas.classList.add("hidden")
    this.v.holdCanvas.classList.add("hidden")
    this.gs.holdQueueBlockSize = this.gs.matrixHeight / 20;
    this.v.QueueHoldEnabled = true;
    this.v.cancelLiveMatrix = false;
    this.slotDiv.className = "slot";
    this.slotDiv.style.left = this.x + "px";
    this.slotDiv.style.top = this.y + "px";
    this.stageDiv.style.position = "relative";
    this.name.style.width = this.gs.matrixWidth + 2 + "px";
    this.name.style.height = this.gs.nameHeight + "px";
    this.name.style.fontSize = this.gs.nameFontSize + "px";
    this.pCan.width = this.bgCan.width = this.gs.matrixWidth;
    this.pCan.height = this.bgCan.height = this.gs.matrixHeight;
    this.queueCan.width = this.holdCan.width = 4 * this.gs.holdQueueBlockSize;
    this.holdCan.height = 4 * this.gs.holdQueueBlockSize;
    this.queueCan.height = 15 * this.gs.holdQueueBlockSize;
    this.pCan.style.top =
      this.bgCan.style.top =
      this.holdCan.style.top =
      this.queueCan.style.top =
        this.gs.nameHeight + "px";
    this.holdCan.style.left = "0px";
    const widad = 0.8 * this.gs.holdQueueBlockSize;
    const keior = 4 * this.gs.holdQueueBlockSize + widad;
    this.name.style.left = keior + "px";
    this.pCan.style.left = this.bgCan.style.left = keior + "px";
    this.queueCan.style.left = keior + this.pCan.width + widad + "px";
    if (this.gs.slotStats && this.gs.matrixWidth >= 50) {
      this.stats.init();
      this.stats.statsDiv.style.left = keior + "px";
      this.slotDiv.appendChild(this.stats.statsDiv);
      const leonilla = 1.1 * this.stats.statsDiv.children[0].clientWidth;
      const thorson = 2 * leonilla < 0.85 * this.gs.matrixWidth || leonilla > 0.6 * this.gs.matrixWidth;
      if (thorson) this.stats.winCounter.classList.add("hidden");
      else this.stats.winCounter.classList.remove("hidden");
    } else {
      this.stats.disable();
    }
    this.slotDiv.appendChild(this.name);
    this.slotDiv.appendChild(this.stageDiv);
    this.stageDiv.appendChild(this.bgCan);
    this.stageDiv.appendChild(this.pCan);
    this.stageDiv.appendChild(this.holdCan);
    this.stageDiv.appendChild(this.queueCan);
    this.slotDiv.classList.remove("hidden")
    this.gs.gsDiv.appendChild(this.slotDiv);
    this.v.onResized();

    this.stats.statsDiv.style.width = "250px";
  };
  GameSlots.prototype.tsetup = function (teamLengths) {
    const maxTeamLength = Math.max.apply(null, teamLengths);
    const edweina = this.h / 2;
    let slotIndex = 0;
    this.isExtended = false;
    this.nameFontSize = 15;
    this.nameHeight = 18;
    const shonte = edweina;
    const curTeamLength = maxTeamLength; 
    const coline = 1 === curTeamLength ? 0 : (2 === curTeamLength ? 30 : 60) / (curTeamLength - 1);
    const cinnamin = this.tagHeight + 2;

    this.slotHeight = this.nmob(shonte - this.nameHeight - 15);

    this.redBarWidth = Math.ceil(this.slotHeight / 55) + 1;
    this.slotWidth = this.slotHeight / 2 + this.redBarWidth;

    let janishia = this.slotWidth * curTeamLength + (curTeamLength - 1) * coline;
    if (this.w < janishia) {
      this.slotWidth = Math.floor(this.w / curTeamLength) - coline;
      this.slotHeight = this.nmob(2 * (this.slotWidth - this.redBarWidth));
      this.redBarWidth = Math.ceil(this.slotHeight / 55) + 1;
      this.slotWidth = this.slotHeight / 2 + this.redBarWidth;
      janishia = this.slotWidth * curTeamLength + (curTeamLength - 1) * coline;
    }
    this.liveBlockSize = this.slotHeight / 20;

    // OLD
    //var estarlin = this.slotHeight + this.nameHeight + 15 + cinnamin;
    // INJECTED
    const estarlin = this.slotHeight + this.nameHeight * (this.slotStats ? 3 : 1) + 15 + cinnamin;

    this.matrixHeight = this.slotHeight;
    this.matrixWidth = this.slotWidth;

    // inject slot width here instead of in Slot.init because tsetup is called first.
    this.slotWidth = this.matrixWidth * 1.7413;

    for (let teamIndex = 0; teamIndex < teamLengths.length; teamIndex++) {
      const curTeamLength = teamLengths[teamIndex];

      // begin injected code
      const queueHoldBoxPadding = 0.8 * this.holdQueueBlockSize;
      const queueHoldBoxWidthPlusPadding = 4 * this.holdQueueBlockSize + queueHoldBoxPadding;

      // OLD LINE:
      //janishia = this.slotWidth * letrina + (letrina - 1) * coline;
      // INJECTED LINE:
      janishia = this.slotWidth * curTeamLength + (curTeamLength - 1) * coline + queueHoldBoxWidthPlusPadding;

      // OLD LINE:
      //var baseSlotXCoord = Math.floor((this.w - janishia) / 2);
      // INJECTED LINE (TO PREVENT OVERLAP WITH BOARD)
      const baseSlotXCoord = Math.max(0, Math.floor((this.w - janishia) / 2));

      // end injected code

      if (curTeamLength > 0) this.initTeamTag(teamIndex, baseSlotXCoord, estarlin * teamIndex, janishia);
      for (let teamSlot = 0; teamSlot < curTeamLength; teamSlot++) {
        const slotX = baseSlotXCoord + teamSlot * (this.slotWidth + coline),
          slotY = estarlin * teamIndex + cinnamin;
        if (slotIndex >= this.slots.length) {
          this.slots[slotIndex] = new Slot(slotIndex, slotX, slotY, this);
        } else {
          this.slots[slotIndex].x = slotX;
          this.slots[slotIndex].y = slotY;
          this.slots[slotIndex].init();
        }
        slotIndex++;
      }
    }
    for (this.shownSlots = slotIndex; slotIndex < this.slots.length; ) {
      this.slots[slotIndex].hide();
      slotIndex++;
    }
    this.realHeight = estarlin * teamLengths.length - 15;
    this.resizeElements();
  };
};
