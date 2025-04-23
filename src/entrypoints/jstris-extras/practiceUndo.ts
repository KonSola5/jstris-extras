import { ConnectionsMatrix } from "./global-typings.js";
import { Config } from "../jstris-extras.js";
import { Modes, range } from "./util.js";

function clone<T extends object | null>(object: T): T {
  return JSON.parse(JSON.stringify(object));
}
export class SaveState {
  /**
   * Creates a SaveState out of the given Game (all attributes are deep copies)
   */
  matrix: Jstris.Matrix;
  deadline: Jstris.MatrixRow;
  activeBlock: Block;
  blockInHold: Block | null;
  queue?: Block[];
  combo: number;
  placedBlocks: number;
  totalFinesse: number;
  totalKeyPresses: number;
  incomingGarbage: [garbageInSegment: number, timestamp: number][];
  redBar: number;
  gamedata: Jstris.GameData;
  b2b: boolean;
  connections?: ConnectionsMatrix;

  constructor(game: Game) {
    this.matrix = clone(game.matrix);
    this.deadline = clone(game.deadline);
    this.activeBlock = clone(game.activeBlock);
    this.blockInHold = clone(game.blockInHold);
    if (game.connections) this.connections = clone(game.connections);

    this.b2b = game.isBack2Back;
    this.combo = game.comboCounter;

    // save stat-related fields. might need to add a few more?
    this.placedBlocks = game.placedBlocks;
    this.totalFinesse = game.totalFinesse;
    this.totalKeyPresses = game.totalKeyPresses;
    this.incomingGarbage = clone(game.incomingGarbage);
    this.redBar = game.redBar;

    this.gamedata = clone(game.gamedata);
  }
}
export const initPracticeUndo = () => {
  const MaxSaveStates = 100;
  /**
   * Creates a save state from the current game state and adds it to the stack.
   * If this pushes the stack above MaxSaveStates, delete the least recent save.
   * To be run before each hard drop.
   */
  Game.prototype.addSaveState = function () {
    if (this.pmode !== Modes.PRACTICE) return;

    this.saveStates.push(new SaveState(this));
    if (this.saveStates.length > MaxSaveStates) this.saveStates.shift();
  };

  /**
   * Rewinds to the last save state and removes it from the stack. If no states available, prints a message to the in-game chat.
   */
  Game.prototype.undoToSaveState = function () {
    if (this.pmode !== Modes.PRACTICE) return;
    if (this.saveStates.length === 0) {
      this.Live.showInChat("Jstris Extras", "Can't undo any further!");
      return;
    }
    if (this.fumenPages) {
      this.fumenPages.pop();
    }
    this.Replay.invalidFromUndo = true;
    const lastState: SaveState = this.saveStates.pop()!;
    this.loadSaveState(lastState);
  };
  Game.prototype.loadSaveState = function (lastState: SaveState) {
    this.matrix = lastState.matrix;
    if (lastState.connections) this.connections = lastState.connections;
    this.deadline = lastState.deadline;
    this.isBack2Back = lastState.b2b;
    this.comboCounter = lastState.combo;

    this.loadSeedAndPieces(
      this.Replay.config.seed!,
      this.conf[0].rnd,
      lastState.placedBlocks,
      lastState.activeBlock,
      lastState.blockInHold
    );

    this.placedBlocks = lastState.placedBlocks;
    this.totalFinesse = lastState.totalFinesse;
    this.totalKeyPresses = lastState.totalKeyPresses;
    this.gamedata = lastState.gamedata;
    this.incomingGarbage = lastState.incomingGarbage;
    this.redBar = lastState.redBar;

    this.holdUsedAlready = false;
    this.setCurrentPieceToDefaultPos();
    this.updateGhostPiece(true);
    this.redrawAll();

    // update all stats' text to the new values
    this.GameStats.get("RECV").set(this.gamedata.linesReceived);
    this.GameStats.get("SCORE").set(this.gamedata.score);
    this.GameStats.get("HOLD").set(this.gamedata.holds);
    this.GameStats.get("LINES").set(this.gamedata.lines);
    this.GameStats.get("ATTACK").set(this.gamedata.linesSent);
    this.GameStats.get("BLOCKS").set(this.placedBlocks);
    this.GameStats.get("KPP").set(this.getKPP());
    this.GameStats.get("WASTE").set(this.getWasted());
    this.GameStats.get("FINESSE").set(this.totalFinesse);
    this.updateTextBar(); // updates stats for clock, pps, apm, and vs, and renders the new stats
  };

  /**
   * Sets the seed, queue, active block, and held block based on the parameters. */
  Game.prototype.loadSeedAndPieces = function (
    seed: string,
    randomizer: number,
    placedPieceCount: number,
    activePiece: Block,
    holdPiece: Block | null
  ) {
    // recreate rng's state at game start (from seed stored in replay)
    this.Replay.config.seed = seed;
    this.blockRNG = alea(seed);
    this.RNG = alea(seed);
    this.initRandomizer(randomizer);

    // to get the rng to the right state, roll for each previously generated block
    // +1 for current piece and +1 for hold, because those are saved separately
    let rollCount: number = placedPieceCount + 1;
    if (holdPiece != null) rollCount += 1;
    for (const _ of range(rollCount)) {
      this.getRandomizerBlock(); // result is ignored but rng is adjusted
    }

    // generate queue from new rng, and set active and held block from save state
    this.queue = [];
    this.generateQueue();
    this.activeBlock = activePiece;
    this.blockInHold = holdPiece;
  };

  /**
   * initializes the save state stack. To be run before a practice mode is a started
   */
  Game.prototype.initSaveStates = function () {
    if (this.pmode !== Modes.PRACTICE) return;
    this.saveStates = [];
  };

  // call `addSaveState` before each hard drop
  const oldBeforeHardDrop = Game.prototype.beforeHardDrop;
  Game.prototype.beforeHardDrop = function (...args) {
    if (this.pmode === Modes.PRACTICE) this.addSaveState();

    return oldBeforeHardDrop.apply(this, args);
  };

  // add `initSaveStates` to generatePracticeQueue
  let keyListenerInjected: boolean = false;
  const oldGeneratePracticeQueue = Game.prototype.generatePracticeQueue;
  Game.prototype.generatePracticeQueue = function (...args) {
    if (this.pmode === Modes.PRACTICE) {
      this.initSaveStates();
      if (!keyListenerInjected) {
        document.addEventListener(
          "keydown",
          (keyEvent: KeyboardEvent) => {
            if (this.focusState === 0) {
              if (keyEvent.code === Config.get("undoKey")) {
                this.undoToSaveState();
              }
            }
          },
          false
        );
      }
      keyListenerInjected = true;
    }

    return oldGeneratePracticeQueue.apply(this, args);
  };

  // neatly tell the user that replays don't work with undos or fumen/snapshot imports
  const oldUploadError = Replay.prototype.uploadError;
  Replay.prototype.uploadError = function (live, message) {
    if (this.invalidFromSnapshot) {
      live.showInChat("Jstris Extras", "Can't generate replay for game with Fumen or snapshot import!");
      return;
    }
    if (this.invalidFromUndo) {
      live.showInChat("Jstris Extras", "Can't generate replay for game with undos!");
      return;
    }
    return oldUploadError.apply(this, [live, message]);
  };
};
