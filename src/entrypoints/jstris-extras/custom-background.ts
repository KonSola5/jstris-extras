import { Config } from "../jstris-extras.js";

const changeBG = (link: string): void => {
  console.log("Changing BG to " + link);
  document.body.style.backgroundImage = `url(${link})`;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundAttachment = "fixed";
};

export const initCustomBackground = (): void => {
  changeBG(Config.get("backgroundURL"));
  Config.onChange("backgroundURL", (value: string) => {
    changeBG(value);
  });
  console.log("Custom backgrond loaded.");
};
