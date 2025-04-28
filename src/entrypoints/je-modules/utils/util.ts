export function lerp(start: number, end: number, amount: number) {
  return (1 - amount) * start + amount * end;
}

/**
 * Clamps a value between the given minimum and maximum value.
 * @param value The value to clamp.
 * @param min The minimum value.
 * @param max The maximum value.
 * @returns The clamped value.
 */
export function clamp(value: number, min: number, max: number) {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

/**
 * Generates numbers from 0 to `end` with step of 1.
 * @param end End of range (exclusive)
 */
export function range(end: number): Generator<number, void, unknown>;
/**
 * Generates numbers from `start` to `end` with step of 1.
 * @param start Start of range (inclusive)
 * @param end End of range (exclusive)
 */
export function range(start: number, end: number): Generator<number, void, unknown>;
/**
 * Generates numbers from `start` to `end` with step of `step`.
 * @param start Start of range (inclusive)
 * @param end End of range (exclusive)
 * @param step Step of the range generator (can't be 0).
 * @throws `TypeError` if the step is 0 or NaN.
 */
export function range(start: number, end: number, step: number): Generator<number, void, unknown>;
export function* range(start: number, end?: number, step?: number) {
  if (end === undefined) {
    end = start;
    start = 0;
  }
  if (step === undefined) step = 1;
  if (step == 0) throw new TypeError("Range step is equal to zero.");
  if (isNaN(step)) throw new TypeError("Range step is not a number.");
  let currentNumber = start;
  while (Math.sign(step) * currentNumber < Math.sign(step) * end) {
    yield currentNumber;
    currentNumber += step;
  }
}

// expands object types one level deep
export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

// expands object types recursively
export type ExpandRecursively<T> = T extends object
  ? T extends infer O
    ? { [K in keyof O]: ExpandRecursively<O[K]> }
    : never
  : T;

/**
 * An enum for easier readability of modes.
 * @enum {number}
 */
export const Modes = Object.freeze({
  SPRINT: 1,
  PRACTICE: 2,
  CHEESE_RACE: 3,
  SURVIVAL: 4,
  ULTRA: 5,
  MAPS: 6,
  TSD20: 7,
  PC_MODE: 8,
  USERMODE: 9,
  BOT: 10,
});

export const Actions = Object.freeze({
  MOVE_LEFT: 0,
  MOVE_RIGHT: 1,
  DAS_LEFT: 2,
  DAS_RIGHT: 3,
  ROTATE_LEFT: 4,
  ROTATE_RIGHT: 5,
  ROTATE_180: 6,
  HARD_DROP: 7,
  SOFT_DROP_BEGIN_END: 8,
  GRAVITY_STEP: 9,
  HOLD_BLOCK: 10,
  GARBAGE_ADD: 11,
  SGARBAGE_ADD: 12,
  REDBAR_SET: 13,
  ARR_MOVE: 14,
  AUX: 15,
});

export const AuxActions = Object.freeze({
  AFK: 0,
  BLOCK_SET: 1,
  MOVE_TO: 2,
  RANDOMIZER: 3,
  MATRIX_MOD: 4,
  WIDE_GARBAGE_ADD: 5,
});

/**
 * Creates an SVG element.
 *
 * @param cssClassArray Array of CSS classes to apply to SVG.
 * @param viewBox The SVG view box.
 * @param pathArray Array of objects containing path attributes.
 * @returns The SVG element.
 */
export function createSVG(cssClassArray: string[], viewBox: string, pathArray: object[]) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add(...cssClassArray);
  svg.setAttribute("viewBox", viewBox);
  const paths: SVGPathElement[] = [];
  pathArray.forEach((path) => {
    const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
    for (const [key, value] of Object.entries(path)) {
      pathElement.setAttribute(key, value);
    }
    paths.push(pathElement);
  });
  svg.append(...paths);
  return svg;
}

type LogLevels = "error" | "warning" | "info" | "success";

