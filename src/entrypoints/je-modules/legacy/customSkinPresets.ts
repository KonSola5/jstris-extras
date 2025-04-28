// import { Config } from "../jstris-extras.js";

// interface Skin {
//   name: string;
//   url: string;
//   ghostUrl?: string;
// }

// const FETCH_URL = "https://raw.githubusercontent.com/JstrisPlus/jstris-plus-assets/main/presets/skinPresets.json";
// export let CUSTOM_SKIN_PRESETS: Skin[] = [];
// export const fetchSkinPresets = () => {
//   fetch(FETCH_URL, { cache: "reload" })
//     .then((response: Response): Promise<Skin[]> => response.json())
//     .then((json: Skin[]): void => {
//       CUSTOM_SKIN_PRESETS = json;
//       for (const i of CUSTOM_SKIN_PRESETS) {
//         const option: HTMLOptionElement = document.createElement("option");
//         option.value = JSON.stringify(i);
//         option.textContent = i.name;
//         dropdown.appendChild(option);
//       }
//     });
// };

// export const CUSTOM_SKIN_PRESET_ELEMENT: HTMLDivElement = document.createElement("div");
// CUSTOM_SKIN_PRESET_ELEMENT.className = "settings-inputRow";
// CUSTOM_SKIN_PRESET_ELEMENT.innerHTML += "<b>Custom skin presets</b>";

// const dropdown: HTMLSelectElement = document.createElement("select");
// dropdown.innerHTML += "<option>Select...</option>";

// dropdown.addEventListener("change", () => {
//   const { url, ghostUrl } = JSON.parse(dropdown.value);

//   (document.getElementById("customSkinURL") as HTMLInputElement).value = url || "";
//   Config.set("customSkinURL", url || "");
//   (document.getElementById("customGhostSkinURL") as HTMLInputElement).value = ghostUrl || "";
//   Config.set("customGhostSkinURL", ghostUrl || "");
//   dropdown.selectedIndex = 0;
// });

// CUSTOM_SKIN_PRESET_ELEMENT.appendChild(dropdown);
