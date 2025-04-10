import { Config } from "../jstris-extras.js";

const changeBG = (link: string): void => {
  console.log("Changing BG to " + link);
  const app = document.getElementById("BG_only") as HTMLDivElement | null;
  if (app) {
    app.style.backgroundImage = `url(${link})`;
    app.style.backgroundSize = "cover";
  }
};

export const initLayout = (): void => {
  changeBG(Config.get("backgroundURL"));
  Config.onChange("backgroundURL", (value: string) => {
    changeBG(value);
  });
  console.log("Layout loaded.");
};
