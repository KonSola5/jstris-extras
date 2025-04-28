import { Actions, range } from "$/utils/util.js";

export let isReplayerReversing = false;

export const initReplayManager = () => {
  let skipping: boolean = false;

  const repControls = document.getElementById("repControls") as HTMLDivElement;
  const skipButton: HTMLButtonElement = document.createElement("button");
  skipButton.textContent = "skip";
  skipButton.onclick = function () {
    if (skipping) {
      skipButton.textContent = "skip";
    } else {
      skipButton.textContent = "step";
    }
    skipping = !skipping;
  };
  if (repControls) repControls.appendChild(skipButton);
  const nextFrame = ReplayController.prototype.nextFrame;
  ReplayController.prototype.nextFrame = function (...args) {
    if (!skipping) {
      return nextFrame.apply(this, args);
    }

    // find the next upcoming hard drop
    let nextHardDropTime: number = -1;
    this.g.forEach((replayer: Replayer) => {
      for (const i of range(replayer.ptr, replayer.actions.length)) {
        const action: number = replayer.actions[i].a;
        const timestamp: number = replayer.actions[i].t;

        if (action == Actions.HARD_DROP) {
          if (nextHardDropTime == -1 || timestamp < nextHardDropTime) nextHardDropTime = timestamp;
          break;
        }
      }
    });

    // play all replayers until that time
    if (nextHardDropTime < 0) return;
    this.g.forEach((replayer: Replayer) => replayer.playUntilTime(nextHardDropTime));
  };
  const oldPrevFrame = ReplayController.prototype.prevFrame;
  ReplayController.prototype.prevFrame = function (...args) {
    isReplayerReversing = true;
    if (!skipping) {
      const returnValue: void = oldPrevFrame.apply(this, args);
      isReplayerReversing = false;
      return returnValue;
    }
    let skipBack: number = 0;
    let passed: boolean = false;
    this.g.forEach((replayer: Replayer) => {
      for (const i of range(replayer.ptr, 0, -1)) {
        const action: number = replayer.actions[i - 1].a;
        skipBack += 1;

        if (action == Actions.HARD_DROP) {
          if (passed) {
            skipBack -= 1;
            break;
          }
          passed = true;
        }
      }
    });
    for (const _ of range(skipBack)) {
      isReplayerReversing = true;
      oldPrevFrame.apply(this, ...args);
      isReplayerReversing = false;
    }
    isReplayerReversing = false;
  };
  const oldLoadReplay = ReplayController.prototype.loadReplay;
  ReplayController.prototype.loadReplay = function (...args) {
    const returnValue = oldLoadReplay.apply(this, args);
    (document.getElementById("next") as HTMLButtonElement).onclick = this.nextFrame.bind(this);
    (document.getElementById("prev") as HTMLButtonElement).onclick = this.prevFrame.bind(this);
    return returnValue;
  };
};
