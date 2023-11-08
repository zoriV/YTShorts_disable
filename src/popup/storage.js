export class Options {
  #defaults = {
    MAIN: true,
    HOME: false,
    RECOMMENDATIONS: false,
    BUTTON: false,
  };

  constructor() {
    this.data = {};
  }

  initialize() {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get(["options"], (result) => {
        if (!result.options) {
          console.log("Nothing saved yet");
          this.data = this.#defaults;
        } else {
          console.log("Found saved data");
          this.data = result.options;
        }
        resolve(this.data);
      });
    });
  }

  set(name, value) {
    this.data[name] = value;
    console.log(this.data);
  }

  commit() {
    chrome.storage.sync.set({ options: this.data }, () => {
      console.log("Successfully saved data");
    });
  }
}
