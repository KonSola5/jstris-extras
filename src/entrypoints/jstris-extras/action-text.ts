import { ElementBuilder } from "./util";

// prettier-ignore
const lineClearKeyframes = {
  offset:    [0,         0.1,      0.8,      1         ],
  opacity:   ["0%",      "100%",   "100%",   "0%"      ],
  translate: ["50% 0",   "0 0",    "0 0",    "0 0"     ],
  easing:    ["ease-in", "linear", "linear", "ease-out"]
};

// prettier-ignore
const comboKeyframes = {
  offset:     [0,         0.3,      1         ],
  opacity:    ["100%",    "100%",   "0%"      ],
  translateY: ["0",       "-3px",   "0"       ],
  easing:     ["ease-in", "linear", "ease-out"]
};

const lineClearNames = [
  "",
  "Single",
  "Double",
  "Triple",
  "Quadruple",
  "Quintuple",
  "Sextuple",
  "Septuple",
  "Octuple",
  "Nonuple",
  "Decuple",
  "Undecuple",
  "Duodecuple",
  "Tredecuple",
  "Quattuordecuple",
  "Quindecuple",
  "Sexdecuple",
  "Septendecuple",
  "Octodecuple",
  "Novemdecuple",
  "Vigintuple",
  "Unvigintuple",
] as const;

export function initActionText() {
  class ActionTextBox {
    actionTextDiv: HTMLDivElement;
    lineClearDiv: HTMLDivElement;
    comboDiv: HTMLDivElement;
    b2bDiv: HTMLDivElement;

    constructor() {
      this.actionTextDiv = new ElementBuilder("div").withID("action-text").withStyles("action-text").build();
      this.lineClearDiv = new ElementBuilder("div").withID("line-clear").withStyles("line-clear").build();
      this.comboDiv = new ElementBuilder("div").withID("current-combo").withStyles("current-combo").build();
      this.b2bDiv = new ElementBuilder("div").withID("b2b").withStyles("b2b").build();

      this.actionTextDiv.append(this.lineClearDiv, this.comboDiv, this.b2bDiv);
    }

    get() {
      return this.actionTextDiv;
    }
  }

  GameCore.prototype.injected_displayActionText = function (lineClear: number) {
    if (typeof this.b2bChain == "undefined") this.b2bChain = -1;
    if (!this.isBack2Back && !this.wasBack2Back) {
      this.b2bChain = -1;
    }
    if (lineClear == 0 && !this.spinPossible && !this.spinMiniPossible) return;
    if (!this.hasActionText && !(this.v instanceof SlotView)) {
      this.actionTextBox = new ActionTextBox();
      let holdCanvas: HTMLCanvasElement;
      if (this.v instanceof SlotView) {
        holdCanvas = this.v.holdCanvas;
      } else {
        holdCanvas = this.holdCanvas;
      }
      holdCanvas.insertAdjacentElement("afterend", this.actionTextBox.get());
      this.hasActionText = true;
    }
    if (this.actionTextBox) {
      const elementsToAdd: HTMLElement[] = [];

      if (lineClear > lineClearNames.length) lineClear = lineClearNames.length - 1;
      const activePiece = this.blockSets[this.activeBlock.set].blocks[this.activeBlock.id];
      if (this.spinPossible || this.spinMiniPossible) {
        if (this.spinMiniPossible)
          elementsToAdd.push(new ElementBuilder("span").withText("Mini ").withStyles("mini").build());
        elementsToAdd.push(
          new ElementBuilder("span")
            .withStyles("spin")
            .withData("color", activePiece.color)
            .withText(`${activePiece.name}\u2011Spin`)
            .build()
        );
        if (lineClear > 0) elementsToAdd.push(document.createElement("br"));
      }
      if (lineClear > 0) elementsToAdd.push(new ElementBuilder("span").withText(lineClearNames[lineClear]).build());
      this.actionTextBox.lineClearDiv.replaceChildren(...elementsToAdd);

      this.actionTextBox.lineClearDiv.animate(lineClearKeyframes, 2000);

      if (this.comboCounter > 0) {
        this.actionTextBox.comboDiv.replaceChildren(
          new ElementBuilder("span").withText(`${this.comboCounter} Combo`).build()
        );
        this.actionTextBox.comboDiv.animate(comboKeyframes, 2000);
      } else {
        this.actionTextBox.comboDiv.replaceChildren();
      }
      if (this.isBack2Back) {
        this.b2bChain++;
      }
      if (!this.isBack2Back) {
        this.b2bChain = -1;
      }
      if (this.b2bChain > 0) {
        this.actionTextBox.b2bDiv.replaceChildren(
          new ElementBuilder("span").withStyles("b2b").withText(`B2B x ${this.b2bChain}`).build()
        );
      }
      else {
        this.actionTextBox.b2bDiv.replaceChildren();
      }
    }
  };
}
