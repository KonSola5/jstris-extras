import { ElementBuilder } from "$/utils/element-builder";
import { getLogDiv } from "$/utils/HTML-utils";
import { Config } from "jstris-extras";

export const initAutomaticReplayCodes = () => {
  const oldStartPractice = Game.prototype.startPractice;

  Game.prototype.startPractice = function (...args) {
    //how many pieces should the replay at least have
    const piecesPlacedCutoff = 1;

    if (typeof this.replayCounter == "undefined") {
      this.replayCounter = 1;
    }

    this.Replay.getData();

    if (
      (this.GameStats.stats.BLOCKS.value as number) > piecesPlacedCutoff &&
      Config.get("automaticReplayCodesEnabled")
    ) {
      const stats = {
        time: this.GameStats.stats.CLOCK.value as number,
        blocks: this.GameStats.stats.BLOCKS.value as number,
        waste: this.GameStats.stats.WASTE.value as number,
      };
      const div = new ElementBuilder("div").withStyles("vertical-flex").build();
      const time = new ElementBuilder("span")
        .withText("Time: ")
        .append(new ElementBuilder("b").withText(String(stats.time)).build())
        .build();
      const pieces = new ElementBuilder("span")
        .withText("Pieces: ")
        .append(new ElementBuilder("b").withText(String(stats.blocks)).build())
        .build();
      const wastedTRatio = new ElementBuilder("span")
        .withText("Wasted T ratio: ")
        .append(new ElementBuilder("b").withText(String(stats.waste * 100) + "%").build())
        .build();

      const textArea = new ElementBuilder("textarea")
        .withID(`replay${this.replayCounter}`)
        .addEventListener("click", () => {
          textArea.focus();
          textArea.select();
        })
        .build();
      textArea.value = this.Replay.string;
      textArea.readOnly = true;

      const copyButton = new ElementBuilder("button")
        .withID(`replayButton${this.replayCounter}`)
        .withText("Copy")
        .addEventListener("click", () => {
          navigator.clipboard
            .writeText(textArea.value)
            .then(() => {
              copyButton.textContent = "Copied!";
              setTimeout(() => {
                copyButton.textContent = "Copy";
              }, 1000);
            })
            .catch((error: Error) => {
              console.error(`An error occured while copying text:
          ${error.message}`);
            });
        })
        .build();

      div.append(time, pieces, wastedTRatio, textArea, copyButton);

      this.Live.showInChat("", getLogDiv("info", `Automatic replay #${this.replayCounter}`, div));
      this.replayCounter++;
    }

    const val = oldStartPractice.apply(this, args);

    return val;
  };
};
