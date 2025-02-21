import { EncodePages, Field } from "tetris-fumen";
import { SaveState } from "./practiceUndo.ts";

declare global {
  interface Window {
    copyReplayText: (number: number) => void;
  }

  interface GameCore {
    GFXCanvas: HTMLCanvasElement | null;
    GFXQueue: GFXDefinition[];
    GFXLoop: () => void;
    GFXctx: CanvasRenderingContext2D;
  }

  interface Game {
    fumenPages: EncodePages | null;
    fumenMatrixRoll: boolean;
    invalidFromSnapshot: boolean;
    altBlocks: unknown;
    pages: { field: Field }[];
    saveStates: SaveState[]
    connections?: number[][]
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

  }

  // @ts-expect-error `addGarbage` breaks Liskov's substitution principle.
  interface Replayer {
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
  }

  interface Replay {
    invalidFromUndo: boolean;
    invalidFromSnapshot: boolean;
  }
}

declare interface SnapshotPlus {
  matrix: number[][];
  deadline: number[];
  placedBlocks: number;
  seed: string;
  activeBlockID: number;
  holdID: number;
  rnd: number;

  connections?: number[][];
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