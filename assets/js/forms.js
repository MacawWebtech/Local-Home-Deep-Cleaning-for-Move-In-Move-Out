"use strict";
(() => {
  const U = CNUI,
    $ = U.one;
  document.querySelectorAll(".show-password").forEach((button) =>
    button.addEventListener("click", () => {
      const input = button.parentElement.querySelector("input");
      const visible = input.type === "password";
      input.type = visible ? "text" : "password";
      button.textContent = visible ? "Hide" : "Show";
      button.setAttribute(
        "aria-label",
        visible ? "Hide password" : "Show password",
      );
    }),
  );
  if ($("#login-form")) {
    let remembered = "";
    try {
      remembered = localStorage.getItem("clearnest-remembered-email") || "";
    } catch {}
    $("#login-form").elements.email.value = remembered;
    $("#login-form").addEventListener("submit", (event) => {
      event.preventDefault();
      if (!event.target.reportValidity()) return;
      const email = event.target.elements.email.value.trim();
      const profile = U.read("clearnest-profile", {});
      if (!profile.email)
        U.write("clearnest-profile", {
          name: "",
          email,
          phone: "",
          notifications: true,
        });
      try {
        if (event.target.elements.remember.checked)
          localStorage.setItem("clearnest-remembered-email", email);
        else localStorage.removeItem("clearnest-remembered-email");
      } catch {}
      event.target.elements.password.value = "";
      U.write("clearnest-local-session", {
        email,
        openedAt: new Date().toISOString(),
      });
      location.href = "dashboard.html";
    });
    $("#forgot-password").addEventListener("click", () => {
      $("#login-form .form-status").textContent =
        "Password reset is not connected. Your local workspace does not store a password. Enter the form details to open locally stored records.";
    });
  }
  if ($("#register-form")) {
    const form = $("#register-form");
    function confirm() {
      form.elements.confirm.setCustomValidity(
        form.elements.confirm.value === form.elements.password.value
          ? ""
          : "Passwords must match.",
      );
    }
    form.elements.confirm.addEventListener("input", confirm);
    form.elements.password.addEventListener("input", confirm);
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      confirm();
      if (!form.reportValidity()) return;
      const profile = {
        name: form.elements.name.value.trim(),
        email: form.elements.email.value.trim(),
        phone: form.elements.phone.value.trim(),
        notifications: true,
      };
      if (!profile.name) {
        form.querySelector(".form-status").textContent =
          "Please enter your full name.";
        return;
      }
      if (!U.write("clearnest-profile", profile)) {
        form.querySelector(".form-status").textContent =
          "Your browser could not save the profile. Please retain your details.";
        return;
      }
      form.elements.password.value = "";
      form.elements.confirm.value = "";
      U.write("clearnest-local-session", {
        email: profile.email,
        openedAt: new Date().toISOString(),
      });
      location.href = "dashboard.html";
    });
  }
  if ($("#newsletter-form"))
    $("#newsletter-form").addEventListener("submit", (event) => {
      event.preventDefault();
      if (!event.target.reportValidity()) return;
      const saved = U.write("clearnest-newsletter-interest", {
        email: event.target.elements.email.value,
        date: new Date().toISOString(),
      });
      event.target.querySelector(".form-status").textContent = saved
        ? "Your interest is saved on this device. No subscription has been sent."
        : "Your browser could not save this information.";
    });
})();
