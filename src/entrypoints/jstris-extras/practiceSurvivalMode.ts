export const initPracticeSurvivalMode = () => {
  // 60 apm cycle from rivi's usermode
  const baseCycle = [
    { time: 4, attack: 4 },
    { time: 4, attack: 5 },
    { time: 4, attack: 2 },
    { time: 3, attack: 1 },
    { time: 4, attack: 4 },
    { time: 4, attack: 4 },
    { time: 3, attack: 5 },
    { time: 3, attack: 5 },
  ];

  let isCycling = false;
  let shouldStartCycle = false;
  let shouldCancel = true;
  let timeFactor = 1;
  let hangingTimeout: number = 0;

  const INIT_MESS = 20;
  let setMess: (messiness: number) => void = (messiness: number) => null;
  const changeAPM = (apm: number) => (timeFactor = 60 / apm);

  let hasInit = false;

  const doCycle = (game: Game, cycle: number) => {
    const cycleStep = baseCycle[cycle];
    if (!isCycling) return;
    if (game.pmode != Jstris.Modes.PRACTICE) return stopCycle();
    console.log(game.pmode);
    hangingTimeout = window.setTimeout(() => {
      if (!isCycling) return;
      if (game.pmode != 2) return stopCycle();
      game.addIntoGarbageQueue(cycleStep.attack);
      doCycle(game, (cycle + 1) % baseCycle.length);
    }, cycleStep.time * timeFactor * 1000);
  };
  const startCycle = (game: Game) => {
    if (!isCycling) {
      isCycling = true;
      doCycle(game, 0);
    }
  };
  const stopCycle = () => {
    clearTimeout(hangingTimeout);
    isCycling = false;
  };
  if (typeof Game == "function") {
    const oldUpdateQueueBox = Game.prototype.updateQueueBox;
    Game.prototype.updateQueueBox = function (...args) {
      if (this.pmode != 2) return oldUpdateQueueBox.apply(this, args);
      return oldUpdateQueueBox.apply(this, args);
    };
    // const oldLineClears = GameCore.prototype.checkLineClears;
    // GameCore.prototype.checkLineClears = function (x) {
    //   let oldAttack = this.gamedata.attack;
    //   let val = oldLineClears.apply(this, arguments);
    //   let curAttack = this.gamedata.attack - oldAttack;
    //   if (this.pmode == 2 && curAttack > 0) {
    //     this.gamedata.attack -= curAttack; // block or send attack also adds to the attack, so just subtracting to make stat accurate
    //     if (shouldCancel) {
    //       this.blockOrSendAttack(curAttack, x);
    //     }
    //   }
    //   return val;
    // };

    const oldReadyGo = Game.prototype.readyGo;
    Game.prototype.readyGo = function (...args) {
      if (this.pmode == 2) {
        settingsDiv.classList.add("show-practice-mode-settings");
      } else {
        settingsDiv.classList.remove("show-practice-mode-settings");
      }

      if (shouldStartCycle) startCycle(this);

      if (!hasInit) {
        const oldOnGameEnd = Settings.prototype.onGameEnd;
        if (this.pmode == 2) {
          this.R.mess = INIT_MESS;
        }
        // window.game = this;
        setMess = (messiness: number) => {
          if (this.pmode == Jstris.Modes.PRACTICE) {
            this.R.mess = messiness;
          }
        };
        this.Settings.onGameEnd = function () {
          if (this.p.pmode == Jstris.Modes.PRACTICE) {
            stopCycle();
          }
          return oldOnGameEnd.apply(this, args);
        };
        startStopButton.addEventListener("click", () => {
          shouldStartCycle = !shouldStartCycle;

          if (shouldStartCycle) {
            startCycle(this);
            startStopButton.textContent = "Stop APM Cycle";
          } else {
            stopCycle();
            startStopButton.textContent = "Start APM Cycle";
          }
        });
        startStopButton.disabled = false;
        hasInit = true;
      }
      return oldReadyGo.apply(this, ...args);
    };
  }

  const stage = document.getElementById("stage") as HTMLDivElement;
  const settingsDiv = document.createElement("DIV");
  settingsDiv.id = "customPracticeSettings";

  const slider = document.createElement("input");
  slider.type = "range";
  slider.min = "5";
  slider.max = "200";
  slider.step = "5";
  slider.id = "customApmSlider";
  slider.value = "60";
  const valueLabel = document.createElement("input");
  valueLabel.type = "number";
  valueLabel.min = "5";
  valueLabel.max = "200";
  valueLabel.id = "customApmInput";
  slider.addEventListener("mousemove", () => {
    valueLabel.value = Number.parseFloat(slider.value).toFixed(0);
    changeAPM(Number.parseFloat(slider.value));
  });
  valueLabel.value = Number.parseFloat(slider.value).toFixed(0);

  valueLabel.addEventListener("change", () => {
    let num = Number.parseFloat(valueLabel.value);
    num = Math.max(5, Math.min(num, 200));
    slider.value = num.toFixed(0);
    valueLabel.value = String(num);
    changeAPM(num);
  });

  valueLabel.addEventListener("click", () => {
    $(window).trigger("modal-opened");
  });

  const label = document.createElement("label");
  label.htmlFor = "customApmSlider";
  label.textContent = "APM";

  const sliderDiv = document.createElement("div");
  sliderDiv.appendChild(label);
  sliderDiv.appendChild(slider);
  sliderDiv.appendChild(valueLabel);

  const messSlider = document.createElement("input");
  messSlider.type = "range";
  messSlider.min = "0";
  messSlider.max = "100";
  messSlider.step = "1";
  messSlider.id = "customApmSlider";
  messSlider.value = String(INIT_MESS);
  const messValueLabel = document.createElement("input");
  messValueLabel.type = "number";
  messValueLabel.min = "0";
  messValueLabel.max = "100";
  messValueLabel.id = "customApmInput";
  messSlider.addEventListener("mousemove", () => {
    messValueLabel.value = Number.parseFloat(messSlider.value).toFixed(0);
    setMess(Number.parseFloat(messSlider.value));
  });
  messValueLabel.value = Number.parseFloat(messSlider.value).toFixed(0);

  messValueLabel.addEventListener("change", () => {
    let num = Number.parseFloat(messValueLabel.value);
    num = Math.max(0, Math.min(num, 100));
    messSlider.value = num.toFixed(0);
    messValueLabel.value = String(num);
    setMess(num);
  });

  messValueLabel.addEventListener("click", () => {
    $(window).trigger("modal-opened");
  });

  const messLabel = document.createElement("label");
  messLabel.htmlFor = "customApmSlider";
  messLabel.textContent = "🧀%";

  const messSliderDiv = document.createElement("div");
  messSliderDiv.appendChild(messLabel);
  messSliderDiv.appendChild(messSlider);
  messSliderDiv.appendChild(messValueLabel);

  const cancelLabel = document.createElement("label");
  cancelLabel.htmlFor = "cancelCheckbox";
  cancelLabel.textContent = "Allow cancel";

  const cancelCheckbox = document.createElement("input");
  cancelCheckbox.type = "checkbox";
  cancelCheckbox.id = "cancelCheckbox";
  cancelCheckbox.checked = true;
  
  cancelCheckbox.addEventListener("change", () => {
    shouldCancel = cancelCheckbox.checked;
  });

  const cancelDiv = document.createElement("div");
  cancelDiv.appendChild(cancelLabel);
  cancelDiv.appendChild(cancelCheckbox);

  const startStopButton = document.createElement("button");
  startStopButton.textContent = "Start APM Cycle";
  startStopButton.disabled = true;
  settingsDiv.innerHTML += "<b>Downstack Practice</b><br/>";
  settingsDiv.appendChild(sliderDiv);
  settingsDiv.appendChild(messSliderDiv);
  settingsDiv.appendChild(cancelDiv);
  settingsDiv.appendChild(startStopButton);
  stage.appendChild(settingsDiv);
};
