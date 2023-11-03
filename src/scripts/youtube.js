const CONSOLE_PREFIX = "[YTShorts_disable]";
const shortsQueries = {
  main: "ytd-rich-grid-renderer > #contents ytd-rich-section-renderer:not(:has(ytd-post-renderer))",
  player:
    "ytd-watch-next-secondary-results-renderer #items #contents ytd-reel-shelf-renderer", // :has(#title-container)
};
const observerTargets = {
  main: "ytd-rich-grid-renderer > #contents",
  player: "ytd-watch-next-secondary-results-renderer #items #contents",
};
const shortsButton =
  "ytd-guide-renderer > #sections > ytd-guide-section-renderer > #items > ytd-guide-entry-renderer:nth-child(2)";

const isVideoPlayer = new URL(window.location.href).pathname === "/watch";

const logWithPrefix = (...message) => {
  console.log(CONSOLE_PREFIX, ...message);
};

const getAllShortTabs = () => {
  return document.querySelectorAll(
    isVideoPlayer ? shortsQueries["player"] : shortsQueries["main"]
  );
};

const getVideosContainer = () => {
  return document.querySelector(
    isVideoPlayer ? observerTargets["player"] : observerTargets["main"]
  );
};

const hideShortsButton = () => {
  document.querySelector(shortsButton).style.setProperty("display", "none");
};

const removeShorts = () => {
  console.log(getAllShortTabs());
  getAllShortTabs().forEach((tab) => {
    tab.remove();
    logWithPrefix("Found and removed shorts");
  });
};

const observer = new MutationObserver(() => {
  removeShorts();
});

const observerConfig = {
  attributes: false,
  childList: true,
  subtree: false,
};

const observeTarget = () => {
  const target = getVideosContainer();
  if (target) {
    logWithPrefix(`Successfully loaded (video player: ${isVideoPlayer})`);

    removeShorts(); // remove all shorts at startup
    observer.observe(target, observerConfig); // observe
  } else {
    setTimeout(observeTarget, 150);
  }
};

window.addEventListener("load", async () => {
  if (!isVideoPlayer) hideShortsButton();
  observeTarget();
});
