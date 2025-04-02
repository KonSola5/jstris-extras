import '~/assets/style.css';
import '~/assets/custom-game-style.css';

export default defineContentScript({
  matches: ["*://*.jstris.jezevec10.com/*"],
  async main(ctx) {
    console.log("Injecting Jstris Extras...");
    const startTime = performance.now();
    await injectScript("/jstris-extras.js", {
      keepInDom: true,
    });

    console.log(`Jstris Extras injected in ${Math.round(performance.now() - startTime)/1000} s.`);

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
