type HTMLElements =
  | typeof HTMLAnchorElement
  | typeof HTMLElement
  | typeof HTMLAreaElement
  | typeof HTMLAudioElement
  | typeof HTMLBaseElement
  | typeof HTMLQuoteElement
  | typeof HTMLBodyElement
  | typeof HTMLBRElement
  | typeof HTMLButtonElement
  | typeof HTMLCanvasElement
  | typeof HTMLTableCaptionElement
  | typeof HTMLTableColElement
  | typeof HTMLDataElement
  | typeof HTMLDataListElement
  | typeof HTMLModElement
  | typeof HTMLDetailsElement
  | typeof HTMLDialogElement
  | typeof HTMLDivElement
  | typeof HTMLDListElement
  | typeof HTMLEmbedElement
  | typeof HTMLFieldSetElement
  | typeof HTMLFormElement
  | typeof HTMLHeadingElement
  | typeof HTMLHeadElement
  | typeof HTMLHRElement
  | typeof HTMLHtmlElement
  | typeof HTMLIFrameElement
  | typeof HTMLImageElement
  | typeof HTMLInputElement
  | typeof HTMLLabelElement
  | typeof HTMLLegendElement
  | typeof HTMLLIElement
  | typeof HTMLLinkElement
  | typeof HTMLMapElement
  | typeof HTMLMenuElement
  | typeof HTMLMetaElement
  | typeof HTMLMeterElement
  | typeof HTMLObjectElement
  | typeof HTMLOListElement
  | typeof HTMLOptGroupElement
  | typeof HTMLOptionElement
  | typeof HTMLOutputElement
  | typeof HTMLParagraphElement
  | typeof HTMLPictureElement
  | typeof HTMLPreElement
  | typeof HTMLProgressElement
  | typeof HTMLScriptElement
  | typeof HTMLSelectElement
  | typeof HTMLSlotElement
  | typeof HTMLSourceElement
  | typeof HTMLSpanElement
  | typeof HTMLStyleElement
  | typeof HTMLTableElement
  | typeof HTMLTableSectionElement
  | typeof HTMLTableCellElement
  | typeof HTMLTemplateElement
  | typeof HTMLTextAreaElement
  | typeof HTMLTimeElement
  | typeof HTMLTitleElement
  | typeof HTMLTableRowElement
  | typeof HTMLTrackElement
  | typeof HTMLUListElement
  | typeof HTMLVideoElement;

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

export function assertType<Type extends HTMLElements>(
  element: Node | null | undefined,
  type: Type
): asserts element is InstanceType<Type> {
  if (!element) throw new Error("Element not found.");
  if (!(element instanceof type)) {
    throw new Error(`Expected the element to be a ${type.name}, got ${element.constructor.name}.`);
  }
}

export function assert<Type extends HTMLElements>(
  element: Node | null | undefined,
  type: Type
): InstanceType<Type> {
  assertType(element, type);
  return element;
}
