export default defineContentScript({
  matches: ["*://*.jstris.jezevec10.com/*"],
  async main(ctx) {
    console.log("Injecting...");

    await injectScript("/injected.js", {
      keepInDom: true,
    });

    console.log("Injected!");

    const ui = createIntegratedUi(ctx, {
      position: "inline",
      anchor: "body",
      onMount: (container) => {
        const app: HTMLParagraphElement = document.createElement("p");
        app.textContent = "...";
        container.append(app);
      },
    });
    console.log("Hello content.");
    ui.mount();
  },
});
