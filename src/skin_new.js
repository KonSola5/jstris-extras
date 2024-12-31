import { Config } from "./config";
import { inject, functionExists, exists } from "./util";
import { getBlockSetsEX } from "./blockSetExtensions";

export const initSkins = () => {
  let offscreenCanvas = document.createElement("canvas");
  let offscreenContext = offscreenCanvas.getContext("2d");
  offscreenCanvas.height = 32;
  offscreenCanvas.width = 32;
  let customSkinSize = 32;
  let customGhostSkinSize = 32;
  let usingConnected = false;
  let usingGhostConnected = false;

  function loadCustomSkin(url, ghost = false) {
    // if not allowing force replay skin, don't load custom skin
    if (location.href.includes("replay") && !Config().ENABLE_REPLAY_SKIN) {
      return;
    }

    let img = new Image();
    console.log(url, ghost);
    img.onload = function () {
      let height = img.height;
      let width = img.width;
      let ratio = width / height;
      switch (true) {
        case ratio == 9 && !ghost:
          customSkinSize = height;
          usingConnected = false;
          if (window.loadSkin) loadSkin(url, customSkinSize);
          break;
        case ratio == (6 * 9) / 8 && !ghost:
          usingConnected = true;
          customSkinSize = width / (6 * 9);
          if (window.loadSkin) loadSkin(url, customSkinSize);
          break;
        case ratio == 7 && ghost:
          usingGhostConnected = false;
          customGhostSkinSize = height;
          if (window.loadGhostSkin) loadGhostSkin(url, height);
          break;
        case ratio == (6 * 7) / 8 && ghost:
          offscreenCanvas.height = width / (6 * 7);
          offscreenCanvas.width = width / (6 * 7);
          usingGhostConnected = true;
          customGhostSkinSize = width / (6 * 7);
          if (window.loadSkin) loadGhostSkin(url, width / (6 * 7));
          break;
        default:
          break;
      }
    };
    img.src = url;
  }
  window.loadCustomSkin = loadCustomSkin;

  function getConnection(connection) {
    const tileLookup = {
      0: [3, 3],
      2: [3, 2],
      8: [2, 3],
      10: [2, 6],
      11: [2, 2],
      16: [0, 3],
      18: [0, 6],
      22: [0, 2],
      24: [1, 3],
      26: [1, 6],
      27: [4, 3],
      30: [5, 1],
      31: [1, 2],
      64: [3, 0],
      66: [3, 1],
      72: [2, 4],
      74: [2, 5],
      75: [5, 0],
      80: [0, 4],
      82: [0, 5],
      86: [4, 2],
      88: [1, 4],
      90: [1, 5],
      91: [0, 7],
      94: [1, 7],
      95: [4, 4],
      104: [2, 0],
      106: [5, 3],
      107: [2, 1],
      120: [4, 0],
      122: [2, 7],
      123: [3, 5],
      126: [5, 7],
      127: [3, 4],
      208: [0, 0],
      210: [4, 1],
      214: [0, 1],
      216: [5, 2],
      218: [3, 7],
      219: [4, 7],
      222: [5, 5],
      223: [5, 4],
      248: [1, 0],
      250: [4, 6],
      251: [3, 6],
      254: [5, 6],
      255: [1, 1],
    };

    return tileLookup[connection] ?? [4, 5];
  }

  // Connected skin init

  let drawCanvas = false;

  // WebGL connected skin init
  if (exists(window.WebGLView)) {
    let oldRedrawMatrix = WebGLView.prototype.redrawMatrix;
    WebGLView.prototype.redrawMatrix = function () {
      if (usingConnected) {
        this.clearMainCanvas();
        if (this.g.isInvisibleSkin) {
          return;
        }
        this.g.redrawMatrixConnected();
        return;
      }
      return oldRedrawMatrix.apply(this, arguments);
    };

    let oldInitRenderer = WebGLView.prototype.initRenderer;
    WebGLView.prototype.initRenderer = function () {
      let returnValue = oldInitRenderer.apply(this, arguments);
      this.setBlendConnected();
      return returnValue;
    };

    WebGLView.prototype.setBlendConnected = function () {
      for (let ctx of this.ctxs) {
        let gl = ctx.gl;
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      }
    };

    WebGLView.prototype.drawBlockConnected = function (x, y, blockID, connection, ctxKind) {
      if (blockID) {
        let skin = this.g.skins[this.g.skinId];
        let scale = this.g.drawScale * this.g.block_size;
        let ctx = this.ctxs[ctxKind],
          texture = ctx.textureInfos[0];
        let [offsetX, offsetY] = getConnection(connection);

        this.drawImage(
          ctx,
          texture.texture,
          texture.width,
          texture.height,
          (6 * this.g.coffset[blockID] + offsetX) * skin.w,
          offsetY * skin.w,
          skin.w,
          skin.w,
          x * this.g.block_size,
          y * this.g.block_size,
          scale,
          scale
        );
      }
    };

    WebGLView.prototype.drawGhostBlockConnected = function (x, y, blockID, connection) {
      let skinSize = this.g.skins[this.g.skinId].w;
      var mainCtx = this.ctxs[0];
      if (this.g.ghostSkinId === 0) {
        mainCtx.gl.uniform1f(mainCtx.globalAlpha, 0.5);
        this.drawBlockConnected(x, y, blockID, connection, 0);
        mainCtx.gl.uniform1f(mainCtx.globalAlpha, 1);
      } else {
        var scale = this.g.drawScale * this.g.block_size;
        var texture = mainCtx.textureInfos[1];
        let [offsetX, offsetY] = getConnection(connection);
        this.drawImage(
          mainCtx,
          texture.texture,
          texture.width,
          texture.height,
          (6 * (this.g.coffset[blockID] - 2) + offsetX) * skinSize,
          offsetY * skinSize,
          skinSize,
          skinSize,
          x * this.g.block_size,
          y * this.g.block_size,
          scale,
          scale
        );
      }
    };
    WebGLView.prototype.drawBlockOnCanvasConnected = function (x, y, blockID, connection, ctxKind) {
      this.drawBlockConnected(x, y, blockID, connection, ctxKind);
    };
  }

  // 2D canvas connected skin init

  if (exists(window.Ctx2DView)) {
    let oldRedrawMatrix = Ctx2DView.prototype.redrawMatrix;
    Ctx2DView.prototype.redrawMatrix = function () {
      if (usingConnected) {
        this.clearMainCanvas();
        if (this.g.isInvisibleSkin) {
          return;
        }
        this.g.redrawMatrixConnected();
        return;
      }
      return oldRedrawMatrix.apply(this, arguments);
    };

    Ctx2DView.prototype.drawBlockConnected = function (x, y, blockID, connection) {
      if (blockID && x >= 0 && y >= 0 && x < 10 && y < 20) {
        var scale = this.g.drawScale * this.g.block_size;
        if (this.g.skinId) {
          let [offsetX, offsetY] = getConnection(connection);
          this.ctx.drawImage(
            this.g.tex,
            (6 * this.g.coffset[blockID] + offsetX) * this.g.skins[this.g.skinId].w,
            offsetY * this.g.skins[this.g.skinId].w,
            this.g.skins[this.g.skinId].w,
            this.g.skins[this.g.skinId].w,
            x * this.g.block_size,
            y * this.g.block_size,
            scale,
            scale
          );
        } else {
          var mono = this.g.monochromeSkin && blockID <= 7 ? this.g.monochromeSkin : this.g.colors[blockID];
          this.drawRectangle(this.ctx, x * this.g.block_size, y * this.g.block_size, scale, scale, mono);
        }
      }
    };

    Ctx2DView.prototype.drawGhostBlockConnected = function (x, y, pieceID, connection) {
      if (x >= 0 && y >= 0 && x < 10 && y < 20) {
        let scale = this.g.drawScale * this.g.block_size;
        let [offsetX, offsetY] = getConnection(connection);
        if (0 === this.g.ghostSkinId) {
          this.ctx.globalAlpha = 0.5;
          if (this.g.skinId > 0) {
            this.ctx.drawImage(
              this.g.tex,
              (6 * this.g.coffset[pieceID] + offsetX) * this.g.skins[this.g.skinId].w,
              offsetY * this.g.skins[this.g.skinId].w,
              this.g.skins[this.g.skinId].w,
              this.g.skins[this.g.skinId].w,
              x * this.g.block_size,
              y * this.g.block_size,
              scale,
              scale
            );
          } else {
            this.drawBlock(x, y, pieceID);
          }
          this.ctx.globalAlpha = 1;
        } else {
          let ghostSkin = this.g.ghostSkins[this.g.ghostSkinId];
          this.ctx.drawImage(
            this.g.ghostTex,
            (6 * (this.g.coffset[pieceID] - 2) + offsetX) * ghostSkin.w,
            offsetY * ghostSkin.w,
            ghostSkin.w,
            ghostSkin.w,
            x * this.g.block_size,
            y * this.g.block_size,
            scale,
            scale
          );
        }
      }
    };

    Ctx2DView.prototype.drawBlockOnCanvasConnected = function (x, y, blockID, connection, ctxKind, drawScale) {
      var ctx = ctxKind === this.HOLD ? this.hctx : this.qctx;
      if (this.g.skinId === 0) {
        var mono = this.g.monochromeSkin && blockID <= 7 ? this.g.monochromeSkin : this.g.colors[blockID];
        this.drawRectangle(
          ctx,
          x * this.g.block_size,
          y * this.g.block_size,
          this.g.block_size * drawScale,
          this.g.block_size * drawScale,
          mono
        );
      } else {
        let [offsetX, offsetY] = getConnection(connection);
        ctx.drawImage(
          this.g.tex,
          (6 * this.g.coffset[blockID] + offsetX) * this.g.skins[this.g.skinId].w,
          offsetY * this.g.skins[this.g.skinId].w,
          this.g.skins[this.g.skinId].w,
          this.g.skins[this.g.skinId].w,
          x * this.g.block_size,
          y * this.g.block_size,
          this.g.block_size * drawScale,
          this.g.block_size * drawScale
        );
      }
    };
  }

  function drawGhostAndCurrentConnected() {
    if (!this.blockSetsEX) {
      this.blockSetsEX = getBlockSetsEX();
    }
    let currentBlockSet = this.blockSets[this.activeBlock.set];
    let currentBlockSetEX = this.blockSetsEX[this.activeBlock.set];
    let pieceToDraw = currentBlockSet.blocks[this.activeBlock.id].blocks[this.activeBlock.rot];
    // currentBlockSet.scale === 1 // It this isn't a giant piece
    //   ? currentBlockSet.blocks[this.activeBlock.id].blocks[this.activeBlock.rot] // Draw it as normal
    //   : currentBlockSet.previewAs.blocks[this.activeBlock.id].blocks[this.activeBlock.rot]; // Else draw big blocks
    let pieceBBSize = pieceToDraw.length; // Piece bounding box size
    // this.drawScale = currentBlockSet.scale;
    if (this.hasGhost() && !this.gameEnded) {
      for (let i = 0; i < pieceBBSize; i++) {
        for (let j = 0; j < pieceBBSize; j++) {
          if (pieceToDraw[i][j] > 0) {
            this.v.drawGhostBlockConnected(
              this.ghostPiece.pos.x + j, // * this.drawScale,
              this.ghostPiece.pos.y + i, // * this.drawScale,
              currentBlockSet.blocks[this.activeBlock.id].color,
              currentBlockSetEX.pieces[this.activeBlock.id].connections[this.activeBlock.rot][i][j]
            );
            if (this.activeBlock.item && pieceToDraw[i][j] === this.activeBlock.item) {
              this.v.drawBrickOverlay(
                this.ghostPiece.pos.x + j, // * this.drawScale,
                this.ghostPiece.pos.y + i, // * this.drawScale,
                true
              );
            }
          }
        }
      }
    }
    if (!this.gameEnded) {
      for (let i = 0; i < pieceBBSize; i++) {
        for (let j = 0; j < pieceBBSize; j++) {
          if (pieceToDraw[i][j] > 0) {
            this.v.drawBlockConnected(
              this.activeBlock.pos.x + j * this.drawScale,
              this.activeBlock.pos.y + i * this.drawScale,
              currentBlockSet.blocks[this.activeBlock.id].color,
              currentBlockSetEX.pieces[this.activeBlock.id].connections[this.activeBlock.rot][i][j],
              0
            );
            if (this.activeBlock.item && pieceToDraw[i][j] === this.activeBlock.item) {
              this.v.drawBrickOverlay(
                this.activeBlock.pos.x + j * this.drawScale,
                this.activeBlock.pos.y + i * this.drawScale,
                false
              );
            }
          }
        }
      }
    }
    this.drawScale = 1;
  }

  function redrawHoldBoxConnected() {
    if (!this.blockSetsEX) {
      this.blockSetsEX = getBlockSetsEX();
    }
    if (
      (!this.ISGAME || !this.redrawBlocked) &&
      (this.ISGAME || (!this.v.redrawBlocked && this.v.QueueHoldEnabled)) &&
      (this.v.clearHoldCanvas(), null !== this.blockInHold)
    ) {
      let piecePreview = this.blockSets[this.blockInHold.set].previewAs;
      let piecePreviewEX = this.blockSetsEX[this.blockInHold.set].previewAs.pieces[this.blockInHold.id];
      let pieceInInitialState = piecePreview.blocks[this.blockInHold.id].blocks[0];
      let block_color = piecePreview.blocks[this.blockInHold.id].color;
      let pieceHeightSpan = piecePreview.blocks[this.blockInHold.id].yp ?? piecePreviewEX.ypOverride; // yp = vertical span
      let pieceHeight = pieceHeightSpan[1] - pieceHeightSpan[0] + 1;
      let pieceMatrixHeight = pieceInInitialState.length;
      let pieceWidthSpan = piecePreview.blocks[this.blockInHold.id].xp
        ? piecePreview.blocks[this.blockInHold.id].xp
        : piecePreviewEX.xpOverride; // xp = horizontal span
      let pieceWidth = pieceWidthSpan[1] - pieceWidthSpan[0] + 1;

      this.drawScale = pieceHeight >= 3 || pieceWidth >= 5 ? 0.75 : 1;

      let hOffset = (4 * (1 / this.drawScale) - pieceWidth) / 2;
      let vOffset = (3 * (1 / this.drawScale) - pieceHeight) / 2;
      for (let j = pieceHeightSpan[0]; j <= pieceHeightSpan[1]; j++) {
        for (let k = pieceWidthSpan[0]; k <= pieceWidthSpan[1]; k++) {
          if (pieceInInitialState[j][k] > 0) {
            this.v.drawBlockOnCanvasConnected(
              this.drawScale * (k - pieceWidthSpan[0] + hOffset),
              this.drawScale * (j - pieceHeightSpan[0] + vOffset),
              block_color,
              piecePreviewEX.connections[0][j][k],
              this.v.HOLD,
              this.drawScale
            );

            if (this.blockInHold.item && pieceInInitialState[j][k] === this.blockInHold.item) {
              this.v.drawBrickOverlayOnCanvas(
                this.drawScale * (k - pieceWidthSpan[0] + hOffset),
                this.drawScale * (j - pieceHeightSpan[0] + vOffset),
                this.v.HOLD
              );
            }
          }
        }
      }
      this.drawScale = 1;
    }
  }

  function updateQueueBoxConnected() {
    // Contains Better NEXT, need to split it up somehow
    if (!this.blockSetsEX) {
      this.blockSetsEX = getBlockSetsEX();
    }
    if (this.ISGAME && this.redrawBlocked) {
      return;
    }
    if (!this.ISGAME && (this.v.redrawBlocked || !this.v.QueueHoldEnabled)) {
      return;
    }
    this.v.clearQueueCanvas();
    let spacing = 0;
    for (let i = 0; i < this.R.showPreviews; i++) {
      if (i >= this.queue.length) {
        if (this.pmode != 9) {
          break;
        }
        if (!this.ModeManager.repeatQueue) {
          break;
        }
        this.ModeManager.addStaticQueueToQueue();
      }
      let piece = this.queue[i];
      let piecePreview = this.blockSets[piece.set].previewAs;
      let pieceInInitialState = piecePreview.blocks[piece.id].blocks[0];
      let connections = this.blockSetsEX[piece.set].previewAs.pieces[piece.id].connections;
      let xpOverride = this.blockSetsEX[piece.set].previewAs.pieces[piece.id].xpOverride;
      let ypOverride = this.blockSetsEX[piece.set].previewAs.pieces[piece.id].ypOverride;
      let block_color = piecePreview.blocks[piece.id].color;
      let pieceHeightSpan = piecePreview.blocks[piece.id].yp ?? ypOverride; // yp = vertical span
      let pieceHeight = pieceHeightSpan[1] - pieceHeightSpan[0] + 1;
      let pieceMatrixHeight = pieceInInitialState.length;
      let pieceWidthSpan = piecePreview.blocks[piece.id].xp ? piecePreview.blocks[piece.id].xp : xpOverride; // xp = horizontal span
      let pieceWidth = pieceWidthSpan[1] - pieceWidthSpan[0] + 1;

      this.drawScale = pieceHeight >= 3 || pieceWidth >= 5 ? 0.75 : 1;

      let hOffset = (4 * (1 / this.drawScale) - pieceWidth) / 2;
      let vOffset = (3 * (1 / this.drawScale) - pieceHeight) / 2;
      for (let j = pieceHeightSpan[0]; j <= pieceHeightSpan[1]; j++) {
        for (let k = pieceWidthSpan[0]; k <= pieceWidthSpan[1]; k++) {
          if (pieceInInitialState[j][k] > 0) {
            this.v.drawBlockOnCanvasConnected(
              this.drawScale * (k - pieceWidthSpan[0] + hOffset),
              this.drawScale * (j - pieceHeightSpan[0] + vOffset) + spacing,
              block_color,
              connections[0][j][k],
              this.v.QUEUE,
              this.drawScale
            );

            if (piece.item && pieceInInitialState[j][k] === piece.item) {
              this.v.drawBrickOverlayOnCanvas(
                this.drawScale * (k - pieceWidthSpan[0] + hOffset),
                this.drawScale * (j - pieceHeightSpan[0] + vOffset) + spacing,
                this.v.QUEUE
              );
            }
          }
        }
      }
      this.drawScale = 1;
      spacing += 3;
    }
  }

  function initConnectedGarbage(garbageLine) {
    this.garbageConnections = [214, 255, 255, 255, 255, 255, 255, 255, 255, 107];
    garbageLine.forEach((block, i) => {
      if (block == 0) {
        this.garbageConnections[i] = 0; //
        if (this.garbageConnections[i - 1]) this.garbageConnections[i - 1] &= ~148; // Slice all the "left" connections
        if (this.garbageConnections[i + 1]) this.garbageConnections[i + 1] &= ~41; // Slice all the "right" connections
      }
    });
  }

  function bumpUpConnections(trueHeight, amountOfLines) {
    for (let i = 0; i < trueHeight + 1; i++) {
      let scannedHeight = trueHeight - i;
      if (scannedHeight < amountOfLines) {
        let connectionsToAdd = this.garbageConnections.slice();
        if (scannedHeight === 0) {
          connectionsToAdd = connectionsToAdd.map((connection) => {
            return (connection &= ~224); // Slice all the "down" connections
          });
        }
        if (scannedHeight === amountOfLines - 1) {
          connectionsToAdd = connectionsToAdd.map((connection) => {
            return (connection &= ~7); // Slice all the "up" connections
          });
        }
        this.connections[i] = connectionsToAdd.slice();
      } else {
        this.connections[i] = this.connections[i + amountOfLines].slice();
      }
    }
  }

  if (functionExists(GameCore)) {
    GameCore.prototype.injected_placeBlock = function (y, i, x, j) {
      if (usingConnected) {
        if (!this.blockSetsEX) {
          this.blockSetsEX = getBlockSetsEX();
        }
        this.connections[y + i + 1][x + j] = // Height corrected for the `deadline`
          this.blockSetsEX[this.activeBlock.set].pieces[this.activeBlock.id].connections[this.activeBlock.rot][i][j];
      }
    };

    GameCore.prototype.injected_beforePlaceBlockInDeadline = function (y, i, x, j) {
      if (usingConnected) {
        if (!this.blockSetsEX) {
          this.blockSetsEX = getBlockSetsEX();
        }
        if (this.deadline[x + j] == 0) {
          this.connections[0][x + j] =
            this.blockSetsEX[this.activeBlock.set].pieces[this.activeBlock.id].connections[this.activeBlock.rot][i][j];
        }
      }
    };

    GameCore.prototype.injected_clearHiddenRow1 = function () {
      this.connections[0] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      for (let j = 0; j < 10; j++) {
        this.connections[1][j] &= ~7; // Cut all the "up" connections
      }
    };

    GameCore.prototype.injected_moveLinesDown = function (i) {
      if (usingConnected) {
        this.connections[i + 1] = this.connections[i];
      }
    };

    GameCore.prototype.injected_afterLinesMoved = function (row) {
      if (usingConnected) {
        this.connections[1] = this.connections[0];
        this.connections[0] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        if (row < 19) {
          for (let j = 0; j < 10; j++) {
            this.connections[row + 2][j] &= ~7; // Cut all the "up" connections
          }
        }
        if (row < 20) {
          for (let j = 0; j < 10; j++) {
            this.connections[row + 1][j] &= ~224; // Cut all the "down" connections
          }
        }
      }
    };

    GameCore.prototype.injected_initConnectedGarbage = function (garbageLine) {
      if (usingConnected) {
        initConnectedGarbage.apply(this, arguments);
      }
    };

    GameCore.prototype.injected_bumpUpConnections = function (trueHeight, amountOfLines) {
      if (usingConnected) {
        bumpUpConnections.apply(this, arguments);
      }
    };

    let oldClearMatrix = GameCore.prototype.clearMatrix;
    GameCore.prototype.clearMatrix = function () {
      oldClearMatrix.call(this);
      if (usingConnected) {
        if (!this.connections) {
          this.connections = Array.from({ length: 21 }).map(() => Array.from({ length: 10 }).fill(0));
        }
        this.connections.forEach((row, i) => {
          row.forEach((column, j) => {
            this.connections[i][j] = 0;
          });
        });
      }
    };

    // Since addSolidGarbage always adds 1 solid line at a time, a wrapper can be used.
    let oldAddSolidGarbage = GameCore.prototype.addSolidGarbage;
    GameCore.prototype.addSolidGarbage = function () {
      oldAddSolidGarbage.apply(this);
      if (usingConnected) {
        let solidGarbageRowConnections = [16, 24, 24, 24, 24, 24, 24, 24, 24, 8];
        for (let i = 0; i < this.connections.length; i++) {
          this.connections[i] =
            this.connections.length - i > 1 ? this.connections[i + 1].slice(0) : solidGarbageRowConnections.slice(0);
        }
      }
    };
  }

  function clearLinesConnected() {}

  function redrawMatrixConnected() {
    if (!this.connections) {
      this.connections = Array.from({ length: 21 }).map(() => Array.from({ length: 10 }).fill(0));
    }
    for (let row = 0; row < 20; row++) {
      for (let column = 0; column < 10; column++) {
        this.v.drawBlockConnected(
          column,
          row,
          this.matrix[row][column],
          this.connections[row + 1][column],
          this.v.MAIN
        );
      }
    }
  }

  // Connected skins in game

  if (exists(window.Game)) {
    let oldDrawGhostAndCurrent = Game.prototype.drawGhostAndCurrent;
    Game.prototype.drawGhostAndCurrent = function () {
      if (usingConnected || usingGhostConnected) {
        return drawGhostAndCurrentConnected.call(this);
      } else {
        return oldDrawGhostAndCurrent.apply(this, arguments);
      }
    };
    let oldRedrawHoldBox = Game.prototype.redrawHoldBox;
    Game.prototype.redrawHoldBox = function () {
      if (usingConnected) {
        return redrawHoldBoxConnected.call(this);
      } else {
        return oldRedrawHoldBox.apply(this, arguments);
      }
    };
    let oldUpdateQueueBox = Game.prototype.updateQueueBox;
    Game.prototype.updateQueueBox = function () {
      if (usingConnected) {
        return updateQueueBoxConnected.call(this);
      } else {
        return oldUpdateQueueBox.apply(this, arguments);
      }
    };
    Game.prototype.redrawMatrixConnected = redrawMatrixConnected;
  }

  // Connected skins in Replayer

  if (exists(window.Replayer) && location.href.includes("replay")) {
    let oldDrawGhostAndCurrent = Replayer.prototype.drawGhostAndCurrent;
    Replayer.prototype.drawGhostAndCurrent = function () {
      if (usingConnected || usingGhostConnected) {
        return drawGhostAndCurrentConnected.call(this);
      } else {
        return oldDrawGhostAndCurrent.apply(this, arguments);
      }
    };
    let oldRedrawHoldBox = Replayer.prototype.redrawHoldBox;
    Replayer.prototype.redrawHoldBox = function () {
      if (usingConnected) {
        return redrawHoldBoxConnected.call(this);
      } else {
        return oldRedrawHoldBox.apply(this, arguments);
      }
    };
    let oldUpdateQueueBox = Replayer.prototype.updateQueueBox;
    Replayer.prototype.updateQueueBox = function () {
      if (usingConnected) {
        return updateQueueBoxConnected.call(this);
      } else {
        return oldUpdateQueueBox.apply(this, arguments);
      }
    };
    Replayer.prototype.redrawMatrixConnected = redrawMatrixConnected;

    Replayer.prototype.injected_initConnectedGarbage = function (garbageLine) {
      if (usingConnected) {
        initConnectedGarbage.apply(this, arguments);
      }
    };

    Replayer.prototype.injected_bumpUpConnections = function (trueHeight, amountOfLines) {
      if (usingConnected) {
        bumpUpConnections.apply(this, arguments);
      }
    };

    // Connected skins in, umm, replay too actually

    if (exists(window.View)) {
      if (!location.href.includes("export")) {
        // This draws blocks in HOLD and NEXT queues
        View.prototype.drawBlockOnCanvasConnected = function (x, y, blockID, connection, ctxKind, drawScale = 1) {
          let ctx = ctxKind === this.HOLD ? this.hctx : this.qctx;
          if (0 === this.skinId) {
            var mono = this.g.monochromeSkin && blockID <= 7 ? this.g.monochromeSkin : this.g.colors[blockID];
            this.drawRectangle(ctx, x * this.block_size, y * this.block_size, this.block_size, this.block_size, mono);
          } else {
            let [offsetX, offsetY] = getConnection(connection);
            ctx.drawImage(
              this.tex, // image
              (6 * this.g.coffset[blockID] + offsetX) * this.g.skins[this.skinId].w, // sx
              offsetY * this.g.skins[this.skinId].w, // sy
              this.g.skins[this.skinId].w, // sWidth
              this.g.skins[this.skinId].w, // sHeight
              x * this.block_size, // dx
              y * this.block_size, // dy
              this.block_size * drawScale, // dWidth
              this.block_size * drawScale // dHeight
            );
          }
        };
        let oldRedraw = View.prototype.redraw;
        View.prototype.redraw = function () {
          if (usingConnected) {
            if (!this.redrawBlocked) {
              if ((this.clearMainCanvas(), !this.g.isInvisibleSkin)) this.g.redrawMatrixConnected();
              this.drawGhostAndCurrent(),
                this.g.redBar &&
                  this.drawRectangle(
                    this.ctx,
                    240,
                    (20 - this.g.redBar) * this.block_size,
                    8,
                    this.g.redBar * this.block_size,
                    "#FF270F"
                  );
            }
            return;
          }
          return oldRedraw.apply(this, arguments);
        };

        // This draws the active piece and blocks on the matrix
        View.prototype.drawBlockConnected = function (x, y, blockID, connection) {
          if (blockID && x >= 0 && y >= 0 && x < 10 && y < 20) {
            let scale = this.drawScale * this.block_size;
            let [offsetX, offsetY] = getConnection(connection);
            this.ctx.drawImage(
              this.tex, // image
              (6 * this.g.coffset[blockID] + offsetX) * this.g.skins[this.skinId].w, // sx
              offsetY * this.g.skins[this.skinId].w, // sy
              this.g.skins[this.skinId].w, // sWidth
              this.g.skins[this.skinId].w, // sHeight
              x * this.block_size, // dx
              y * this.block_size, // dy
              scale, // dWidth
              scale // dHeight
            );
          }
        };

        View.prototype.drawGhostBlockConnected = function (x, y, blockID, connection) {
          if (x >= 0 && y >= 0 && x < 10 && y < 20) {
            let scale = this.drawScale * this.block_size;
            let [offsetX, offsetY] = getConnection(connection);
            if (this.ghostSkinId === 0) {
              this.ctx.globalAlpha = 0.5;
              if (this.skinId > 0) {
                this.ctx.drawImage(
                  this.tex,
                  (6 * this.g.coffset[blockID] + offsetX) * this.g.skins[this.skinId].w,
                  offsetY * this.g.skins[this.skinId].w,
                  this.g.skins[this.skinId].w,
                  this.g.skins[this.skinId].w,
                  x * this.block_size,
                  y * this.block_size,
                  scale,
                  scale
                );
              } else {
                this.drawBlockConnected(x, y, blockID);
              }
              this.ctx.globalAlpha = 1;
            } else {
              var ghostSkin = this.ghostSkins[this.ghostSkinId];
              this.ctx.drawImage(
                this.ghostTex,
                (6 * (this.g.coffset[blockID] - 2) + offsetX) * ghostSkin.w,
                offsetY * ghostSkin.w,
                ghostSkin.w,
                ghostSkin.w,
                x * this.block_size,
                y * this.block_size,
                scale,
                scale
              );
            }
          }
        };

        let oldViewDrawGhostAndCurrent = View.prototype.drawGhostAndCurrent;
        View.prototype.drawGhostAndCurrent = function () {
          if (usingConnected) {
            if (!this.g.blockSetsEX) {
              this.g.blockSetsEX = getBlockSetsEX();
            }
            let currentBlockSet = this.g.blockSets[this.g.activeBlock.set];
            let currentBlockSetEX = this.g.blockSetsEX[this.g.activeBlock.set];
            let pieceToDraw = currentBlockSet.blocks[this.g.activeBlock.id].blocks[this.g.activeBlock.rot];
            let pieceLength = pieceToDraw.length;
            if (this.ghostEnabled)
              for (let i = 0; i < pieceLength; i++)
                for (let j = 0; j < pieceLength; j++)
                  pieceToDraw[i][j] > 0 &&
                    this.drawGhostBlockConnected(
                      this.g.ghostPiece.pos.x + j,
                      this.g.ghostPiece.pos.y + i,
                      currentBlockSet.blocks[this.g.activeBlock.id].color,
                      currentBlockSetEX.pieces[this.g.activeBlock.id].connections[this.g.activeBlock.rot][i][j]
                    );
            for (let i = 0; i < pieceLength; i++)
              for (let j = 0; j < pieceLength; j++)
                pieceToDraw[i][j] > 0 &&
                  this.drawBlockConnected(
                    this.g.activeBlock.pos.x + j,
                    this.g.activeBlock.pos.y + i,
                    currentBlockSet.blocks[this.g.activeBlock.id].color,
                    currentBlockSetEX.pieces[this.g.activeBlock.id].connections[this.g.activeBlock.rot][i][j]
                  );
          } else oldViewDrawGhostAndCurrent.call(this);
        };
      } else {
        // things to do with export
        View.prototype.drawBlockOnCanvasConnected = function (x, y, blockID, connection, ctxKind, scale = 1) {
          let blockSize = this.block_size;
          let ctx = this.ctx;
          if (
            (ctxKind === this.HOLD
              ? ((this.drawOffsetTop = this.AP.HLD.T),
                (this.drawOffsetLeft = this.AP.HLD.L),
                (this.block_size = this.AP.HLD.BS))
              : ((this.drawOffsetTop = this.AP.QUE.T),
                (this.drawOffsetLeft = this.AP.QUE.L),
                (this.block_size = this.AP.QUE.BS)),
            0 === this.skinId)
          ) {
            var color = this.g.monochromeSkin && blockID <= 7 ? this.g.monochromeSkin : this.g.colors[blockID];
            this.drawRectangle(ctx, x * this.block_size, y * this.block_size, this.block_size, this.block_size, color);
          } else {
            let [offsetX, offsetY] = getConnection(connection);
            this.drawImage(
              ctx,
              this.tex,
              (6 * this.g.coffset[blockID] + offsetX) * this.g.skins[this.skinId].w, // sx
              offsetY * this.g.skins[this.skinId].w, // sy
              this.g.skins[this.skinId].w,
              this.g.skins[this.skinId].w,
              x * this.block_size,
              y * this.block_size,
              this.block_size * scale,
              this.block_size * scale
            );
          }

          this.block_size = blockSize;
        };

        View.prototype.drawBlockConnected = function (x, y, blockID, connection) {
          if (blockID && x >= 0 && y >= 0 && x < 10 && y < 20) {
            let scale = this.drawScale * this.BS;
            let [offsetX, offsetY] = getConnection(connection);
            if (this.skinId) {
              this.drawImage(
                this.ctx,
                this.tex,
                (6 * this.g.coffset[blockID] + offsetX) * this.g.skins[this.skinId].w,
                offsetY * this.g.skins[this.skinId].w,
                this.g.skins[this.skinId].w,
                this.g.skins[this.skinId].w,
                x * this.BS,
                y * this.BS,
                scale,
                scale
              );
            } else {
              let mono = this.g.monochromeSkin && blockID <= 7 ? this.g.monochromeSkin : this.g.colors[blockID];
              this.drawRectangle(this.ctx, x * this.BS, y * this.BS, scale, scale, mono);
            }
          }
        };

        View.prototype.drawGhostBlockConnected = function (x, y, blockID, connection) {
          if (x >= 0 && y >= 0 && x < 10 && y < 20) {
            let scale = this.drawScale * this.BS;
            let [offsetX, offsetY] = getConnection(connection);
            if (this.ghostSkinId === 0) {
              this.ctx.globalAlpha = 0.5;
              if (this.skinId > 0) {
                this.drawImage(
                  this.ctx,
                  this.tex,
                  (6 * this.g.coffset[blockID] + offsetX) * this.g.skins[this.skinId].w,
                  offsetY * this.g.skins[this.skinId].w,
                  this.g.skins[this.skinId].w,
                  this.g.skins[this.skinId].w,
                  x * this.BS,
                  y * this.BS,
                  scale,
                  scale
                );
              } else {
                this.drawBlock(x, y, blockID);
              }
              this.ctx.globalAlpha = 1;
            } else {
              var ghostSkin = this.ghostSkins[this.ghostSkinId];
              this.drawImage(
                this.ctx,
                this.ghostTex,
                (6 * (this.g.coffset[blockID] - 2) + offsetX) * ghostSkin.w,
                offsetY * ghostSkin.w,
                ghostSkin.w,
                ghostSkin.w,
                x * this.BS,
                y * this.BS,
                scale,
                scale
              );
            }
          }
        };
        View.prototype.drawGhostAndCurrentConnected = function () {
          if (!this.g.blockSetsEX) {
            this.g.blockSetsEX = getBlockSetsEX();
          }
          let currentBlockSet = this.g.blockSets[this.g.activeBlock.set];
          let currentBlockSetEX = this.g.blockSetsEX[this.g.activeBlock.set];
          let pieceToDraw = currentBlockSet.blocks[this.g.activeBlock.id].blocks[this.g.activeBlock.rot];
          let pieceLength = pieceToDraw.length;
          if (this.ghostEnabled) {
            for (let i = 0; i < pieceLength; i++) {
              for (let j = 0; j < pieceLength; j++) {
                if (pieceToDraw[i][j] > 0) {
                  this.drawGhostBlockConnected(
                    this.g.ghostPiece.pos.x + j,
                    this.g.ghostPiece.pos.y + i,
                    currentBlockSet.blocks[this.g.activeBlock.id].color,
                    currentBlockSetEX.pieces[this.g.activeBlock.id].connections[this.g.activeBlock.rot][i][j]
                  );
                }
              }
            }
          }
          for (let i = 0; i < pieceLength; i++) {
            for (let j = 0; j < pieceLength; j++) {
              if (pieceToDraw[i][j] > 0) {
                this.drawBlockConnected(
                  this.g.activeBlock.pos.x + j,
                  this.g.activeBlock.pos.y + i,
                  currentBlockSet.blocks[this.g.activeBlock.id].color,
                  currentBlockSetEX.pieces[this.g.activeBlock.id].connections[this.g.activeBlock.rot][i][j]
                );
              }
            }
          }
        };

        let oldDrawMainStage = View.prototype.drawMainStage;
        View.prototype.drawMainStage = function () {
          if (usingConnected) {
            if (!this.g.connections) {
              this.g.connections = Array.from({ length: 21 }).map(() => Array.from({ length: 10 }).fill(0));
            }
            this.drawOffsetTop = this.AP.STG.T;
            this.drawOffsetLeft = this.AP.STG.L;
            if (!this.g.isInvisibleSkin) {
              for (var y = 0; y < 20; y++) {
                for (var x = 0; x < 10; x++) {
                  this.drawBlockConnected(x, y, this.g.matrix[y][x], this.g.connections[y + 1][x]);
                }
              }
            }
            this.drawGhostAndCurrentConnected(),
              this.g.redBar &&
                this.drawRectangle(
                  this.ctx,
                  this.AP.STG.W,
                  (20 - this.g.redBar) * this.BS,
                  8,
                  this.g.redBar * this.BS,
                  "#FF270F"
                );
          } else oldDrawMainStage.call(this);
        };
      }
    }
  }
  // Remaining skin init
  let skinLoaded = false;
  let game = null;
  if (Config().CUSTOM_SKIN_URL) loadCustomSkin(Config().CUSTOM_SKIN_URL);

  if (Config().CUSTOM_GHOST_SKIN_URL) loadCustomSkin(Config().CUSTOM_GHOST_SKIN_URL, true);

  if (functionExists(window.Live)) {
    Config().onChange("CUSTOM_SKIN_URL", (val) => {
      if (val) loadCustomSkin(val);
      else {
        loadSkin("resetRegular");
      }
    });
    Config().onChange("CUSTOM_GHOST_SKIN_URL", (val) => {
      if (val) loadCustomSkin(val, true);
      else if (game) {
        game.ghostSkinId = 0;
        usingGhostConnected = false;
      }
    });

    let oldOnCIDassigned = Live.prototype.onCIDassigned;
    Live.prototype.onCIDassigned = function () {
      let returnValue = oldOnCIDassigned.apply(this, arguments);
      if (!skinLoaded) {
        game = this.p;
        skinLoaded = true;
        if (Config().CUSTOM_SKIN_URL) loadCustomSkin(Config().CUSTOM_SKIN_URL);
        if (Config().CUSTOM_GHOST_SKIN_URL) loadCustomSkin(Config().CUSTOM_GHOST_SKIN_URL, true);
      }
      return returnValue;
    };
  }

  if (functionExists(window.View) && !functionExists(window.Live)) {
    // Force skin on replayers
    let oldOnReady = View.prototype.onReady;
    View.prototype.onReady = function () {
      let returnValue = oldOnReady.apply(this, arguments);
      if (Config().ENABLE_REPLAY_SKIN && Config().CUSTOM_SKIN_URL) {
        this.tex.crossOrigin = "anonymous";
        this.skinId = 1;
        this.g.skins[1].data = Config().CUSTOM_SKIN_URL;
        this.g.skins[1].w = customSkinSize;
        this.tex.src = this.g.skins[1].data;
      }
      return returnValue;
    };
  }

  if (functionExists(window.Game)) {
    let oldChangeSkin = Game.prototype.changeSkin;
    Game.prototype.changeSkin = function () {
      let returnValue = oldChangeSkin.apply(this, arguments);
      let url = this.skins[arguments[0]].data;
      if (url == "resetRegular") {
        usingConnected = false;
        oldChangeSkin.apply(this, [0]);
        return returnValue;
      }
      if (this.v && this.v.NAME == "webGL") {
        this.v.setBlendConnected();
      }
      return returnValue;
    };
  }

  console.log("Custom skin loaded.");
};