export function getLogDiv(level: LogLevels, title: string, message: string | HTMLElement) {
  // const chatDiv: HTMLDivElement | null = document.querySelector("#chatContent");
  // if (!chatDiv) return;

  // const chatMessage = document.createElement("div");
  // chatMessage.classList.add("chl", "srv");

  const logDiv = document.createElement("div");
  logDiv.classList.add("je-log");
  switch (level) {
    case "error": {
      logDiv.classList.add("je-error");
      break;
    }
    case "warning": {
      logDiv.classList.add("je-warning");
      break;
    }
    case "info": {
      logDiv.classList.add("je-info");
      break;
    }
    case "success": {
      logDiv.classList.add("je-success");
      break;
    }
  }
  const titleDiv = document.createElement("div");
  titleDiv.classList.add("title");
  let svg: SVGSVGElement | null = null;
  switch (level) {
    case "error": {
      svg = createSVG([], "-1.7 0 20.4 20.4", [
        {
          d: "M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917m-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z",
        },
      ]);
      break;
    }
    case "warning": {
      svg = createSVG([], "0 0 1024 1024", [
        {
          d: "M520.741 163.801a10.2 10.2 0 0 0-3.406-3.406c-4.827-2.946-11.129-1.421-14.075 3.406L80.258 856.874a10.24 10.24 0 0 0-1.499 5.335c0 5.655 4.585 10.24 10.24 10.24h846.004c1.882 0 3.728-.519 5.335-1.499 4.827-2.946 6.352-9.248 3.406-14.075L520.742 163.802zm43.703-26.674L987.446 830.2c17.678 28.964 8.528 66.774-20.436 84.452a61.45 61.45 0 0 1-32.008 8.996H88.998c-33.932 0-61.44-27.508-61.44-61.44a61.45 61.45 0 0 1 8.996-32.008l423.002-693.073c17.678-28.964 55.488-38.113 84.452-20.436a61.44 61.44 0 0 1 20.436 20.436M512 778.24c22.622 0 40.96-18.338 40.96-40.96s-18.338-40.96-40.96-40.96-40.96 18.338-40.96 40.96 18.338 40.96 40.96 40.96m0-440.32c-22.622 0-40.96 18.338-40.96 40.96v225.28c0 22.622 18.338 40.96 40.96 40.96s40.96-18.338 40.96-40.96V378.88c0-22.622-18.338-40.96-40.96-40.96",
        },
      ]);
      break;
    }
    case "info": {
      svg = createSVG([], "-1 0 19 19", [
        {
          d: "M16.417 9.583A7.917 7.917 0 1 1 8.5 1.666a7.917 7.917 0 0 1 7.917 7.917M5.85 3.309a6.833 6.833 0 1 0 2.65-.534 6.8 6.8 0 0 0-2.65.534m2.654 1.336A1.136 1.136 0 1 1 7.37 5.78a1.136 1.136 0 0 1 1.135-1.136zm.792 9.223V8.665a.792.792 0 1 0-1.583 0v5.203a.792.792 0 0 0 1.583 0",
        },
      ]);
      break;
    }
    case "success": {
      // ! Not yet implemented
      break;
    }
  }
  const titleHeading = document.createElement("h1");
  titleHeading.textContent = title;
  const closeSVG = createSVG(["je-closebtn"], "0 0 24 24", [
    {
      d: "m13.414 12 5.293-5.293a.999.999 0 1 0-1.414-1.414L12 10.586 6.707 5.293a.999.999 0 1 0-1.414 1.414L10.586 12l-5.293 5.293a.999.999 0 1 0 1.414 1.414L12 13.414l5.293 5.293a.997.997 0 0 0 1.414 0 1 1 0 0 0 0-1.414z",
    },
  ]);
  closeSVG.onclick = () => {
    logDiv.remove();
  };

  if (svg) {
    svg.classList.add("je-svg");
    titleDiv.append(svg);
  }
  titleDiv.append(titleHeading, closeSVG);

  logDiv.append(titleDiv);

  if (typeof message == "string") {
    const messageSpan = document.createElement("span");
    messageSpan.textContent = message;
    logDiv.append(messageSpan);
  } else {
    logDiv.append(message);
  }

  return logDiv;
  // chatMessage.append(logDiv);
  // chatDiv.append(chatMessage);
}

/**
 * Contains functions shared between various element builders.
 * @abstract
 */
abstract class NodeBuilder {
  element!: Element; // Initialized elsewhere
  constructor() {
    if (this.constructor == NodeBuilder) {
      throw new ReferenceError("Abstract classes can't be instantiated.");
    }
  }

  /**
   * Assigns an ID to the element.
   * @param {string} id ID to give to the element.
   * @returns The current instance for chaining.
   */
  withID(id: string) {
    this.element.id = id;
    return this;
  }

  /**
   * Adds CSS classes to the element.
   * @param  {...string} styles CSS classes to give to the element.
   * @returns The current instance for chaining.
   */
  withStyles(...styles: string[]) {
    this.element.classList.add(...styles);
    return this;
  }

  /**
   * Adds an event listener to the element.
   * @param {string} type The type of the event.
   * @param {EventListenerOrEventListenerObject} listener The event listener.
   * @param {boolean | AddEventListenerOptions} [options] Options for the event.
   * @returns The current instance for chaining.
   */
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options: boolean | AddEventListenerOptions
  ) {
    this.element.addEventListener(type, listener, options);
    return this;
  }

  /**
   * Appedns the element to the parent element.
   * @param parent The parent element.
   * @returns The current instance for chaining.
   */
  appendTo(parent: Element) {
    parent.appendChild(this.element);
    return this;
  }

  /**
   * Builds the element.
   * @returns The built element.
   */
  build() {
    return this.element;
  }
}

/**
 * Constructs new HTML elements.
 */
export class ElementBuilder<K extends keyof HTMLElementTagNameMap> extends NodeBuilder {
  element: HTMLElementTagNameMap[K];

  /**
   * Constructs a new HTML element.
   */
  constructor(tagName: K) {
    super();
    this.element = document.createElement(tagName);
  }

  /**
   * Adds text to the element.
   * @param {string} textContent
   * @returns The current instance for chaining.
   */
  withText(textContent: string) {
    this.element.textContent = textContent;
    return this;
  }

