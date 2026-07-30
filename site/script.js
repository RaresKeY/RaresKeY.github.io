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

const phases = {
  spike: {
    kicker: "question / 01",
    title: "What is actually unknown?",
    copy: "Map the system and trust boundaries. Reproduce the risky behavior. Build the smallest probe that can disprove the convenient story.",
    items: [
      "System map before architecture theatre",
      "One thin end-to-end path",
      "Evidence captured beside the claim",
    ],
  },
  iterate: {
    kicker: "feedback / 02",
    title: "Does the whole loop close?",
    copy: "Use the working path. Watch where it becomes awkward, slow, unsafe, or impossible to operate. Improve the bottleneck instead of polishing the fiction.",
    items: [
      "Dogfood the actual workflow",
      "Keep feedback attached to behavior",
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
