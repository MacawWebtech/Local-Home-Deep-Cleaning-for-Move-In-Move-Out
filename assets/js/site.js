"use strict";
// Small shared utilities. User-provided values are escaped before HTML rendering.
globalThis.CNUI = {
  one(selector) {
    return document.querySelector(selector);
  },
  all(selector) {
    return [...document.querySelectorAll(selector)];
  },
  escape(value) {
    return String(value ?? "").replace(
      /[&<>"']/g,
      (char) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[char],
    );
  },
  read(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  },
  write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
  today() {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  },
  icon: '<svg class="home-symbol" viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M4 14 16 4l12 10M7 12v15h18V12M13 27v-9h6v9" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  selection() {
    return this.read("clearnest-selection", {
      type: "move-in",
      size: 0,
      package: "essential",
      bathrooms: 1,
      addons: [],
    });
  },
  setSelection(patch) {
    return this.write("clearnest-selection", { ...this.selection(), ...patch });
  },
};
(() => {
  const U = CNUI,
    $ = U.one,
    $$ = U.all;
  let theme;
  try {
    theme = localStorage.getItem("clearnest-theme");
  } catch {}
  const dark = theme
    ? theme === "dark"
    : matchMedia("(prefers-color-scheme: dark)").matches;
  function setTheme(value) {
    document.body.classList.toggle("dark", value);
    $("#theme").setAttribute("aria-pressed", value);
    $("#theme").setAttribute(
      "aria-label",
      `Switch to ${value ? "light" : "dark"} mode`,
    );
    try {
      localStorage.setItem("clearnest-theme", value ? "dark" : "light");
    } catch {}
  }
  setTheme(dark);
  $("#theme").addEventListener("click", () =>
    setTheme(!document.body.classList.contains("dark")),
  );
  let rtl = false;
  try {
    rtl = localStorage.getItem("clearnest-rtl") === "true";
  } catch {}
  function setRTL(value) {
    document.body.classList.toggle("rtl", value);
    $("#rtl").setAttribute("aria-pressed", value);
    $("#rtl").textContent = value ? "LTR" : "RTL";
    $("#rtl").setAttribute(
      "aria-label",
      value ? "Restore left-to-right layout" : "Reverse layout",
    );
    try {
      localStorage.setItem("clearnest-rtl", String(value));
    } catch {}
  }
  setRTL(rtl);
  $("#rtl").addEventListener("click", () =>
    setRTL(!document.body.classList.contains("rtl")),
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
  const menus = $$(".nav-dropdown");
  menus.forEach((menu) =>
    menu.addEventListener("toggle", () => {
      if (menu.open)
        menus.forEach((other) => {
          if (other !== menu) other.open = false;
        });
    }),
  );
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".nav-dropdown"))
      menus.forEach((menu) => (menu.open = false));
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      menus.forEach((menu) => {
        if (menu.open) {
          menu.open = false;
          menu.querySelector("summary").focus();
        }
      });
    }
  });
  $("#year").textContent = new Date().getFullYear();
  $$(".faq-list details").forEach((detail) =>
    detail.addEventListener("toggle", () => {
      if (detail.open)
        detail.parentElement.querySelectorAll("details").forEach((other) => {
          if (other !== detail) other.open = false;
        });
    }),
  );
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  let paused = false;
  try {
    paused = localStorage.getItem("clearnest-motion") === "paused";
  } catch {}
  if (!motion.matches && !paused && "IntersectionObserver" in window) {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (typeof entry.target.animate === "function")
              entry.target.animate(
                [
                  { opacity: 0, transform: "translateY(18px)" },
                  { opacity: 1, transform: "translateY(0)" },
                ],
                { duration: 600, easing: "cubic-bezier(.22,1,.36,1)" },
              );
            obs.unobserve(entry.target);
          }
        }),
      { threshold: 0.1 },
    );
    $$(
      ".content-card,.title-row,.note-box,.feature-pair article,.standards-list > div",
    ).forEach((element) => obs.observe(element));
  }
  function packageCards(host, size = 0, type = "move-in", bathrooms = 1) {
    host.innerHTML = CN.packages
      .map(
        (pack) =>
          `<article class="content-card"><p class="eyebrow">${pack.id === "essential" ? "A CLEAR START" : pack.id === "complete" ? "A DEEPER RESET" : "EXTRA ATTENTION"}</p><h3>${pack.name}</h3><div class="price-amount">${CN.money(CN.calculate({ size, type, bathrooms, package: pack.id, addons: [] }))}</div><p>${pack.detail}</p><p class="form-note">${CN.hours({ size, package: pack.id, addons: [] })}. Interior appliances remain optional.</p><a class="button primary package-link" href="book-cleaning.html" data-package="${pack.id}">Choose this scope ↗</a></article>`,
      )
      .join("");
    host.querySelectorAll(".package-link").forEach((link) =>
      link.addEventListener("click", () =>
        U.setSelection({
          size,
          type,
          bathrooms,
          package: link.dataset.package,
        }),
      ),
    );
  }
  $$("[data-package-cards]").forEach((host) => packageCards(host));
  $$("[data-addon-list]").forEach(
    (host) =>
      (host.innerHTML = CN.addons
        .map(
          (item) =>
            `<div class="addon-item"><strong>${item.name}</strong><span>${CN.money(item.price)}</span></div>`,
        )
        .join("")),
  );
  if ($("#home-room-directory"))
    $("#home-room-directory").innerHTML = Object.keys(CN.rooms)
      .map(
        (name, index) =>
          `<a href="cleaning-checklist.html?room=${encodeURIComponent(name)}"><span>0${index + 1} ↗</span><strong>${name}</strong></a>`,
      )
      .join("");
  // Services: searchable scope catalogue with real detail routes.
  if ($("#service-catalog")) {
    function render() {
      const query = $("#service-search").value.toLowerCase().trim();
      const filter = $("#service-filter").value;
      const services = CN.services.filter(
        (item) =>
          item.join(" ").toLowerCase().includes(query) &&
          (filter === "all" ||
            (filter === "optional"
              ? /optional|add-on|separately/i.test(item[4])
              : !/optional|add-on|separately/i.test(item[4]))),
      );
      $("#service-count").textContent =
        `${services.length} service${services.length === 1 ? "" : "s"} found`;
      $("#service-catalog").innerHTML =
        services
          .map(
            (item, index) =>
              `<article class="content-card"><div class="service-icon">${U.icon}<span>${String(index + 1).padStart(2, "0")}</span></div><span class="badge">${item[4]}</span><h3>${item[1]}</h3><p>${item[2]}</p><ul>${item[3]
                .split("|")
                .map((task) => `<li>${task}</li>`)
                .join(
                  "",
                )}</ul><div class="card-actions"><a class="text-link" href="service-details.html?service=${item[0]}">Learn more ↗</a><a class="button primary" href="book-cleaning.html?service=${item[0]}">Book cleaning ↗</a></div></article>`,
          )
          .join("") ||
        '<div class="empty-state"><h3>No matching services.</h3><p>Try another room or cleaning term.</p></div>';
    }
    $("#service-search").addEventListener("input", render);
    $("#service-filter").addEventListener("change", render);
    render();
  }
  if ($("#service-detail-content")) {
    const id = new URLSearchParams(location.search).get("service") || "move-in";
    const item =
      CN.services.find((service) => service[0] === id) || CN.services[0];
    const room = ["bathroom", "kitchen", "bedroom", "floors"].includes(item[0])
      ? item[0]
      : item[0] === "living"
        ? "bright-home"
        : "living-room";
    const image =
      room === "floors" ? "living-room" : room === "bedroom" ? "bedroom" : room;
    $("#service-detail-content").className = "detail-article";
    $("#service-detail-content").innerHTML =
      `<p class="eyebrow">${item[4]}</p><h2>${item[1]}</h2><p>${item[2]} Scope is discussed in relation to property condition, access and selected package.</p><img class="scope-image" src="../assets/images/${image}.jpg" alt="Illustrative residential space for this cleaning scope" width="1200" height="800"><h3>What’s considered</h3><ul>${item[3]
        .split("|")
        .map((task) => `<li>${task}</li>`)
        .join(
          "",
        )}</ul><h3>Suitable property types</h3><p>Apartments, independent homes and accessible residential rooms. Empty homes allow easier access; furnished homes need clear paths and discussion of heavy furniture.</p><h3>Room-by-room checklist</h3><p>Use our checklist to review kitchen, bathroom, bedroom and living-area tasks. Not every task is included in every package.</p><a class="text-link" href="cleaning-checklist.html">Review the checklist ↗</a><h3>Methods and preparation</h3><p>Check surface materials and product suitability first. Share delicate finishes, access limitations and areas requiring extra time. Avoid mixing cleaning chemicals and follow product instructions.</p><h3>Optional care</h3><p>Oven and refrigerator interiors, cabinet interiors, extra bathrooms, balconies and additional deep-cleaning time are priced separately.</p><h3>Duration and pricing</h3><p>Indicative duration begins at 3–4 hours for a studio, with extra time for larger homes, bathrooms and add-ons. Size alone does not determine the final quote.</p><a class="text-link" href="pricing.html">Understand estimates ↗</a><h3>Before-and-after context</h3><p>Results depend on material and condition. Illustrative gallery comparisons explain scope; they are not actual customer results or guarantees of stain removal or deposit return.</p><a class="text-link" href="gallery.html">Explore scope comparisons ↗</a>`;
    // Group the existing service copy without changing its wording or routes.
    const detail = $("#service-detail-content");
    const originalNodes = [...detail.children];
    const overview = document.createElement("div");
    overview.className = "detail-overview";
    const panels = document.createElement("div");
    panels.className = "detail-panels";
    let currentPanel = null;
    originalNodes.forEach((node) => {
      if (node.tagName === "H3") {
        currentPanel = document.createElement("section");
        currentPanel.className = "detail-info-card";
        panels.append(currentPanel);
      }
      (currentPanel || overview).append(node);
    });
    detail.replaceChildren(overview, panels);
    document.title = `${item[1]} | ClearNest`;
    $("#related-services").innerHTML = CN.services
      .filter((service) => service[0] !== item[0])
      .slice(0, 3)
      .map(
        (service) =>
          `<article class="content-card"><h3>${service[1]}</h3><p>${service[2]}</p><a class="text-link" href="service-details.html?service=${service[0]}">Explore this scope ↗</a></article>`,
      )
      .join("");
  }
  if ($("#pricing-cards")) {
    $("#price-type").innerHTML = CN.types
      .map((item) => `<option value="${item.id}">${item.name}</option>`)
      .join("");
    $("#price-size").innerHTML = CN.sizes
      .map((name, index) => `<option value="${index}">${name}</option>`)
      .join("");
    function prices() {
      packageCards(
        $("#pricing-cards"),
        Number($("#price-size").value),
        $("#price-type").value,
        Number($("#price-bathrooms").value),
      );
    }
    ["#price-type", "#price-size", "#price-bathrooms"].forEach((id) =>
      $(id).addEventListener("change", prices),
    );
    prices();
  }
  if ($("#coverage-form")) {
    $("#coverage-zones").innerHTML = CN.coverage
      .map(
        (zone) =>
          `<article class="content-card"><p class="eyebrow">CONFIGURED COVERAGE</p><h3>${zone.name}</h3><strong>${zone.code}</strong><p>${zone.note} Location and scheduling require operator confirmation.</p><a class="text-link" href="book-cleaning.html">Request a location review ↗</a></article>`,
      )
      .join("");
    $("#coverage-form").addEventListener("submit", (event) => {
      event.preventDefault();
      if (!event.target.reportValidity()) return;
      const code = event.target.elements.postal.value.trim();
      const zone = CN.coverage.find((item) => item.code === code);
      $("#coverage-result").textContent = zone
        ? `${zone.name} is listed in the illustrative configuration. Coverage and availability are not confirmed.`
        : "This code is not in the configured list. Share your location in an enquiry for review.";
    });
  }
  if ($("#checklist-content")) {
    let room = new URLSearchParams(location.search).get("room");
    if (!CN.rooms[room]) room = "Kitchen";
    $("#checklist-package").innerHTML = CN.packages
      .map((pack) => `<option value="${pack.id}">${pack.name}</option>`)
      .join("");
    $("#checklist-package").value = U.selection().package || "essential";
    const names = Object.keys(CN.rooms);
    $("#checklist-tabs").innerHTML = names
      .map(
        (name, index) =>
          `<button id="check-tab-${index}" role="tab" data-room="${name}" aria-controls="checklist-content">${name}<span>0${index + 1} ↗</span></button>`,
      )
      .join("");
    function render() {
      const pack = $("#checklist-package").value;
      $("#checklist-tabs")
        .querySelectorAll("button")
        .forEach((button, index) => {
          const selected = button.dataset.room === room;
          button.setAttribute("aria-selected", selected);
          button.tabIndex = selected ? 0 : -1;
          if (selected)
            $("#checklist-content").setAttribute(
              "aria-labelledby",
              `check-tab-${index}`,
            );
        });
      $("#checklist-content").innerHTML =
        `<h2>${room}</h2><p class="form-note">${CN.packages.find((item) => item.id === pack).name}: tasks apply only where safely accessible and agreed.</p>` +
        CN.rooms[room]
          .map((task) => {
            const optional =
              room === "Additional areas" &&
              ["Balconies", "Utility spaces"].includes(task);
            const detailed = task === "Baseboards";
            const included = !optional && !(detailed && pack === "essential");
            return `<details class="task-detail"><summary>${task}<span class="badge">${included ? "Included in agreed scope" : "Optional / discuss"}</span></summary><p>Review accessible ${task.toLowerCase()} and surface materials before work. ${optional ? "This area needs an agreed add-on." : detailed ? "Detailed edges depend on package and access." : "The approach depends on the material and condition."}</p></details>`;
          })
          .join("");
      U.setSelection({ package: pack });
    }
    $$("#checklist-tabs button").forEach((button, index) => {
      button.addEventListener("click", () => {
        room = button.dataset.room;
        render();
      });
      button.addEventListener("keydown", (event) => {
        let n;
        if (event.key === "ArrowRight" || event.key === "ArrowDown")
          n = (index + 1) % names.length;
        if (event.key === "ArrowLeft" || event.key === "ArrowUp")
          n = (index - 1 + names.length) % names.length;
        if (event.key === "Home") n = 0;
        if (event.key === "End") n = names.length - 1;
        if (n !== undefined) {
          event.preventDefault();
          room = names[n];
          render();
          $$("#checklist-tabs button")[n].focus();
        }
      });
    });
    $("#checklist-package").addEventListener("change", render);
    render();
    const selected = U.selection().addons || [];
    $("#checklist-addons").innerHTML = CN.addons
      .map(
        (addon) =>
          `<label class="check-label"><input type="checkbox" value="${addon.id}" ${selected.includes(addon.id) ? "checked" : ""}>${addon.name} · ${CN.money(addon.price)}</label>`,
      )
      .join("");
    $$("#checklist-addons input").forEach((input) =>
      input.addEventListener("change", () =>
        U.setSelection({
          addons: $$("#checklist-addons input:checked").map(
            (item) => item.value,
          ),
        }),
      ),
    );
  }
  // Editorial pages: search, category filtering and real pagination.
  function postCard(post) {
    return `<article class="content-card"><img src="../assets/images/${post[4]}.jpg" alt="Residential interior illustrating ${post[1]}" width="1200" height="800" loading="lazy"><div class="blog-card-body"><p class="eyebrow">${post[2]} · ${post[5]} MIN READ</p><h3>${post[1]}</h3><p>${post[3]}</p><a class="text-link" href="blog-details.html?article=${post[0]}">Read the article ↗</a></div></article>`;
  }
  if ($("#blog-grid")) {
    const featured = CN.posts[0];
    $("#featured-post").innerHTML =
      `<img src="../assets/images/${featured[4]}.jpg" alt="Residential kitchen for a moving checklist" width="1200" height="800"><div><p class="eyebrow">FEATURED / ${featured[2]}</p><h2>${featured[1]}</h2><p>${featured[3]}</p><a class="button primary" href="blog-details.html?article=${featured[0]}">Read the guide ↗</a></div>`;
    let current = 1;
    const initial = new URLSearchParams(location.search).get("category");
    if (
      initial &&
      [...$("#blog-category").options].some(
        (option) => option.value === initial,
      )
    )
      $("#blog-category").value = initial;
    function render() {
      const query = $("#blog-search").value.toLowerCase().trim(),
        category = $("#blog-category").value;
      const matches = CN.posts.filter(
        (post) =>
          post.join(" ").toLowerCase().includes(query) &&
          (category === "All topics" || post[2] === category),
      );
      const count = Math.max(1, Math.ceil(matches.length / 6));
      current = Math.min(current, count);
      $("#blog-count").textContent =
        `${matches.length} article${matches.length === 1 ? "" : "s"} found`;
      $("#blog-grid").innerHTML =
        matches
          .slice((current - 1) * 6, current * 6)
          .map(postCard)
          .join("") ||
        '<div class="empty-state"><h3>No matching articles.</h3><p>Try a broader cleaning or moving term.</p></div>';
      $("#blog-pagination").innerHTML = Array.from(
        { length: count },
        (_, index) =>
          `<button class="${current === index + 1 ? "selected" : ""}" ${current === index + 1 ? 'aria-current="page"' : ""} data-page="${index + 1}">${index + 1}</button>`,
      ).join("");
      $$("#blog-pagination button").forEach((button) =>
        button.addEventListener("click", () => {
          current = Number(button.dataset.page);
          render();
          $("#blog-count").scrollIntoView({
            block: "center",
            behavior: motion.matches ? "instant" : "smooth",
          });
        }),
      );
    }
    $("#blog-search").addEventListener("input", () => {
      current = 1;
      render();
    });
    $("#blog-category").addEventListener("change", () => {
      current = 1;
      render();
    });
    render();
  }
  if ($("#article-content")) {
    const slug = new URLSearchParams(location.search).get("article");
    const post = CN.posts.find((item) => item[0] === slug) || CN.posts[0];
    const index = CN.posts.indexOf(post);
    const topics = {
      "Moving in": [
        [
          "Start before the boxes arrive",
          "Empty rooms offer easier access to floors, cabinets and reachable surfaces. Plan the cleaning window before unpacking, and make sure water, power and entry arrangements are ready.",
        ],
        [
          "Agree room-by-room scope",
          "List kitchen and bathroom priorities alongside bedrooms and living areas. Appliance interiors and cabinet interiors should be requested explicitly; they are not automatic standard inclusions.",
        ],
        [
          "Leave time for a review",
          "Keep time between the clean and furniture delivery. Review the agreed scope and discuss inaccessible areas, surface limitations or additional work before moving in.",
        ],
      ],
      "Moving out": [
        [
          "Separate packing from cleaning",
          "Remove belongings from the areas to be cleaned and finish packing before the appointment where possible. A clear path helps keep scope practical and makes floors and edges easier to reach.",
        ],
        [
          "Work from a written checklist",
          "List safely accessible kitchen, bathroom, bedroom and living-area tasks. Discuss appliance interiors, balconies and additional bathrooms separately so the expected work matches the quote.",
        ],
        [
          "Prepare for handover",
          "Arrange a final walk-through against the agreed scope. Cleaning helps prepare the property, but a landlord or manager decides deposit matters and no result can guarantee a refund.",
        ],
      ],
      "Cleaning care": [
        [
          "Routine care and detailed care serve different needs",
          "Routine cleaning supports everyday upkeep. A deep clean is a planned review of accessible surfaces, fittings and room details, shaped by the property’s condition and selected package.",
        ],
        [
          "Materials determine the approach",
          "Identify delicate finishes, flooring types and existing damage before work. Follow product instructions, test compatibility where appropriate and never mix cleaning chemicals.",
        ],
        [
          "Discuss difficult areas early",
          "Share buildup, access restrictions and fragile belongings. Some marks are permanent, some tasks need extra time and some areas may be outside a safe accessible scope.",
        ],
      ],
      Planning: [
        [
          "Start with size, access and condition",
          "Bedrooms are a useful starting point, but floor area, bathrooms, additional spaces and buildup affect time and cost. Send a clear description rather than relying on property size alone.",
        ],
        [
          "Make the practical details easy",
          "Share entry instructions, parking information, working utilities and moving dates. Keep valuable or delicate belongings out of the cleaning path and note anything that should not be moved.",
        ],
        [
          "Review an estimate before confirmation",
          "Add-ons and property assessment can change an indicative price. Agree the final quote and requested schedule before treating an appointment as confirmed.",
        ],
      ],
    };
    const sections = topics[post[2]];
    $("#article-content").innerHTML =
      `<p class="eyebrow">${post[2]}</p><h2>${post[1]}</h2><p class="article-meta">ClearNest editorial · Updated 12 October 2026 · ${post[5]} minute read</p><img src="../assets/images/${post[4]}.jpg" alt="Illustrative residential space" width="1200" height="800"><p>${post[3]}</p>` +
      sections
        .map(([heading, text]) => `<h3>${heading}</h3><p>${text}</p>`)
        .join("") +
      `<h3>Your preparation checklist</h3><ul><li>Confirm which rooms and tasks are in scope.</li><li>Share property access, utilities and special surfaces.</li><li>Request optional tasks explicitly.</li><li>Leave a realistic window for cleaning and review.</li></ul><p>Exact scope and results depend on property condition, access and materials. Use this guide as a planning aid, then discuss your home’s specific needs.</p>`;
    document.title = `${post[1]} | ClearNest`;
    $("#article-navigation").innerHTML =
      `<a class="text-link" href="blog-details.html?article=${CN.posts[(index - 1 + CN.posts.length) % CN.posts.length][0]}">← Previous article</a><a class="text-link" href="blog-details.html?article=${CN.posts[(index + 1) % CN.posts.length][0]}">Next article →</a>`;
    $("#related-posts").classList.add("blog-grid");
    $("#related-posts").innerHTML = CN.posts
      .filter((item) => item !== post)
      .slice(0, 3)
      .map(postCard)
      .join("");
    $("#share-article").addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(location.href);
        $("#share-status").textContent = "Article link copied.";
      } catch {
        $("#share-status").textContent =
          "Copy the address from your browser to share this article.";
      }
    });
    const schema = document.createElement("script");
    schema.type = "application/ld+json";
    schema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post[1],
      author: { "@type": "Organization", name: "ClearNest editorial" },
      dateModified: "2026-10-12",
    });
    document.head.append(schema);
  }
  if ($("#contact-form"))
    $("#contact-form").addEventListener("submit", (event) => {
      event.preventDefault();
      if (!event.target.reportValidity()) return;
      const data = Object.fromEntries(new FormData(event.target));
      if (!data.name.trim() || !data.message.trim()) {
        event.target.querySelector(".form-status").textContent =
          "Please enter your name and enquiry message.";
        return;
      }
      const saved = U.write("clearnest-contact", {
        ...data,
        createdAt: new Date().toISOString(),
      });
      event.target.querySelector(".form-status").textContent = saved
        ? "Your enquiry is saved on this device. No message has been sent."
        : "Your browser could not save the enquiry. Please retain your details and try again.";
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
