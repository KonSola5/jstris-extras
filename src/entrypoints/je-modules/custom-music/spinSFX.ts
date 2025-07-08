import { AllSpin } from "$/utils/enums";

export function initSpinSFX() {
  const oldRotateCurrentBlock = Game.prototype.rotateCurrentBlock;
  Game.prototype.rotateCurrentBlock = function (stateChange, ...args) {
    const activePiece = this.blockSets[this.activeBlock.set].blocks[this.activeBlock.id];
    const stateBeforeRotation = this.activeBlock.rot;
    const returnValue = oldRotateCurrentBlock.apply(this, [stateChange, ...args]);
    const stateAfterRotation = this.activeBlock.rot;
    if (stateBeforeRotation - stateAfterRotation === 0) return;
    if (this.R.allSpin != AllSpin.IMMOBILE) {
      if (activePiece.id == 2 || activePiece.id == 202) {
        const { full, mini } = this.rawCheckTSpin(activePiece.id);
        if (full) {
          this.playSound("prespin");
        } else if (mini) {
          this.playSound("prespin"); // TODO: Separate sound for mini pre-spin
        }
      } else if (this.R.allSpin == AllSpin.FOUR_POINT) {
        const { full, mini } = this.rawCheckAllSpin(activePiece.id);
        if (full) {
          this.playSound("prespin");
        } else if (mini) {
          this.playSound("prespin"); // TODO: Separate sound for mini pre-spin
        }
      }
    } else {
      const { full } = this.rawCheckAllSpinImmobile();
      if (full) {
        this.playSound("prespin");
      }
    }
    return returnValue;
  };
}

