import "~/assets/style.css";
import "~/assets/custom-game-style.css";

interface SetStorageRequest {
  key: string;
  value: unknown;
}

export default defineContentScript({
  matches: ["*://*.jstris.jezevec10.com/*"],
  async main(_ctx) {
    console.log("[Jstris Extras Content Script]: Injecting Jstris Extras...");
    const startTime = performance.now();

    // Remove the stylesheet that sets black, !important background
    for (const child of document.head.children) {
      if (
        child.tagName == "STYLE" &&
        child.textContent &&
        /\s*body\s*\{\s*background:\s*black\s+!important;\s*}\s*/g.test(child.textContent)
      ) {
        child.remove();
      }
    }

    // Annoyingly, Jstris uses "display: block" style inline to show elements,
    // so listen to every mutation of inline style and change them to classes.
    // Except if that's a modal dialog in usermode creator, since for some reason attempts to turn this into classes
    // messes up the modal.
    const observer = new MutationObserver((mutations: MutationRecord[]) => {
      for (const mutation of mutations) {
        if (mutation.type == "attributes" && mutation.attributeName && mutation.target instanceof HTMLElement) {
          const element: HTMLElement = mutation.target;
          if (element.style.display == "block" && !element.classList.contains("modal")) {
            element.classList.remove("hidden");
            element.style.removeProperty("display");
          }
          if (element.style.display == "none" && !element.classList.contains("modal")) {
            element.classList.add("hidden");
            element.style.removeProperty("display");
          }

          // Annoyingly, Jstris also uses inline styles set with JavaScript to style game captions.
          // Give them classes to make them stylable with CSS.
          // If that's a game caption:
          if (element.classList.contains("gCapt")) {
            // A ton of magic numbers ahead!
            switch (true) {
              // If that's a loading caption:
              case element.style.opacity == "1" &&
                element.style.top == "214px" &&
                element.style.height == "125px" &&
                element.style.color == "white": {
                element.removeAttribute("style");
                element.classList.add("loading");
                break;
              }
              // If that's a "Ready? Go!" caption:
              case element.style.opacity == "1" &&
                element.style.top == "264px" &&
                element.style.height == "73px" &&
                element.style.color == "rgb(203, 214, 0)" &&
                element.style.fontWeight == "bold": {
                element.removeAttribute("style");
                element.classList.add("ready-go");
                break;
              }
              // If that's a "Spectator mode" caption
              case element.style.top == "288px" &&
                element.style.height == "73px" &&
                element.style.color == "rgb(203, 214, 0)": {
                element.removeAttribute("style");
                element.classList.add("spectator-mode");
                break;
              }
              // If that's either an "Out of focus" or game placement caption
              case element.style.top == "168px" &&
                element.style.height == "97px" &&
                element.style.color == "rgb(203, 214, 0)": {
                if (element.style.opacity == "0.91" && element.style.fontWeight == "bold") {
                  element.classList.add("game-place");
                } else {
                  element.classList.add("out-of-focus");
                }
                element.removeAttribute("style");
                break;
              }
              // If that's a "SLOW DOWN" caption
              case element.style.top == "216px" &&
                element.style.height == "97px" &&
                element.style.backgroundColor == "red" &&
                element.style.fontWeight == "bold": {
                element.removeAttribute("style");
                element.classList.add("speed-warning");
                break;
              }
              // If that's a "Map/Usermode loading" caption
              case element.style.opacity == "1" &&
                element.style.top == "266px" &&
                element.style.height == "69px" &&
                element.style.color == "white": {
                element.removeAttribute("style");
                element.classList.add("map-loading");
                break;
              }
              // If that's a "New personal best" caption
              case (element.style.opacity == "1" && element.style.paddingTop == "11px") ||
                element.classList.contains("pb"): {
                element.classList.add("pb");
                if (element.style.top == "168px" && element.style.height == "184px") {
                  element.removeAttribute("style");
                  element.classList.add("first-game");
                }
                if (element.style.top == "142px" && element.style.height == "235px") {
                  element.removeAttribute("style");
                  element.classList.remove("first-game");
                }
                break;
              }
              // If that's a game warning
              case element.style.top == "216px" &&
                element.style.paddingBottom == "15px" &&
                element.style.backgroundColor == "red" &&
                element.style.fontWeight == "bold": {
                element.removeAttribute("style");
                element.classList.add("warning");
                break;
              }
              // If that's a usermode task
              case element.style.top == "90px" &&
                element.style.color == "rgb(107, 180, 255)" &&
                element.style.fontWeight == "bold": {
                element.removeAttribute("style");
                element.classList.add("mode-info");
                break;
              }
              // If that's a "Usermode complete" caption
              case element.style.top == "272px" && element.style.color == "rgb(0, 219, 0)": {
                element.removeAttribute("style");
                element.classList.add("mode-complete");
                break;
              }
            }
          }
        }
      }
    });

    observer.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: ["style"],
    });

    const config = await browser.storage.local.get(null);

    window.addEventListener("getStorageRequest", (event: Event) => {
      if (!(event instanceof CustomEvent)) return;
      if (event.detail === null) {
        if (import.meta.env.BROWSER === "firefox") {
          // Firefox can't pass objects to a webpage
          window.dispatchEvent(new CustomEvent("getStorageResponse", { detail: JSON.stringify(config) }));
        } else {
          window.dispatchEvent(new CustomEvent("getStorageResponse", { detail: structuredClone(config) }));
        }
      }
    });

    window.addEventListener("setStorageRequest", (event: Event) => {
      if (!(event instanceof CustomEvent)) return;
      const request: SetStorageRequest = event.detail;
      if (typeof request.key == "string" && request.value) {
        browser.storage.local.set({ [event.detail.key]: event.detail.value }).then(() => {
          window.dispatchEvent(new CustomEvent("setStorageResponse", { detail: { status: "success" } }));
        });
      } else {
        window.dispatchEvent(
          new CustomEvent("setStorageResponse", {
            detail: { status: "failure", reason: new Error("Invalid request schema.") },
          })
        );
      }
    });

    await injectScript("/jstris-extras.js", {
      keepInDom: true,
    });

    console.log(
      `[Jstris Extras Content Script]: Jstris Extras injected in ${Math.round(performance.now() - startTime) / 1000} s.`
    );
  },
});
