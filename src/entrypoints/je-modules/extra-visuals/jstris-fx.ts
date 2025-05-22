import { lerp } from "$/utils/extra-math.js";
import { isReplayerReversing } from "$/replayer-improvements/replayManager.js";
import { Config } from "jstris-extras";
import { shake } from "$/utils/shake";
import { assert } from "$/utils/HTML-utils";

interface GFXDefinition {
  opacity: number;
  blockSize: number;
  row: number;
  col?: number;
  delta?: number;
  block?: number[][];
  amountParted?: number;
  trailTop?: number;
  trailLeftBorder?: number;
  trailRightBorder?: number;
  trailBottom?: number;
  process: (ctx: CanvasRenderingContext2D) => boolean;
}

function shouldRenderEffectsOnView(view: View | SlotView): boolean {
  return view.holdCanvas && view.holdCanvas.width >= 70;
}

// helper function
function initGFXCanvas(game: Game | Replayer, refCanvas: HTMLCanvasElement): void {
  game.GFXCanvas = assert(refCanvas.cloneNode(true), HTMLCanvasElement);
  /*
  obj.GFXCanvas = document.createElement("canvas");
  obj.GFXCanvas.className = "layer mainLayer gfxLayer";
  obj.GFXCanvas.height = refCanvas.height;
  obj.GFXCanvas.width = refCanvas.width;
  obj.GFXCanvas.style = refCanvas.style;
  */
  game.GFXCanvas.id = "";
  game.GFXCanvas.className = "layer mainLayer gfxLayer";
  game.GFXctx = game.GFXCanvas.getContext("2d")!;
  game.GFXctx.clearRect(0, 0, game.GFXCanvas.width, game.GFXCanvas.height);
  if (refCanvas.parentNode) refCanvas.parentNode.appendChild(game.GFXCanvas);
}

