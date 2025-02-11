import { Config } from "./index.ts";

const changeBG = (link) => {
  console.log("Changing BG to " + link);
  var app = document.getElementById("BG_only");
  app.style.backgroundImage = `url(${link})`;
  app.style.backgroundSize = "cover";
};

export const initLayout = () => {
  changeBG(Config.settings.backgroundURL);
  Config.onChange("backgroundURL", (value) => {
    changeBG(value);
  });
  console.log("Layout loaded.");
};
