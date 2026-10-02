"use strict";

const root = document.documentElement;
const body = document.body;
const themeToggle = document.querySelector(".theme-toggle");
const themeColor = document.querySelector('meta[name="theme-color"]');
const evidenceToggle = document.querySelector(".evidence-toggle");
const commandDialog = document.querySelector(".command-dialog");
const commandTrigger = document.querySelector(".command-trigger");
const dialogClose = document.querySelector(".dialog-close");
const projectCards = [...document.querySelectorAll(".project-card")];
const filterButtons = [...document.querySelectorAll(".filter-button")];
const phaseButtons = [...document.querySelectorAll(".phase-button")];
const phaseEmblem = document.querySelector("#phase-emblem");
const gameLaunchers = [...document.querySelectorAll(".game-launch")];
const gamePlayerDialog = document.querySelector(".game-player-dialog");
const gamePlayerStage = document.querySelector(".game-player-stage");
const gamePlayerPanel = document.querySelector(".game-player-panel");
const gamePlayerToolbar = document.querySelector(".game-player-toolbar");
const gamePlayerViewport = document.querySelector(".game-player-viewport");
const gamePlayerFrame = document.querySelector(".game-player-frame");
const gamePlayerTitle = document.querySelector("#game-player-title");
const gamePlayerItchLink = document.querySelector(".game-player-itch-link");
const gamePlayerClose = document.querySelector(".game-player-close");
const gamePlayerFullscreen = document.querySelector(".game-player-fullscreen");

let gameNativeWidth = 0;
let gameNativeHeight = 0;

function fitGamePlayer() {
  if (
    !gamePlayerStage ||
    !gamePlayerPanel ||
    !gamePlayerViewport ||
    !gamePlayerFrame ||
    !gameNativeWidth ||
    !gameNativeHeight
  ) {
    return;
  }

  const isFullscreen = document.fullscreenElement === gamePlayerViewport;
  const stageStyle = window.getComputedStyle(gamePlayerStage);
  const horizontalPadding =
    Number.parseFloat(stageStyle.paddingLeft) +
    Number.parseFloat(stageStyle.paddingRight);
  const verticalPadding =
    Number.parseFloat(stageStyle.paddingTop) +
    Number.parseFloat(stageStyle.paddingBottom);
  const availableWidth = isFullscreen
    ? window.innerWidth
    : gamePlayerStage.clientWidth - horizontalPadding;
  const availableHeight = isFullscreen
    ? window.innerHeight
    : gamePlayerStage.clientHeight -
      verticalPadding -
      (gamePlayerToolbar?.offsetHeight ?? 0);
  const scale = Math.min(
    availableWidth / gameNativeWidth,
    availableHeight / gameNativeHeight,
    1,
  );

  if (!isFullscreen) {
    const fittedWidth = Math.floor(gameNativeWidth * scale);
    const fittedHeight = Math.floor(gameNativeHeight * scale);
    gamePlayerPanel.style.width = `${fittedWidth}px`;
    gamePlayerViewport.style.width = `${fittedWidth}px`;
    gamePlayerViewport.style.height = `${fittedHeight}px`;
  }
  gamePlayerFrame.style.width = `${gameNativeWidth}px`;
  gamePlayerFrame.style.height = `${gameNativeHeight}px`;
  gamePlayerFrame.style.transform = `scale(${scale})`;
}

function closeGamePlayer() {
  if (gamePlayerDialog?.open) gamePlayerDialog.close();
}

gameLaunchers.forEach((launcher) => {
  launcher.addEventListener("click", () => {
    if (!gamePlayerDialog || !gamePlayerFrame || gamePlayerDialog.open) return;

    gameNativeWidth = Number.parseInt(launcher.dataset.gameWidth ?? "0", 10);
    gameNativeHeight = Number.parseInt(launcher.dataset.gameHeight ?? "0", 10);
    const gameTitle = launcher.dataset.gameTitle ?? "Game";
    const gamePage = launcher.dataset.gamePage ?? "https://smallloopworks.itch.io/";
    const gameSource = launcher.dataset.gameSrc;
    if (!gameNativeWidth || !gameNativeHeight || !gameSource) return;

    if (gamePlayerTitle) gamePlayerTitle.textContent = gameTitle;
    if (gamePlayerItchLink) gamePlayerItchLink.href = gamePage;
    gamePlayerFrame.title = gameTitle;
    gamePlayerFrame.src = gameSource;
    document.body.classList.add("game-player-open");
    gamePlayerDialog.showModal();
    requestAnimationFrame(fitGamePlayer);
  });
});

