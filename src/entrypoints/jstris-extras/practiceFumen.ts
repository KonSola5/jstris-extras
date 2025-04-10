import { encoder, decoder, Field, EncodePage, Pages } from "tetris-fumen";
// import { SaveState } from "./practiceUndo.js";
import { PieceType, RotationType } from "tetris-fumen/lib/defines.js";
import { SaveState } from "./practiceUndo.js";
import { SnapshotPlus } from "./global-typings.js";
import { Modes } from "./util.js";

/** Creates a deep clone of an object. */
function clone<T>(x: T): T {
  return JSON.parse(JSON.stringify(x));
}

const reverseMatrix: string[] = [
  "_",
  "Z",
  "L",
  "O",
  "S",
  "I",
  "J",
  "T",
  "X",
  "X",
  "I",
  "O",
  "T",
  "L",
  "J",
  "S",
  "Z",
  "I",
  "O",
  "T",
  "L",
  "J",
  "S",
  "Z",
];
const jstrisToCenterX: number[][] = [
  [1, 2, 2, 1],
  [1, 1, 2, 2],
  [1, 1, 1, 1],
  [1, 1, 1, 1],
  [1, 1, 1, 1],
  [1, 1, 1, 1],
  [1, 1, 1, 1],
];
const jstrisToCenterY: number[][] = [
  [1, 1, 2, 2],
  [2, 1, 1, 2],
  [2, 2, 2, 2],
  [2, 2, 2, 2],
  [2, 2, 2, 2],
  [2, 2, 2, 2],
  [2, 2, 2, 2],
];
const pIndex: PieceType[] = ["I", "O", "T", "L", "J", "S", "Z"];
const rIndex: RotationType[] = ["spawn", "right", "reverse", "left"];
const quizFilter = new RegExp("[^" + "IOTLJSZ" + "]", "g");

function downloadText(filename: string, text: string): void {
  const anchor: HTMLAnchorElement = document.createElement("a");
  anchor.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
  anchor.setAttribute("download", filename);

  anchor.style.display = "none";
  document.body.appendChild(anchor);

  anchor.click();

  document.body.removeChild(anchor);
}

function generateFumenQueue(this: Game | Replayer, lim: number | null = null) {
  if (!lim) lim = this.queue.length;
  const pieceSet = this.blockSets[this.activeBlock.set];
  lim = Math.min(lim, this.queue.length);
  let activePieceName: string = "";
  if (this.activeBlock) {
    activePieceName = pieceSet.blocks[this.activeBlock.id].name;
  }
  let holdPieceName: string = "";
  if (this.blockInHold) {
    holdPieceName = pieceSet.blocks[this.blockInHold.id].name;
  }
  let quiz: string = `#Q=[${holdPieceName}](${activePieceName})`;
  for (let i: number = 0; i < lim; i++) {
    quiz += pieceSet.blocks[this.queue[i].id].name;
  }
  return quiz;
}

