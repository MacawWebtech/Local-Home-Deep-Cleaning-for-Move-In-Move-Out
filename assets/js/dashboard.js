"use strict";
(() => {
  const U = CNUI,
    $ = U.one,
    esc = U.escape;
  let panel = "overview",
    statusFilter = "all";
  const labels = {
    overview: "Overview",
    bookings: "My bookings",
    status: "Booking status",
    packages: "Cleaning packages",
    payments: "Payments & invoices",
    addresses: "Saved addresses",
    notifications: "Notifications",
    profile: "Profile settings",
  };
  function records() {
    const value = U.read("clearnest-bookings", []);
    return Array.isArray(value) ? value : [];
  }
  function addresses() {
    const value = U.read("clearnest-addresses", []);
    return Array.isArray(value) ? value : [];
  }
  function empty(title, copy) {
    return `<div class="empty-state"><h3>${title}</h3><p>${copy}</p><a class="button primary" href="book-cleaning.html">Plan a cleaning ↗</a></div>`;
  }
  function storeRecords(list) {
    return U.write("clearnest-bookings", list);
  }
  function type(record) {
    return (
      CN.types.find((item) => item.id === record.type)?.name ||
      "Cleaning request"
    );
  }
  function pack(record) {
    return (
      CN.packages.find((item) => item.id === record.package)?.name ||
      "Scope to be reviewed"
    );
  }
  function table(list, mode = "bookings") {
    return `<div class="table-wrap"><table><caption>Locally saved requests; schedules and costs are not confirmed.</caption><thead><tr><th>Reference</th><th>Cleaning / property</th><th>Preferred date</th><th>Estimate</th><th>Status</th><th>Actions</th></tr></thead><tbody>${list.map((record) => `<tr><td>${esc(record.reference)}</td><td>${esc(type(record))}<br>${esc(CN.sizes[Number(record.size)] || "Property assessment")}</td><td>${esc(record.date)}</td><td>${CN.money(record.estimate)}</td><td>${esc(record.status)}</td><td><div class="record-actions"><button data-view="${esc(record.reference)}">View details</button>${mode === "bookings" && record.status !== "Cancelled" ? `<button data-change="${esc(record.reference)}">Request change</button><button data-cancel="${esc(record.reference)}">Cancel local request</button>` : ""}</div></td></tr>`).join("")}</tbody></table></div><div id="record-detail"></div>`;
  }
  function timeline(record) {
    const stages = [
      "Request submitted",
      "Awaiting confirmation",
      "Booking confirmed",
      "Cleaner assigned",
      "Cleaning scheduled",
      "Cleaning in progress",
      "Quality review",
      "Completed",
    ];
    return `<ol class="status-track">${stages.map((stage, index) => `<li class="${index < 2 && record.status !== "Cancelled" ? "done" : ""}"><span>${String(index + 1).padStart(2, "0")}</span>${stage}${index > 1 ? " · Not connected" : ""}</li>`).join("")}</ol><p class="form-note">Only locally submitted requests are tracked. Later operational stages need a connected booking service.</p>`;
  }
  function detail(reference) {
    const record = records().find((item) => item.reference === reference);
    if (!record) return;
    const host = $("#record-detail") || $("#status-detail");
    host.innerHTML = `<div class="content-card" style="margin-top:25px"><h2>Request ${esc(record.reference)}</h2><dl class="summary-list">${[
      ["Service", type(record)],
      ["Property", CN.sizes[Number(record.size)]],
      ["Package", pack(record)],
      ["Bathrooms", record.bathrooms],
      ["Preferred schedule", `${record.date} / ${record.time}`],
      ["Contact", `${record.name} / ${record.email} / ${record.phone}`],
      ["Address", `${record.address}, ${record.city}, ${record.postal}`],
      ["Access", record.access || "Not specified"],
      ["Notes", record.notes || "None"],
      ["Status", record.status],
    ]
      .map(([key, value]) => `<div><dt>${key}</dt><dd>${esc(value)}</dd></div>`)
      .join(
        "",
      )}</dl><div class="summary-price">${CN.money(record.estimate)}</div><p>Indicative estimate only. No payment or confirmed appointment is recorded.</p>${timeline(record)}<button class="button outline" id="download-request">Download request summary ↗</button></div>`;
    $("#download-request").addEventListener("click", () => {
      const blob = new Blob([JSON.stringify(record, null, 2)], {
          type: "application/json",
        }),
        url = URL.createObjectURL(blob),
        link = document.createElement("a");
      link.href = url;
      link.download = `${record.reference}-request.json`;
      link.click();
      URL.revokeObjectURL(url);
    });
    host.scrollIntoView({
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
      block: "start",
    });
  }
  function bindRecords() {
    document
      .querySelectorAll("[data-view]")
      .forEach((button) =>
        button.addEventListener("click", () => detail(button.dataset.view)),
      );
    document.querySelectorAll("[data-cancel]").forEach((button) =>
      button.addEventListener("click", () => {
        const list = records();
        const record = list.find(
          (item) => item.reference === button.dataset.cancel,
        );
        record.status = "Cancelled";
        record.cancelledAt = new Date().toISOString();
        if (!storeRecords(list)) {
          notice("Your browser could not save the cancellation.");
          return;
        }
        render();
        notice(
          "The local request is marked cancelled. No cancellation was sent to an operator.",
        );
      }),
    );
    document.querySelectorAll("[data-change]").forEach((button) =>
      button.addEventListener("click", () => {
        const record = records().find(
          (item) => item.reference === button.dataset.change,
        );
        $("#record-detail").innerHTML =
          `<form id="reschedule-form" class="content-card dashboard-form" style="margin-top:25px"><h3>Request a schedule change</h3><p>This updates the local request only. It does not confirm an appointment.</p><label>Preferred new date<input type="date" name="date" required min="${U.today()}" value="${esc(record.date)}"></label><label>Preferred arrival<select name="time"><option>Morning · 9am–12pm</option><option>Afternoon · 12pm–3pm</option><option>Late afternoon · 3pm–6pm</option></select></label><button class="button primary">Save local change ↗</button><p class="form-status" role="status"></p></form>`;
        $("#reschedule-form").addEventListener("submit", (event) => {
          event.preventDefault();
          if (!event.target.reportValidity()) return;
          const date = event.target.elements.date.value;
          if (date < U.today()) {
            event.target.querySelector(".form-status").textContent =
              "Choose today or a future date.";
            return;
          }
          const list = records();
          const target = list.find(
            (item) => item.reference === record.reference,
          );
          target.date = date;
          target.time = event.target.elements.time.value;
          target.status = "Awaiting confirmation";
          target.changedAt = new Date().toISOString();
          if (!storeRecords(list)) {
            event.target.querySelector(".form-status").textContent =
              "Your browser could not save the change.";
            return;
          }
          render();
          notice(
            "The preferred schedule is updated locally. Availability is not confirmed.",
          );
        });
      }),
    );
  }
  function notice(text) {
    const host = document.querySelector("[data-dashboard-notice]");
    if (host) host.textContent = text;
  }
  function addressForm(record = {}) {
    return `<form id="address-form" class="content-card dashboard-form"><h3>${record.id ? "Edit saved address" : "Add an address"}</h3><div class="form-grid"><label>Label<input name="label" value="${esc(record.label)}" required maxlength="100"></label><label>City<input name="city" value="${esc(record.city)}" required></label><label class="full">Address<textarea name="address" rows="3" required maxlength="300">${esc(record.address)}</textarea></label><label>Postal code<input name="postal" value="${esc(record.postal)}" pattern="[0-9]{6}" maxlength="6" required inputmode="numeric"></label><label>Access notes<input name="access" value="${esc(record.access)}" maxlength="300"></label></div><button class="button primary">Save address ↗</button><p class="form-status" role="status"></p></form>`;
  }
  function bindAddressForm(id) {
    $("#address-form").addEventListener("submit", (event) => {
      event.preventDefault();
      if (!event.target.reportValidity()) return;
      const data = Object.fromEntries(new FormData(event.target));
      if (!data.label.trim() || !data.address.trim()) {
        event.target.querySelector(".form-status").textContent =
          "Please enter a label and address.";
        return;
      }
      const list = addresses();
      const record = { ...data, id: id || `address-${Date.now()}` };
      const index = list.findIndex((item) => item.id === id);
      if (index >= 0) list[index] = record;
      else list.push(record);
      if (!U.write("clearnest-addresses", list)) {
        event.target.querySelector(".form-status").textContent =
          "Your browser could not save the address.";
        return;
      }
      render();
      notice("Address saved on this device.");
    });
  }
  function render() {
    const host = $("#dashboard-content"),
      list = records();
    $("#dashboard-title").textContent = labels[panel];
    document.querySelectorAll("[data-panel]").forEach((button) => {
      button.classList.toggle("selected", button.dataset.panel === panel);
      button.setAttribute("aria-pressed", button.dataset.panel === panel);
    });
    let body = '<p data-dashboard-notice role="status"></p>';
    if (panel === "overview") {
      const active = list.filter((record) => record.status !== "Cancelled");
      const stats = [
        ["Total requests", list.length],
        [
          "Awaiting confirmation",
          active.filter((record) => record.status === "Awaiting confirmation")
            .length,
        ],
        ["Confirmed upcoming", 0],
        ["Completed", 0],
      ];
      body +=
        `<div class="stats-grid">${stats.map(([title, value]) => `<article class="stat-card"><strong>${value}</strong><span>${title}</span></article>`).join("")}</div><div class="note-box"><h3>Your workspace, on this device.</h3><p>No confirmed cleanings, invoices or online payments are connected. Locally submitted requests appear below and remain awaiting confirmation.</p></div><h2>Recent activity</h2>` +
        (list.length
          ? table(list.slice(0, 5), "overview")
          : empty(
              "Your first fresh start begins here.",
              "Create a request to see your selected scope, estimated price and preferred schedule in this workspace.",
            ));
    }
    if (panel === "bookings") {
      body += `<div class="filter-bar"><label>Request status<select id="booking-filter"><option value="all">All requests</option><option value="Awaiting confirmation">Awaiting confirmation</option><option value="Cancelled">Cancelled</option></select></label></div>`;
      const filtered = list.filter(
        (record) => statusFilter === "all" || record.status === statusFilter,
      );
      body += filtered.length
        ? table(filtered)
        : empty(
            "No matching requests.",
            "Choose another status or create a cleaning request.",
          );
    }
    if (panel === "status") {
      body += list.length
        ? `<label>Select a request<select id="status-record">${list.map((record) => `<option value="${esc(record.reference)}">${esc(record.reference)} · ${esc(record.status)}</option>`).join("")}</select></label><div id="status-detail"></div>`
        : empty(
            "Nothing to track yet.",
            "Your saved requests will appear here. Operational status requires a connected booking service.",
          );
    }
    if (panel === "packages") {
      body += list.length
        ? `<div class="content-grid">${list.map((record) => `<article class="content-card"><p class="eyebrow">${esc(record.reference)}</p><h3>${esc(pack(record))}</h3><p>${CN.packages.find((item) => item.id === record.package)?.detail || "Scope to be agreed."}</p><p>Add-ons: ${esc((record.addons || []).map((id) => CN.addons.find((item) => item.id === id)?.name || id).join(", ") || "None")}</p><p>Duration: ${esc(record.duration)}</p><strong>${CN.money(record.estimate)}</strong></article>`).join("")}</div>`
        : empty(
            "Find the right scope.",
            "Choose an Essential, Complete or Intensive package to see it here.",
          );
    }
    if (panel === "payments") {
      body +=
        '<div class="note-box"><h3>Payment connections are not active.</h3><p>No successful online payments or final invoices are recorded. A saved estimate is not an invoice or a payment request.</p></div><h2>Request estimates</h2>';
      body += list.length
        ? table(list, "payments")
        : empty(
            "No request estimates yet.",
            "Create a request to keep an indicative cost alongside your cleaning plan.",
          );
    }
    if (panel === "addresses") {
      const entries = addresses();
      body += `<div id="address-form-host">${addressForm()}</div><h2>Saved addresses</h2><div class="address-grid">${entries.map((record) => `<article class="content-card"><h3>${esc(record.label)}</h3><p>${esc(record.address)}<br>${esc(record.city)} · ${esc(record.postal)}</p><p>${esc(record.access || "No access notes.")}</p><div class="record-actions"><button data-edit-address="${esc(record.id)}">Edit</button><button data-delete-address="${esc(record.id)}">Remove</button><button data-use-address="${esc(record.id)}">Use for booking</button></div></article>`).join("")}</div>`;
      if (!entries.length)
        body += '<p class="form-note">No addresses saved yet.</p>';
    }
    if (panel === "notifications") {
      const read = U.read("clearnest-read-notifications", []);
      body += list.length
        ? `<div class="standards-list">${list.map((record) => `<div><strong>${esc(record.reference)} · ${record.status === "Cancelled" ? "Request cancelled locally" : "Request saved locally"}</strong><p>${esc(record.changedAt || record.cancelledAt || record.createdAt)}<br>${read.includes(record.reference) ? "Read" : "Unread"} · No operational notification sent.<br><button class="text-link" data-read="${esc(record.reference)}">Mark as read</button></p></div>`).join("")}</div>`
        : empty(
            "No notifications yet.",
            "Locally saved request activity will appear here. Automated messages need a connected service.",
          );
    }
    if (panel === "profile") {
      const profile = U.read("clearnest-profile", {});
      body += `<form id="profile-form" class="content-card dashboard-form"><h3>Your profile details</h3><p>Profile changes are stored on this device. No account password is stored.</p><div class="form-grid"><label>Full name<input name="name" value="${esc(profile.name)}" autocomplete="name" required></label><label>Email<input name="email" value="${esc(profile.email)}" type="email" autocomplete="email" required></label><label>Phone<input name="phone" value="${esc(profile.phone)}" type="tel" autocomplete="tel" pattern="[0-9+\\s\\-]{7,20}" required></label></div><label class="check-label"><input type="checkbox" name="notifications" ${profile.notifications !== false ? "checked" : ""}> Save my preference for appointment updates</label><p class="form-note">Email and notification delivery are not connected.</p><button class="button primary">Save profile ↗</button><p class="form-status" role="status"></p></form>`;
    }
    host.innerHTML = body;
    bindRecords();
    if (panel === "bookings") {
      $("#booking-filter").value = statusFilter;
      $("#booking-filter").addEventListener("change", (event) => {
        statusFilter = event.target.value;
        render();
      });
    }
    if (panel === "status" && list.length) {
      $("#status-record").addEventListener("change", (event) =>
        detail(event.target.value),
      );
      detail(list[0].reference);
    }
    if (panel === "addresses") {
      bindAddressForm();
      document.querySelectorAll("[data-edit-address]").forEach((button) =>
        button.addEventListener("click", () => {
          const record = addresses().find(
            (item) => item.id === button.dataset.editAddress,
          );
          $("#address-form-host").innerHTML = addressForm(record);
          bindAddressForm(record.id);
          $("#address-form").scrollIntoView({ block: "center" });
        }),
      );
      document.querySelectorAll("[data-delete-address]").forEach((button) =>
        button.addEventListener("click", () => {
          if (
            !U.write(
              "clearnest-addresses",
              addresses().filter(
                (item) => item.id !== button.dataset.deleteAddress,
              ),
            )
          ) {
            notice("Your browser could not remove the address.");
            return;
          }
          render();
          notice("Address removed from this device.");
        }),
      );
      document.querySelectorAll("[data-use-address]").forEach((button) =>
        button.addEventListener("click", () => {
          const record = addresses().find(
            (item) => item.id === button.dataset.useAddress,
          );
          const draft = U.read("clearnest-booking-draft", {});
          U.write("clearnest-booking-draft", {
            ...draft,
            address: record.address,
            city: record.city,
            postal: record.postal,
            access: record.access,
          });
          location.href = "book-cleaning.html";
        }),
      );
    }
    if (panel === "notifications")
      document.querySelectorAll("[data-read]").forEach((button) =>
        button.addEventListener("click", () => {
          const read = U.read("clearnest-read-notifications", []);
          U.write("clearnest-read-notifications", [
            ...new Set([...read, button.dataset.read]),
          ]);
          render();
        }),
      );
    if (panel === "profile")
      $("#profile-form").addEventListener("submit", (event) => {
        event.preventDefault();
        if (!event.target.reportValidity()) return;
        const profile = {
          name: event.target.elements.name.value.trim(),
          email: event.target.elements.email.value.trim(),
          phone: event.target.elements.phone.value.trim(),
          notifications: event.target.elements.notifications.checked,
        };
        if (!profile.name) {
          event.target.querySelector(".form-status").textContent =
            "Please enter your name.";
          return;
        }
        event.target.querySelector(".form-status").textContent = U.write(
          "clearnest-profile",
          profile,
        )
          ? "Profile saved on this device."
          : "Your browser could not save the profile.";
      });
  }
  document.querySelectorAll("[data-panel]").forEach((button) =>
    button.addEventListener("click", () => {
      panel = button.dataset.panel;
      render();
      $("#dashboard-title").tabIndex = -1;
      $("#dashboard-title").focus();
    }),
  );
  $("#logout").addEventListener("click", () => {
    try {
      localStorage.removeItem("clearnest-local-session");
    } catch {}
    location.href = "login.html";
  });
  render();
})();
