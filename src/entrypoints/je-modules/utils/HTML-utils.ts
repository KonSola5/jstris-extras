const HTMLTagNames = {
  a: HTMLAnchorElement,
  abbr: HTMLElement,
  address: HTMLElement,
  area: HTMLAreaElement,
  article: HTMLElement,
  aside: HTMLElement,
  audio: HTMLAudioElement,
  b: HTMLElement,
  base: HTMLBaseElement,
  bdi: HTMLElement,
  bdo: HTMLElement,
  blockquote: HTMLQuoteElement,
  body: HTMLBodyElement,
  br: HTMLBRElement,
  button: HTMLButtonElement,
  canvas: HTMLCanvasElement,
  caption: HTMLTableCaptionElement,
  cite: HTMLElement,
  code: HTMLElement,
  col: HTMLTableColElement,
  colgroup: HTMLTableColElement,
  data: HTMLDataElement,
  datalist: HTMLDataListElement,
  dd: HTMLElement,
  del: HTMLModElement,
  details: HTMLDetailsElement,
  dfn: HTMLElement,
  dialog: HTMLDialogElement,
  div: HTMLDivElement,
  dl: HTMLDListElement,
  dt: HTMLElement,
  em: HTMLElement,
  embed: HTMLEmbedElement,
  fieldset: HTMLFieldSetElement,
  figcaption: HTMLElement,
  figure: HTMLElement,
  footer: HTMLElement,
  form: HTMLFormElement,
  h1: HTMLHeadingElement,
  h2: HTMLHeadingElement,
  h3: HTMLHeadingElement,
  h4: HTMLHeadingElement,
  h5: HTMLHeadingElement,
  h6: HTMLHeadingElement,
  head: HTMLHeadElement,
  header: HTMLElement,
  hgroup: HTMLElement,
  hr: HTMLHRElement,
  html: HTMLHtmlElement,
  i: HTMLElement,
  iframe: HTMLIFrameElement,
  img: HTMLImageElement,
  input: HTMLInputElement,
  ins: HTMLModElement,
  kbd: HTMLElement,
  label: HTMLLabelElement,
  legend: HTMLLegendElement,
  li: HTMLLIElement,
  link: HTMLLinkElement,
  main: HTMLElement,
  map: HTMLMapElement,
  mark: HTMLElement,
  menu: HTMLMenuElement,
  meta: HTMLMetaElement,
  meter: HTMLMeterElement,
  nav: HTMLElement,
  noscript: HTMLElement,
  object: HTMLObjectElement,
  ol: HTMLOListElement,
  optgroup: HTMLOptGroupElement,
  option: HTMLOptionElement,
  output: HTMLOutputElement,
  p: HTMLParagraphElement,
  picture: HTMLPictureElement,
  pre: HTMLPreElement,
  progress: HTMLProgressElement,
  q: HTMLQuoteElement,
  rp: HTMLElement,
  rt: HTMLElement,
  ruby: HTMLElement,
  s: HTMLElement,
  samp: HTMLElement,
  script: HTMLScriptElement,
  search: HTMLElement,
  section: HTMLElement,
  select: HTMLSelectElement,
  slot: HTMLSlotElement,
  small: HTMLElement,
  source: HTMLSourceElement,
  span: HTMLSpanElement,
  strong: HTMLElement,
  style: HTMLStyleElement,
  sub: HTMLElement,
  summary: HTMLElement,
  sup: HTMLElement,
  table: HTMLTableElement,
  tbody: HTMLTableSectionElement,
  td: HTMLTableCellElement,
  template: HTMLTemplateElement,
  textarea: HTMLTextAreaElement,
  tfoot: HTMLTableSectionElement,
  th: HTMLTableCellElement,
  thead: HTMLTableSectionElement,
  time: HTMLTimeElement,
  title: HTMLTitleElement,
  tr: HTMLTableRowElement,
  track: HTMLTrackElement,
  u: HTMLElement,
  ul: HTMLUListElement,
  var: HTMLElement,
  video: HTMLVideoElement,
  wbr: HTMLElement,
} as const;

interface MapFromObject<Props extends { [key in keyof Props]: Props[key] }>
  extends Map<keyof Props, Props[keyof Props]> {
  get<K extends keyof Props>(key: K): Props[K];
  set<K extends keyof Props>(key: K, value: Props[K]): this;
  has<K extends keyof Props>(key: K): boolean;
  delete<K extends keyof Props>(key: K): boolean;
  forEach<K extends keyof Props>(
    callbackfn: (value: Props[K], key: K, map: Map<K, Props[K]>) => void,
    thisArg?: unknown
  ): void;
  clear(): void;
  entries<K extends keyof Props>(): MapIterator<[K, Props[K]]>;
  keys<K extends keyof Props>(): MapIterator<K>;
  values<K extends keyof Props>(): MapIterator<Props[K]>;
  [Symbol.iterator]<K extends keyof Props>(): MapIterator<[K, Props[K]]>;
}

const HTMLTagNameMap = new NativeMap(Object.entries(HTMLTagNames)) as MapFromObject<typeof HTMLTagNames>;

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

export function assertElementType<Type extends keyof HTMLElementTagNameMap>(
  element: Element,
  type: Type
): asserts element is HTMLElementTagNameMap[Type] {
  if (!element) throw new Error("Element not found.");
  if (!(element instanceof HTMLTagNameMap.get(type))) {
    throw new Error(`Expected the element to be a ${HTMLTagNameMap.get(type)}, got ${element.constructor.name}.`);
  }
}
