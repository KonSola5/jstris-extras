export const lerp = (start, end, amount) => {
  return (1 - amount) * start + amount * end;
};

/**
 * Clamps a value between the given minimum and maximum value.
 * @param {number} value The value to clamp.
 * @param {number} min The minimum value.
 * @param {number} max The maximum value.
 * @returns The clamped value.
 */
export function clamp(value, min, max) {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

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

/**
 * Creates an SVG element.
 * @param {string[]} cssClassArray Array of CSS classes to apply to SVG.
 * @param {string} viewBox The SVG view box.
 * @param {object[]} pathArray Array of objects containing path attributes.
 * @returns The SVG element.
 */
export function createSVG(cssClassArray, viewBox, pathArray) {
  let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add(...cssClassArray);
  svg.setAttribute("viewBox", viewBox);
  let paths = [];
  pathArray.forEach(path => {
    let pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
    for (const [key, value] of Object.entries(path)) {
      pathElement.setAttribute(key, value)
    }
    paths.push(pathElement)
  });
  svg.append(...paths)
  return svg;
}

/**
 * Contains functions shared between various element builders.
 * @abstract
 */
class NodeBuilder {
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
  withID(id) {
    this.element.id = id;
    return this;
  }

  /**
   * Adds CSS classes to the element.
   * @param  {...string} styles CSS classes to give to the element.
   * @returns The current instance for chaining.
   */
  withStyles(...styles) {
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
  addEventListener(type, listener, options) {
    this.element.addEventListener(type, listener, options);
    return this;
  }

  /**
   * Appedns the element to the parent element.
   * @param {Node} parent The parent element.
   * @returns The current instance for chaining.
   */
  appendTo(parent) {
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
 * @template {keyof HTMLElementTagNameMap} K
 */
export class ElementBuilder extends NodeBuilder {
  /** @type {HTMLElementTagNameMap[K]} */ element;

  /**
   * Constructs a new HTML element.
   * @param {K} tagName
   */
  constructor(tagName) {
    super();
    this.element = document.createElement(tagName);
  }

  /**
   * Adds text to the element.
   * @param {string} textContent
   * @returns The current instance for chaining.
   */
  withText(textContent) {
    this.element.textContent = textContent;
    return this;
  }
}

/** Constructs new SVG elements. */
export class SVGBuilder extends NodeBuilder {
  element;
  /**
   * Constructs a new SVG element.
   * @param {string} viewBox View box.
   */
  constructor(viewBox) {
    super();
    this.element = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.element.setAttribute("viewBox", viewBox);
  }

  /**
   * Adds a path to the SVG.
   * @param {Object.<string, string>} pathDefinition An object containing path attributes and their values.
   * @returns The current instance for chaining.
   */
  addPath(pathDefinition) {
    let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    for (const [key, value] of Object.entries(pathDefinition)) {
      path.setAttribute(key, value);
    }
    this.element.appendChild(path);
  }
}

// https://jsfiddle.net/12aueufy/1/
var shakingElements = [];

export const shake = function (element, magnitude = 16, numberOfShakes = 15, angular = false) {
  if (!element) return;

  //First set the initial tilt angle to the right (+1)
  var tiltAngle = 1;

  //A counter to count the number of shakes
  var counter = 1;

  //The total number of shakes (there will be 1 shake per frame)

  //Capture the element's position and angle so you can
  //restore them after the shaking has finished
  var startX = 0,
    startY = 0,
    startAngle = 0;

  // Divide the magnitude into 10 units so that you can
  // reduce the amount of shake by 10 percent each frame
  var magnitudeUnit = magnitude / numberOfShakes;

  //The `randomInt` helper function
  var randomInt = (min, max) => {
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
      var randomX = randomInt(-magnitude, magnitude);
      var randomY = randomInt(-magnitude, magnitude);

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
      var angle = Number(magnitude * tiltAngle).toFixed(2);

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
};

// @params callback: (name: string , loggedIn: boolean) => {}
export const getPlayerName = (callback) => {
  fetch("https://jstris.jezevec10.com/profile")
    .then((res) => {
      if (res.url.includes("/u/")) {
        let username = res.url.substring(res.url.indexOf("/u/") + 3);
        callback(username, true);
      } else {
        callback("", false);
      }
    })
    .catch((e) => {
      console.log(e);
      callback("", false);
    });
};

let notificationsSupported = false;

export const authNotification = () => {
  if (!window.Notification) {
    notificationsSupported = false;
  } else if (Notification.permission != "granted") {
    Notification.requestPermission()
      .then((p) => {
        if (p === "granted") {
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
};

export const notify = (title, body) => {
  if (notificationsSupported) {
    new Notification(title, {
      body: body,
      icon: "https://jstrisplus.github.io/jstris-plus-assets/logo.png",
    });
  }
};