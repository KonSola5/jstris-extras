import { Config } from "./index.js";
import { setPlusSfx } from "./util";

const FETCH_URL = "https://raw.githubusercontent.com/JstrisPlus/jstris-plus-assets/main/presets/plusSoundPresets.json";

export let CUSTOM_PLUS_SOUND_PRESETS = [];
export const fetchPlusSoundPresets = () => {
  fetch(FETCH_URL, { cache: "reload" })
    .then((e) => e.json())
    .then((j) => {
      CUSTOM_PLUS_SOUND_PRESETS = j;
      for (let i of CUSTOM_PLUS_SOUND_PRESETS) {
        let option = document.createElement("option");
        option.value = JSON.stringify(i);
        option.textContent = i.name;
        dropdown.appendChild(option);
      }
    });
};

export const CUSTOM_PLUS_SOUND_PRESET_ELEMENT = document.createElement("div");
CUSTOM_PLUS_SOUND_PRESET_ELEMENT.className = "settings-inputRow";
CUSTOM_PLUS_SOUND_PRESET_ELEMENT.innerHTML += "<b>Custom Jstris+ sound presets</b>";

const dropdown = document.createElement("select");
dropdown.innerHTML += "<option>Select...</option>";

dropdown.addEventListener("change", () => {
  document.getElementById("customPlusSFX_JSON").value = dropdown.value;
  Config.set("customPlusSFX_JSON", dropdown.value);
  setPlusSfx(dropdown.value);

  dropdown.selectedIndex = 0;
});

CUSTOM_PLUS_SOUND_PRESET_ELEMENT.appendChild(dropdown);
