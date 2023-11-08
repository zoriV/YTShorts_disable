import { Options } from "./storage.js";

const checkboxes = document.querySelectorAll(
  "#optionsContainer > .option input[type='checkbox'], #mainSwitch"
);

const options = new Options();

window.addEventListener("load", async () => {
  options.initialize().then((saved) => {
    changeAll(saved);

    checkboxes.forEach((chb) => {
      chb.addEventListener("change", (e) => {
        const clicked = e.target;

        const optionName = clicked.dataset.optionName;
        const newState = clicked.checked;
        console.log(
          `${optionName} has been ${newState ? "enabled" : "disabled"}`
        );
        options.set(optionName, newState);
        options.commit();

        if (optionName === "MAIN") {
          changeAll(options.data);
        }
      });
    });
  });
});

function changeAll(data) {
  const mainSwitchValue = data["MAIN"];

  const other = Array.from(checkboxes).filter((o) => {
    return o.dataset.optionName !== "MAIN";
  });

  other.forEach((o) => {
    const oName = o.dataset.optionName;
    if (!mainSwitchValue) {
      o.setAttribute("disabled", "");
      o.checked = false;
    } else {
      o.removeAttribute("disabled");
      o.checked = data[oName];
    }
  });
}
