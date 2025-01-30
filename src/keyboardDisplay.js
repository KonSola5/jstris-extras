import { Config } from "./index.js";
import { createSVG, clamp } from "./util.js";
export const initKeyboardDisplay = () => {
  const isGame = typeof Game != "undefined";
  const isReplayer = typeof Replayer != "undefined";

  if (!isGame && !isReplayer) return;

  // SVGs taken from https://s.jezevec10.com/svg/dark.svg.
  let keys = [
    {
      name: "move-left",
      viewBox: "0 0 120 120",
      paths: [
        {
          d: "M34.358 43.3l60.033 60.04-16.65 16.65L17.7 59.957z",
        },
        {
          d: "M17.606 60.067L77.623.01 94.28 16.654 34.257 76.71z",
        },
      ],
    },
    {
      name: "move-right",
      viewBox: "0 0 120 120",
      paths: [
        {
          d: "M34.358 43.3l60.033 60.04-16.65 16.65L17.7 59.957z",
          transform: "matrix(-1 0 0 1 111.997 0)",
        },
        {
          d: "M17.606 60.067L77.623.01 94.28 16.654 34.257 76.71z",
          transform: "matrix(-1 0 0 1 111.997 0)",
        },
      ],
    },
    {
      name: "soft-drop",
      viewBox: "0 0 84.56 82.148",
      paths: [
        {
          d: "M48.732 73.783l42.307-42.307 11.741 11.739-42.308 42.312z",
          transform: "translate(-18.22 -3.424)",
        },
        {
          d: "M50.999 3.424h19.055v60.21H50.999z",
          transform: "translate(-18.22 -3.424)",
        },
        {
          d: "M60.543 85.572L18.22 43.283l11.721-11.741 42.33 42.308z",
          transform: "translate(-18.22 -3.424)",
        },
      ],
    },
    {
      name: "hard-drop",
      viewBox: "0 0 103 101.151",
      paths: [
        {
          d: "M91.039 31.476l11.741 11.739-42.308 42.312-11.74-11.744z",
          transform: "translate(-9 -3.424)",
        },
        {
          d: "M50.999 3.424h19.055v60.21H50.999z",
          transform: "translate(-9 -3.424)",
        },
        {
          d: "M18.22 43.283l11.721-11.741 42.33 42.308-11.728 11.722zM9 87.575h103v17H9z",
          transform: "translate(-9 -3.424)",
        },
      ],
    },
    {
      name: "rotate-left",
      viewBox: "0 0 146.869 210.794",
      paths: [
        {
          d: "M146.869 115.574c0-46.312-33.237-85.002-77.109-93.484L69.522 0 0 36.427l69.998 39.286-.238-22.78c27.176 7.87 47.109 32.964 47.109 62.642 0 35.962-29.02 66.887-64.982 66.887 3.343 13.187 3.704 13.25-.237 28.332 52.504 0 95.219-42.716 95.219-95.22z",
        },
      ],
    },
    {
      name: "rotate-right",
      viewBox: "0 0 146.869 210.794",
      paths: [
        {
          d: "M0 115.574C0 69.262 33.237 30.572 77.109 22.09L77.347 0l69.522 36.427-69.998 39.286.238-22.78C49.933 60.803 30 85.897 30 115.575c0 35.962 29.02 66.888 64.982 66.888-3.343 13.186-3.704 13.248.237 28.331C42.715 210.794 0 168.078 0 115.574z",
        },
      ],
    },
    {
      name: "rotate-180",
      viewBox: "0 0 108.74 90.397",
      paths: [
        {
          style: "line-height: 125%; -inkscape-font-specification: 'Verdana Bold'",
          d: "M21.037 65.644H1.623v-5.079h6.133v-15.37H1.623v-4.747q1.407 0 2.696-.156 1.289-.176 2.148-.586 1.016-.488 1.523-1.27.508-.78.586-1.953h6.465v24.082h5.996v5.079zm28.709-8.125q0 3.867-3.3 6.328-3.282 2.46-9.024 2.46-3.223 0-5.527-.663-2.305-.665-3.81-1.836-1.483-1.153-2.206-2.696-.703-1.543-.703-3.32 0-2.188 1.27-3.867 1.288-1.7 4.433-2.969v-.117q-2.54-1.172-3.73-2.95-1.192-1.777-1.192-4.12 0-3.457 3.203-5.665 3.203-2.207 8.34-2.207 5.39 0 8.438 2.012 3.066 1.992 3.066 5.332 0 2.07-1.29 3.692-1.288 1.62-3.944 2.754v.117q3.046 1.152 4.511 3.105 1.465 1.953 1.465 4.61zM41.68 44.08q0-1.484-1.153-2.363-1.132-.88-3.027-.88-.703 0-1.445.177-.723.175-1.328.507-.567.332-.938.88-.371.527-.371 1.21 0 1.153.645 1.797.664.645 2.148 1.29.547.234 1.484.585.957.332 2.305.762.898-1.055 1.29-1.895.39-.84.39-2.07zm.605 13.77q0-1.407-.703-2.13-.703-.722-2.89-1.66-.645-.292-1.876-.722-1.23-.43-2.07-.742-.84.761-1.523 1.855-.664 1.074-.664 2.422 0 2.031 1.445 3.242 1.465 1.192 3.809 1.192.625 0 1.464-.176.84-.195 1.446-.586.703-.45 1.132-1.055.43-.605.43-1.64zm35.645-6.757q0 3.672-.664 6.582-.664 2.89-2.07 4.746-1.446 1.894-3.712 2.871-2.265.957-5.586.957-3.261 0-5.566-.977-2.305-.976-3.73-2.89-1.446-1.914-2.09-4.746-.645-2.852-.645-6.524 0-3.789.664-6.582.664-2.793 2.11-4.726 1.445-1.914 3.75-2.871 2.304-.957 5.507-.957 3.34 0 5.606.996 2.266.976 3.71 2.93 1.427 1.913 2.071 4.726.645 2.793.645 6.465zm-7.559 0q0-5.274-1.035-7.5-1.035-2.246-3.438-2.246-2.402 0-3.437 2.246-1.035 2.226-1.035 7.539 0 5.176 1.054 7.46 1.055 2.286 3.418 2.286 2.364 0 3.418-2.285 1.055-2.285 1.055-7.5z",
          "font-weight": "700",
          "font-size": "40",
          "font-family": "Verdana",
          "letter-spacing": "0",
          "word-spacing": "0",
          transform: "translate(-1.623)",
        },
        {
          d: "M110.363 49.563c0-19.86-14.253-36.452-33.067-40.09L77.194 0 47.38 15.621 77.398 32.47l-.102-9.77c11.654 3.376 20.202 14.137 20.202 26.864 0 15.422-12.445 28.684-27.867 28.684 1.434 5.655 1.588 5.682-.102 12.15 22.516 0 40.834-18.318 40.834-40.834z",
          transform: "translate(-1.623)",
        },
      ],
    },
    {
      name: "hold",
      viewBox: "0 0 784.223 725.701",
      paths: [
        {
          d: "M990 742.4L794 575.8v98H402V811h392v88.2zM401.777 223.5l-196 166.6 196 156.8v-88.2h392V321.5h-392v-98z",
          transform: "translate(-205.777 -173.5)",
        },
      ],
    },
    {
      name: "reset",
      viewBox: "0 0 120 120",
      paths: [
        {
          d: "M120 0v45.336M91.418 43.5h22.622",
        },
        {
          d: "M60 95.5c-19.575 0-35.5-15.926-35.5-35.5 0-19.575 15.925-35.5 35.5-35.5 13.62 0 25.467 7.714 31.418 19h22.627c-7.06-23.153-28.578-40-54.04-40-31.204 0-56.5 25.296-56.5 56.5 0 31.203 25.296 56.5 56.5 56.5 16.264 0 30.911-6.882 41.221-17.88L85.895 84.255C79.412 91.168 70.207 95.5 60.006 95.5z",
        },
        {
          d: "M120 21.832l-.01 47.01-45.163-13.031z",
        },
      ],
    },
    {
      name: "new-game",
      viewBox: "0 0 8 8",
      paths: [
        {
          d: "M.336 3.097h7.328v1.807H.336z",
        },
        {
          d: "M3.097.336h1.807v7.328H3.097z",
        },
      ],
    },
  ];

  let keyboardDiv = document.createElement("div");
  keyboardDiv.classList.add("keyboard-div");
  keyboardDiv.style.left = `${Config.settings.keyboardOSDViewportX}vw`;
  keyboardDiv.style.top = `${Config.settings.keyboardOSDViewportY}vh`;
  keyboardDiv.style.width = `${Config.settings.keyboardOSDWidthPx}px`;
  keyboardDiv.style.height = `${Config.settings.keyboardOSDHeightPx}px`;

  if (!Config.settings.keyboardOSD) keyboardDiv.classList.add("hidden");
  Config.onChange("keyboardOSD", (value) => {
    if (value) {
      keyboardDiv.classList.remove("hidden");
    } else {
      keyboardDiv.classList.add("hidden");
    }
  });

  let keyboardOSD = document.createElement("div");
  keyboardOSD.classList.add("keyboard-osd");

  let resizeHandle = document.createElement("div");
  resizeHandle.classList.add("resize-handle");
  let handleSVG = createSVG(["handle-svg"], "0 0 120 120", [
    { d: "M120 57.953V0H62.047zM0 120h62.189L0 57.811z" },
    { d: "m44.61 60 17.6 17.6-32.59 32.589-17.6-17.601zm45.056-46.53 17.6 17.602-32.59 32.59-17.6-17.603z" },
  ]);
  handleSVG.setAttribute("transform", "scale(-1 1)");
  resizeHandle.append(handleSVG);

  resizeHandle.addEventListener("mousedown", (event) => {
    event.preventDefault();
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
  });

  function resize(event) {
    keyboardDiv.style.width = `${Math.max(event.pageX - keyboardDiv.getBoundingClientRect().left, 150)}px`;
    keyboardDiv.style.height = `${Math.max(event.pageY - keyboardDiv.getBoundingClientRect().top, 75)}px`;
  }

  function stopResizing(event) {
    Config.set("keyboardOSDWidthPx", Math.max(event.pageX - keyboardDiv.getBoundingClientRect().left, 150))
    Config.set("keyboardOSDHeightPx", Math.max(event.pageY - keyboardDiv.getBoundingClientRect().top, 75))
    window.removeEventListener("mousemove", resize);
  }

  let lastX = 0,
    lastY = 0,
    deltaX = 0,
    deltaY = 0;

  keyboardDiv.append(keyboardOSD, resizeHandle);

  keyboardDiv.addEventListener("mousedown", (event) => {
    if (!(event.target == resizeHandle || resizeHandle.contains(event.target))) {
      event.preventDefault();
      lastX = event.clientX;
      lastY = event.clientY;
      window.addEventListener("mousemove", move);
      window.addEventListener("mouseup", stopMoving);
    }
  });

  function move(event) {
    deltaX = event.clientX - lastX;
    deltaY = event.clientY - lastY;
    lastX = event.clientX;
    lastY = event.clientY;
    keyboardDiv.style.left = `${clamp(
      ((keyboardDiv.getBoundingClientRect().left + deltaX) * 100) / window.innerWidth,
      0,
      100 - (keyboardDiv.getBoundingClientRect().width * 100) / window.innerWidth
    )}vw`;
    keyboardDiv.style.top = `${Math.max(
      ((keyboardDiv.getBoundingClientRect().top + deltaY) * 100) / window.innerHeight,
      0
    )}vh`;
  }

  function stopMoving(event) {
    Config.set(
      "keyboardOSDViewportX",
      clamp(
        ((keyboardDiv.getBoundingClientRect().left + deltaX) * 100) / window.innerWidth,
        0,
        100 - (keyboardDiv.getBoundingClientRect().width * 100) / window.innerWidth
      )
    );
    Config.set(
      "keyboardOSDViewportY",
      Math.max(((keyboardDiv.getBoundingClientRect().top + deltaY) * 100) / window.innerHeight, 0)
    );
    window.removeEventListener("mousemove", move);
  }

  let keyDivs = [];

  keys.forEach((key) => {
    let keyDiv = document.createElement("div");
    keyDiv.classList.add("key", key.name);
    keyDiv.append(createSVG(["key-svg"], key.viewBox, key.paths));
    keyDivs.push(keyDiv);
  });

  keyboardOSD.append(...keyDivs);

  document.body.appendChild(keyboardDiv);

  let setKey = function (key, pressed) {
    for (const keyDiv of document.getElementsByClassName(`${key}`)) {
      if (pressed) keyDiv.classList.add("pressed");
      else keyDiv.classList.remove("pressed");
    }
  };

  if (isGame) {
    let oldReadyGo = Game.prototype.readyGo;

    Game.prototype.readyGo = function () {
      Game.set2ings = this.Settings.controls;
      return oldReadyGo.apply(this, arguments);
    };

    // KPS will be moved to "Custom Stats".
    /*
    let oldUpdateTextBar = Game.prototype.updateTextBar;
    Game.prototype.updateTextBar = function () {
      let val = oldUpdateTextBar.apply(this, arguments);
      
      // kps.textContent = "KPS: " + ((this.getKPP() * this.placedBlocks) / this.clock).toFixed(2);
      return val;
    };
    */
    let press = function (event) {
      if (typeof Game.set2ings == "undefined") return;

      // This usage of keyCode must remain, since Jstris still uses deprecated keyCodes.
      let i = Game.set2ings.indexOf(event.keyCode);
      if (i == -1) return;

      let key = keys[i].name;
      setKey(key, event.type == "keydown");
    };

    document.addEventListener("keydown", press);
    document.addEventListener("keyup", press);
  } else if (isReplayer) {
    var url = window.location.href.split("/");

    if (!url[2].endsWith("jstris.jezevec10.com")) return;
    if (url[3] != "replay") return;
    if (url[4] == "1v1") {
      // kbhold.classList.add("really-hide-kbd-display");
      return;
    }

    let L;
    let fetchURL = "https://" + url[2] + "/replay/data?id=" + url[(L = url[4] == "live") + 4] + "&type=" + (L ? 1 : 0);

    // let fetchURL = `https://${url[2]}/replay/data?id=${url[(L = url[4] == "live") + 4]}&type=${L ? 1 : 0}`;
    /*
    if(url[4] == "live"){
      fetchURL = "https://"+url[2]+"/replay/data?id=" + url[5] + "&type=1"
    } else {
      fetchURL = "https://"+url[2]+"/replay/data?id=" + url[4] + "&type=0"
    }
    */

    //fetch(`https://${url[2]}/replay/data?id=${url.length == 6? (url[5] + "&live=1") : url[4]}&type=0`)
    fetch(fetchURL)
      .then((res) => res.json())
      .then((json) => {
        if (!json.c) return;
        let das = json.c.das;

        Replayer.setKey = setKey;

        let oldPlayUntilTime = Replayer.prototype.playUntilTime;
        Replayer.prototype.playUntilTime = function () {
          // kps.textContent = "KPS: " + (((this.getKPP() * this.placedBlocks) / this.clock) * 1000).toFixed(2);

          if (this.ptr == 0) Replayer.lastPtr = -1;

          this.kbdActions = [];

          for (let i = 0; i < this.actions.length; i++) {
            let keyAction = { action: this.actions[i].a, timestamp: this.actions[i].t };

            if (keyAction.action == 2 || keyAction.action == 3) {
              keyAction.action -= 2;
              for (let j = i - 1; j >= 0; j--) {
                if (this.kbdActions[j].action < 2) {
                  this.kbdActions[j].action += 2;
                  break;
                }
              }
            }

            this.kbdActions.push(keyAction);
          }

          let pressKey = function (key, type) {
            Replayer.setKey(key, type >= 1);

            if (type == 2) {
              setTimeout((x) => Replayer.setKey(key, 0), (das * 3) / 5);
            }
          };

          let val = oldPlayUntilTime.apply(this, arguments);

          if (this.ptr != Replayer.lastPtr && this.ptr - 1 < this.kbdActions.length) {
            let action = this.kbdActions[this.ptr - 1].action
            let highlight = [
              ["move-left", 2],
              ["move-right", 2],
              ["move-left", 1],
              ["move-right", 1],
              ["rotate-left", 2],
              ["rotate-right", 2],
              ["rotate-180", 2],
              ["hard-drop", 2],
              ["soft-drop", 2],
              null,
              ["hold", 2],
            ][action];

            if (highlight) {
              pressKey(...highlight);
            }
          }

          Replayer.lastPtr = this.ptr;

          return val;
        };
      });
  }
};
