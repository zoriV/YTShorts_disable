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

let isVideoPlayer;

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
  getAllShortTabs().forEach((tab) => {
    tab.remove();
    logWithPrefix("Found and removed shorts");
  });
};

const observer = new MutationObserver(() => {
  removeShorts();
});

const observeTarget = () => {
  const target = getVideosContainer();
  if (target) {
    removeShorts(); // remove all shorts at startup
    observer.observe(target, {
      attributes: false,
      childList: true,
      subtree: false,
    }); // observe

    logWithPrefix(`Successfully loaded (video player: ${isVideoPlayer})`);
  } else {
    logWithPrefix(`Couldn't setup. Retrying in 150ms...`);
    setTimeout(observeTarget, 150);
  }
};

const setup = async () => {
  isVideoPlayer = new URL(window.location.href).pathname === "/watch";

  if (!isVideoPlayer) hideShortsButton();
  observeTarget();
};

window.addEventListener("load", async () => {
  setup();
});

let oldHref = document.location.href;

const locaitonObserver = new MutationObserver(() => {
  if (oldHref !== document.location.href) {
    oldHref = document.location.href;
    logWithPrefix("Detected URL change");
    setup();
  }
});

locaitonObserver.observe(document.querySelector("head"), {
  childList: true,
  subtree: true,
});
