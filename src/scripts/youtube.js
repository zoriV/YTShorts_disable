const shortsQuery =
  "ytd-rich-grid-renderer > #contents ytd-rich-section-renderer:not(:has(ytd-post-renderer))";
const CONSOLE_PREFIX = "[YTShorts_disable]";
const mainPageObserverTarget = "ytd-rich-grid-renderer > #contents";
const playerObserverTarget = "#items > #contents";

const isVideoPlayer = new URL(window.location.href).pathname === "/watch";

const logWithPrefix = (...message) => {
  console.log(CONSOLE_PREFIX, ...message);
};

const getAllShortTabs = () => {
  return document.querySelectorAll(shortsQuery);
};

const getVideosContainer = () => {
  return document.querySelector(
    isVideoPlayer ? playerObserverTarget : mainPageObserverTarget
  );
};

const removeShorts = () => {
  getAllShortTabs().forEach((tab) => {
    console.log(tab);
    tab.remove();
    logWithPrefix("Found and removed shorts");
  });
};

const observer = new MutationObserver(function (mutationsList) {
  mutationsList
    .filter((v) => {
      return v.type === "childList";
    })
    .forEach(() => {
      removeShorts();
    });
});

const observerConfig = {
  attributes: false,
  childList: true,
  subtree: false,
};

removeShorts(); // remove all shorts at startup
observer.observe(getVideosContainer(), observerConfig); // observe
