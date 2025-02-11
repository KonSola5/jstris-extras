class StatsManager2 {
  /**
   * @typedef {object} Stats
   * @prop {Stat} CLOCK
   * @prop {Stat} SCORE
   * @prop {Stat} LINES
   * @prop {Stat} ATTACK
   * @prop {Stat} RECV
   * @prop {Stat} FINESSE
   * @prop {Stat} PPS
   * @prop {Stat} KPP
   * @prop {Stat} APM
   * @prop {Stat} BLOCKS
   * @prop {Stat} VS
   * @prop {Stat} WASTE
   * @prop {Stat} HOLD
   */

  /** @type {Stats} */
  stats = {};
  /** @type {Game} */
  game;
  jstrisExtras = true;
  /** @param {Ctx2DView | WebGLView} view */
  constructor(view) {
    this.game = view.g;
    let statBoxLeft = document.querySelector("#main .stat-box-left");
    if (!statBoxLeft) {
      statBoxLeft = document.createElement("div");
      statBoxLeft.classList.add("stat-box-left");
      document.querySelector("#main .lstage").append(statBoxLeft);
    }
    let statBoxRight = document.querySelector("#main .stat-box-right");
    if (!statBoxRight) {
      statBoxRight = document.createElement("div");
      statBoxRight.classList.add("stat-box-right");
      document.querySelector("#main #rInfoBox").append(statBoxRight);
    }
    this.statBoxLeft = statBoxLeft;
    this.statBoxRight = statBoxRight;

    this.initDefault();
  }

  /** @param {Ctx2DView | WebGLView} view */
  setView(view) {
    this.game = view.g;
  }

  adjustToGameMode() {
    this.resetAll();
    this.applyShownStats();
  }

  initDefault() {
    // Vanilla stats
    this.stats.CLOCK = new Stat({ name: i18n.roundTime, stats:[{initialValue: "0.00"}] });
    this.stats.SCORE = new Stat({ name: i18n.score, stats: [{initialValue: 0}] });
    this.stats.LINES = new Stat({ name: "Lines", stats: [{initialValue: 0}] });
    this.stats.ATTACK = new Stat({ name: i18n.attack, stats: [{initialValue: 0}] });
    this.stats.RECV = new Stat({ name: i18n.received, stats: [{initialValue: 0}] });
    this.stats.FINESSE = new Stat({ name: i18n.finesse, stats: [{initialValue: 0}] });
    this.stats.PPS = new Stat({ name: i18n.PPS, stats: [{initialValue: 0}] });
    this.stats.KPP = new Stat({ name: i18n.KPP, stats: [{initialValue: 0}] });
    this.stats.APM = new Stat({ name: i18n.APM, stats: [{initialValue: 0}] });
    this.stats.BLOCKS = new Stat({ name: "Pieces", stats: [{initialValue: 0}] });
    this.stats.VS = new Stat({ name: "VS Score", stats: [{initialValue: 0}] });
    this.stats.WASTE = new Stat({ name: "Wasted T", stats: [{initialValue: 0}] });
    this.stats.HOLD = new Stat({ name: "Holds", stats: [{initialValue: 0}] });
    // Custom stats
    this.stats.HOLDPERCENT = new Stat({name: "Holds", stats: [
      {initialValue: 0},
      {initialValue: 0, unit: "%"}
    ]})
    this.stats.PIECES_AND_PPS = new Stat({name: "Pieces", stats: [
      {initialValue: 0},
      {initialValue: 0, unit: "/s"}
    ]})
  }

  applyShownStats(shown) {
    let defaultStatss = {
      /* Live      */ 0: ["CLOCK", "ATTACK", "RECV", "PPS", "APM"],
      /* Sprint    */ 1: ["CLOCK", "ATTACK", "FINESSE", "PPS", "KPP", "BLOCKS"],
      /* Practice  */ 2: ["CLOCK", "ATTACK", "FINESSE", "PPS", "KPP", "BLOCKS"],
      /* Cheese    */ 3: ["CLOCK", "ATTACK", "FINESSE", "PPS", "KPP", "BLOCKS"],
      /* Survival  */ 4: ["CLOCK", "ATTACK", "FINESSE", "PPS", "KPP", "BLOCKS"],
      /* Ultra     */ 5: ["SCORE", "ATTACK", "FINESSE", "PPS", "KPP", "BLOCKS"],
      /* Maps      */ 6: ["CLOCK", "ATTACK", "FINESSE", "PPS", "KPP", "BLOCKS"],
      /* TSD20     */ 7: ["CLOCK", "ATTACK", "FINESSE", "PPS", "KPP", "BLOCKS"],
      /* PCMode    */ 8: ["CLOCK", "ATTACK", "FINESSE", "PPS", "KPP", "BLOCKS"],
      /* Usermodes */ 9: ["CLOCK", "LINES", "FINESSE", "PPS", "KPP", "BLOCKS"],
    };
    let defaultStats = {
      0: {
        left: ["ATTACK", "RECV", "PPS", "APM"],
        right: ["CLOCK"],
      },
      1: {
        left: ["PPS", "KPP", "FINESSE", "CLOCK"],
        right: ["LINES"],
      },
      2: {
        left: ["LINES", "BLOCKS", "KPP", "PPS", "WASTE"],
        right: ["SCORE", "CLOCK"],
      },
      3: {
        left: [],
        right: [],
      },
      4: {
        left: [],
        right: [],
      },
      5: {
        left: [],
        right: [],
      },
      6: {
        left: [],
        right: [],
      },
      7: {
        left: [],
        right: [],
      },
      8: {
        left: [],
        right: [],
      },
      9: {
        left: [],
        right: [],
      },
    };

    this.statsLeft = defaultStats[this.game.isPmode(false)].left;
    this.statsRight = defaultStats[this.game.isPmode(false)].right;
    this.statBoxLeft.replaceChildren();
    this.statsLeft.forEach((statName) => {
      this.statBoxLeft.appendChild(this.stats[statName].statBox);
    });
    this.statBoxRight.replaceChildren();
    this.statsRight.forEach((statName) => {
      this.statBoxRight.appendChild(this.stats[statName].statBox);
    });
  }

  get(stat) {
    return this.stats[stat];
  }

  render() {
    this.statsLeft.forEach((statName) => {
      this.stats[statName].update();
    });
    this.statsRight.forEach((statName) => {
      this.stats[statName].update();
    });
  }

  reorder() {}

  resetAll() {
    Object.values(this.stats).forEach((stat) => {
      stat.reset();
    });
  }
}

