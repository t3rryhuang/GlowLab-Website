(function () {
  var PENDING_KEY = "glowlab-abandon-modal-pending";
  var SHOWN_KEY = "glowlab-abandon-modal-shown";
  var PROMO_CODE = "GLOW10";
  var DELAY_MS = 5000;
  var MAX_PENDING_AGE_MS = 60 * 60 * 1000;

  var showTimer = null;

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function formatPrice(n) {
    return "£" + Number(n).toFixed(2).replace(/\.00$/, "");
  }

  function formatExpiry(date) {
    return date.toLocaleString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "Europe/London",
    });
  }

  function writePending(payload) {
    var json = JSON.stringify(payload);
    try {
      sessionStorage.setItem(PENDING_KEY, json);
    } catch (e) {}
    try {
      localStorage.setItem(PENDING_KEY, json);
    } catch (e) {}
    try {
      sessionStorage.removeItem(SHOWN_KEY);
    } catch (e) {}
    try {
      localStorage.removeItem(SHOWN_KEY);
    } catch (e) {}
  }

  function readPendingRaw() {
    try {
      return sessionStorage.getItem(PENDING_KEY) || localStorage.getItem(PENDING_KEY);
    } catch (e) {
      return null;
    }
  }

  function clearPending() {
    try {
      sessionStorage.removeItem(PENDING_KEY);
    } catch (e) {}
    try {
      localStorage.removeItem(PENDING_KEY);
    } catch (e) {}
  }

  function schedule(items) {
    if (!items || !items.length) return;
    writePending({ items: items, ts: Date.now() });
  }

  function buildItemRows(items) {
    return items
      .map(function (item) {
        var lineTotal = item.price * (item.qty || 1);
        return (
          "<tr>" +
          '<td class="abandon-email-item-name">' +
          escapeHtml(item.name) +
          '<span class="abandon-email-item-kind">' +
          escapeHtml(item.kind === "bundle" ? "Bundle" : "Product") +
          (item.qty > 1 ? " · Qty " + item.qty : "") +
          "</span></td>" +
          '<td class="abandon-email-item-price">' +
          formatPrice(lineTotal) +
          "</td></tr>"
        );
      })
      .join("");
  }

  function hasShown() {
    try {
      return sessionStorage.getItem(SHOWN_KEY) || localStorage.getItem(SHOWN_KEY);
    } catch (e) {
      return null;
    }
  }

  function markShown() {
    try {
      sessionStorage.setItem(SHOWN_KEY, "1");
    } catch (e) {}
    try {
      localStorage.setItem(SHOWN_KEY, "1");
    } catch (e) {}
  }

  function show(items) {
    if (!items.length || hasShown()) return;

    var subtotal = items.reduce(function (sum, item) {
      return sum + item.price * (item.qty || 1);
    }, 0);
    var discount = subtotal * 0.1;
    var total = subtotal - discount;
    var expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    var now = new Date();

    var overlay = document.createElement("div");
    overlay.className = "abandon-email-overlay";
    overlay.id = "abandon-email-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-labelledby", "abandon-email-subject");

    overlay.innerHTML =
      '<div class="abandon-email-shell">' +
      '<button type="button" class="abandon-email-close" aria-label="Close">×</button>' +
      '<div class="abandon-email-window">' +
      '<div class="abandon-email-titlebar">' +
      '<span class="abandon-email-dot abandon-email-dot--red"></span>' +
      '<span class="abandon-email-dot abandon-email-dot--yellow"></span>' +
      '<span class="abandon-email-dot abandon-email-dot--green"></span>' +
      '<span class="abandon-email-titlebar-label">Mail — GlowLab</span>' +
      "</div>" +
      '<div class="abandon-email-meta">' +
      '<div class="abandon-email-meta-row"><span class="abandon-email-meta-label">From</span><span>GlowLab &lt;hello@glowlab.demo&gt;</span></div>' +
      '<div class="abandon-email-meta-row"><span class="abandon-email-meta-label">To</span><span>you@example.com</span></div>' +
      '<div class="abandon-email-meta-row abandon-email-meta-row--subject">' +
      '<span class="abandon-email-meta-label">Subject</span>' +
      '<span id="abandon-email-subject">10% off your basket — expires in 24 hours</span>' +
      '<time class="abandon-email-time">' +
      escapeHtml(
        now.toLocaleTimeString("en-GB", { hour: "numeric", minute: "2-digit", hour12: true })
      ) +
      "</time></div>" +
      "</div>" +
      '<div class="abandon-email-body">' +
      '<p class="abandon-email-eyebrow">GlowLab</p>' +
      '<h2 class="abandon-email-headline">You left something <em>glowing</em> behind</h2>' +
      "<p>Complete your ritual in the next 24 hours and enjoy <strong>10% off</strong> your order.</p>" +
      '<div class="abandon-email-promo">' +
      '<span class="abandon-email-promo-label">Your code</span>' +
      '<span class="abandon-email-promo-code">' +
      PROMO_CODE +
      "</span></div>" +
      '<p class="abandon-email-expires">Expires <strong>' +
      escapeHtml(formatExpiry(expiresAt)) +
      "</strong></p>" +
      '<table class="abandon-email-table"><tbody>' +
      buildItemRows(items) +
      "</tbody></table>" +
      '<div class="abandon-email-totals">' +
      '<div><span>Subtotal</span><span>' +
      formatPrice(subtotal) +
      "</span></div>" +
      '<div class="abandon-email-totals abandon-email-totals--discount"><span>10% off with ' +
      PROMO_CODE +
      '</span><span>−' +
      formatPrice(discount) +
      "</span></div>" +
      '<div class="abandon-email-totals abandon-email-totals--total"><span>Total</span><strong>' +
      formatPrice(total) +
      "</strong></div>" +
      '<a href="checkout.html" class="btn btn-primary btn-lg abandon-email-cta">Return to checkout</a>' +
      '<p class="abandon-email-footnote">Demo inbox preview — no email was sent.</p>' +
      "</div></div></div>";

    document.body.appendChild(overlay);
    document.body.style.overflow = "hidden";
    markShown();

    function close() {
      overlay.remove();
      document.body.style.overflow = "";
    }

    overlay.querySelector(".abandon-email-close").addEventListener("click", close);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) close();
    });
    document.addEventListener(
      "keydown",
      function onKey(e) {
        if (e.key === "Escape") {
          close();
          document.removeEventListener("keydown", onKey);
        }
      }
    );
  }

  function stripReturnQuery() {
    try {
      if (!/glowlabCheckoutReturn=1/.test(location.search)) return;
      var u = new URL(location.href);
      u.searchParams.delete("glowlabCheckoutReturn");
      var next = u.pathname + (u.search ? u.search : "") + (u.hash || "");
      history.replaceState({}, "", next || "/");
    } catch (e) {}
  }

  function scheduleShowFromPending() {
    if (/checkout\.html$/i.test(location.pathname || "")) {
      return;
    }

    var raw = readPendingRaw();
    if (!raw) return;

    if (showTimer !== null) {
      clearTimeout(showTimer);
      showTimer = null;
    }

    showTimer = setTimeout(function () {
      showTimer = null;

      var raw2 = readPendingRaw();
      if (!raw2) return;

      var data;
      try {
        data = JSON.parse(raw2);
      } catch (e) {
        clearPending();
        return;
      }

      if (!data.items || !data.items.length) {
        clearPending();
        return;
      }

      if (data.ts && Date.now() - data.ts > MAX_PENDING_AGE_MS) {
        clearPending();
        return;
      }

      clearPending();
      stripReturnQuery();
      show(data.items);
    }, DELAY_MS);
  }

  window.GlowLabAbandonModal = {
    schedule: schedule,
    show: show,
  };

  function boot() {
    document.addEventListener("DOMContentLoaded", scheduleShowFromPending);
    window.addEventListener("pageshow", function () {
      scheduleShowFromPending();
    });
    if (document.readyState !== "loading") {
      setTimeout(scheduleShowFromPending, 0);
    }
  }

  boot();
})();
