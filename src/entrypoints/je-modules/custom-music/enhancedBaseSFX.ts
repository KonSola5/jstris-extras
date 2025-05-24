// For some goddamn reason, Jstris uses classes and inheritance instead of objects to define sound packs.
// Here, I modify them, since the "rotate" sound effect is inherited by every single pack.

import { range } from "$/utils/extra-math";

export function initEnhancedBaseSFX() {
  interface SFXSet {
    // Vanilla
    hold: Jstris.SFXDefinition | null;
    linefall: Jstris.SFXDefinition | null;
    lock: Jstris.SFXDefinition | null;
    move: Jstris.SFXDefinition | null;
    died: Jstris.SFXDefinition | null;
    ready: Jstris.SFXDefinition | null;
    go: Jstris.SFXDefinition | null;
    ding: Jstris.SFXDefinition | null;
    msg: Jstris.SFXDefinition | null;
    fault: Jstris.SFXDefinition | null;
    blank: Jstris.SFXDefinition | null;
    item: Jstris.SFXDefinition | null;
    pickup: Jstris.SFXDefinition | null;
    rotate: Jstris.SFXDefinition | null;
    success: Jstris.SFXDefinition | null;
    harddrop: Jstris.SFXDefinition | null;
    golive: Jstris.SFXDefinition | null;
    land: Jstris.SFXDefinition | null;
    garbage: Jstris.SFXDefinition | null;
    b2b: Jstris.SFXDefinition | null;
    comboTones: false | Jstris.SFXDefinition | (Jstris.SFXDefinition | null)[];
    scoring: ((Jstris.SFXDefinition | undefined)[] & { length: 15 }) | null;
    b2bScoring: ((Jstris.SFXDefinition | undefined)[] & { length: 15 }) | null;
    spawns: { [piece in Jstris.Tetrominoes]: Jstris.SFXDefinition } | null;
    author: string | null;
    // Extra
    prespin: Jstris.SFXDefinition | null;
  }

  class EnhancedBaseSFXSet extends BaseSFXset implements SFXSet {
    constructor() {
      super();
    }
    ready: Jstris.SFXDefinition | null = {
      url: "ready.wav",
      abs: 0,
      set: 0,
    };
    go: Jstris.SFXDefinition | null = {
      url: "go.wav",
      abs: 0,
      set: 0,
    };
    ding: Jstris.SFXDefinition | null = {
      url: "ding.wav",
      abs: 0,
      set: 0,
    };
    msg: Jstris.SFXDefinition | null = {
      url: "msg2.mp3",
      abs: 0,
      set: 0,
    };
    blank: Jstris.SFXDefinition | null = {
      url: "null.wav",
      abs: 0,
      set: 0,
    };
    item: Jstris.SFXDefinition | null = {
      url: "item.mp3",
      abs: 0,
      set: 0,
    };
    pickup: Jstris.SFXDefinition | null = {
      url: "pickup.mp3",
      abs: 0,
      set: 0,
    };
    success: Jstris.SFXDefinition | null = {
      url: "success.ogg",
      abs: 0,
      set: 0,
    };
    hold: Jstris.SFXDefinition | null = null;
    linefall: Jstris.SFXDefinition | null = null;
    lock: Jstris.SFXDefinition | null = null;
    move: Jstris.SFXDefinition | null = null;
    died: Jstris.SFXDefinition | null = null;
    fault: Jstris.SFXDefinition | null = null;
    rotate: Jstris.SFXDefinition | null = null;
    harddrop: Jstris.SFXDefinition | null = null;
    golive: Jstris.SFXDefinition | null = null;
    land: Jstris.SFXDefinition | null = null;
    garbage: Jstris.SFXDefinition | null = null;
    b2b: Jstris.SFXDefinition | null = null;
    comboTones: false | Jstris.SFXDefinition | (Jstris.SFXDefinition | null)[] = false;
    scoring: ((Jstris.SFXDefinition | undefined)[] & { length: 15 }) | null = null;
    b2bScoring: ((Jstris.SFXDefinition | undefined)[] & { length: 15 }) | null = null;
    spawns: { [piece in Jstris.Tetrominoes]: Jstris.SFXDefinition } | null = null;
    author: string | null = null;
    prespin: Jstris.SFXDefinition | null = null;
  }

  class EnhancedNullSFXSet extends EnhancedBaseSFXSet {
    ready = null;
    go = null;
    ding = null;
    msg = null;
    blank = null;
    item = null;
    pickup = null;
    success = null;
  }

  class EnhancedYotipoSFXSet extends EnhancedBaseSFXSet {
    volume = 1;
    lock = {
      url: "lock.wav",
      abs: 0,
      set: 1,
    };
    died = {
      url: "topout.wav",
      abs: 0,
      set: 1,
    };
    ready = {
      url: "ready.wav",
      abs: 0,
      set: 1,
    };
    go = {
      url: "go.wav",
      abs: 0,
      set: 1,
    };
    scoring = Array(15) as Jstris.SFXDefinition[] & { length: 15 };
    constructor() {
      super();
      this.scoring[Score.A.CLEAR1] = {
        url: "linefall.wav",
        abs: 0,
        set: 1,
      };
      this.scoring[Score.A.CLEAR2] = {
        url: "linefall2.wav",
        abs: 0,
        set: 1,
      };
      this.scoring[Score.A.CLEAR3] = {
        url: "linefall3.wav",
        abs: 0,
        set: 1,
      };
      this.scoring[Score.A.CLEAR4] = {
        url: "linefall4.wav",
        abs: 0,
        set: 1,
      };
      this.scoring[Score.A.TSPIN_MINI_SINGLE] = {
        url: "linefall.wav",
        abs: 0,
        set: 1,
      };
      this.scoring[Score.A.TSPIN_SINGLE] = {
        url: "linefall.wav",
        abs: 0,
        set: 1,
      };
      this.scoring[Score.A.TSPIN_DOUBLE] = {
        url: "linefall2.wav",
        abs: 0,
        set: 1,
      };
      this.scoring[Score.A.TSPIN_TRIPLE] = {
        url: "linefall3.wav",
        abs: 0,
        set: 1,
      };
      this.scoring[Score.A.CLEAR5] = {
        url: "linefall4.wav",
        abs: 0,
        set: 1,
      };
    }
  }

  class EnhancedRainforestSFXset extends EnhancedBaseSFXSet {
    constructor() {
      super();
    }
    author = "Chris Butler, CC BY 3.0, remixed, freesound.org";
    volume = 0.4;
    lock = {
      url: "lock.mp3",
      abs: 0,
      set: 2,
    };
    died = {
      url: "topout.mp3",
      abs: 0,
      set: 2,
    };
    comboTones = {
      url: "comboTones.mp3",
      abs: 0,
      set: 2,
      duration: 1000,
      spacing: 500,
      cnt: 15,
    };
  }

  class EnhancedTetraSFXSet extends EnhancedBaseSFXSet {
    author = "Dr Ocelot, CC BY 3.0";
    volume = 0.35;
    comboTones: Jstris.SFXDefinition[] = [];
    hold = {
      url: "hold.ogg",
      abs: 0,
      set: 3,
    };
    move = {
      url: "move.ogg",
      abs: 0,
      set: 3,
    };
    ready = {
      url: "ready.ogg",
      abs: 0,
      set: 3,
    };
    go = {
      url: "go.ogg",
      abs: 0,
      set: 3,
    };
    golive = {
      url: "start.ogg",
      abs: 0,
      set: 3,
    };
    lock = {
      url: "locknohd.ogg",
      abs: 0,
      set: 3,
    };
    harddrop = {
      url: "harddrop.ogg",
      abs: 0,
      set: 3,
    };
    land = {
      url: "step.ogg",
      abs: 0,
      set: 3,
    };
    garbage = {
      url: "garbage.ogg",
      abs: 0,
      set: 3,
    };
    b2b = {
      url: "b2b.ogg",
      abs: 0,
      set: 3,
    };
    died = {
      url: "topout.ogg",
      abs: 0,
      set: 3,
    };
    fault = {
      url: "lockforce.ogg",
      abs: 0,
      set: 3,
    };
    rotate = {
      url: "rotate.ogg",
      abs: 0,
      set: 3,
    };
    prespin = {
      url: "prespin.ogg",
      abs: 0,
      set: 3,
    };
    scoring: Jstris.SFXDefinition[] & { length: 15 } = Array(15) as Jstris.SFXDefinition[] & { length: 15 };
    constructor() {
      super();
      for (const i of range(1, 21)) {
        this.comboTones.push({
          url: `ren/ren${i}.ogg`,
          abs: 0,
          set: 3,
        });
      }
      this.scoring[Score.A.CLEAR1] = {
        url: "erase1.ogg",
        abs: 0,
        set: 3,
      };
      this.scoring[Score.A.CLEAR2] = {
        url: "erase2.ogg",
        abs: 0,
        set: 3,
      };
      this.scoring[Score.A.CLEAR3] = {
        url: "erase3.ogg",
        abs: 0,
        set: 3,
      };
      this.scoring[Score.A.CLEAR4] = {
        url: "erase4.ogg",
        abs: 0,
        set: 3,
      };
      this.scoring[Score.A.TSPIN_MINI] = {
        url: "tspin0mini.ogg",
        abs: 0,
        set: 3,
      };
      this.scoring[Score.A.TSPIN] = {
        url: "tspin0.ogg",
        abs: 0,
        set: 3,
      };
      this.scoring[Score.A.TSPIN_MINI_SINGLE] = {
        url: "tspin1mini.ogg",
        abs: 0,
        set: 3,
      };
      this.scoring[Score.A.TSPIN_SINGLE] = {
        url: "tspin1.ogg",
        abs: 0,
        set: 3,
      };
      this.scoring[Score.A.TSPIN_DOUBLE] = {
        url: "tspin2.ogg",
        abs: 0,
        set: 3,
      };
      this.scoring[Score.A.TSPIN_TRIPLE] = {
        url: "tspin3.ogg",
        abs: 0,
        set: 3,
      };
      this.scoring[Score.A.PERFECT_CLEAR] = {
        url: "bravo.ogg",
        abs: 0,
        set: 3,
      };
      this.scoring[Score.A.CLEAR5] = {
        url: "tspin3.ogg",
        abs: 0,
        set: 3,
      };
    }
  }

  class EnhancedNullpoMinoSFXSet extends EnhancedBaseSFXSet {
    hold = {
      url: "hold.wav",
      abs: 0,
      set: 0,
    };
    linefall = {
      url: "linefall.wav",
      abs: 0,
      set: 0,
    };
    lock = {
      url: "lock.wav",
      abs: 0,
      set: 0,
    };
    move = {
      url: "move.wav",
      abs: 0,
      set: 0,
    };
    died = {
      url: "topout.wav",
      abs: 0,
      set: 0,
    };
    ready = {
      url: "ready.wav",
      abs: 0,
      set: 0,
    };
    go = {
      url: "go.wav",
      abs: 0,
      set: 0,
    };
    ding = {
      url: "ding.wav",
      abs: 0,
      set: 0,
    };
    msg = {
      url: "msg2.mp3",
      abs: 0,
      set: 0,
    };
    fault = {
      url: "fault.wav",
      abs: 0,
      set: 0,
    };
    blank = {
      url: "null.wav",
      abs: 0,
      set: 0,
    };
    item = {
      url: "item.mp3",
      abs: 0,
      set: 0,
    };
    pickup = {
      url: "pickup.mp3",
      abs: 0,
      set: 0,
    };
    success = {
      url: "success.ogg",
      abs: 0,
      set: 0,
    };
  }

  SFXsets[0].data = EnhancedNullpoMinoSFXSet;
  SFXsets[1].data = EnhancedYotipoSFXSet;
  SFXsets[2].data = EnhancedRainforestSFXset;
  SFXsets[3].data = EnhancedTetraSFXSet;
  SFXsets[4].data = EnhancedNullSFXSet;
}
