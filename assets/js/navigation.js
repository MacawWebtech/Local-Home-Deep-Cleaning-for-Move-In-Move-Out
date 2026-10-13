"use strict";
// Native details menus preserve keyboard and no-JavaScript access.
(() => {
  const dropdowns = [...document.querySelectorAll(".nav-dropdown")];
  dropdowns.forEach((menu) =>
    menu.addEventListener("toggle", () => {
      if (menu.open)
        dropdowns.forEach((other) => {
          if (other !== menu) other.open = false;
        });
    }),
  );
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".nav-dropdown"))
      dropdowns.forEach((menu) => (menu.open = false));
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape")
      dropdowns.forEach((menu) => {
        if (menu.open) {
          menu.open = false;
          menu.querySelector("summary").focus();
        }
      });
  });
})();

(() => {
  const current = location.pathname.replace(/\/$/, "/index.html");
  document.querySelectorAll(".header nav a").forEach((link) => {
    if (new URL(link.href, location.href).pathname === current) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });
})();
