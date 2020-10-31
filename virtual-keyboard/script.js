const keyboard = {
  elements: {
    main: null,
    keysContainer: null,
    keys: [],
  },

  eventHandlers: {
    oninput: null,
    onclose: null,
  },

  properties: {
    value: "",
    capsLock: false,
    shift: false,
    soundOn: true,
    language: "en",
  },

  layoutsStandard:{
    english: [
      "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
      "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]",
      "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "\'","enter",
      "shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?",
      "done", "lang","space", "keyboard_arrow_left", "keyboard_arrow_right", "sound"
    ],
    russian: [
      "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
      "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "x", "ъ",
      "caps", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "enter",
      "shift", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ".",
      "done", "lang","space", "keyboard_arrow_left", "keyboard_arrow_right", "sound"
    ],
  },

  layoutsShift:{
    english: [
      "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "backspace",
      "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "{", "}", // обработать перенос строки при }
      "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "\'","enter",
      "shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?",
      "done", "lang","space", "keyboard_arrow_left", "keyboard_arrow_right", "sound"
    ],
    russian: [
      "!", "\"", "№", ";", "%", ":", "?", "*", "(", ")", "backspace",
      "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "x", "ъ",
      "caps", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "enter",
      "shift", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ".",
      "done", "lang","space", "keyboard_arrow_left", "keyboard_arrow_right", "sound"
    ],
  },

  init() {
    // Create main elements
    this.elements.main = document.createElement('div')
    this.elements.keysContainer = document.createElement('div')

    //SetUp classes
    this.elements.main.classList.add("keyboard", "keyboard--hidden")
    this.elements.keysContainer.classList.add("keyboard__keys")
    this.elements.keysContainer.appendChild(this._createKeys())

    this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard__key')

    // Add to DOM
    this.elements.main.appendChild(this.elements.keysContainer)
    document.body.appendChild(this.elements.main)

    // Use keyboard for all elements with the class use-keyboard-input
    document.querySelectorAll(".use-keyboard-input").forEach(element =>{
      element.addEventListener("focus", () => {
        this.open(element.value, currentValue => {
          element.value = currentValue;
        })
      })

    })
  },

  _createKeys() {
    const fragment = document.createDocumentFragment();

    let keyLayout
    if (this.properties.language === "ru"){
      keyLayout = this.layoutsStandard.russian
    } else {
      keyLayout = this.layoutsStandard.english
    }

    // Create HTML for an icon
    const createIconHtml = (icon_name) => {
      return `<i class="material-icons">${icon_name}</i>`
    }

    keyLayout.forEach(key => {
      const keyElement = document.createElement("button")
      let lineBreak

      if (this.properties.language === "en") {
        lineBreak = ["backspace", "]", "enter", "?"].indexOf(key) !== -1
      } else {
        lineBreak = ["backspace", "ъ", "enter", "."].indexOf(key) !== -1
      }

      //Add atributes/classes
      keyElement.setAttribute("type", "button")
      keyElement.classList.add("keyboard__key")

      switch(key){
        case "sound":
          keyElement.classList.add("keyboard__key--wide")
          keyElement.innerHTML = createIconHtml("volume_up");

          keyElement.addEventListener("click", (e) => {
          //   this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1)
          //   this._triggerEvent("oninput")
          this._toggleSound(e)
          })


        break;
        case "backspace":
          keyElement.classList.add("keyboard__key--wide")
          keyElement.innerHTML = createIconHtml("backspace");

          keyElement.addEventListener("click", () => {
            this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1)
            this._triggerEvent("oninput")
          })
        break;
        case "caps":
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable")
          keyElement.innerHTML = createIconHtml("keyboard_capslock");

          keyElement.addEventListener("click", () => {

            if (this.properties.language === "en") {
              this._toggleCapsLock("english");
            } else {
              this._toggleCapsLock("russian");
            }

            keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock)

          })
        break;
        case "enter":
          keyElement.classList.add("keyboard__key--wide")
          keyElement.innerHTML = createIconHtml("keyboard_return");

          keyElement.addEventListener("click", () => {
            this.properties.value += "\n";
            this._triggerEvent("oninput")
          })
        break;
        case "space":
          keyElement.classList.add("keyboard__key--extra-wide")
          keyElement.innerHTML = createIconHtml("space_bar");

          keyElement.addEventListener("click", () => {
            this.properties.value += " ";
            this._triggerEvent("oninput")
          })
        break;
        case "done":
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark")
          keyElement.innerHTML = createIconHtml("check_circle");

          keyElement.addEventListener("click", () => {
            this.close();
            this._triggerEvent("onclose")
          })
        break;
        case "shift":
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable")
          keyElement.innerText = "Shift";

          keyElement.addEventListener("click", () => {

            if (this.properties.language === "en") {
              this._toggleShift("english");
            } else {
              this._toggleShift("russian");
            }

            keyElement.classList.toggle("keyboard__key--active", this.properties.shift)
          })
        break;

        case "lang":
          keyElement.classList.add("keyboard__key--wide")
          keyElement.innerText = this.properties.language;

          //Добавить обработчик на смену языка
          keyElement.addEventListener("click", (e) => {
            this._toggleLanguage()
            e.currentTarget.innerText = e.currentTarget.innerText === "en" ? "ru" : "en"
            })
        break;

        case "keyboard_arrow_left":
          keyElement.innerHTML = createIconHtml("keyboard_arrow_left");

          //Добавить обработчик
          // keyElement.addEventListener("click", () => {
            // this.close();
          // })
        break;
        case "keyboard_arrow_right":
          keyElement.innerHTML = createIconHtml("keyboard_arrow_right");

          //Добавить обработчик
          // keyElement.addEventListener("click", () => {
            // this.close();
          // })
        break;
        default:
          keyElement.textContent = key.toLowerCase();

          keyElement.addEventListener("click", (e) => {
            this.properties.value += e.target.innerText;
            this._triggerEvent("oninput")
          });
        break;
      }
      fragment.appendChild(keyElement);

      if (lineBreak){
        fragment.appendChild(document.createElement("br"))
      }

    });
  return fragment;
  },

  _triggerEvent(handlerName){
    if (typeof this.eventHandlers[handlerName] == "function") {
      this.eventHandlers[handlerName](this.properties.value)
    }
    console.log("Event triggered! Event Name: " + handlerName);
  },

  _toggleShift(currentLanguage){
    this.properties.shift = !this.properties.shift

    for (const key of this.elements.keys){
      if (key.innerText === "Shift") continue
      if (key.innerText === "en") continue
      if (key.innerText === "ru") continue
      if (key.childElementCount === 0) {

        if (this.properties.shift && this.properties.capsLock) {

          let standardIndex = this.layoutsStandard[currentLanguage].indexOf(key.textContent.toLowerCase())
          key.textContent = this.layoutsShift[currentLanguage][standardIndex].toLowerCase()

        } else if (this.properties.shift && !this.properties.capsLock) {

          let standardIndex = this.layoutsStandard[currentLanguage].indexOf(key.textContent.toLowerCase())
          key.textContent = this.layoutsShift[currentLanguage][standardIndex].toUpperCase()

        } else if (!this.properties.shift && this.properties.capsLock) {

          let shiftIndex = this.layoutsShift[currentLanguage].indexOf(key.textContent.toLowerCase())
          key.textContent = this.layoutsStandard[currentLanguage][shiftIndex].toUpperCase()

        } else {

          let shiftIndex = this.layoutsShift[currentLanguage].indexOf(key.textContent.toLowerCase())
          key.textContent = this.layoutsStandard[currentLanguage][shiftIndex].toLowerCase()

        }
      }
    }
  },

  _toggleLanguage(){
    this.properties.language === "en" ? this.properties.language = "ru" : this.properties.language = "en"

    switch(this.properties.language){
      case "en":
        for (const key of this.elements.keys){
          if (key.innerText === "Shift") continue
          if (key.innerText === "en") continue
          if (key.innerText === "ru") continue
          if (key.childElementCount === 0) {

            if (this.properties.shift && this.properties.capsLock) {
              let ruIndex = this.layoutsShift.russian.indexOf(key.textContent.toLowerCase())
              key.textContent = this.layoutsShift.english[ruIndex].toLowerCase()

            } else if (this.properties.shift && !this.properties.capsLock) {
              let ruIndex = this.layoutsShift.russian.indexOf(key.textContent.toLowerCase())
              key.textContent = this.layoutsShift.english[ruIndex].toUpperCase()

            } else if (!this.properties.shift && this.properties.capsLock) {
              let ruIndex = this.layoutsStandard.russian.indexOf(key.textContent.toLowerCase())
              key.textContent = this.layoutsStandard.english[ruIndex].toUpperCase()
            } else {
              let ruIndex = this.layoutsStandard.russian.indexOf(key.textContent.toLowerCase())
              key.textContent = this.layoutsStandard.english[ruIndex].toLowerCase()
            }

          }
        }
      break;

      default:
        for (const key of this.elements.keys){
          if (key.innerText === "Shift") continue
          if (key.innerText === "en") continue
          if (key.innerText === "ru") continue
          if (key.childElementCount === 0) {

            if (this.properties.shift && this.properties.capsLock) {
              let engIndex = this.layoutsShift.english.indexOf(key.textContent.toLowerCase())
              key.textContent = this.layoutsShift.russian[engIndex].toLowerCase()

            } else if (this.properties.shift && !this.properties.capsLock) {
              let engIndex = this.layoutsShift.english.indexOf(key.textContent.toLowerCase())
              key.textContent = this.layoutsShift.russian[engIndex].toUpperCase()

            } else if (!this.properties.shift && this.properties.capsLock) {
              let engIndex = this.layoutsStandard.english.indexOf(key.textContent.toLowerCase())
              key.textContent = this.layoutsStandard.russian[engIndex].toUpperCase()
            } else {
              let engIndex = this.layoutsStandard.english.indexOf(key.textContent.toLowerCase())
              key.textContent = this.layoutsStandard.russian[engIndex].toLowerCase()
            }

          }
        }
      break;
    }

  },

  _toggleSound(e){
    this.properties.soundOn = !this.properties.soundOn

    switch(e.target.textContent){
      case "volume_up":
        e.currentTarget.innerHTML = `<i class="material-icons">volume_off</i>`
      break;
      default:
        e.currentTarget.innerHTML = `<i class="material-icons">volume_up</i>`
      break;
    }
  },

  _toggleCapsLock(){
    this.properties.capsLock = !this.properties.capsLock

    for (const key of this.elements.keys) {
      if (key.innerText === "Shift") continue
      if (key.innerText === "en") continue
      if (key.innerText === "ru") continue
      if (key.childElementCount === 0) {

        if (this.properties.shift && this.properties.capsLock) {
          key.textContent = key.textContent.toLowerCase()
        } else if (this.properties.shift && !this.properties.capsLock) {
          key.textContent = key.textContent.toUpperCase()
        } else if (!this.properties.shift && this.properties.capsLock) {
          key.textContent = key.textContent.toUpperCase()
        } else {
          key.textContent = key.textContent.toLowerCase()
        }

      }
    }
  },

  open(initialValue, oninput, onclose){
    this.properties.value = initialValue || "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.remove("keyboard--hidden");
  },

  close(){
    this.properties.value = "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.add("keyboard--hidden")
  },
}



window.addEventListener('DOMContentLoaded', () => {
  keyboard.init()
});

