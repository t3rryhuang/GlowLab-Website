(function () {
  var CHECKOUT_ACTIVE_KEY = "glowlab-checkout-active";
  var SUBSCRIPTION_KEY = "glowlab-checkout-subscriptions";
  var SUBSCRIPTION_DISCOUNT = 0.15;
  var SUBSCRIPTION_PRODUCT_IDS = { "terry-liv-energy": true, "liv-energy": true };

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function getItems() {
    return window.GlowLabBasket ? window.GlowLabBasket.getItems() : [];
  }

  function loadSubscriptions() {
    try {
      return JSON.parse(sessionStorage.getItem(SUBSCRIPTION_KEY) || "{}");
    } catch (e) {
      return {};
    }
  }

  function saveSubscriptions(map) {
    sessionStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(map));
  }

  function isSubscriptionEligible(item) {
    if (SUBSCRIPTION_PRODUCT_IDS[item.id]) return true;
    var name = (item.name || "").toLowerCase();
    return name.indexOf("hydration multiplier + energy") !== -1;
  }

  function isSubscribed(itemId) {
    return !!loadSubscriptions()[itemId];
  }

  function setSubscribed(itemId, on) {
    var map = loadSubscriptions();
    if (on) {
      map[itemId] = true;
    } else {
      delete map[itemId];
    }
    saveSubscriptions(map);
  }

  function lineUnitPrice(item) {
    if (isSubscriptionEligible(item) && isSubscribed(item.id)) {
      return Math.round(item.price * (1 - SUBSCRIPTION_DISCOUNT) * 100) / 100;
    }
    return item.price;
  }

  function checkoutTotal() {
    return getItems().reduce(function (sum, item) {
      return sum + lineUnitPrice(item) * (item.qty || 1);
    }, 0);
  }

  function formatLinePrice(item) {
    var qty = item.qty || 1;
    var unit = lineUnitPrice(item);
    var subscribed = isSubscriptionEligible(item) && isSubscribed(item.id);
    if (subscribed) {
      return (
        '<span class="checkout-line-price-now">' +
        window.GlowLabBasket.formatPrice(unit * qty) +
        '</span><span class="checkout-line-price-was">' +
        window.GlowLabBasket.formatPrice(item.price * qty) +
        "</span>"
      );
    }
    return window.GlowLabBasket.formatPrice(unit * qty);
  }

  function buildSubscriptionOffer(item) {
    if (!isSubscriptionEligible(item)) return "";
    var checked = isSubscribed(item.id) ? " checked" : "";
    var discounted = Math.round(item.price * (1 - SUBSCRIPTION_DISCOUNT) * 100) / 100;
    return (
      '<label class="checkout-subscribe">' +
      '<input type="checkbox" data-subscribe="' +
      escapeHtml(item.id) +
      '"' +
      checked +
      " />" +
      '<span class="checkout-subscribe-text">' +
      "<strong>Subscribe &amp; save 15%</strong>" +
      "<span>Delivered every 30 days · " +
      window.GlowLabBasket.formatPrice(discounted) +
      " per delivery</span>" +
      "</span></label>"
    );
  }

  function itemsForOrder() {
    return getItems().map(function (item) {
      var subscribed = isSubscriptionEligible(item) && isSubscribed(item.id);
      var unitPrice = lineUnitPrice(item);
      var out = {
        id: item.id,
        name: item.name,
        price: unitPrice,
        img: item.img,
        kind: item.kind,
        qty: item.qty || 1,
      };
      if (subscribed) {
        out.subscription = true;
        out.originalPrice = item.price;
      }
      return out;
    });
  }

  function renderSummary() {
    var root = document.getElementById("checkout-summary");
    if (!root || !window.GlowLabBasket) {
      return;
    }

    var items = getItems();
    if (!items.length) {
      root.innerHTML =
        '<div class="checkout-empty">' +
        "<p>Your basket is empty.</p>" +
        '<a href="index.html#shop" class="btn btn-secondary">Browse products</a>' +
        "</div>";
      var payBtn = document.getElementById("checkout-pay");
      if (payBtn) payBtn.disabled = true;
      return;
    }

    var html = '<h2>Order summary</h2><ul class="checkout-list">';
    var hasSubscription = false;
    items.forEach(function (item) {
      if (isSubscriptionEligible(item) && isSubscribed(item.id)) {
        hasSubscription = true;
      }
      html +=
        '<li class="checkout-line' +
        (isSubscriptionEligible(item) ? " checkout-line--subscribable" : "") +
        '">' +
        '<div class="checkout-line-img">' +
        (item.img ? '<img src="' + escapeHtml(item.img) + '" alt="">' : "") +
        "</div>" +
        '<div class="checkout-line-body">' +
        '<div class="checkout-line-kind">' +
        escapeHtml(item.kind === "bundle" ? "Bundle" : "Product") +
        "</div>" +
        '<p class="checkout-line-name">' +
        escapeHtml(item.name) +
        "</p>" +
        (item.qty > 1 ? '<span class="checkout-line-qty">Qty ' + item.qty + "</span>" : "") +
        buildSubscriptionOffer(item) +
        "</div>" +
        '<div class="checkout-line-price">' +
        formatLinePrice(item) +
        "</div></li>";
    });
    html += "</ul>";
    if (hasSubscription) {
      html +=
        '<p class="checkout-savings-note">Subscription savings applied — 15% off Hydration Multiplier + Energy.</p>';
    }
    html +=
      '<div class="checkout-total-row">' +
      "<span>Subtotal</span>" +
      "<strong>" +
      window.GlowLabBasket.formatPrice(checkoutTotal()) +
      "</strong></div>";
    root.innerHTML = html;

    root.querySelectorAll("[data-subscribe]").forEach(function (input) {
      input.addEventListener("change", function () {
        setSubscribed(input.getAttribute("data-subscribe"), input.checked);
        renderSummary();
      });
    });
  }

  function wireAbandonment() {
    var back = document.getElementById("checkout-back");
    if (!back) return;

    back.addEventListener("click", function (e) {
      var items = getItems();
      if (!items.length) return;

      e.preventDefault();
      var target = back.getAttribute("href") || "index.html";
      var hashIdx = target.indexOf("#");
      var pathPart = hashIdx >= 0 ? target.slice(0, hashIdx) : target;
      var hashPart = hashIdx >= 0 ? target.slice(hashIdx) : "";
      var sep = pathPart.indexOf("?") >= 0 ? "&" : "?";
      var dest = pathPart + sep + "glowlabCheckoutReturn=1" + hashPart;

      if (window.GlowLabAbandonModal) {
        var snapshot = items.map(function (item) {
          return {
            id: item.id,
            name: item.name,
            price: Number(item.price),
            qty: item.qty || 1,
            img: item.img || "",
            kind: item.kind || "product",
          };
        });
        window.GlowLabAbandonModal.schedule(snapshot);
      }
      sessionStorage.removeItem(CHECKOUT_ACTIVE_KEY);
      window.location.href = dest;
    });
  }

  function wireForm() {
    var form = document.getElementById("checkout-form");
    if (!form) {
      return;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var items = getItems();
      if (!items.length) {
        return;
      }

      var status = document.getElementById("checkout-status");
      var payBtn = document.getElementById("checkout-pay");
      payBtn.disabled = true;
      status.textContent = "Processing your demo order…";

      var orderId = "GL-" + Date.now().toString(36).toUpperCase();
      sessionStorage.setItem(
        "glowlab-last-order",
        JSON.stringify({
          id: orderId,
          items: itemsForOrder(),
          total: checkoutTotal(),
          placedAt: new Date().toISOString(),
        })
      );
      sessionStorage.removeItem(CHECKOUT_ACTIVE_KEY);
      sessionStorage.removeItem("glowlab-abandon-modal-shown");
      sessionStorage.removeItem("glowlab-abandon-modal-pending");
      try {
        localStorage.removeItem("glowlab-abandon-modal-shown");
      } catch (e) {}
      try {
        localStorage.removeItem("glowlab-abandon-modal-pending");
      } catch (e) {}
      sessionStorage.removeItem(SUBSCRIPTION_KEY);
      window.GlowLabBasket.clear();

      setTimeout(function () {
        window.location.href = "confirmation.html";
      }, 700);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    sessionStorage.setItem(CHECKOUT_ACTIVE_KEY, "1");
    renderSummary();
    wireAbandonment();
    wireForm();
  });
})();
