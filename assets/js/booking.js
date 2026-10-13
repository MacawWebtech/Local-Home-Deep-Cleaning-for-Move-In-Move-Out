"use strict";
(() => {
  const U = CNUI,
    $ = U.one,
    esc = U.escape;
  const defaults = {
    type: "move-in",
    size: 0,
    package: "essential",
    bathrooms: 1,
    addons: [],
    date: "",
    time: "Morning · 9am–12pm",
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postal: "",
    access: "",
    parking: "",
    notes: "",
  };
  const saved = U.read("clearnest-booking-draft", {});
  const selection = U.selection();
  let plan = { ...defaults, ...saved, ...selection };
  if (!CN.types.some((item) => item.id === plan.type)) plan.type = "move-in";
  if (!CN.packages.some((item) => item.id === plan.package))
    plan.package = "essential";
  if (
    !Number.isInteger(Number(plan.size)) ||
    Number(plan.size) < 0 ||
    Number(plan.size) > 4
  )
    plan.size = 0;
  if (!Array.isArray(plan.addons)) plan.addons = [];
  plan.addons = [...new Set(plan.addons)].filter((id) =>
    CN.addons.some((item) => item.id === id),
  );
  const service = new URLSearchParams(location.search).get("service");
  if (service === "move-in" || service === "move-out") plan.type = service;
  const profile = U.read("clearnest-profile", {});
  ["name", "email", "phone"].forEach((key) => {
    if (!plan[key] && profile[key]) plan[key] = profile[key];
  });
  let step = 1,
    submittedRecord = null;
  const headings = [
    "Choose your cleaning type.",
    "Tell us about your property.",
    "Choose a cleaning package.",
    "Add a little extra care.",
    "Choose a preferred schedule.",
    "Share property and contact details.",
    "Review your cleaning request.",
    "Your request is saved.",
  ];
  function radio(name, value, title, text, checked) {
    return `<label class="selection-card"><input type="radio" name="${name}" value="${value}" ${checked ? "checked" : ""} required><strong>${title}</strong><span>${text}</span></label>`;
  }
  function typeName() {
    return CN.types.find((item) => item.id === plan.type).name;
  }
  function packageName() {
    return CN.packages.find((item) => item.id === plan.package).name;
  }
  function summary(full = false) {
    const addons =
      plan.addons
        .map((id) => CN.addons.find((item) => item.id === id).name)
        .join(", ") || "None selected";
    const pairs = [
      ["Cleaning type", typeName()],
      ["Property", CN.sizes[Number(plan.size)]],
      ["Bathrooms", String(plan.bathrooms)],
      ["Package", packageName()],
      ["Add-ons", addons],
      ["Preferred date", plan.date || "Not selected"],
      ["Arrival window", plan.time],
      ["Duration", CN.hours(plan)],
    ];
    if (full)
      pairs.push(
        ["Customer", plan.name],
        ["Email", plan.email],
        ["Phone", plan.phone],
        [
          "Address",
          [plan.address, plan.city, plan.postal].filter(Boolean).join(", "),
        ],
        ["Access", plan.access || "To be discussed"],
        ["Parking / entry", plan.parking || "To be discussed"],
        ["Special requirements", plan.notes || "None noted"],
      );
    return `<dl class="summary-list">${pairs.map(([label, value]) => `<div><dt>${label}</dt><dd>${esc(value)}</dd></div>`).join("")}</dl><div class="summary-price">${CN.money(CN.calculate(plan))}</div><p class="form-note">Indicative estimate. Extra bathroom care is ₹499 per additional bathroom. Final scope and cost require assessment.</p>`;
  }
  function updateSummary() {
    $("#live-booking-summary").innerHTML = summary();
  }
  function collect() {
    const form = $("#booking-form");
    const data = new FormData(form);
    if (step === 1 && data.has("type")) plan.type = data.get("type");
    if (step === 2) {
      if (data.has("size")) plan.size = Number(data.get("size"));
      plan.bathrooms = Number(data.get("bathrooms") || 1);
    }
    if (step === 3 && data.has("package")) plan.package = data.get("package");
    if (step === 4) plan.addons = data.getAll("addons");
    if (step === 5) {
      plan.date = data.get("date") || "";
      plan.time = data.get("time") || defaults.time;
    }
    if (step === 6)
      [
        "name",
        "email",
        "phone",
        "address",
        "city",
        "postal",
        "access",
        "parking",
        "notes",
      ].forEach((key) => (plan[key] = String(data.get(key) || "").trim()));
    U.write("clearnest-booking-draft", plan);
    U.setSelection({
      type: plan.type,
      size: plan.size,
      package: plan.package,
      bathrooms: plan.bathrooms,
      addons: plan.addons,
    });
    updateSummary();
  }
  function render() {
    const host = $("#booking-step");
    $("#step-count").textContent = `Step ${step} of 8 · ${headings[step - 1]}`;
    $("#booking-progress").value = step;
    $("#booking-error").textContent = "";
    $("#booking-prev").hidden = step === 1 || step === 8;
    $("#booking-next").hidden = step === 8;
    $("#booking-next").textContent =
      step === 7 ? "Save request ↗" : "Continue ↗";
    let body = "";
    if (step === 1)
      body = `<p>Choose the purpose of your appointment.</p><div class="selection-grid">${CN.types.map((item) => radio("type", item.id, item.name, item.id === "move-in" ? "Before you unpack." : item.id === "move-out" ? "Before property handover." : "A reset for everyday living.", plan.type === item.id)).join("")}</div>`;
    if (step === 2)
      body = `<p>Property size is a starting point; access and condition also affect scope.</p><div class="selection-grid">${CN.sizes.map((name, index) => radio("size", index, name, index === 4 ? "A tailored quote after assessment." : `${CN.money(CN.prices[index])} base estimate.`, Number(plan.size) === index)).join("")}</div><label style="margin-top:24px">Bathrooms<select name="bathrooms">${[1, 2, 3, 4].map((value) => `<option value="${value}" ${Number(plan.bathrooms) === value ? "selected" : ""}>${value} bathroom${value === 1 ? "" : "s"}</option>`).join("")}</select></label><p class="form-note">The base estimate includes one bathroom. Additional bathroom care adds ₹499 each.</p>`;
    if (step === 3)
      body = `<p>Each package lists its intended scope. Optional tasks remain separate.</p><div class="selection-grid">${CN.packages.map((pack) => radio("package", pack.id, pack.name, `${pack.detail} ${CN.money(CN.calculate({ ...plan, package: pack.id }))} · ${CN.hours({ ...plan, package: pack.id })}`, plan.package === pack.id)).join("")}</div>`;
    if (step === 4)
      body = `<p>Select optional tasks. Skip this step if standard scope is sufficient.</p><div class="addon-grid">${CN.addons.map((addon) => `<label class="selection-card"><input type="checkbox" name="addons" value="${addon.id}" ${plan.addons.includes(addon.id) ? "checked" : ""}><strong>${addon.name}</strong><span>${CN.money(addon.price)}</span></label>`).join("")}</div>`;
    if (step === 5)
      body = `<p>These are preferred dates and arrival windows. Live availability is not connected.</p><div class="calendar-choice"><label>Preferred date<input name="date" type="date" min="${U.today()}" value="${esc(plan.date)}" required></label><fieldset class="slot-options"><legend>Preferred arrival window</legend>${[defaults.time, "Afternoon · 12pm–3pm", "Late afternoon · 3pm–6pm"].map((time) => `<label class="check-label"><input type="radio" name="time" value="${time}" ${time === plan.time ? "checked" : ""} required>${time}</label>`).join("")}</fieldset></div>`;
    if (step === 6)
      body = `<p>Share access and any requirements that affect cleaning scope.</p><div class="form-grid"><label>Full name<input name="name" value="${esc(plan.name)}" autocomplete="name" required maxlength="100"></label><label>Email<input name="email" type="email" value="${esc(plan.email)}" autocomplete="email" required></label><label>Phone<input name="phone" type="tel" value="${esc(plan.phone)}" autocomplete="tel" required pattern="[0-9+\\s\\-]{7,20}" title="7–20 digits, spaces, +, brackets or hyphens."></label><label>City<input name="city" value="${esc(plan.city)}" autocomplete="address-level2" required></label><label class="full">Property address<textarea name="address" autocomplete="street-address" required rows="2" maxlength="300">${esc(plan.address)}</textarea></label><label>Postal code<input name="postal" value="${esc(plan.postal)}" inputmode="numeric" pattern="[0-9]{6}" maxlength="6" autocomplete="postal-code" required></label><label>Parking / entry information<input name="parking" value="${esc(plan.parking)}" maxlength="300"></label><label class="full">Property access instructions<input name="access" value="${esc(plan.access)}" maxlength="300"></label><label class="full">Special cleaning requirements<textarea name="notes" rows="3" maxlength="1000">${esc(plan.notes)}</textarea></label></div>`;
    if (step === 7)
      body = `<p>Review your details. Saving creates a local request awaiting confirmation, not a confirmed appointment or a payment.</p>${summary(true)}<label class="check-label" style="margin-top:24px"><input type="checkbox" name="review" required>I have reviewed the details and understand that this request is stored on this device and has not been sent.</label>`;
    if (step === 8)
      body = `<div class="note-box"><h3>Reference ${esc(submittedRecord.reference)}</h3><p>Status: Awaiting confirmation.</p><p>Your request is stored on this device. No appointment has been confirmed, no payment has been made and no request has been sent to an operator.</p></div><div class="button-row"><a class="button primary" href="dashboard.html">Open customer dashboard ↗</a><a class="text-link" href="contact.html">Review contact options ↗</a></div>`;
    host.innerHTML = `<h2 tabindex="-1" id="booking-step-heading">${headings[step - 1]}</h2>${body}`;
    host.querySelectorAll("input,select,textarea").forEach((input) =>
      input.addEventListener("change", () => {
        input.setCustomValidity("");
        collect();
      }),
    );
    updateSummary();
  }
  $("#booking-prev").addEventListener("click", () => {
    collect();
    if (step > 1) step--;
    render();
    $("#booking-step-heading").focus();
  });
  $("#booking-form").addEventListener("submit", (event) => {
    event.preventDefault();
    collect();
    if (!event.target.reportValidity()) return;
    if (step === 5 && plan.date < U.today()) {
      $("#booking-error").textContent = "Choose today or a future date.";
      return;
    }
    if (step === 6 && ["name", "city", "address"].some((key) => !plan[key])) {
      $("#booking-error").textContent =
        "Please enter a name, city and property address.";
      return;
    }
    if (step === 7) {
      if (!plan.date || plan.date < U.today()) {
        $("#booking-error").textContent =
          "Your preferred date has passed. Return to the schedule step and choose a new date.";
        return;
      }
      const records = U.read("clearnest-bookings", []);
      const reference = `CN-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
      submittedRecord = {
        ...plan,
        reference,
        status: "Awaiting confirmation",
        estimate: CN.calculate(plan),
        duration: CN.hours(plan),
        createdAt: new Date().toISOString(),
        source: "local request",
      };
      if (
        !Array.isArray(records) ||
        !U.write("clearnest-bookings", [submittedRecord, ...records])
      ) {
        $("#booking-error").textContent =
          "Your browser could not save this request. Keep your details and try again.";
        return;
      }
      U.write("clearnest-booking-draft", {});
      step = 8;
    } else step++;
    render();
    $("#booking-step-heading").focus();
  });
  render();
})();
