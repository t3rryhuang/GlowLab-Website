(function () {
  var STORAGE_KEY = "glowlab-basket";

  var PRICES = {
    "bundle-hair": 99,
    "bundle-skin": 99,
    "bundle-stress": 99,
    "bundle-energy": 99,
    "bundle-hormone": 99,
    "nutrafol-women-hair-growth": 79,
    "nutrafol-clear-skin": 68,
    "nutrafol-stress-adaptogen": 38,
    "nutrafol-b-energized": 38,
    "nutrafol-womens-balance": 79,
    "olly-womens-multi": 15,
    "olly-glowing-skin": 15,
    "olly-goodbye-stress": 15,
    "olly-daily-energy": 15,
    "olly-period-hero": 15,
    "liv-sugar-free": 25,
    "liv-energy": 25,
    "liv-immune": 25,
  };

  function slugify(text) {
    return String(text)
      .toLowerCase()
      .replace(/['']/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function loadBasket() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveBasket(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  function formatPrice(n) {
    return "£" + n.toFixed(2).replace(".00", "");
  }

  function getBasket() {
    return loadBasket();
  }

  function updateCount() {
    var items = getBasket();
    var count = items.reduce(function (sum, item) {
      return sum + (item.qty || 1);
    }, 0);
    document.querySelectorAll(".cart-count").forEach(function (el) {
      el.textContent = count;
      if (count > 0) {
        el.removeAttribute("hidden");
      } else {
        el.setAttribute("hidden", "");
      }
    });
  }

  function showToast(message) {
    var toast = document.getElementById("cart-toast");
    if (!toast) return;
    toast.querySelector("[data-toast-msg]").textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 2600);
  }

  function addItem(item) {
    var items = getBasket();
    var existing = items.find(function (i) {
      return i.id === item.id;
    });
    if (existing) {
      existing.qty = (existing.qty || 1) + 1;
    } else {
      items.push({
        id: item.id,
        name: item.name,
        price: item.price,
        img: item.img,
        kind: item.kind,
        qty: 1,
      });
    }
    saveBasket(items);
    updateCount();
    renderDrawer();
    showToast("Added to your basket");
  }

  function removeItem(id) {
    var items = getBasket().filter(function (i) {
      return i.id !== id;
    });
    saveBasket(items);
    updateCount();
    renderDrawer();
  }

  function total() {
    return getBasket().reduce(function (sum, item) {
      return sum + item.price * (item.qty || 1);
    }, 0);
  }

  function injectUI() {
    if (document.getElementById("cart-drawer")) return;

    var overlay = document.createElement("div");
    overlay.className = "cart-overlay";
    overlay.id = "cart-overlay";

    var drawer = document.createElement("aside");
    drawer.className = "cart-drawer";
    drawer.id = "cart-drawer";
    drawer.setAttribute("aria-hidden", "true");
    drawer.innerHTML =
      '<div class="cart-drawer-head">' +
      "<h2>Your basket</h2>" +
      '<button type="button" class="cart-close" id="cart-close" aria-label="Close basket">×</button>' +
      "</div>" +
      '<div class="cart-drawer-body" id="cart-drawer-body"></div>' +
      '<div class="cart-drawer-foot" id="cart-drawer-foot">' +
      '<div class="cart-total-row"><span class="cart-total-label">Subtotal</span>' +
      '<span class="cart-total-price" id="cart-total">£0</span></div>' +
      '<button type="button" class="btn btn-primary" id="cart-checkout">Continue to checkout</button>' +
      "</div>";

    var toast = document.createElement("div");
    toast.className = "cart-toast";
    toast.id = "cart-toast";
    toast.innerHTML = '<span class="cart-toast-dot"></span><span data-toast-msg>Added to basket</span>';

    document.body.appendChild(overlay);
    document.body.appendChild(drawer);
    document.body.appendChild(toast);

    overlay.addEventListener("click", closeDrawer);
    document.getElementById("cart-close").addEventListener("click", closeDrawer);
    document.getElementById("cart-checkout").addEventListener("click", function () {
      if (getBasket().length === 0) return;
      closeDrawer();
      sessionStorage.removeItem("glowlab-abandon-modal-shown");
      sessionStorage.removeItem("glowlab-abandon-modal-pending");
      try {
        localStorage.removeItem("glowlab-abandon-modal-shown");
      } catch (e) {}
      try {
        localStorage.removeItem("glowlab-abandon-modal-pending");
      } catch (e) {}
      sessionStorage.setItem("glowlab-checkout-active", "1");
      window.location.href = "checkout.html";
    });
  }

  function openDrawer() {
    document.getElementById("cart-overlay").classList.add("is-open");
    document.getElementById("cart-drawer").classList.add("is-open");
    document.getElementById("cart-drawer").setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    renderDrawer();
  }

  function closeDrawer() {
    document.getElementById("cart-overlay").classList.remove("is-open");
    document.getElementById("cart-drawer").classList.remove("is-open");
    document.getElementById("cart-drawer").setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function renderDrawer() {
    var body = document.getElementById("cart-drawer-body");
    var foot = document.getElementById("cart-drawer-foot");
    var totalEl = document.getElementById("cart-total");
    if (!body) return;

    var items = getBasket();
    if (items.length === 0) {
      body.innerHTML =
        '<div class="cart-empty"><p>Your basket is empty.</p>' +
        '<a href="index.html#shop" class="btn btn-secondary">Browse products</a></div>';
      foot.style.display = "none";
      return;
    }

    foot.style.display = "";
    var html = '<ul class="cart-list">';
    items.forEach(function (item) {
      html +=
        '<li class="cart-item" data-id="' +
        item.id +
        '">' +
        '<div class="cart-item-img"><img src="' +
        (item.img || "") +
        '" alt=""></div>' +
        '<div class="cart-item-body">' +
        '<div class="cart-item-kind">' +
        (item.kind === "bundle" ? "Bundle" : "Product") +
        "</div>" +
        '<p class="cart-item-name">' +
        item.name +
        "</p>" +
        '<div class="cart-item-price">' +
        formatPrice(item.price) +
        (item.qty > 1 ? " × " + item.qty : "") +
        "</div>" +
        '<button type="button" class="cart-item-remove" data-remove="' +
        item.id +
        '">Remove</button>' +
        "</div></li>";
    });
    html += "</ul>";
    body.innerHTML = html;

    body.querySelectorAll("[data-remove]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        removeItem(btn.getAttribute("data-remove"));
      });
    });

    if (totalEl) totalEl.textContent = formatPrice(total());
  }

  function wireCartButtons() {
    document.querySelectorAll("[data-cart-open]").forEach(function (btn) {
      btn.addEventListener("click", openDrawer);
    });
  }

  function priceFor(id, name, kind) {
    if (PRICES[id]) return PRICES[id];
    if (kind === "bundle") return 99;
    if (name && name.indexOf("Nutrafol") === 0 && name.indexOf("Booster") > -1) return 38;
    if (name && name.indexOf("Nutrafol") === 0) return 79;
    if (name && name.indexOf("OLLY") === 0) return 15;
    return 25;
  }

  function itemFromArticle(article, kind) {
    var titleEl = article.querySelector("h3") || article.querySelector(".product-name");
    var id = article.id || slugify(titleEl ? titleEl.textContent : "item");
    var nameEl = article.querySelector(".product-name") || article.querySelector("h3");
    var name = nameEl ? nameEl.textContent.trim() : "Item";
    var img = article.querySelector("img");
    return {
      id: id,
      name: name,
      price: priceFor(id, name, kind),
      img: img ? img.getAttribute("src") : "",
      kind: kind,
    };
  }

  function wireShopCards() {
    document.querySelectorAll("#shop .product").forEach(function (article) {
      var foot = article.querySelector(".product-foot");
      if (!foot || foot.dataset.basketWired) return;
      foot.dataset.basketWired = "1";

      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn btn-sm btn-secondary";
      btn.textContent = "Add to basket";
      btn.addEventListener("click", function () {
        addItem(itemFromArticle(article, "product"));
      });

      var priceSpan = foot.querySelector(".product-price");
      if (priceSpan) {
        var item = itemFromArticle(article, "product");
        priceSpan.textContent = formatPrice(item.price);
      }

      var oldBtn = foot.querySelector("a.btn, button.btn");
      if (oldBtn) oldBtn.replaceWith(btn);
      else foot.appendChild(btn);
    });

    document.querySelectorAll("#bundles .bundle").forEach(function (article) {
      var foot = article.querySelector(".bundle-foot");
      if (!foot || foot.dataset.basketWired) return;
      foot.dataset.basketWired = "1";

      var item = itemFromArticle(article, "bundle");
      var priceBlock = foot.querySelector(".bundle-price-now");
      if (priceBlock) priceBlock.textContent = formatPrice(item.price);

      var addBtn = document.createElement("button");
      addBtn.type = "button";
      addBtn.className = "btn btn-sm btn-dark";
      addBtn.textContent = "Add to basket";
      addBtn.addEventListener("click", function () {
        addItem(item);
      });

      var quizLink = document.createElement("a");
      quizLink.href = "quiz.html";
      quizLink.className = "btn btn-sm btn-secondary";
      quizLink.textContent = "Find match";
      quizLink.style.marginRight = "8px";

      var actions = document.createElement("div");
      actions.className = "bundle-foot-actions";
      actions.appendChild(quizLink);
      actions.appendChild(addBtn);

      var oldBtn = foot.querySelector("a.btn-dark, button.btn-dark");
      if (oldBtn) oldBtn.replaceWith(actions);
    });
  }

  function injectNavCart() {
    document.querySelectorAll(".nav-right").forEach(function (navRight) {
      if (navRight.querySelector("[data-cart-open]")) return;

      var cartBtn = document.createElement("button");
      cartBtn.type = "button";
      cartBtn.className = "cart-btn";
      cartBtn.setAttribute("data-cart-open", "");
      cartBtn.setAttribute("aria-label", "Open basket");
      cartBtn.innerHTML =
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">' +
        '<path d="M6 6h15l-1.5 9h-12z"/><path d="M6 6L5 3H2"/><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/></svg>' +
        '<span class="cart-count" hidden>0</span>';

      navRight.insertBefore(cartBtn, navRight.firstChild);
    });
  }

  function clearBasket() {
    saveBasket([]);
    updateCount();
    renderDrawer();
  }

  window.GlowLabBasket = {
    add: addItem,
    open: openDrawer,
    getItems: getBasket,
    clear: clearBasket,
    formatPrice: formatPrice,
    total: total,
  };

  document.addEventListener("DOMContentLoaded", function () {
    injectUI();
    injectNavCart();
    wireCartButtons();
    wireShopCards();
    updateCount();
    renderDrawer();
  });
})();
