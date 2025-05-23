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
    options?: boolean | AddEventListenerOptions
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
   * Appedns the child element to this element.
   * @param child The child element.
   * @returns The current instance for chaining.
   */
    append(child: Element) {
      this.element.appendChild(child);
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
