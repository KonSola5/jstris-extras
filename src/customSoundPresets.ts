import { Config } from "./index.js";

interface SoundDefinition {
  name?: string;
  rotate?: string;
  land?: string;
  harddrop?: string;
  lock?: string;
  ready?: string;
  go?: string;
  died?: string;
  hold?: string;
  move?: string;
  golive?: string;
  b2b?: string;
  comboTones?: (string | null)[];
  scoring?: {
    SOFT_DROP?: string;
    HARD_DROP?: string;
    CLEAR1?: string;
    CLEAR2?: string;
    CLEAR3?: string;
    CLEAR4?: string;
    CLEAR5?: string;
    TSPIN?: string;
    TSPIN_MINI?: string;
    TSPIN_MINI_SINGLE?: string;
    TSPIN_SINGLE?: string;
    TSPIN_DOUBLE?: string;
    TSPIN_TRIPLE?: string;
    PERFECT_CLEAR?: string;
  };
  specialScoring?: {
    ALLSPIN?: SpecialScoring[];
    CLEAR4?: SpecialScoring[];
    CLEAR5?: SpecialScoring[];
    TSPIN_MINI_SINGLE?: SpecialScoring[];
    TSPIN_SINGLE?: SpecialScoring[];
    TSPIN_DOUBLE?: SpecialScoring[];
    TSPIN_TRIPLE?: SpecialScoring[];
  };
}

interface SpecialScoring {
  url: string;
  b2b: boolean;
  override?: boolean;
}

const FETCH_URL = "https://raw.githubusercontent.com/JstrisPlus/jstris-plus-assets/main/presets/soundPresets.json";

export let CUSTOM_SOUND_PRESETS: SoundDefinition[] = [];
export const fetchSoundPresets = () => {
  fetch(FETCH_URL, { cache: "reload" })
    .then((response: Response): Promise<SoundDefinition[]> => response.json())
    .then((json: SoundDefinition[]) => {
      CUSTOM_SOUND_PRESETS = json;
      for (const preset of CUSTOM_SOUND_PRESETS) {
        const option: HTMLOptionElement = document.createElement("option");
        option.value = JSON.stringify(preset);
        option.textContent = preset.name || "";
        dropdown.appendChild(option);
      }
    });
};

export const CUSTOM_SOUND_PRESET_ELEMENT: HTMLDivElement = document.createElement("div");
CUSTOM_SOUND_PRESET_ELEMENT.className = "settings-inputRow";
CUSTOM_SOUND_PRESET_ELEMENT.innerHTML += "<b>Custom sound presets</b>";

const dropdown: HTMLSelectElement = document.createElement("select");
dropdown.innerHTML += "<option>Select...</option>";

dropdown.addEventListener("change", () => {
  (document.getElementById("customSFX_JSON") as HTMLTextAreaElement).value = dropdown.value;
  Config.set("customSFX_JSON", dropdown.value);

  dropdown.selectedIndex = 0;
});

CUSTOM_SOUND_PRESET_ELEMENT.appendChild(dropdown);