  withData(name: string, value: string | number | boolean) {
    this.element.dataset[name] = String(value);
    return this;
  }

  /**
   * Builds the element.
   * @returns The built element.
   */
  build() {
    return this.element;
  }
}

/** Constructs new SVG elements. */
export class SVGBuilder extends NodeBuilder {
  element: SVGSVGElement;
  /**
   * Constructs a new SVG element.
   * @param viewBox View box.
   */
  constructor(viewBox: string) {
    super();
    this.element = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.element.setAttribute("viewBox", viewBox);
  }

  /**
   * Adds a path to the SVG.
   * @param {Object.<string, string>} pathDefinition An object containing path attributes and their values.
   * @returns The current instance for chaining.
   */
  addPath(pathDefinition: { [s: string]: string }) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    for (const [key, value] of Object.entries(pathDefinition)) {
      path.setAttribute(key, value);
    }
    this.element.appendChild(path);
  }
}

// https://jsfiddle.net/12aueufy/1/
const shakingElements: HTMLElement[] = [];

export function shake(
  element: HTMLElement,
  magnitude: number = 16,
  numberOfShakes: number = 15,
  angular: boolean = false
) {
  if (!element) return;

  //First set the initial tilt angle to the right (+1)
  let tiltAngle = 1;

  //A counter to count the number of shakes
  let counter = 1;

  //The total number of shakes (there will be 1 shake per frame)

  //Capture the element's position and angle so you can
  //restore them after the shaking has finished
  const startX = 0,
    startY = 0,
    startAngle = 0;

  // Divide the magnitude into 10 units so that you can
  // reduce the amount of shake by 10 percent each frame
  const magnitudeUnit = magnitude / numberOfShakes;

  //The `randomInt` helper function
  const randomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  //Add the element to the `shakingElements` array if it
  //isn't already there

  if (shakingElements.indexOf(element) === -1) {
    //console.log("added")
    shakingElements.push(element);

    //Add an `updateShake` method to the element.
    //The `updateShake` method will be called each frame
    //in the game loop. The shake effect type can be either
    //up and down (x/y shaking) or angular (rotational shaking).
    if (angular) {
      angularShake();
    } else {
      upAndDownShake();
    }
  }

  //The `upAndDownShake` function
  function upAndDownShake() {
    //Shake the element while the `counter` is less than
    //the `numberOfShakes`
    if (counter < numberOfShakes) {
      //Reset the element's position at the start of each shake
      element.style.transform = `translate(${startX}px, ${startY}px)`;

      //Reduce the magnitude
      magnitude -= magnitudeUnit;

      //Randomly change the element's position
      const randomX = randomInt(-magnitude, magnitude);
      const randomY = randomInt(-magnitude, magnitude);

      element.style.transform = `translate(${randomX}px, ${randomY}px)`;

      //Add 1 to the counter
      counter += 1;

      requestAnimationFrame(upAndDownShake);
    }

    //When the shaking is finished, restore the element to its original
    //position and remove it from the `shakingElements` array
    if (counter >= numberOfShakes) {
      element.style.transform = `translate(${startX}, ${startY})`;
      shakingElements.splice(shakingElements.indexOf(element), 1);
    }
  }

  //The `angularShake` function
  function angularShake() {
    if (counter < numberOfShakes) {
      //Reset the element's rotation
      element.style.transform = `rotate(${startAngle}deg)`;

      //Reduce the magnitude
      magnitude -= magnitudeUnit;

      //Rotate the element left or right, depending on the direction,
      //by an amount in radians that matches the magnitude
      const angle = Number(magnitude * tiltAngle).toFixed(2);

      element.style.transform = `rotate(${angle}deg)`;
      counter += 1;

      //Reverse the tilt angle so that the element is tilted
      //in the opposite direction for the next shake
      tiltAngle *= -1;

      requestAnimationFrame(angularShake);
    }

    //When the shaking is finished, reset the element's angle and
    //remove it from the `shakingElements` array
    if (counter >= numberOfShakes) {
      element.style.transform = `rotate(${startAngle}deg)`;
      shakingElements.splice(shakingElements.indexOf(element), 1);
    }
  }
}

export function getPlayerName(callback: (name: string, loggedIn: boolean) => void) {
  fetch("https://jstris.jezevec10.com/profile")
    .then((res) => {
      if (res.url.includes("/u/")) {
        const username = res.url.substring(res.url.indexOf("/u/") + 3);
        callback(username, true);
      } else {
        callback("", false);
      }
    })
    .catch((e) => {
      console.log(e);
      callback("", false);
    });
}

let notificationsSupported = false;

export function authNotification() {
  if (!window.Notification) {
    notificationsSupported = false;
  } else if (Notification.permission != "granted") {
    Notification.requestPermission()
      .then((permission: NotificationPermission) => {
        if (permission === "granted") {
          notificationsSupported = true;
        } else {
          console.log("User has blocked notifications.");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  } else {
    notificationsSupported = true;
  }
}

export function notify(title: string, body: string) {
  if (notificationsSupported) {
    new Notification(title, {
      body: body,
      icon: "https://jstrisplus.github.io/jstris-plus-assets/logo.png",
    });
  }
}
