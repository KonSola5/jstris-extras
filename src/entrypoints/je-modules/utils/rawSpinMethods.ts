export function initRawSpinMethods() {
  if (!GameCore.prototype.rawCheckTSpin) {
    // If this is the first time this is called, bind "checkTSpin" to a specially crafted object that we can extract interesting values from.
    GameCore.prototype.rawCheckTSpin = function (pieceID: number) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const gameCore = this; // I don't think setters / getters can be arrow functions.
      const binding = {
        get activeBlock() {
          return gameCore.activeBlock;
        },
        get matrix() {
          return gameCore.matrix;
        },
        get deadline() {
          return gameCore.deadline;
        },
        set spinPossible(spinPossible: boolean) {
          this.full = spinPossible;
        },
        set spinMiniPossible(spinMiniPossible: boolean) {
          this.mini = spinMiniPossible;
        },
        mini: false,
        full: false,
      };
      const boundRawCheckTSpin = this.checkTSpin.bind(binding);
      // Overwrite itself with a new reference to skip binding
      GameCore.prototype.rawCheckTSpin = function (pieceID: number) {
        boundRawCheckTSpin(pieceID);
        const full = binding.full;
        const mini = binding.mini;
        binding.full = false;
        binding.mini = false;
        return { full, mini };
      };
      boundRawCheckTSpin(pieceID);
      const full = binding.full;
      const mini = binding.mini;
      binding.full = false;
      binding.mini = false;
      return { full, mini };
    };
  }

  if (!GameCore.prototype.rawCheckAllSpin) {
    GameCore.prototype.rawCheckAllSpin = function (pieceID: number) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const gameCore = this;
      const binding = {
        get activeBlock() {
          return gameCore.activeBlock;
        },
        get matrix() {
          return gameCore.matrix;
        },
        get deadline() {
          return gameCore.deadline;
        },
        get blockSets() {
          return gameCore.blockSets;
        },
        set spinPossible(spinPossible: boolean) {
          this.full = spinPossible;
        },
        set spinMiniPossible(spinMiniPossible: boolean) {
          this.mini = spinMiniPossible;
        },
        mini: false,
        full: false,
      };
      const boundRawCheckAllSpin = this.checkAllSpin.bind(binding);
      GameCore.prototype.rawCheckAllSpin = function (pieceID: number) {
        boundRawCheckAllSpin(pieceID);
        const full = binding.full;
        const mini = binding.mini;
        binding.full = false;
        binding.mini = false;
        return { full, mini };
      };
      boundRawCheckAllSpin(pieceID);
      const full = binding.full;
      const mini = binding.mini;
      binding.full = false;
      binding.mini = false;
      return { full, mini };
    };
  }

  if (!GameCore.prototype.rawCheckAllSpinImmobile) {
    GameCore.prototype.rawCheckAllSpinImmobile = function () {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const gameCore = this;
      const binding = {
        get activeBlock() {
          return gameCore.activeBlock;
        },
        set spinPossible(spinPossible: boolean) {
          this.full = spinPossible;
        },
        checkIntersection: gameCore.checkIntersection.bind({
          get activeBlock() {
            return gameCore.activeBlock;
          },
          get matrix() {
            return gameCore.matrix;
          },
          get deadline() {
            return gameCore.deadline;
          },
          get blockSets() {
            return gameCore.blockSets;
          },
        }),
        full: false,
      };
      const boundRawCheckAllSpinImmobile = this.checkAllSpinImmobile.bind(binding);
      GameCore.prototype.rawCheckAllSpinImmobile = function () {
        boundRawCheckAllSpinImmobile();
        const full = binding.full;
        binding.full = false;
        return { full };
      };
      boundRawCheckAllSpinImmobile();
      const full = binding.full;
      binding.full = false;
      return { full };
    };
  }
}