gamePlayerClose?.addEventListener("click", closeGamePlayer);
gamePlayerStage?.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Element) || !target.closest(".game-player-panel")) {
    closeGamePlayer();
  }
});
gamePlayerDialog?.addEventListener("close", () => {
  document.body.classList.remove("game-player-open");
  gamePlayerFrame?.removeAttribute("src");
});
gamePlayerFullscreen?.addEventListener("click", async () => {
  if (!gamePlayerViewport) return;
  try {
    await gamePlayerViewport.requestFullscreen();
  } catch {
    // The fitted dialog remains usable when fullscreen is unavailable.
  }
});
window.addEventListener("resize", fitGamePlayer);
document.addEventListener("fullscreenchange", () => {
  requestAnimationFrame(fitGamePlayer);
});

const phases = {
  spike: {
    kicker: "question / 01",
    title: "What is actually unknown?",
    copy: "Map the system and trust boundaries. Reproduce the risky behavior. Build a small probe to test the assumption.",
    items: [
      "Map the system and its boundaries",
      "One thin end-to-end path",
      "Record what the experiment shows",
    ],
  },
  iterate: {
    kicker: "feedback / 02",
    title: "Does the whole loop close?",
    copy: "Use the working path. Watch where it becomes awkward, slow, unsafe, or impossible to operate. Fix the bottleneck and test the path again.",
    items: [
      "Use the actual workflow",
      "Turn feedback into a concrete change",
      "Separate product friction from structural risk",
    ],
  },
  stabilize: {
    kicker: "contract / 03",
    title: "Can another person continue?",
    copy: "Turn the useful behavior into an explicit contract. Add tests, specifications, automation, recovery paths, and enough context for the next operator.",
    items: [
      "Regression tests around the invariant",
      "Specs record intent and boundaries",
      "Release and recovery paths are repeatable",
    ],
  },
  why: {
    kicker: "principle / 04",
    title: "For those\nwho come\nafter.",
    copy: "What you build today becomes the next person’s starting point. Make it a good one.",
    items: [
      "Create",
      "Endure",
      "Begin again",
    ],
  },
};

const themePreference = window.matchMedia("(prefers-color-scheme: dark)");
const themeStorageKey = "portfolio-theme-mode";
const legacyThemeStorageKey = "portfolio-theme";

function getSavedThemeMode() {
  try {
    const savedMode = localStorage.getItem(themeStorageKey);
    return savedMode === "light" || savedMode === "dark"
      ? savedMode
      : "system";
  } catch {
    return "system";
  }
}

function saveThemeMode(mode) {
  try {
    localStorage.removeItem(legacyThemeStorageKey);
    if (mode === "system") {
      localStorage.removeItem(themeStorageKey);
    } else {
      localStorage.setItem(themeStorageKey, mode);
    }
  } catch {
    // The page still works when storage is unavailable.
  }
}

function getSystemTheme() {
  return themePreference.matches ? "dark" : "light";
}

let themeMode = getSavedThemeMode();
if (themeMode !== "system" && themeMode === getSystemTheme()) {
  themeMode = "system";
}

function getResolvedTheme() {
  return themeMode === "system" ? getSystemTheme() : themeMode;
}

function applyTheme() {
  const nextTheme = getResolvedTheme();
  root.dataset.theme = nextTheme;
  root.dataset.themeMode = themeMode;
  if (themeColor) {
    themeColor.content = nextTheme === "dark" ? "#111318" : "#f5f1e8";
  }

  const nextAction =
    themeMode === "system"
      ? `Switch to ${nextTheme === "dark" ? "light" : "dark"} theme`
      : `Use system theme (${getSystemTheme()})`;
  themeToggle?.setAttribute(
    "aria-label",
    nextAction,
  );
  themeToggle?.setAttribute("title", nextAction);
}

