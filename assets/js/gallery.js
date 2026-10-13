"use strict";
(() => {
  const U = CNUI,
    $ = U.one;
  const entries = [
    ["kitchens", "Kitchens", "kitchen"],
    ["bathrooms", "Bathrooms", "bathroom"],
    ["living", "Living Rooms", "living-room"],
    ["bedrooms", "Bedrooms", "bedroom"],
    ["floors", "Floors", "bright-home"],
    ["cabinets", "Cabinets", "kitchen-detail"],
    ["move-out", "Move-Out Properties", "bright-home"],
  ];
  let filter = "all";
  $("#gallery-filters").innerHTML = [
    ["all", "All spaces"],
    ...entries.map((item) => [item[0], item[1]]),
  ]
    .map(
      ([id, name]) =>
        `<button data-category="${id}" aria-pressed="${id === "all"}" class="${id === "all" ? "selected" : ""}">${name}</button>`,
    )
    .join("");
  function render() {
    const visible = entries.filter(
      (item) => filter === "all" || filter === item[0],
    );
    $("#gallery-grid").innerHTML = visible
      .map(
        ([id, name, image]) =>
          `<article class="gallery-card"><img class="space-photo" src="../assets/images/${image}.jpg" alt="Illustrative ${name.toLowerCase()} interior" width="1200" height="800" loading="lazy"><h3>${name}</h3><p>Interior photography for inspiration. The comparison below is a cleaning-scope diagram, not a customer result.</p><div class="compare-window" id="comparison-${id}" style="--split:50%"><img src="../assets/images/gallery/${id}-before.jpg" alt="Illustrative room diagram with dust marks before agreed cleaning" width="960" height="600" loading="lazy"><img class="after-image" src="../assets/images/gallery/${id}-after.jpg" alt="Same illustrative room diagram showing cleaned accessible surfaces" width="960" height="600" loading="lazy"><span class="compare-line" aria-hidden="true"></span><div class="compare-labels"><span>Before · Diagram</span><span>After · Diagram</span></div></div><label class="compare-control">${name} comparison<input type="range" min="0" max="100" value="50" data-compare="${id}" aria-controls="comparison-${id}" aria-valuetext="50 percent before, 50 percent after"></label><a class="text-link" href="service-details.html?service=${id === "kitchens" ? "kitchen" : id === "bathrooms" ? "bathroom" : id === "bedrooms" ? "bedroom" : id === "living" ? "living" : id === "move-out" ? "move-out" : id}">Explore related care ↗</a></article>`,
      )
      .join("");
    document.querySelectorAll("[data-compare]").forEach((input) =>
      input.addEventListener("input", () => {
        document
          .getElementById(`comparison-${input.dataset.compare}`)
          .style.setProperty("--split", `${input.value}%`);
        input.setAttribute(
          "aria-valuetext",
          `${input.value} percent before, ${100 - Number(input.value)} percent after`,
        );
      }),
    );
  }
  document.querySelectorAll("[data-category]").forEach((button) =>
    button.addEventListener("click", () => {
      filter = button.dataset.category;
      document.querySelectorAll("[data-category]").forEach((item) => {
        item.classList.toggle("selected", item === button);
        item.setAttribute("aria-pressed", item === button);
      });
      render();
    }),
  );
  render();
})();