class Stat {
  /**
   * @typedef {object} StatDefinition
   * @prop {any} initialValue Initial value of the stat.
   * @prop {string?} unit Unit for the stat.
   */

  /**
   * @typedef {object} StatSettings
   * @prop {string} name Name of the stat.
   * @prop {StatDefinition[]} stats Defines stats within the stat.
   */
  statBox;
  statTitle;
  statValueBox;
  statValues = [];
  name;
  values = [];
  initialValues = [];

  /** @param {StatSettings} settings  */
  constructor(settings) {
    this.statBox = document.createElement("div");
    this.statBox.classList.add("stat");
    this.statTitle = document.createElement("span");
    this.statTitle.classList.add("title");
    this.statTitle.textContent = settings.name;
    this.statValueBox = document.createElement("div");
    this.statValueBox.classList.add("value");
    this.statBox.append(this.statTitle, this.statValueBox);

    settings.stats.forEach((stat, i) => {
      if (i !== 0) this.statValueBox.append("|")
      this.statValues.push(document.createElement("span"));
      this.statValues[i].textContent = stat.initialValue;
      this.statValueBox.append(this.statValues[i]);
      if (stat.unit) this.statBox.append(stat.unit)

      this.values.push(stat.initialValue);
      this.initialValues.push(stat.initialValue)
    })
  }

  set(...values) {
    this.values = values;
  }

  get() {
    if (this.values.length == 1) return this.values[0];
    else return this.values;
  }

  reset() {
    this.values = this.initialValues.slice();
  }

  update() {
    this.values.forEach((value, i) => {
      this.statValues[i].textContent = value;
    })
  }
}

export function initCustomStats() {
  // let oldRestart = Game.prototype.restart;
  // Game.prototype.restart = function () {
  //   if (this.GameStats instanceof StatsManager) this.GameStats = new StatsManager2(this.v);
  //   return oldRestart.call(this);
  // };
}
