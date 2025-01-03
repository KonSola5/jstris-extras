import { Config } from "./index.js";

const FETCH_URL = "https://raw.githubusercontent.com/JstrisPlus/jstris-plus-assets/main/presets/skinPresets.json";
export let CUSTOM_SKIN_PRESETS = [];
export const fetchSkinPresets = () => {
  fetch(FETCH_URL, { cache: "reload" })
    .then((e) => e.json())
    .then((j) => {
      CUSTOM_SKIN_PRESETS = j;
      for (let i of CUSTOM_SKIN_PRESETS) {
        let option = document.createElement("option");
        option.value = JSON.stringify(i);
        option.textContent = i.name;
        dropdown.appendChild(option);
      }
    });
};

export const CUSTOM_SKIN_PRESET_ELEMENT = document.createElement("div");
CUSTOM_SKIN_PRESET_ELEMENT.className = "settings-inputRow";
CUSTOM_SKIN_PRESET_ELEMENT.innerHTML += "<b>Custom skin presets</b>";

const dropdown = document.createElement("select");
dropdown.innerHTML += "<option>Select...</option>";

dropdown.addEventListener("change", () => {
  var { url, ghostUrl } = JSON.parse(dropdown.value);

  document.getElementById("customSkinURL").value = url || "";
  Config.set("customSkinURL", url || "");
  document.getElementById("customGhostSkinURL").value = ghostUrl || "";
  Config.set("customGhostSkinURL", ghostUrl || "");
  dropdown.selectedIndex = 0;
});

CUSTOM_SKIN_PRESET_ELEMENT.appendChild(dropdown);
