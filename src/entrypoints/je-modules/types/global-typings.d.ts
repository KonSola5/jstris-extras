import { EncodePages, Field } from "tetris-fumen";
import { SaveState } from "../practice-tweaks/practiceUndo.js";
import { BlockSetsEX } from "../utils/blockSetExtensions.js";

declare type ConnectionsMatrix = FixedArray<Jstris.MatrixRow, 21>;

class ActionTextBox {
  actionTextDiv: HTMLDivElement;
  lineClearDiv: HTMLDivElement;
  comboDiv: HTMLDivElement;
  b2bDiv: HTMLDivElement;
  constructor(): void;
  get(): HTMLDivElement;
}

declare global {
  // eslint-disable-next-line no-var
  var NativeMap: typeof globalThis.Map;

  interface Window {
    copyReplayText: (number: number) => void;
    loadCustomSkin: (url: string, ghost?: boolean) => void;
    Map: typeof globalThis.Map;
    NativeMap: typeof globalThis.Map;
  }

  interface WebGLView {
    setBlendConnected(): void;
    drawBlockConnected(x: number, y: number, blockID: number, connection: number, ctxKind: number): void;
    drawGhostBlockConnected(x: number, y: number, blockID: number, connection: number): void;
    drawBlockOnCanvasConnected(x: number, y: number, blockID: number, connection: number, ctxKind: number): void;
  }

  interface Ctx2DView {
    drawBlockConnected(x: number, y: number, blockID: number, connection: number, ctxKind: number): void;
    drawGhostBlockConnected(x: number, y: number, blockID: number, connection: number): void;
    drawBlockOnCanvasConnected(
      x: number,
      y: number,
      blockID: number,
      connection: number,
      ctxKind: number,
      drawScale: number
    ): void;
  }

  interface View {
    drawBlockOnCanvasConnected(
      x: number,
      y: number,
      blockID: number,
      connection: number,
      ctxKind: number,
      drawScale: number
    ): void;
    drawBlockConnected(x: number, y: number, blockID: number, connection: number): void;
    drawGhostBlockConnected(x: number, y: number, blockID: number, connection: number): void;
    playReplayerSound(soundOrSounds: string | string[]): void;
  }

  interface SlotView {
    playReplayerSound(soundOrSounds: string | string[]): void;
    drawBlockOnCanvasConnected(x: number, y: number, blockID: number, connection: number, ctxKind: number): void;
    drawBlockConnected(x: number, y: number, blockID: number, connection: number): void;
    cancelLiveMatrix?: boolean;
  }

  interface ExportView {
    drawBlockOnCanvasConnected(
      x: number,
      y: number,
      blockID: number,
      connection: number,
      ctxKind: number,
      drawScale: number
    ): void;
    drawBlockConnected(x: number, y: number, blockID: number, connection: number): void;
    drawGhostBlockConnected(x: number, y: number, blockID: number, connection: number): void;
    drawGhostAndCurrentConnected(): void;
  }

  interface GameCore {
    GFXCanvas: HTMLCanvasElement | null;
    GFXQueue: GFXDefinition[];
    GFXLoop: () => void;
    GFXctx: CanvasRenderingContext2D;
    connections?: ConnectionsMatrix;
    blockSetsEX?: BlockSetsEX;
    garbageConnections: Jstris.MatrixRow;
    hasActionText?: boolean;
    actionTextBox?: ActionTextBox;
    b2bChain?: number;

    injected_placeBlock(y: number, i: number, x: number, j: number): void;
    injected_beforePlaceBlockInDeadline(y: number, i: number, x: number, j: number): void;

    injected_clearHiddenRow1(): void;
    injected_moveLinesDown(i: number): void;
    injected_afterLinesMoved(row: number): void;

    injected_initConnectedGarbage(garbageLine: Jstris.MatrixRow): void;
    injected_bumpUpConnections(trueHeight: number, amountOfLines: number): void;

    injected_displayActionText(lineClear: number): void;

    rawCheckTSpin(pieceID: number): { full: boolean; mini: boolean };
    rawCheckAllSpin(pieceID: number): { full: boolean; mini: boolean };
    rawCheckAllSpinImmobile(): { full: boolean };
  }

  interface Game extends GameCore {
    fumenPages: EncodePages | null;
    fumenMatrixRoll: boolean;
    invalidFromSnapshot: boolean;
    altBlocks: unknown;
    pages: { field: Field }[];
    saveStates: SaveState[];
    // connections?: number[][]
    replayCounter?: number;
    generateFumenQueue(lim?: number | null): string;
    generateFumenMatrix(): string;
    loadSeedAndPieces(
      seed: string,
      randomizer: number,
      placedPieceCount: number,
      activePiece: Block,
      holdPiece: Block | null
    ): void;
    loadSaveState(lastState: SaveState): void;
    addSaveState(): void;
    undoToSaveState(): void;
    initSaveStates(): void;

    redrawMatrixConnected(): void;

    injected_createLineClearAnimator(
      matrixCopy: Jstris.Matrix,
      linesToClear: number[],
      connectionsCopy: ConnectionsMatrix
    ): void;

    injected_connectMap(): void;
  }

  // @ts-expect-error `addGarbage` breaks Liskov's substitution principle.
  interface Replayer extends GameCore {
    GFXCanvas: HTMLCanvasElement | null;
    GFXQueue: GFXDefinition[];
    GFXLoop: () => void;
    GFXctx: CanvasRenderingContext2D;
    kbdActions: KeyAction[];
    lastPtr: number;

    snapshotFumen(): string;
    snapshotPlus(): string;
    generateFumenQueue(lim?: number | null): string;
    generateFumenMatrix(): string;
    redrawMatrixConnected(): void;

    injected_initConnectedGarbage(garbageLine: Jstris.MatrixRow): void;
    injected_bumpUpConnections(trueHeight: number, amountOfLines: number): void;
  }

  interface Replay {
    invalidFromUndo: boolean;
    invalidFromSnapshot: boolean;
  }

  interface ModeManager {
    injected_connectMap(): void;
  }

  interface GameSlots {
    realHeight?: number;
  }
}

declare interface SnapshotPlus {
  matrix: Jstris.Matrix;
  deadline: Jstris.MatrixRow;
  placedBlocks: number;
  seed: string;
  activeBlockID: number;
  holdID: number;
  rnd: number;

  connections?: ConnectionsMatrix;
}

declare interface GFXDefinition {
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

declare interface KeyAction {
  action: number;
  timestamp: number;
}