function generateFumenMatrix(this: Game | Replayer): string {
  let fieldStr = "";
  for (const block in this.deadline) {
    fieldStr += reverseMatrix[this.deadline[block]];
  }
  for (const row in this.matrix) {
    for (const column in this.matrix[row]) {
      fieldStr += reverseMatrix[this.matrix[row][column]];
    }
  }
  return fieldStr;
}
export const initPracticeFumen = () => {
  const oldRestart = Game.prototype.restart;
  Game.prototype.restart = function (...args) {
    const urlParams = new URLSearchParams(window.location.search);
    const snapshot = urlParams.get("snapshotPlus");

    if (this.pmode === 2 && snapshot != null) {
      const returnValue: void = oldRestart.apply(this, args);
      const decompressedGame = LZString.decompressFromEncodedURIComponent(snapshot);
      const game: SnapshotPlus = JSON.parse(decompressedGame || "null");
      if (!game) return returnValue;
      console.log(game);

      const holdPiece: Block | null = game.holdID == null ? null : new Block(game.holdID);
      this.loadSeedAndPieces(game.seed, game.rnd, game.placedBlocks, new Block(game.activeBlockID), holdPiece);

      this.matrix = clone(game.matrix);
      this.deadline = clone(game.deadline);
      this.setCurrentPieceToDefaultPos();
      this.updateGhostPiece(true);
      this.redrawAll();
      this.invalidFromSnapshot = true;
      return returnValue;
    } else {
      this.fumenPages = null;
      if (this.pmode === Modes.PRACTICE) this.fumenPages = [];
      return oldRestart.apply(this, args);
    }
  };
  Game.prototype.generateFumenQueue = generateFumenQueue;
  Game.prototype.generateFumenMatrix = generateFumenMatrix;
  const oldAddGarbage = Game.prototype.addGarbage;
  Game.prototype.addGarbage = function (...args) {
    this.fumenMatrixRoll = true; //matrix modulated, need to update fumen matrix
    return oldAddGarbage.apply(this, args);
  };
  const oldBeforeHardDrop = Game.prototype.beforeHardDrop;

  Game.prototype.beforeHardDrop = function (...args) {
    const returnValue = oldBeforeHardDrop.apply(this, args);
    if (!this.fumenPages) return returnValue;

    if (this.altBlocks) {
      this.pages.push({ field: Field.create(this.generateFumenMatrix()) });
      return;
    }
    if (this.activeBlock.set == 0) {
      const x: number = jstrisToCenterX[this.activeBlock.id][this.activeBlock.rot] + this.activeBlock.pos.x;
      const y: number = 19 - (jstrisToCenterY[this.activeBlock.id][this.activeBlock.rot] + this.ghostPiece.pos.y);
      const msg: EncodePage = {
        operation: {
          type: this.blockSets[this.activeBlock.set].blocks[this.activeBlock.id].name as PieceType,
          rotation: rIndex[this.activeBlock.rot],
          x: x,
          y: y,
        },
      };
      if (this.fumenMatrixRoll) {
        msg.field = Field.create(this.generateFumenMatrix());
        this.fumenMatrixRoll = false;
      }
      msg.comment = this.generateFumenQueue();
      // msg.flags = { quiz: true };
      this.fumenPages.push(msg);
    }
    //   console.log(encoder.encode(this.fumenPages))
    return returnValue;
  };

  const chatListener = Live.prototype.sendChat;
  Live.prototype.sendChat = function (rawmsg) {
    const msg = "string" != typeof rawmsg ? this.chatInput.value.replace(/"/g, '\\"') : rawmsg;
    if (msg == "/fumen") {
      if (this.p.pmode != Modes.PRACTICE) {
        this.showInChat("Jstris Extras", "Live Fumen export is only supported in Practice mode.");
        this.chatInput.value = "";
        return;
      }
      if (!this.p.fumenPages) {
        this.showInChat("Jstris Extras", "No Fumen data available.");
        this.chatInput.value = "";
        return;
      }
      const fumen: string = encoder.encode(this.p.fumenPages);
      const coderro = `
            <span class='wFirstLine'><span class='wTitle'>!${i18n.warning2}!</span><b>${i18n.repFail}"</b>(<em>Jstris+ Fumen Export</em>)</span>
            <p>Fumen code dumped into the chat.</p>
            <a href="https://harddrop.com/fumen/?${fumen}" target="_blank">Link</a>
            <textarea readonly cols="30" onclick="this.focus();this.select()">${fumen}</textarea>
            `;
      this.chatMajorWarning(coderro);
      this.chatInput.value = "";
      return;
    } else if ("/fumen" === msg.substring(0, 6)) {
      if (this.p.pmode != Modes.PRACTICE) {
        this.showInChat("Jstris Extras", "Fumen import is only supported in Practice mode.");
        this.chatInput.value = "";
        return;
      }
      let pages: Pages | null = null;
      try {
        pages = decoder.decode(msg.substring(5));
      } catch (error) {
        console.log(error);
        if (error instanceof Error) {
          this.showInChat("Jstris Extras", error.message);
          this.chatInput.value = "";
        }
        return;
      }
      const gamestates: SaveState = loadFumen(pages);
      this.p.loadSaveState(gamestates);
      for (let i: number = this.p.queue.length; i < 7; i++) {
        this.p.refillQueue();
      }
      this.p.redrawAll();
      this.p.saveStates = [];
      this.p.addSaveState();
      this.p.fumenPages = [];
      this.chatInput.value = "";
      this.p.invalidFromSnapshot = true;
      return;
    }
    const val = chatListener.apply(this, [rawmsg]);
    return val;
  };
};
export const initReplayerSnapshot = () => {
  const repControls = document.getElementById("repControls") as HTMLDivElement;
  const skipButton: HTMLButtonElement = document.createElement("button");
  skipButton.className = "replay-btn";
  skipButton.textContent = "snapshot";
  const fumenButton: HTMLButtonElement = document.createElement("button");
  fumenButton.className = "replay-btn";
  fumenButton.textContent = "fumen";
  const pcButton: HTMLButtonElement = document.createElement("button");
  pcButton.className = "replay-btn";
  pcButton.textContent = "pc solver";
  const wellRow1: HTMLDivElement = document.createElement("div");
  wellRow1.className = "replay-btn-group";
  let injected: boolean = false;
  const oldLoadReplay = ReplayController.prototype.loadReplay;
  ReplayController.prototype.loadReplay = function (...args) {
    if (!injected && this.g.length == 1) {
      Replayer.prototype.generateFumenQueue = generateFumenQueue.bind(this.g[0]);
      Replayer.prototype.generateFumenMatrix = generateFumenMatrix.bind(this.g[0]);
      repControls.appendChild(wellRow1);
      wellRow1.appendChild(skipButton);
      wellRow1.appendChild(fumenButton);

      skipButton.onclick = () => {
        const code = this.g[0].snapshotPlus();
        window.open(`https://jstris.jezevec10.com/?play=2&snapshotPlus=${code}`, "_blank");
      };
      pcButton.onclick = () => {
        const code = this.g[0].snapshotFumen();
        window.open(
          `https://wirelyre.github.io/tetra-tools/pc-solver.html?fumen=${encodeURIComponent(code)}`,
          "_blank"
        );
      };
      fumenButton.onclick = () => {
        const rep: string = (document.getElementById("rep0") as HTMLTextAreaElement).value;
        fumenButton.disabled = true;
        fumenButton.textContent = "loading";
        fetch(`https://fumen.tstman.net/jstris`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: `replay=${rep}`,
        })
          .then((response: Response) => response.json())
          .then((data) => {
            navigator.clipboard
              .writeText(data.fumen)
              .then(() => {
                fumenButton.textContent = "copied";
              })
              .catch((err) => {
                fumenButton.textContent = `err ${err}`;
              })
              .finally(() => {
                if (data.fumen.length < 8168) {
                  window.open(`https://harddrop.com/fumen/?${data.fumen}`, "_blank");
                }
                const textArea: HTMLTextAreaElement = document.createElement("textarea");
                textArea.className = "repArea";
                textArea.rows = 1;
                textArea.textContent = data.fumen;
                const dlButton: HTMLButtonElement = document.createElement("button");
                dlButton.textContent = "download";
                dlButton.className = "replay-btn";
                dlButton.onclick = () => {
                  downloadText("jstrisFumen.txt", data.fumen);
                };
                const openButton: HTMLButtonElement = document.createElement("button");
                openButton.textContent = "open";
                let fumenLink: string = `https://harddrop.com/fumen/?${data.fumen}`;
                if (data.fumen.length >= 8168) {
                  alert("Fumen code is too long for URL, you'll need to paste the code in manually.");
                  fumenLink = `https://harddrop.com/fumen/?`;
                }

                openButton.className = "replay-btn";
                openButton.onclick = () => {
                  window.open(fumenLink, "_blank");
                };
                repControls.appendChild(textArea);
                repControls.appendChild(dlButton);
                repControls.appendChild(openButton);
              });
          });
      };
      injected = true;
    }
    const returnValue = oldLoadReplay.apply(this, args);
    if (this.g[0].pmode == Modes.PC_MODE) {
      wellRow1.appendChild(pcButton);
    }
    return returnValue;
  };
  Replayer.prototype.snapshotFumen = function () {
    /*
        let ss = this.activeBlock
        let x = jstrisToCenterX[ss.id][ss.rot] + this.activeBlock.pos.x
        let y = 19 - (jstrisToCenterY[ss.id][ss.rot] + this.ghostPiece.pos.y)
           let msg = {
               operation: { type: this.blockSets[ss.set].blocks[ss.id].name, rotation: rIndex[ss.rot], x: x, y: y }
           }*/
    const msg: EncodePage = {};
    const fieldStr = this.generateFumenMatrix().substring(170);
    const airCount = fieldStr.split("_").length - 1;
    msg.field = Field.create(fieldStr);
    msg.comment = this.generateFumenQueue().replace(quizFilter, "");
    msg.comment = msg.comment.substring(0, Math.floor(airCount / 4) + 1);
    console.log(msg);
    const code = encoder.encode([msg]);
    console.log(code);
    return code;
  };
  Replayer.prototype.snapshotPlus = function () {
    const matrix = clone(this.matrix);
    const deadline = clone(this.deadline);
    const placedBlocks = this.placedBlocks;
    const seed = this.r.c.seed;
    const activeBlockID = this.activeBlock.id;
    let holdID = null;
    if (this.blockInHold) {
      holdID = this.blockInHold.id;
    }
    const rnd = this.R.rnd;
    return LZString.compressToEncodedURIComponent(
      JSON.stringify({
        matrix,
        deadline,
        placedBlocks,
        seed,
        activeBlockID,
        holdID,
        rnd,
      })
    );
  };
};
export function loadFumen(pages: Pages) {
  const page = pages[pages.length - 1];
  const field = page.field;
  const matrix = Array(20)
    .fill(undefined)
    .map(() => Array(10).fill(0)) as Jstris.Matrix;
  const deadline = Array(10).fill(0) as Jstris.MatrixRow;
  let activeBlock = new Block(0);
  let hold: Block | null = null;
  const queue: Block[] = [];
  if (page.flags.quiz) {
    const match = /^#Q=\[([LOJSTZI]?)\]?\(([LOJSTZI]?)\)([LOJSTZI]*)$/.exec(page.comment);
    console.log(match);
    if (match) {
      if (match[1]) {
        hold = new Block(pIndex.indexOf(match[1] as PieceType));
      }
      if (match[2]) {
        activeBlock = new Block(pIndex.indexOf(match[2] as PieceType));
      }
      if (match[3]) {
        for (const char of match[3]) {
          queue.push(new Block(pIndex.indexOf(char as PieceType)));
        }
      }
    }
  }

  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 20; y++) {
      const v = reverseMatrix.indexOf(field.at(x, y));
      if (v > 0) matrix[19 - y][x] = v;
    }
  }
  for (let x = 0; x < 10; x++) {
    const v = reverseMatrix.indexOf(field.at(x, 20));
    if (v > 0) deadline[x] = v;
  }
  const game: SaveState = {
    matrix: matrix,
    deadline: deadline,
    activeBlock: activeBlock,
    blockInHold: hold,
    queue: queue,
    combo: 0,
    b2b: false,
    placedBlocks: 0,
    totalFinesse: 0,
    totalKeyPresses: 0,
    incomingGarbage: [],
    redBar: 0,
    gamedata: {
      lines: 0,
      singles: 0,
      doubles: 0,
      triples: 0,
      tetrises: 0,
      maxCombo: 0,
      linesSent: 0,
      linesReceived: 0,
      PCs: 0,
      lastPC: 0,
      TSD: 0,
      TSD20: 0,
      B2B: 0,
      attack: 0,
      score: 0,
      holds: 0,
      garbageCleared: 0,
      wasted: 0,
      tpieces: 0,
      tspins: 0,
    },
  };
  return game;
}
