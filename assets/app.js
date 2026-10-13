"use strict";
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const safeStorage = {
  get(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  },
};
const settings = {
  prices: [2499, 3499, 4499, 5999, null],
  hours: ["3–4", "4–5", "5–6", "6–8", "To be assessed"],
  types: {
    "move-in": { label: "Move-In", extra: 0 },
    "move-out": { label: "Move-Out", extra: 500 },
    deep: { label: "Full Home Deep Clean", extra: 250 },
  },
  sizes: ["Studio", "1 Bedroom", "2 Bedrooms", "3 Bedrooms", "4+ Bedrooms"],
};
const state = { type: "move-in", size: 0 };
function updateEstimate() {
  const type = settings.types[state.type];
  const base = settings.prices[state.size];
  $("#estimate-label").textContent =
    `${type.label} · ${settings.sizes[state.size]}`;
  $("#price").textContent =
    base === null
      ? "Let’s talk"
      : `₹${(base + type.extra).toLocaleString("en-IN")}`;
  $("#duration").textContent =
    base === null
      ? "A tailored estimate for your home"
      : `Estimated time: ${settings.hours[state.size]} hours`;
}
$$("[data-type]").forEach((button) =>
  button.addEventListener("click", () => {
    state.type = button.dataset.type;
    $$("[data-type]").forEach((b) => {
      b.classList.toggle("selected", b === button);
      b.setAttribute("aria-pressed", b === button);
    });
    updateEstimate();
  }),
);
$$("[data-size]").forEach((button) =>
  button.addEventListener("click", () => {
    state.size = Number(button.dataset.size);
    $$("[data-size]").forEach((b) => {
      b.classList.toggle("selected", b === button);
      b.setAttribute("aria-pressed", b === button);
    });
    updateEstimate();
  }),
);
function applyTheme(dark) {
  document.body.classList.toggle("dark", dark);
  $("#theme").setAttribute("aria-pressed", dark);
  $("#theme").setAttribute(
    "aria-label",
    `Switch to ${dark ? "light" : "dark"} mode`,
  );
  safeStorage.set("clearnest-theme", dark ? "dark" : "light");
}
applyTheme(
  safeStorage.get("clearnest-theme")
    ? safeStorage.get("clearnest-theme") === "dark"
    : matchMedia("(prefers-color-scheme: dark)").matches,
);
$("#theme").addEventListener("click", () =>
  applyTheme(!document.body.classList.contains("dark")),
);
function applyRTL(reversed) {
  document.body.classList.toggle("rtl", reversed);
  $("#rtl").setAttribute("aria-pressed", reversed);
  $("#rtl").textContent = reversed ? "LTR" : "RTL";
  $("#rtl").setAttribute(
    "aria-label",
    reversed ? "Restore left-to-right layout" : "Reverse layout",
  );
  safeStorage.set("clearnest-rtl", String(reversed));
}
applyRTL(safeStorage.get("clearnest-rtl") === "true");
$("#rtl").addEventListener("click", () =>
  applyRTL(!document.body.classList.contains("rtl")),
);
function closeMenu() {
  $("#navigation").classList.remove("open");
  $(".menu-toggle").setAttribute("aria-expanded", "false");
  $(".menu-toggle").setAttribute("aria-label", "Open menu");
}
$(".menu-toggle").addEventListener("click", () => {
  const open = $("#navigation").classList.toggle("open");
  $(".menu-toggle").setAttribute("aria-expanded", open);
  $(".menu-toggle").setAttribute(
    "aria-label",
    open ? "Close menu" : "Open menu",
  );
});
$$("nav a").forEach((a) =>
  a.addEventListener("click", () => {
    closeMenu();
    $$("nav a").forEach((b) => b.classList.toggle("active", a === b));
  }),
);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
});
const rooms = {
  Kitchen: {
    title: "A kitchen ready for a fresh start.",
    image: "kitchen.jpg",
    alt: "Clean kitchen counters and cabinets",
    tasks: [
      "Countertops & accessible surfaces",
      "Sink & fixtures",
      "Stove surface",
      "Cabinet exteriors",
      "Appliance exteriors",
      "Accessible corners & floors",
    ],
    addons:
      "Optional: oven interiors, refrigerator interiors and cabinet interiors.",
  },
  Bathrooms: {
    title: "A brighter start to your routine.",
    image: "bathroom.jpg",
    alt: "Clean bathroom basin and tiled surfaces",
    tasks: [
      "Toilets & accessible fittings",
      "Basins & taps",
      "Shower & bathtub surfaces",
      "Mirrors",
      "Accessible wall tiles",
      "Bathroom floors",
    ],
    addons:
      "Extra bathrooms and intensive buildup removal affect the quote. Results depend on condition.",
  },
  Bedrooms: {
    title: "A little more room to rest.",
    image: "bedroom.jpg",
    alt: "Neatly arranged sunlit bedroom",
    tasks: [
      "Accessible surfaces",
      "Window sills",
      "Wardrobe exteriors",
      "Doors & handles",
      "Accessible baseboards",
      "Vacuuming or mopping",
    ],
    addons:
      "Optional: wardrobe interiors. Moving heavy furniture is outside the standard scope.",
  },
  "Living areas": {
    title: "Space for what happens next.",
    image: "bright-home.jpg",
    alt: "Light-filled residential living area",
    tasks: [
      "Accessible dusting",
      "Doors & handles",
      "Switch plates",
      "Window sills",
      "Accessible baseboards",
      "Floor cleaning",
    ],
    addons:
      "Optional: interior windows and additional utility spaces. Delicate items need prior discussion.",
  },
  Floors: {
    title: "A fresh start underfoot.",
    image: "living-room.jpg",
    alt: "Residential room with clean accessible floors",
    tasks: [
      "Loose dust & debris",
      "Accessible floor edges",
      "Vacuuming where suitable",
      "Material-appropriate mopping",
      "Accessible corners",
      "Final surface review",
    ],
    addons:
      "Optional: intensive scrubbing where suitable. Permanent marks and stain removal are not guaranteed.",
  },
};
function selectRoom(name, focus = false) {
  const panel = $("#room-panel");
  if (
    panel.dataset.initialized === "true" &&
    !matchMedia("(prefers-reduced-motion: reduce)").matches &&
    !document.body.classList.contains("motion-paused")
  ) {
    panel.classList.remove("is-changing");
    void panel.offsetWidth;
    panel.classList.add("is-changing");
  }
  panel.dataset.initialized = "true";
  const data = rooms[name];
  const tabs = $$("[role=tab]");
  tabs.forEach((tab) => {
    const active = tab.dataset.room === name;
    tab.setAttribute("aria-selected", active);
    tab.tabIndex = active ? 0 : -1;
    if (active) {
      $("#room-panel").setAttribute("aria-labelledby", tab.id);
      if (focus) tab.focus();
    }
  });
  $("#room-title").textContent = data.title;
  const img = $(".room-image img");
  img.src = `assets/images/${data.image}`;
  img.alt = data.alt;
  $("#tasks").replaceChildren(
    ...data.tasks.map((task) => {
      const li = document.createElement("li");
      li.textContent = task;
      return li;
    }),
  );
  $("#addons").textContent = data.addons;
}
$$("[role=tab]").forEach((tab, index) => {
  tab.addEventListener("click", () => selectRoom(tab.dataset.room));
  tab.addEventListener("keydown", (e) => {
    const tabs = $$("[role=tab]");
    let next;
    if (e.key === "ArrowRight") next = (index + 1) % tabs.length;
    if (e.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = tabs.length - 1;
    if (next !== undefined) {
      e.preventDefault();
      selectRoom(tabs[next].dataset.room, true);
    }
  });
});
$$(".service-link").forEach((button) =>
  button.addEventListener("click", () => {
    selectRoom(button.dataset.room);
    $("#services").scrollIntoView({
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }),
);
selectRoom("Kitchen");
const dialog = $("#booking-dialog");
let returnFocus;
function localDate() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
$("input[type=date]").min = localDate();
$$(".book-button").forEach((button) =>
  button.addEventListener("click", () => {
    safeStorage.set(
      "clearnest-selection",
      JSON.stringify({
        type: state.type,
        size: state.size,
        package: "essential",
        bathrooms: 1,
        addons: [],
      }),
    );
    location.href = "pages/book-cleaning.html";
  }),
);
$("#close-dialog").addEventListener("click", () => dialog.close());
dialog.addEventListener("close", () => {
  document.body.classList.remove("modal-open");
  returnFocus?.focus();
});
dialog.addEventListener("click", (e) => {
  if (e.target === dialog) {
    const rect = dialog.getBoundingClientRect();
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    )
      dialog.close();
  }
});
$("#enquiry").addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.currentTarget;
  const date = form.elements.date;
  date.setCustomValidity(
    date.value < localDate() ? "Choose today or a future date." : "",
  );
  if (!form.reportValidity()) return;
  const fields = Object.fromEntries(new FormData(form));
  if (!fields.name.trim() || !fields.location.trim()) {
    $("#form-status").textContent = "Please enter your name and neighborhood.";
    return;
  }
  const record = {
    ...fields,
    cleaningType: state.type,
    propertySize: settings.sizes[state.size],
    estimate: $("#price").textContent,
    status: "Awaiting confirmation",
    createdAt: new Date().toISOString(),
  };
  const saved = safeStorage.set("clearnest-enquiry", JSON.stringify(record));
  $("#form-status").textContent = saved
    ? "Your enquiry is saved on this device. No request has been sent and no appointment is confirmed."
    : "Your browser could not save this enquiry. Please keep your details and try again.";
  if (saved) form.querySelector("button[type=submit]").disabled = true;
});
$("input[type=date]").addEventListener("input", (e) =>
  e.target.setCustomValidity(""),
);
$$(".faq-list details").forEach((details) =>
  details.addEventListener("toggle", () => {
    if (details.open)
      $$(".faq-list details").forEach((other) => {
        if (other !== details) other.open = false;
      });
  }),
);
$("#year").textContent = new Date().getFullYear();
// Progressive motion: content remains visible if animation APIs are unavailable.
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
let motionPaused = safeStorage.get("clearnest-motion") === "paused";
const runningAnimations = new Set();
function syncMotion() {
  document.body.classList.toggle("motion-paused", motionPaused);
  $("#motion-toggle").setAttribute("aria-pressed", motionPaused);
  $("#motion-toggle").setAttribute(
    "aria-label",
    motionPaused ? "Resume animations" : "Pause animations",
  );
  $("#motion-toggle").textContent = motionPaused ? "▷" : "Ⅱ";
  runningAnimations.forEach((animation) =>
    motionPaused || reducedMotion.matches
      ? animation.pause()
      : animation.play(),
  );
  safeStorage.set("clearnest-motion", motionPaused ? "paused" : "playing");
}
$("#motion-toggle").addEventListener("click", () => {
  motionPaused = !motionPaused;
  syncMotion();
});
reducedMotion.addEventListener("change", () => {
  if (reducedMotion.matches)
    runningAnimations.forEach((animation) => animation.finish());
});
syncMotion();
function revealElement(element, delay = 0) {
  if (
    reducedMotion.matches ||
    motionPaused ||
    typeof element.animate !== "function"
  )
    return;
  const animation = element.animate(
    [
      { opacity: 0, transform: "translateY(24px)" },
      { opacity: 1, transform: "translateY(0)" },
    ],
    {
      duration: 700,
      delay,
      easing: "cubic-bezier(.22,1,.36,1)",
      fill: "backwards",
    },
  );
  runningAnimations.add(animation);
  animation.finished
    .then(() => runningAnimations.delete(animation))
    .catch(() => runningAnimations.delete(animation));
}
if ("IntersectionObserver" in window) {
  const animationObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const siblings = entry.target.parentElement;
        const staggered = siblings.matches(
          ".service-grid,.why-row,.gallery-grid,.footer-main",
        );
        const delay = staggered
          ? [...siblings.children].indexOf(entry.target) * 90
          : 0;
        revealElement(entry.target, delay);
        animationObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.12 },
  );
  $$(
    ".section-top,.title-row h2,.title-row p,.estimator,.room-panel,.service-grid article,.process-list article,.why-row > div,.gallery-grid figure,.area-section > div,.faq-list,.footer-main > div",
  ).forEach((element) => animationObserver.observe(element));
}
// Stagger the centered opening without hiding content before JavaScript runs.
[
  $(".hero > .eyebrow"),
  $("h1"),
  $(".hero-copy"),
  $(".hero-home-panel"),
].forEach((element, index) => revealElement(element, index * 100));
