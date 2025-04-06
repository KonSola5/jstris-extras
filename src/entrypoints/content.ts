import "~/assets/style.css";
import "~/assets/custom-game-style.css";

interface SetStorageRequest {
  key: string;
  value: unknown;
}

export default defineContentScript({
  matches: ["*://*.jstris.jezevec10.com/*"],
  async main(ctx) {
    console.log("[Jstris Extras Content Script]: Injecting Jstris Extras...");
    const startTime = performance.now();

    const config = await browser.storage.local.get(null);

    window.addEventListener("getStorageRequest", (event: Event) => {
      if (!(event instanceof CustomEvent)) return;
      if (event.detail === null) {
        if (import.meta.env.BROWSER === "firefox") { // Firefox can't pass objects to a webpage
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