saveThemeMode(themeMode);
applyTheme();

themeToggle?.addEventListener("click", () => {
  themeMode =
    themeMode === "system"
      ? getResolvedTheme() === "dark"
        ? "light"
        : "dark"
      : "system";
  saveThemeMode(themeMode);
  applyTheme();
});

function handleSystemThemeChange() {
  if (themeMode !== "system" && themeMode === getSystemTheme()) {
    themeMode = "system";
    saveThemeMode(themeMode);
  }
  applyTheme();
}

if (typeof themePreference.addEventListener === "function") {
  themePreference.addEventListener("change", handleSystemThemeChange);
} else {
  themePreference.addListener(handleSystemThemeChange);
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedFilter = button.dataset.filter ?? "all";

    filterButtons.forEach((candidate) => {
      const isSelected = candidate === button;
      candidate.classList.toggle("is-active", isSelected);
      candidate.setAttribute("aria-pressed", String(isSelected));
    });

    projectCards.forEach((card) => {
      const tags = (card.dataset.tags ?? "").split(/\s+/);
      card.hidden = selectedFilter !== "all" && !tags.includes(selectedFilter);
    });
  });
});

evidenceToggle?.addEventListener("click", () => {
  const isActive = evidenceToggle.getAttribute("aria-pressed") === "true";
  evidenceToggle.setAttribute("aria-pressed", String(!isActive));
  body.classList.toggle("show-evidence", !isActive);
});

function setPhase(phaseName) {
  const phase = phases[phaseName];
  if (!phase) return;

  phaseButtons.forEach((button) => {
    const isSelected = button.dataset.phase === phaseName;
    button.classList.toggle("is-active", isSelected);
    button.setAttribute("aria-selected", String(isSelected));
  });

  const selectedButton = document.querySelector(`[data-phase="${phaseName}"]`);
  const panel = document.querySelector("#phase-panel");
  panel?.setAttribute("aria-labelledby", selectedButton?.id ?? "");
  if (phaseEmblem) phaseEmblem.hidden = phaseName !== "why";

  document.querySelector("#phase-kicker").textContent = phase.kicker;
  document.querySelector("#phase-title").textContent = phase.title;
  document.querySelector("#phase-copy").textContent = phase.copy;

  const list = document.querySelector("#phase-list");
  if (list) {
    list.replaceChildren(
      ...phase.items.map((item) => {
        const element = document.createElement("li");
        element.textContent = item;
        return element;
      }),
    );
  }
}

phaseButtons.forEach((button) => {
  button.addEventListener("click", () => setPhase(button.dataset.phase));
});

function openCommandDialog() {
  if (!commandDialog?.open) commandDialog?.showModal();
}

function closeCommandDialog() {
  if (commandDialog?.open) commandDialog.close();
}

commandTrigger?.addEventListener("click", openCommandDialog);
dialogClose?.addEventListener("click", closeCommandDialog);
commandDialog?.addEventListener("click", (event) => {
  if (event.target === commandDialog) closeCommandDialog();
});
commandDialog?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeCommandDialog);
});

document.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  if ((event.ctrlKey || event.metaKey) && key === "k") {
    event.preventDefault();
    openCommandDialog();
    return;
  }

  if (!commandDialog?.open || event.ctrlKey || event.metaKey || event.altKey) {
    return;
  }

  const commandMap = {
    w: "#work",
    g: "games.html",
    m: "#method",
    a: "#about",
    c: "#contact",
    v: "cv.html",
  };
  const destination = commandMap[key];
  if (!destination) return;
  closeCommandDialog();
  window.location.href = destination;
});

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealTargets = [...document.querySelectorAll("[data-reveal]")];

if (reduceMotion || !("IntersectionObserver" in window)) {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
} else {
  revealTargets
    .filter((target) => target.getBoundingClientRect().top < window.innerHeight * 1.1)
    .forEach((target) => target.classList.add("is-visible"));

  root.classList.add("js");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
  );
  revealTargets
    .filter((target) => !target.classList.contains("is-visible"))
    .forEach((target) => observer.observe(target));
}

const currentYear = document.querySelector("#current-year");
if (currentYear) currentYear.textContent = String(new Date().getFullYear());

