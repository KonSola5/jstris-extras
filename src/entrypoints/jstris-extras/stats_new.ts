// TODO

declare interface Stats {
CLOCK?: Stat
SCORE?: Stat
LINES?: Stat
ATTACK?: Stat
RECV?: Stat
FINESSE?: Stat
PPS?: Stat
KPP?: Stat
APM?: Stat
BLOCKS?: Stat
VS?: Stat
WASTE?: Stat
HOLD?: Stat
HOLDPERCENT?: Stat
PIECES_AND_PPS?: Stat
}
class StatsManager2 { // eslint-disable-line
  stats: Stats = {}
  game: Game;
  jstrisExtras: boolean = true;
  statBoxLeft: HTMLDivElement;
  statBoxRight: HTMLDivElement;
  statsLeft: string[] = [];
  statsRight: string[] = [];

  constructor(view: Ctx2DView | WebGLView) {
    this.game = view.g;
    let statBoxLeft: HTMLDivElement = document.querySelector("#main .stat-box-left") as HTMLDivElement;
    if (!statBoxLeft) {
      statBoxLeft = document.createElement("div");
      statBoxLeft.classList.add("stat-box-left");
      (document.querySelector("#main .lstage") as HTMLDivElement).append(statBoxLeft);
    }
    let statBoxRight: HTMLDivElement = document.querySelector("#main .stat-box-right") as HTMLDivElement;
    if (!statBoxRight) {
      statBoxRight = document.createElement("div");
      statBoxRight.classList.add("stat-box-right");
      (document.querySelector("#main #rInfoBox") as HTMLDivElement).append(statBoxRight);
    }
    this.statBoxLeft = statBoxLeft;
    this.statBoxRight = statBoxRight;

    this.initDefault();
  }

  setView(view: Ctx2DView | WebGLView): void {
    this.game = view.g;
  }

  adjustToGameMode(): void {
    this.resetAll();
    this.applyShownStats();
  }

  initDefault(): void {
    // Vanilla stats
    this.stats.CLOCK = new Stat({ name: i18n.roundTime, stats:[{initialValue: 0}] });
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

  applyShownStats(/*shown?: number*/): void {
    // let defaultStatsa = {
    //   /* Live      */ 0: ["CLOCK", "ATTACK", "RECV", "PPS", "APM"],
    //   /* Sprint    */ 1: ["CLOCK", "ATTACK", "FINESSE", "PPS", "KPP", "BLOCKS"],
    //   /* Practice  */ 2: ["CLOCK", "ATTACK", "FINESSE", "PPS", "KPP", "BLOCKS"],
    //   /* Cheese    */ 3: ["CLOCK", "ATTACK", "FINESSE", "PPS", "KPP", "BLOCKS"],
    //   /* Survival  */ 4: ["CLOCK", "ATTACK", "FINESSE", "PPS", "KPP", "BLOCKS"],
    //   /* Ultra     */ 5: ["SCORE", "ATTACK", "FINESSE", "PPS", "KPP", "BLOCKS"],
    //   /* Maps      */ 6: ["CLOCK", "ATTACK", "FINESSE", "PPS", "KPP", "BLOCKS"],
    //   /* TSD20     */ 7: ["CLOCK", "ATTACK", "FINESSE", "PPS", "KPP", "BLOCKS"],
    //   /* PCMode    */ 8: ["CLOCK", "ATTACK", "FINESSE", "PPS", "KPP", "BLOCKS"],
    //   /* Usermodes */ 9: ["CLOCK", "LINES", "FINESSE", "PPS", "KPP", "BLOCKS"],
    // };
    const defaultStats = {
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
    const currentMode = this.game.isPmode(false) as keyof typeof defaultStats
    this.statsLeft = defaultStats[currentMode].left;
    this.statsRight = defaultStats[currentMode].right;
    this.statBoxLeft.replaceChildren();
    this.statsLeft.forEach((statName: string): void => {
      this.statBoxLeft.appendChild(this.stats[statName as keyof Stats]!.statBox);
    });
    this.statBoxRight.replaceChildren();
    this.statsRight.forEach((statName: string): void => {
      this.statBoxRight.appendChild(this.stats[statName as keyof Stats]!.statBox);
    });
  }

  get(stat: string): Stat | undefined {
    return this.stats[stat as keyof Stats];
  }

  render() {
    this.statsLeft.forEach((statName: string): void => {
      this.stats[statName as keyof Stats]!.update();
    });
    this.statsRight.forEach((statName: string): void => {
      this.stats[statName as keyof Stats]!.update();
    });
  }

  reorder(): void {}

  resetAll(): void {
    Object.values(this.stats).forEach((stat: Stat): void => {
      stat.reset();
    });
  }
}

interface StatDefinition {
  initialValue: number;
  unit?: string;
}

interface StatSettings {
  name: string,
  stats: StatDefinition[]
}

class Stat {
  statBox: HTMLDivElement;
  statTitle: HTMLSpanElement;
  statValueBox: HTMLDivElement;
  statValues: HTMLElement[] = [];
  values: number[] = [];
  initialValues: number[] = [];

  constructor(settings: StatSettings) {
    this.statBox = document.createElement("div");
    this.statBox.classList.add("stat");
    this.statTitle = document.createElement("span");
    this.statTitle.classList.add("title");
    this.statTitle.textContent = settings.name;
    this.statValueBox = document.createElement("div");
    this.statValueBox.classList.add("value");
    this.statBox.append(this.statTitle, this.statValueBox);

    settings.stats.forEach((stat: StatDefinition, i: number) => {
      if (i !== 0) this.statValueBox.append("|")
      this.statValues.push(document.createElement("span"));
      this.statValues[i].textContent = String(stat.initialValue);
      this.statValueBox.append(this.statValues[i]);
      if (stat.unit) this.statBox.append(stat.unit)

      this.values.push(stat.initialValue);
      this.initialValues.push(stat.initialValue)
    })
  }

  set(...values: number[]): void {
    this.values = values;
  }

  get(): number | number[] {
    if (this.values.length == 1) return this.values[0];
    else return this.values;
  }

  reset(): void {
    this.values = this.initialValues.slice();
  }

  update(): void {
    this.values.forEach((value: number, i: number) => {
      this.statValues[i].textContent = String(value);
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