export function initFX(): void {
  "use strict";
  // where you actually inject things into the settings

  // -- injection below --
  if (typeof Game == "function") {
    const oldReadyGo = Game.prototype.readyGo;
    Game.prototype.readyGo = function (...args) {
      const val: void = oldReadyGo.apply(this, args);

      if (!this.GFXCanvas || !this.GFXCanvas.parentNode) {
        initGFXCanvas(this, this.canvas);
      }

      this.GFXQueue = [];

      this.GFXLoop = (): void => {
        if (!this.GFXQueue) this.GFXQueue = [];
        this.GFXctx.clearRect(0, 0, this.GFXCanvas!.width, this.GFXCanvas!.height);
        this.GFXQueue = this.GFXQueue.filter((definition: GFXDefinition): boolean =>
          definition.process.call(definition, this.GFXctx)
        );
        if (this.GFXQueue.length) requestAnimationFrame(this.GFXLoop);
      };
      //  window.game = this;

      return val;
    };
  }

  if (typeof SlotView == "function") {
    const oldOnResized = SlotView.prototype.onResized;
    SlotView.prototype.onResized = function (...args) {
      oldOnResized.apply(this, args);

      if (this.g && this.g.GFXCanvas && this.g instanceof Replayer) {
        this.g.GFXCanvas.width = this.canvas.width;
        this.g.GFXCanvas.height = this.canvas.height;
        this.g.GFXCanvas.style.top = this.canvas.style.top;
        this.g.GFXCanvas.style.left = this.canvas.style.left;
        this.g.block_size = this.g.v.block_size;
      }
    };
  }

  // -- injection below --
  const oldInitReplay = Replayer.prototype.initReplay;
  Replayer.prototype.initReplay = function (...args) {
    const val = oldInitReplay.apply(this, args);

    // SlotViews have replayers attached to them, don't want to double up on the canvases
    //if (SlotView.prototype.isPrototypeOf(this.v))
    //    return;
    // window.replayer = this;

    // always clear and re-init for slotviews
    if (typeof SlotView == "function" && this.v instanceof SlotView) {
      // do not do gfx if the board is too small
      const live: Live = this.v.slot.gs.p.Live;
      if (!shouldRenderEffectsOnView(this.v) && live?.roomConfig?.m != 2) {
        return val;
      }
      const foundGFXCanvases = this.v.slot.slotDiv.getElementsByClassName(
        "gfxLayer"
      )
      for (const canvas of foundGFXCanvases) {
        if (canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }
      }
      this.GFXCanvas = null;
    }

    if (!this.GFXCanvas || !this.GFXCanvas.parentNode || this.GFXCanvas.parentNode != this.v.canvas.parentNode) {
      initGFXCanvas(this, this.v.canvas);
      console.log("replayer initializing gfx canvas");
    }

    this.GFXQueue = [];
    this.block_size = this.v.block_size;

    this.GFXLoop = () => {
      if (!this.GFXQueue) this.GFXQueue = [];
      this.GFXctx.clearRect(0, 0, this.GFXCanvas!.width, this.GFXCanvas!.height);
      this.GFXQueue = this.GFXQueue.filter((definition: GFXDefinition): boolean =>
        definition.process.call(definition, this.GFXctx)
      );
      if (this.GFXQueue.length) requestAnimationFrame(this.GFXLoop);
    };
    this.v.canvas.parentNode!.appendChild(this.GFXCanvas!);
    return val;
  };

  const oldCheckLineClears = GameCore.prototype.checkLineClears;
  GameCore.prototype.checkLineClears = function (...args) {
    const animateLineClear = (row: number) => {
      if (Config.get("lineClearAnimationEnabled") && Config.get("lineClearAnimationLength") > 0) {
        this.GFXQueue.push({
          opacity: 1,
          delta: 1 / ((Config.get("lineClearAnimationLength") * 1000) / 60),
          row,
          blockSize: this.block_size,
          amountParted: 0,
          process: function (ctx: CanvasRenderingContext2D): boolean {
            if (this.opacity <= 0) return false;

            const x1 = 1;
            const x2: number = this.blockSize * 5 + this.amountParted!;
            const y: number = 1 + this.row * this.blockSize;

            // Create gradient
            const leftGradient: CanvasGradient = ctx.createLinearGradient(
              0,
              0,
              this.blockSize * 5 - this.amountParted!,
              0
            );
            leftGradient.addColorStop(0, `rgba(255,255,255,${this.opacity})`);
            leftGradient.addColorStop(1, `rgba(255,170,0,0)`);
            // Fill with gradient
            ctx.fillStyle = leftGradient;

            ctx.fillRect(x1, y, this.blockSize * 5 - this.amountParted!, this.blockSize);

            // Create gradient
            const rightGradient: CanvasGradient = ctx.createLinearGradient(
              0,
              0,
              this.blockSize * 5 - this.amountParted!,
              0
            );
            rightGradient.addColorStop(0, `rgba(255,170,0,0)`);
            rightGradient.addColorStop(1, `rgba(255,255,255,${this.opacity})`);
            // Fill with gradient
            ctx.fillStyle = rightGradient;
            ctx.fillRect(x2, y, this.blockSize * 5 - this.amountParted!, this.blockSize);

            this.amountParted = lerp(this.amountParted!, this.blockSize * 5, 0.1);
            this.opacity -= this.delta!;
            return true;
          },
        });
      }
    };

    const shakeBoard = (oldAttack: number) => {
      const attack: number = this.gamedata.attack - oldAttack;
      if (Config.get("lineClearShakeEnabled")) {
        const element = assert(this.GFXCanvas?.parentNode?.parentNode, HTMLElement);
        if (element) shake(
          element,
          Math.min(1 + attack * 5, 50) * Config.get("lineClearShakeStrength"),
          Config.get("lineClearShakeLength") * (1000 / 60)
        );
      }
      if (this.GFXQueue.length) requestAnimationFrame(this.GFXLoop);
    };

    if (!this.GFXCanvas || isReplayerReversing) return oldCheckLineClears.apply(this, args);

    const oldAttack: number = this.gamedata.attack;

    let cleared: number = 0;
    for (let row: number = 0; row < 20; row++) {
      let blocks: number = 0;
      for (let col: number = 0; col < 10; col++) {
        const block: number = this.matrix[row][col];
        if (block === 9) break; // solid garbage
        if (block !== 0) blocks++;
      }
      if (blocks === 10) {
        cleared++;
        animateLineClear(row);
      }
    }
    if (cleared > 0) shakeBoard(oldAttack);
    return oldCheckLineClears.apply(this, args);
  };
  // have to do this so we can properly override ReplayerCore
  Replayer.prototype.checkLineClears = GameCore.prototype.checkLineClears;
  // placement animation

  const oldPlaceBlock = GameCore.prototype.placeBlock;
  GameCore.prototype.placeBlock = function (x: number, y: number, ...args): void {
    if (!this.GFXCanvas || !Config.get("piecePlacementAnimationEnabled") || isReplayerReversing)
      return oldPlaceBlock.apply(this, [x, y, ...args]);

    const piece: number[][] =
      this.blockSets[this.activeBlock.set].blocks[this.activeBlock.id].blocks[this.activeBlock.rot];

    oldPlaceBlock.apply(this, [x, y, ...args]);

    // flashes the piece once you place it
    if (Config.get("piecePlacementAnimationLength") > 0) {
      this.GFXQueue.push({
        opacity: Config.get("piecePlacementAnimationOpacity") / 100,
        delta:
          Config.get("piecePlacementAnimationOpacity") /
          (100 * ((Config.get("piecePlacementAnimationLength") * 1000) / 60)),
        col: x,
        row: y,
        blockSize: this.block_size,
        block: piece,
        process: function (ctx: CanvasRenderingContext2D): boolean {
          if (this.opacity <= 0) return false;

          ctx.fillStyle = `rgba(255,255,255,${this.opacity})`;
          this.opacity -= this.delta!;

          for (let i: number = 0; i < this.block!.length; i++) {
            for (let j: number = 0; j < this.block![i].length; j++) {
              if (!this.block![i][j]) continue;

              const x: number = 1 + (this.col! + j) * this.blockSize;
              const y: number = 1 + (this.row + i) * this.blockSize;

              ctx.fillRect(x, y, this.blockSize, this.blockSize);
            }
          }
          return true;
        },
      });
    }

    let trailLeftBorder: number = 10;
    let trailRightBorder: number = 0;
    let trailBottom: number = 0;
    for (let i: number = 0; i < piece.length; i++) {
      for (let j: number = 0; j < piece[i].length; j++) {
        if (!piece[i][j]) continue;
        trailLeftBorder = Math.max(Math.min(trailLeftBorder, j), 0);
        trailRightBorder = Math.min(Math.max(trailRightBorder, j), 10);
        trailBottom = Math.max(trailBottom, i);
      }
    }

    // flashes the piece once you place it
    this.GFXQueue.push({
      opacity: 0.3,
      col: x,
      row: y,
      blockSize: this.block_size,
      trailTop: 1,
      block: piece,
      trailLeftBorder,
      trailRightBorder,
      trailBottom,
      process: function (ctx: CanvasRenderingContext2D): boolean {
        if (this.opacity <= 0) return false;

        const { trailLeftBorder, trailRightBorder, trailBottom } = this;

        const row: number = this.row + trailBottom!;

        const gradient: CanvasGradient = ctx.createLinearGradient(0, 0, 0, row * this.blockSize - this.trailTop!);
        gradient.addColorStop(0, `rgba(255,255,255,0)`);
        gradient.addColorStop(1, `rgba(255,255,255,${this.opacity})`);

        // Fill with gradient
        ctx.fillStyle = gradient;
        ctx.fillRect(
          (this.col! + trailLeftBorder!) * this.blockSize,
          this.trailTop!,
          (trailRightBorder! - trailLeftBorder! + 1) * this.blockSize,
          row * this.blockSize - this.trailTop!
        );

        const middle: number = (trailLeftBorder! + trailRightBorder!) / 2;

        this.trailLeftBorder = lerp(trailLeftBorder!, middle, 0.1);
        this.trailRightBorder = lerp(trailRightBorder!, middle, 0.1);

        this.opacity -= 0.0125;

        return true;
      },
    });

    requestAnimationFrame(this.GFXLoop);
  };

  // have to do this so we can properly override ReplayerCore
  Replayer.prototype.placeBlock = GameCore.prototype.placeBlock;
}
