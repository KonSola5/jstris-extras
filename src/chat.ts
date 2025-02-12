import { Config } from "./index.js";
let chatListenerPresent: boolean = false;

export const initChat = () => {
  "use strict";

  // === show or hide chat timestamps code ===
  // showing timestamp logic is in css
  if (Config.settings.chatTimestampsEnabled) document.body.classList.add("show-chat-timestamps");
  Config.onChange("chatTimestampsEnabled", (value: boolean) => {
    if (value) {
      document.body.classList.add("show-chat-timestamps");
    } else {
      document.body.classList.remove("show-chat-timestamps");
    }
  });

  const oldReadyGo = Game.prototype.readyGo;
  Game.prototype.readyGo = function (...args) {
    addChatToggleEventListener(this);
    return oldReadyGo.apply(this, args);
  };

  // === toggle chat button code ===

  // document.getElementById("toggleChatKey_INPUT_ELEMENT").value = displayKey(Config.settings.toggleChatKey);
  // document.getElementById("closeChatKey_INPUT_ELEMENT").value = displayKey(Config.settings.closeChatKey);

  // thanks justin https://greasyfork.org/en/scripts/423192-change-chat-key

  function addChatToggleEventListener(game: Game): void {
    if (chatListenerPresent) return;
    chatListenerPresent = true;
    document.addEventListener("keydown", (event: KeyboardEvent) => {
      const key: string = event.code;
      if (key == Config.settings.toggleChatKey) {
        if (game && game.focusState !== 1) {
          // game already focused, unfocus
          game.setFocusState(1);
          setTimeout(function (): void {
            game.Live.chatInput.focus();
          }, 0); // setTimeout to prevent the key from being typed

          // if keys are same, should close chat in this case
        } else if (Config.settings.closeChatKey == Config.settings.toggleChatKey) {
          (document.getElementsByClassName("layer mainLayer gfxLayer")[0] as HTMLElement).click();
          (document.getElementsByClassName("layer mainLayer gfxLayer")[0] as HTMLElement).focus();
        }
      } else if (key == Config.settings.closeChatKey) {
        // focus game
        (document.getElementsByClassName("layer mainLayer gfxLayer")[0] as HTMLElement).click();
        (document.getElementsByClassName("layer mainLayer gfxLayer")[0] as HTMLElement).focus();
      }
    });
  }

  // === emote code ===

  const CUSTOM_EMOTES = [
    {
      u: "https://raw.githubusercontent.com/JstrisPlus/jstris-plus-assets/main/emotes/Cheese.png",
      t: "qep",
      g: "Jstris+",
      n: "MrCheese",
    },
    {
      u: "https://raw.githubusercontent.com/JstrisPlus/jstris-plus-assets/main/emotes/Cat.png",
      t: "jermy",
      g: "Jstris+",
      n: "CatUp",
    },
    {
      u: "https://raw.githubusercontent.com/JstrisPlus/jstris-plus-assets/main/emotes/Freg.png",
      t: "frog",
      g: "Jstris+",
      n: "FrogSad",
    },
    {
      u: "https://raw.githubusercontent.com/JstrisPlus/jstris-plus-assets/main/emotes/freycat.webp",
      t: "frey",
      g: "Jstris+",
      n: "freycat",
    },
    {
      u: "https://raw.githubusercontent.com/JstrisPlus/jstris-plus-assets/main/emotes/Blahaj.png",
      t: "jermy",
      g: "Jstris+",
      n: "StarHaj",
    },
    {
      u: "https://raw.githubusercontent.com/JstrisPlus/jstris-plus-assets/main/emotes/ThisIsFine.png",
      t: "jermy",
      g: "Jstris+",
      n: "fine",
    },
  ];
  const oldShowInChat = Live.prototype.showInChat;
  Live.prototype.showInChat = function (...args) {
    let zandria: string | HTMLDivElement | undefined = args[1];

    if (typeof zandria == "string") {
      zandria = zandria.replace(/:(.*?):/g, function (match: string): string {
        let cEmote: Emote | undefined = undefined;
        for (const emote of CUSTOM_EMOTES) {
          if (emote.n == match.split(":")[1]) {
            cEmote = emote;
            break;
          }
        }
        if (cEmote) {
          return `<img src='${cEmote.u}' class='emojiPlus' alt=':${cEmote.n}:'>`;
        }
        return match;
      });
    }
    args[1] = zandria;
    const val = oldShowInChat.apply(this, args);
    // Add Timestamps
    const chatTimestampSpan: HTMLSpanElement = document.createElement("span");
    chatTimestampSpan.className = "chat-timestamp";
    chatTimestampSpan.textContent = "[" + new Date().toTimeString().slice(0, 8) + "] ";
    const c: HTMLCollectionOf<Element> = document.getElementsByClassName("chl");
    c[c.length - 1].prepend(chatTimestampSpan);

    return val;
  };
  ChatAutocomplete.prototype.loadEmotesIndex = function () {
    if (!this.moreEmotesAdded) {
      const request = new XMLHttpRequest();
      const emotesURL = "/code/emotes?";
      request.timeout = 8000;
      request.open("GET", emotesURL, true);
      try {
        request.send();
      } catch (error) {
        console.error("There was an error whilst loading emotes:\n" + error);
      }
      request.ontimeout = function () {};
      request.onerror = request.onabort = function () {};
      request.onload = () => {
        if (request.status === 200) {
          let emoteList: EmoteList = JSON.parse(request.responseText);
          for (const emote of CUSTOM_EMOTES) {
            emoteList.unshift(emote);
          }
          if (this.preProcessEmotes !== null) {
            emoteList = this.preProcessEmotes!(emoteList);
          }
          this.addEmotes(emoteList);
          this.onEmoteObjectReady?.(emoteList);
        }
      };
    }
  };
  EmoteSelect.prototype.initializeContainers = function (): void {
    console.log(
      (this.groupEmotes["Jstris+"] =
        "https://raw.githubusercontent.com/JstrisPlus/jstris-plus-assets/main/emotes/freycat.webp")
    );
    this.searchElem = document.createElement("form");
    this.searchElem.classList.add("form-inline", "emoteForm");
    this.emoteElem.appendChild(this.searchElem);
    this.searchBar = document.createElement("input");
    this.searchBar.setAttribute("autocomplete", "off");
    this.searchBar.classList.add("form-control");
    this.searchBar.id = "emoteSearch";
    this.searchBar.addEventListener("input", () => {
      this.searchFunction(this.emoteList);
    });
    this.searchElem.addEventListener("submit", (event: Event): void => {
      event.preventDefault();
    });
    this.searchBar.setAttribute("type", "text");
    this.searchBar.setAttribute("placeholder", "Search Emotes");
    this.searchElem.appendChild(this.searchBar);
    this.optionsContainer = document.createElement("div");
    this.optionsContainer.classList.add("optionsContainer");
    this.emoteElem.appendChild(this.optionsContainer);
    this.emotesWrapper = document.createElement("div");
    this.emotesWrapper.classList.add("emotesWrapper");
    this.optionsContainer.appendChild(this.emotesWrapper);
  };
  ChatAutocomplete.prototype.processHint = function (currentWord: CurrentWord): void {
    const lastWord: string = currentWord[0].toLowerCase();
    const caretPosition: number = currentWord[1];
    if (
      this.prfx !== "" &&
      (null === lastWord || lastWord.length < this.minimalLengthForHint || this.prfx !== lastWord[0])
    ) {
      hideElem(this.hintsElem);
    } else {
      const prefixlessWordTemp: string = lastWord.substring(this.prfx.length);
      const prefixlessWord: string = this.prefixInSearch ? lastWord : prefixlessWordTemp;
      let cinque: number = 0;
      const hints: string[] = typeof this.hints == "function" ? this.hints() : this.hints;
      this.hintsElem.textContent = "";
      const matchedHints: string[] = [];
      const tishie: string[] = [];
      hints.forEach((hint: string) => {
        const catenia: string = hint.toLowerCase();
        if (catenia.startsWith(prefixlessWord)) matchedHints.push(hint);
        else {
          if (prefixlessWordTemp.length >= 2 && catenia.includes(prefixlessWordTemp)) {
            tishie.push(hint);
          }
        }
      });
      matchedHints.sort();
      if (matchedHints.length < this.maxPerHint) {
        tishie.sort();
        for (const ajitesh of tishie) {
          if (
            -1 === matchedHints.indexOf(ajitesh) &&
            (matchedHints.push(ajitesh), matchedHints.length >= this.maxPerHint)
          ) {
            break;
          }
        }
      }
      for (const matchedHint of matchedHints) {
        const hintDiv: HTMLDivElement = document.createElement("div");
        if (this.hintsImg && this.hintsImg[matchedHint]) {
          hintDiv.className = "emHint";
          const hintEmoteImage: HTMLImageElement = document.createElement("img");
          let cEmote: Emote | undefined = undefined;
          for (const emote of CUSTOM_EMOTES) {
            if (emote.n == matchedHint.split(":")[1]) {
              cEmote = emote;
              break;
            }
          }
          if (cEmote) {
            hintEmoteImage.src = cEmote.u!;
          } else {
            hintEmoteImage.src = CDN_URL("/" + this.hintsImg[matchedHint]);
          }
          hintDiv.appendChild(hintEmoteImage);
          const wael: HTMLDivElement = document.createElement("div");
          wael.textContent = matchedHint;
          hintDiv.appendChild(wael);
        } else {
          hintDiv.textContent = matchedHint;
        }
        hintDiv.dataset.pos = caretPosition.toString();
        hintDiv.dataset.str = matchedHint;
        hintDiv.addEventListener("click", () => {
          const inputValue: string = this.inp.value;
          const pos: number = parseInt(hintDiv.dataset.pos!);
          const xila: string = inputValue.substring(0, pos);
          let neng: number = xila.indexOf(" ");
          let marshelia;
          for (marshelia = neng + 1; -1 !== neng; ) {
            if (-1 !== (neng = xila.indexOf(" ", neng + 1))) marshelia = neng + 1;
          }
          if (!this.prefixInSearch) ++marshelia;
          this.inp.value = inputValue.substring(0, marshelia) + hintDiv.dataset.str! + " " + inputValue.substring(pos);
          this.inp.focus();
          this.setCaretPosition(pos + hintDiv.dataset.str!.length + 1 - (pos - marshelia));
          hideElem(this.hintsElem);
          if (this.wipePrevious) this.inp.value = hintDiv.dataset.str!;
          if (this.onWiped) this.onWiped(hintDiv.dataset.str!);
        });
        this.hintsElem.appendChild(hintDiv);
        if (++cinque >= this.maxPerHint) {
          break;
        }
      }
      this.setSelected(0);
      if (cinque) showElem(this.hintsElem);
      else hideElem(this.hintsElem);
    }
  };
  console.log("JSTRIS+ EMOTES LOADED");
};