// The award image stays in the top layer so previews never move the shelf.
const awardPreview = document.querySelector(".award-preview");
const awardBadges = [...document.querySelectorAll(".game-award-badge")];
let activeAward = null;
let awardCloseTimer;

function hideAwardPreview() {
  clearTimeout(awardCloseTimer);
  if (awardPreview?.matches(":popover-open")) awardPreview.hidePopover();
}

function positionAwardPreview() {
  if (!awardPreview || !activeAward || !awardPreview.matches(":popover-open")) return;
  const anchor = activeAward.getBoundingClientRect();
  const width = awardPreview.offsetWidth;
  const height = awardPreview.offsetHeight;
  const left = Math.max(12, Math.min(anchor.right - width, innerWidth - width - 12));
  const below = anchor.bottom + 10;
  const top = below + height <= innerHeight - 12
    ? below
    : Math.max(12, anchor.top - height - 10);
  awardPreview.style.left = `${left}px`;
  awardPreview.style.top = `${top}px`;
}

function showAwardPreview(badge) {
  if (!awardPreview || typeof awardPreview.showPopover !== "function") return;
  clearTimeout(awardCloseTimer);
  if (activeAward) activeAward.setAttribute("aria-expanded", "false");
  activeAward = badge;
  const image = awardPreview.querySelector(".award-preview-image");
  image.src = badge.dataset.awardImage;
  image.alt = badge.dataset.awardAlt;
  awardPreview.querySelector("#award-preview-title").textContent = badge.dataset.awardTitle;
  awardPreview.querySelector(".award-preview-caption").textContent = badge.dataset.awardCaption;
  awardPreview.querySelector(".award-preview-full").href = badge.dataset.awardImage;
  const source = awardPreview.querySelector(".award-preview-source");
  source.href = badge.href;
  source.hidden = !badge.href.startsWith("https://itch.io/");
  if (!awardPreview.matches(":popover-open")) awardPreview.showPopover();
  badge.setAttribute("aria-expanded", "true");
  positionAwardPreview();
}

function scheduleAwardClose() {
  clearTimeout(awardCloseTimer);
  awardCloseTimer = setTimeout(() => {
    if (awardPreview?.matches(":hover") || activeAward?.matches(":hover") ||
      awardPreview?.contains(document.activeElement) || document.activeElement === activeAward) return;
    hideAwardPreview();
  }, 180);
}

awardBadges.forEach((badge) => {
  if (!awardPreview || typeof awardPreview.showPopover !== "function") return;
  badge.setAttribute("aria-haspopup", "dialog");
  badge.setAttribute("aria-controls", "award-preview");
  badge.setAttribute("aria-expanded", "false");
  badge.removeAttribute("title");
  badge.addEventListener("pointerenter", (event) => {
    if (event.pointerType !== "touch") showAwardPreview(badge);
  });
  badge.addEventListener("pointerleave", scheduleAwardClose);
  badge.addEventListener("focus", () => showAwardPreview(badge));
  badge.addEventListener("blur", scheduleAwardClose);
  badge.addEventListener("click", (event) => {
    event.preventDefault();
    showAwardPreview(badge);
    awardPreview.querySelector(".award-preview-close").focus({ preventScroll: true });
  });
});
awardPreview?.addEventListener("pointerenter", () => clearTimeout(awardCloseTimer));
awardPreview?.addEventListener("pointerleave", scheduleAwardClose);
awardPreview?.addEventListener("focusout", scheduleAwardClose);
awardPreview?.addEventListener("toggle", () => {
  if (!awardPreview.matches(":popover-open")) {
    activeAward?.setAttribute("aria-expanded", "false");
    activeAward = null;
  }
});
awardPreview?.querySelector(".award-preview-close").addEventListener("click", hideAwardPreview);
awardPreview?.querySelector(".award-preview-image").addEventListener("load", positionAwardPreview);
window.addEventListener("resize", hideAwardPreview);
window.addEventListener("scroll", (event) => {
  if (event.target === document && activeAward) {
    const anchor = activeAward.getBoundingClientRect();
    if (anchor.bottom < 0 || anchor.top > innerHeight) hideAwardPreview();
    else positionAwardPreview();
  }
}, true);
