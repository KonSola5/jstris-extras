import { Config } from "../jstris-extras.js";
import { IConfig } from "./config.js";

export function initSidebar() {
  function openSubmenu(submenuElement: HTMLElement) {
    submenuElement.classList.remove("submenu-hidden");
    sidebarMainDiv.classList.add("sidebarMain-hidden");
  }

  function closeSubmenu(submenuElement: HTMLElement) {
    submenuElement.classList.add("submenu-hidden");
    sidebarMainDiv.classList.remove("sidebarMain-hidden");
  }

  // Sidebar skeleton
  const sidebar = document.createDocumentFragment();

  const sidebarDiv = document.createElement("div");
  sidebarDiv.id = "sidebar";
  sidebarDiv.classList.add("sidebar", "noAnimation");
  sidebar.append(sidebarDiv);

  const sidebarHeaderDiv = document.createElement("div");
  sidebarHeaderDiv.id = "sidebarHeader";
  sidebarHeaderDiv.classList.add("sidebarHeader");
  sidebarDiv.append(sidebarHeaderDiv);

  const title = document.createElement("h1");
  title.textContent = "Jstris Extras";
  sidebarHeaderDiv.append(title);

  const closeButton = document.createElement("a");
  closeButton.onclick = (_event: MouseEvent) => {
    sidebarDiv.classList.remove("sidebar-shown");
  };
  closeButton.classList.add("closebtn");

  const closeBtnSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  closeBtnSVG.setAttribute("viewBox", "0 0 24 24");
  closeButton.append(closeBtnSVG);
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("fill-rule", "evenodd");
  path.setAttribute("style", "fill:currentColor;stroke:currentColor;");
  path.setAttribute(
    "d",
    "m13.414 12 5.293-5.293a.999.999 0 1 0-1.414-1.414L12 10.586 6.707 5.293a.999.999 0 1 0-1.414 1.414L10.586 12l-5.293 5.293a.999.999 0 1 0 1.414 1.414L12 13.414l5.293 5.293a.997.997 0 0 0 1.414 0 1 1 0 0 0 0-1.414z"
  );
  closeBtnSVG.append(path);

  sidebarHeaderDiv.append(closeButton);

  const sidebarContentDiv = document.createElement("div");
  sidebarContentDiv.id = "sidebarContent";
  sidebarContentDiv.classList.add("sidebarContent");
  sidebarDiv.append(sidebarContentDiv);

  const sidebarMainDiv = document.createElement("div");
  sidebarMainDiv.id = "sidebarMain";
  sidebarMainDiv.classList.add("sidebarMain");
  sidebarContentDiv.appendChild(sidebarMainDiv);

  const sidebarFooterDiv = document.createElement("div");
  sidebarFooterDiv.id = "sidebarFooter";
  sidebarFooterDiv.classList.add("sidebarFooter");
  sidebarDiv.append(sidebarFooterDiv);

  const aboutButton = document.createElement("a");
  aboutButton.classList.add("sidebarButton");
  // aboutButton.textContent = "About";
  sidebarFooterDiv.append(aboutButton);

  // Submenu-creating class that allows chaining methods
  class Submenu {
    id: string;
    submenu: DocumentFragment;
    submenuDiv: HTMLDivElement;
    submenuButton: HTMLAnchorElement;
    submenuContent: HTMLDivElement;

    constructor(id: string, displayName: string) {
      this.id = id;

      this.submenu = document.createDocumentFragment();

      this.submenuDiv = document.createElement("div");
      this.submenuDiv.id = id;
      this.submenuDiv.classList.add("submenu", "submenu-hidden");
      this.submenu.append(this.submenuDiv);

      this.submenuButton = document.createElement("a");
      this.submenuButton.classList.add("sidebarButton");
      this.submenuButton.onclick = (_event: MouseEvent) => {
        openSubmenu(this.submenuDiv);
      };
      this.submenuButton.textContent = displayName;
      sidebarMainDiv.append(this.submenuButton);

      const submenuNavigation = document.createElement("div");
      submenuNavigation.classList.add("submenuNavigation");
      this.submenuDiv.append(submenuNavigation);

      const closeSubmenuButton = document.createElement("a");
      closeSubmenuButton.classList.add("closeSubmenuBtn");
      closeSubmenuButton.onclick = (_event: MouseEvent) => {
        closeSubmenu(this.submenuDiv);
      };
      closeSubmenuButton.textContent = "\u25C2 Back";
      submenuNavigation.append(closeSubmenuButton);

      const header = document.createElement("h2");
      header.textContent = displayName;
      submenuNavigation.append(header);

      this.submenuContent = document.createElement("div");
      this.submenuContent.classList.add("submenuContent");
      this.submenuDiv.append(this.submenuContent);
    }

    addSectionTitle(title: string) {
      const sectionTitle = document.createElement("h3");
      sectionTitle.textContent = title;
      this.submenuContent.append(sectionTitle);
      return this;
    }

    addHorizontalRule() {
      this.submenuContent.append(document.createElement("hr"));
      return this;
    }

    /**
     * Adds a new checkbox input to the submenu.
     * @param id - ID of the checkbox input - should match the setting name in Config.
     * @param label - The label for the checkbox input
     * @param description - The description of the input written below.
     * @param disabled - Optional - specifies whether the input is disabled or not. Defaults to `false`.
     * @returns This.
     */
    addCheckboxInput(id: keyof IConfig, label: string, description: string, disabled: boolean = false) {
      const userInput = document.createElement("div");
      userInput.classList.add("userInput");
      this.submenuContent.append(userInput);

      const flexbox = document.createElement("div");
      userInput.append(flexbox);

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = id;
      checkbox.checked = Boolean(Config.settings.get(id) ?? false);
      checkbox.disabled = disabled;
      flexbox.append(checkbox);

      checkbox.addEventListener("change", (_event: Event) => {
        Config.set(id, checkbox.checked);
      });

      const labelElement = document.createElement("label");
      labelElement.htmlFor = id;
      labelElement.textContent = label;
      flexbox.append(labelElement);

      const smallText = document.createElement("small");
      smallText.textContent = description;
      userInput.append(smallText);

      return this;
    }

    /**
     * Adds a new text input to the submenu.
     * @param id - ID of the text input - should match the setting name in Config.
     * @param label - The label for the text input.
     * @param description - The description of the input written below.
     * @param disabled - Optional - specifies whether the input is disabled or not. Defaults to `false`.
     * @returns This.
     */
    addTextInput(id: keyof IConfig, label: string, description: string, disabled: boolean = false) {
      const userInput = document.createElement("div");
      userInput.classList.add("userInput");
      this.submenuContent.append(userInput);

      const flexbox = document.createElement("div");
      userInput.append(flexbox);

      const labelElement = document.createElement("label");
      labelElement.htmlFor = id;
      labelElement.textContent = label;
      flexbox.append(labelElement);

      const textbox = document.createElement("input");
      textbox.type = "text";
      textbox.id = id;
      textbox.value = String(Config.settings.get(id) ?? "");
      textbox.disabled = disabled;
      flexbox.append(textbox);

      textbox.addEventListener("change", (_event: Event) => {
        Config.set(id, textbox.value);
      });

      const smallText = document.createElement("small");
      smallText.textContent = description;
      userInput.append(smallText);

      return this;
    }

    /**
     * Adds a new radio input group to the submenu.
     * @param groupID - The group ID. IDs of the options will be derived from the option names.
     * @param label - The label of the radio group.
     * @param optionArray - Displayed option names.
     * @param disabledArray - Optional - Specifies, which options are disabled. Defaults to all options enabled.
     * @returns This.
     */
    addRadioInput(
      groupID: string,
      label: string,
      description: string,
      optionArray: string[],
      disabledArray: boolean[] = Array(optionArray.length).fill(false)
    ) {
      const userInput = document.createElement("div");
      userInput.classList.add("userInput");
      this.submenuContent.append(userInput);

      const span = document.createElement("span");
      span.textContent = label;
      userInput.append(label);

      optionArray.forEach((option, i) => {
        const flexbox = document.createElement("div");
        userInput.append(flexbox);

        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = groupID;
        radio.id = `${groupID}-${option.toLowerCase().replace(/ /g, "-")}`;
        radio.disabled = disabledArray[i];
        flexbox.append(radio);

        const labelElement = document.createElement("label");
        labelElement.htmlFor = `${groupID}-${option.toLowerCase().replace(/ /g, "-")}`;
        labelElement.textContent = option;
        flexbox.append(labelElement);
      });

      const smallText = document.createElement("small");
      smallText.textContent = description;
      userInput.append(smallText);

      return this;
    }

    addSliderInput(
      id: keyof IConfig,
      label: string,
      min: number,
      max: number,
      step: number,
      type: string,
      description: string,
      disabled: boolean = false
    ) {
      const userInput = document.createElement("div");
      userInput.classList.add("userInput");
      this.submenuContent.append(userInput);

      const flexbox = document.createElement("div");
      userInput.append(flexbox);

      const labelElement = document.createElement("label");
      labelElement.htmlFor = id;
      labelElement.textContent = label;
      flexbox.append(labelElement);

      const slider = document.createElement("input");
      slider.type = "range";
      slider.id = id;
      slider.min = String(min);
      slider.max = String(max);
      slider.step = String(step);
      slider.value = String(Config.settings.get(id) ?? "");

      slider.disabled = disabled;
      flexbox.append(slider);

      const valueSpan = document.createElement("span");
      valueSpan.classList.add("value", type);
      valueSpan.id = `${id}Value`;
      valueSpan.textContent = type == "percentage" ? slider.value : Number(slider.value).toFixed(2);
      flexbox.append(valueSpan);

      slider.addEventListener("input", (_event) => {
        valueSpan.textContent = type == "percentage" ? slider.value : Number(slider.value).toFixed(2);
      });

      slider.addEventListener("change", (_event) => {
        Config.set(id, slider.value);
      });

      const smallText = document.createElement("small");
      smallText.textContent = description;
      userInput.append(smallText);

      return this;
    }

    addPasteInput(id: keyof IConfig, label: string, description: string, disabled: boolean = false) {
      const userInput = document.createElement("div");
      userInput.classList.add("userInput");
      this.submenuContent.append(userInput);

      const span = document.createElement("span");
      span.textContent = label;
      userInput.append(label);

      const hiddenInput = document.createElement("input");
      hiddenInput.type = "hidden";
      hiddenInput.id = `${id}Value`;
      hiddenInput.value = String(Config.settings.get(id) ?? "");
      userInput.append(hiddenInput);

      const dragDropArea = document.createElement("div");
      dragDropArea.classList.add("dragDropArea");
      dragDropArea.id = `${id}Area`;
      dragDropArea.textContent = "Drag and drop a JSON file here!\nOr click here to paste from clipboard.";

      userInput.append(dragDropArea);

      const statusDiv = document.createElement("div");
      statusDiv.classList.add("status");
      userInput.append(statusDiv);

      const validity = document.createElement("span");
      validity.id = `${id}Validity`;
      const selection = document.createElement("b");
      selection.id = `${id}Selection`;

      statusDiv.append(validity, selection);

      dragDropArea.addEventListener("dragenter", (_event) => {
        if (dragDropArea.classList.contains("dragDropArea")) {
          dragDropArea.classList.add("dragover");
        }
      });

      dragDropArea.addEventListener("dragleave", (_event) => {
        if (dragDropArea.classList.contains("dragDropArea")) {
          dragDropArea.classList.remove("dragover");
        }
      });

      dragDropArea.addEventListener("dragover", (event) => {
        event.preventDefault();
      });

      function dropHandler(event: DragEvent) {
        function tryParseText(text: string) {
          try {
            const json: object & { name?: string } = JSON.parse(text);
            hiddenInput.value = text;
            Config.set(id, text);
            validity.textContent = "Currently loaded:";
            selection.textContent = json.name ?? "Unnamed Sound Pack";
          } catch (error) {
            if (error instanceof Error) {
              console.error(`An error occured while parsing file data to JSON:
                ${error.message}`);
              validity.textContent = "Invalid JSON!";
              selection.textContent = "";
            }
          }
        }

        if (dragDropArea.classList.contains("dragDropArea")) {
          dragDropArea.classList.remove("dragover");
        }

        if (event.dataTransfer?.items) {
          // Use DataTransferItemList interface to access the file(s)
          if (event.dataTransfer.items.length != 1) {
            validity.textContent = "Only 1 item at a time, please!";
            selection.textContent = "";
          }
          const item = event.dataTransfer.items[0];
          if (item.kind !== "file") {
            validity.textContent = "This isn't a file.";
            selection.textContent = "";
          } else {
            item
              .getAsFile()!
              .text()
              .then((text: string) => {
                tryParseText(text);
              });
          }
        } else {
          // Use DataTransfer interface to access the file(s)
          if (event.dataTransfer?.files.length != 1) {
            validity.textContent = "Only 1 file at a time, please!";
            selection.textContent = "";
          } else {
            const file = event.dataTransfer.files[0];
            file.text().then((text: string) => {
              tryParseText(text);
            });
          }
        }

        event.preventDefault();
      }

      dragDropArea.addEventListener("drop", dropHandler, false);

      dragDropArea.addEventListener("click", (event) => {
        navigator.clipboard
          .readText()
          .then((text) => {
            try {
              const json: object & { name?: string } = JSON.parse(text);
              hiddenInput.value = text;
              Config.set(id, text);
              validity.textContent = "Currently loaded:";
              selection.textContent = json.name ?? "Unnamed Sound Pack";
            } catch (error) {
              if (error instanceof Error) {
                console.error(`An error occured while parsing clipboard data to JSON:
                ${error.message}`);
                validity.textContent = "Invalid JSON!";
                selection.textContent = "";
              }
            }
          })
          .catch((error) => {
            if (error instanceof Error) {
              console.error(`An error occured while reading clipboard data:
                ${error.message}`);
                validity.textContent = "Paste error!";
                selection.textContent = "";
            }
          });
      });

      const smallText = document.createElement("small");
      smallText.textContent = description;
      userInput.append(smallText);

      return this;
    }

    addKeyInput(id: keyof IConfig, label: string, description: string, disabled: boolean = false) {}

    done(): DocumentFragment {
      return this.submenu;
    }
  }

  const visualSettingsSubmenu = new Submenu("visualSettings", "Visual Settings")
    .addSectionTitle("Piece Placement Animation")
    .addCheckboxInput("piecePlacementAnimationEnabled", "Enabled", "Enables the piece placement animation.")
    .addSliderInput(
      "piecePlacementAnimationLength",
      "Animation length:",
      0,
      1,
      0.1,
      "seconds",
      "Specifies the duration of the animation."
    )
    .addSliderInput(
      "piecePlacementAnimationOpacity",
      "Initial opacity:",
      0,
      100,
      1,
      "percentage",
      "Specifies at which opacity the animation starts from."
    )
    .addHorizontalRule()
    .addSectionTitle("Line Clear Animation")
    .addCheckboxInput("lineClearAnimationEnabled", "Enabled", "Enables the line clear animation.")
    .addSliderInput(
      "lineClearAnimationLength",
      "Animation length:",
      0,
      2,
      0.1,
      "seconds",
      "Specifies the duration of the animation (applies when there's no line clear delay)."
    )
    .addHorizontalRule()
    .addSectionTitle("Line Clear Shake")
    .addCheckboxInput(
      "lineClearShakeEnabled",
      "Enabled",
      "Enables the line clear shake.\nThe more attack you send, the stronger the shake is."
    )
    .addSliderInput(
      "lineClearShakeStrength",
      "Shake strength:",
      0,
      5,
      0.05,
      "times",
      "Specifies the multiplier for the line clear shake animation."
    )
    .addSliderInput(
      "lineClearShakeLength",
      "Animation length:",
      0,
      3,
      0.1,
      "seconds",
      "Specifies the duration of the animation."
    )
    .addHorizontalRule()
    .addSectionTitle("Action Text")
    .addCheckboxInput(
      "actionTextEnabled",
      "Enabled",
      "Enables the action text - pop-ups specifying the line clear/spin performed and the attack the action sent.\nDoes not work at the moment.",
      true
    )
    .done();

  const customizationSettingsSubmenu = new Submenu("customizationSettings", "Customization Settings")
    .addSectionTitle("Background")
    .addTextInput(
      "backgroundURL",
      "Background image:",
      "Insert the URL of your desired background image.\nLeave blank for no image."
    )
    .addHorizontalRule()
    .addSectionTitle("Block Skin")
    .addTextInput(
      "customSkinURL",
      "Block skin:",
      "Insert the URL of your desired block skin.\nTne skin will be only visible to you - not your opponents.\nLeave blank to use the skin selected in Jstris."
    )
    .addTextInput(
      "customGhostSkinURL",
      "Ghost skin:",
      "Insert the URL of your desired ghost block skin.\nThe skin will be only visible to you - not your opponents.\nLeave blank to use the skin selected in Jstris."
    )
    .addCheckboxInput("customSkinInReplays", "Use custom skin in replays", "All replays will use your custom skin.")
    .addHorizontalRule()
    .addSectionTitle("Keyboard OSD")
    .addCheckboxInput(
      "keyboardOSD",
      "Enabled",
      "Enables the keyboard on-screen display - displays your inputs and the amount of keypresses per second."
    )
    .done();

  const audioSettingsSubmenu = new Submenu("audioSettings", "Audio Settings")
    .addSectionTitle("Hear opponents")
    .addCheckboxInput(
      "opponentSFXEnabled",
      "Enabled",
      "Enables sound effects for opponents, allowing you to hear their actions. Works for rooms with up to 7 people."
    )
    .addSliderInput(
      "opponentSFXVolumeMultiplier",
      "Opponent SFX Volume:",
      0,
      100,
      1,
      "percentage",
      "The volume of opponent SFX to use in rooms of 3 to 7 people."
    )
    .addHorizontalRule()
    .addSectionTitle("Custom SFX")
    .addCheckboxInput(
      "customSFXEnabled",
      "Enabled",
      "Enables custom sound effects. Disabling this may require a refresh."
    )
    .addPasteInput(
      "customSFX_JSON",
      "Custom SFX data:",
      `Specifies the definition for custom sound effects. Refer to [this guide](WIP) to learn how to create custom SFX definitions.`
    )
    .addCheckboxInput(
      "customPieceSpawnSFXEnabled",
      "Enable piece spawn SFX",
      "Enables piece spawn SFX (if provided in the definition above). Voice Annotations in Jstris settings must be enabled for this to work."
    )
    .done();

  const customStatsSubmenu = new Submenu("customStats", "Custom Stats")
    .addSectionTitle("All Modes")
    .addCheckboxInput("statAPPEnabled", "Attack Per Piece", "Enables the Attack Per Piece stat.")
    .addCheckboxInput(
      "statPPDEnabled",
      "Pieces Per Downstack",
      "Enables the Pieces Per Downstack stat.\n(formula: garbageCleared/pieces)"
    )
    .addHorizontalRule()
    .addSectionTitle("Cheese Race")
    .addCheckboxInput(
      "statCheeseRacePiecePaceEnabled",
      "Piece Pace",
      "Enables the Piece Pace stat.\nShows the forecasted piece count at the end of the Cheese Race game based on your current piece count."
    )
    .addCheckboxInput(
      "statCheeseRaceTimePaceEnabled",
      "Time Pace",
      "Enables the Time Pace stat.\nShows the forecasted time at the end of the Cheese Race game based on your current time."
    )
    .addHorizontalRule()
    .addSectionTitle("Ultra")
    .addCheckboxInput("statUltraSPPEnabled", "Score Per Piece", "Enables the Score Per Piece stat.")
    .addCheckboxInput(
      "statUltraScorePaceEnabled",
      "Score Pace",
      "Enables the Score Pace stat.\nShows the forecasted score at the end of the Ultra game based on your current score."
    )
    .addHorizontalRule()
    .addSectionTitle("PC Mode")
    .addCheckboxInput(
      "statPCNumberEnabled",
      "Perfect Clear Number",
      "Enables the Perfect Clear Number stat.\nShows the currently performed Perfect Clear. Useful for PC looping!"
    )
    .done();

  const miscSettingsSubmenu = new Submenu("miscSettings", "Miscellaneous Settings")
    .addSectionTitle("Chat")
    .addCheckboxInput(
      "automaticReplayCodesEnabled",
      "Dump replays on reset",
      "When resetting, the replay from your previous game will be dumped into chat."
    )
    .addCheckboxInput("chatTimestampsEnabled", "Chat Timestamps", "Adds a timestamp for every chat message.")
    // .addKeyInput(
    // "toggleChatKey",
    // "Open Chat:",
    // "Choose a button to open chat. The hardcoded Enter key will still work."
    // )
    // .addKeyInput("closeChatKey", "Close Chat:", "Choose a button to close chat and give focus back to the game.")
    .addHorizontalRule()
    .addSectionTitle("Other")
    // .addKeyInput("undoKey", "Practice Mode: Undo:", "Choose a button to undo in Practice.")
    .done();

  sidebarContentDiv.append(
    visualSettingsSubmenu,
    customizationSettingsSubmenu,
    audioSettingsSubmenu,
    customStatsSubmenu,
    miscSettingsSubmenu
  );

  document.body.appendChild(sidebar);

  // For some reason, the animatons play when the sidebar is added, so this is a hack for it.
  setTimeout(() => {
    sidebarDiv.classList.remove("noAnimation");
  }, 1000);

  const settingsButton = document.createElement("img");
  settingsButton.src =
    "https://media.istockphoto.com/vectors/gear-icon-vector-illustration-vector-id857768248?k=6&m=857768248&s=170667a&w=0&h=p8E79IurGj0VrH8FO3l1-NXmMubUiShDW88xXynZpjE=";
  settingsButton.className = "settings-modalOpenButton";

  settingsButton.onclick = (event) => {
    sidebarDiv.classList.add("sidebar-shown");
  };

  document.body.appendChild(settingsButton);
}
