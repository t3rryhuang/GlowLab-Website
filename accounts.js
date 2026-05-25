(function () {
  var STORAGE_KEY = "glowlab-active-account";

  var ACCOUNTS = {
    terry: {
      id: "terry",
      name: "Terry",
      persona: "Gen Z · energy & focus",
      avatar: "images/profiles/terry.png",
      heroImage: "images/hero-terry.png",
      heroAlt: "Terry holding Liquid I.V. Hydration Multiplier on a London rooftop",
      products: [
        {
          id: "terry-ag1",
          brand: "AG1",
          name: "Athletic Greens Daily Nutrition",
          desc: "All-in-one greens for busy mornings and study days.",
          img: "other_brand_products/genz_male/AG1_Athletic_daily_nutrition_support.png",
          price: 79,
        },
        {
          id: "terry-liv-energy",
          brand: "Liquid I.V.",
          name: "Hydration Multiplier + Energy",
          desc: "Functional hydration with natural caffeine for alertness.",
          img: "other_brand_products/genz_male/Liquid I.V. Hydration Multiplier + Energy.png",
          price: 25,
          priceOld: 40,
          emphasized: true,
        },
        {
          id: "terry-lmnt",
          brand: "LMNT",
          name: "Electrolyte Drink Mix",
          desc: "Zero-sugar electrolytes for hydration without the slump.",
          img: "other_brand_products/genz_male/LMNT_electroltye_drink_mix.png",
          price: 45,
        },
      ],
    },
    riddhima: {
      id: "riddhima",
      name: "Riddhima",
      persona: "Young mum · postnatal support",
      avatar: "images/profiles/riddhima.png",
      heroImage: "images/hero-liquid-iv-sunset.jpg",
      heroAlt: "Woman holding Liquid I.V. Hydration Multiplier at sunset by the ocean",
      products: [
        {
          id: "riddhima-ritual",
          brand: "Ritual",
          name: "Essential Postnatal",
          desc: "Clean postnatal multivitamin designed for new mums.",
          img: "other_brand_products/young_mom/Ritual_essential_postnatal.png",
          price: 35,
        },
        {
          id: "riddhima-nutrafol",
          brand: "Nutrafol",
          name: "Women's Balance",
          desc: "Hormone-transition hair support for life-stage changes.",
          img: "other_brand_products/young_mom/Nutrafol_Women_Balance.png",
          price: 30,
          priceOld: 88,
          emphasized: true,
        },
        {
          id: "riddhima-naturelo",
          brand: "NATURELO",
          name: "Postnatal Multivitamin",
          desc: "Breastfeeding-friendly nutrients for recovery and energy.",
          img: "other_brand_products/young_mom/NATURELO_Postnatal_Multivitamin_for_Breastfeeding_Moms.png",
          price: 32,
        },
      ],
    },
  };

  function getActiveId() {
    var stored = localStorage.getItem(STORAGE_KEY);
    return ACCOUNTS[stored] ? stored : "riddhima";
  }

  function setActiveId(id) {
    if (!ACCOUNTS[id]) return;
    localStorage.setItem(STORAGE_KEY, id);
    refreshUI();
    document.dispatchEvent(
      new CustomEvent("glowlab:account-change", { detail: { accountId: id } })
    );
  }

  function getActiveAccount() {
    return ACCOUNTS[getActiveId()];
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function closeAllMenus() {
    document.querySelectorAll("[data-account-menu]").forEach(function (menu) {
      menu.hidden = true;
    });
    document.querySelectorAll("[data-account-trigger]").forEach(function (btn) {
      btn.setAttribute("aria-expanded", "false");
    });
  }

  function injectAccountSwitcher() {
    document.querySelectorAll(".nav-right").forEach(function (navRight) {
      if (navRight.querySelector("[data-account-switcher]")) return;

      var wrap = document.createElement("div");
      wrap.className = "account-switcher";
      wrap.setAttribute("data-account-switcher", "");

      var trigger = document.createElement("button");
      trigger.type = "button";
      trigger.className = "account-trigger";
      trigger.setAttribute("data-account-trigger", "");
      trigger.setAttribute("aria-expanded", "false");
      trigger.setAttribute("aria-haspopup", "true");

      var avatar = document.createElement("img");
      avatar.className = "account-avatar";
      avatar.setAttribute("data-account-avatar", "");
      avatar.width = 40;
      avatar.height = 40;
      trigger.appendChild(avatar);

      var menu = document.createElement("div");
      menu.className = "account-menu";
      menu.setAttribute("data-account-menu", "");
      menu.hidden = true;
      menu.setAttribute("role", "menu");

      var title = document.createElement("p");
      title.className = "account-menu-title";
      title.textContent = "Switch account";

      var list = document.createElement("div");
      list.className = "account-menu-list";
      list.setAttribute("data-account-menu-list", "");

      Object.keys(ACCOUNTS).forEach(function (id) {
        var account = ACCOUNTS[id];
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "account-menu-item";
        btn.setAttribute("data-account-pick", id);
        btn.setAttribute("role", "menuitem");

        var thumb = document.createElement("img");
        thumb.src = account.avatar;
        thumb.alt = "";
        thumb.width = 36;
        thumb.height = 36;

        var text = document.createElement("span");
        text.className = "account-menu-text";
        var strong = document.createElement("strong");
        strong.textContent = account.name;
        var sub = document.createElement("span");
        sub.textContent = account.persona;
        text.appendChild(strong);
        text.appendChild(sub);

        btn.appendChild(thumb);
        btn.appendChild(text);
        list.appendChild(btn);
      });

      menu.appendChild(title);
      menu.appendChild(list);
      wrap.appendChild(trigger);
      wrap.appendChild(menu);

      wrap.addEventListener("click", function (e) {
        e.stopPropagation();
      });

      trigger.addEventListener("click", function (e) {
        e.stopPropagation();
        var open = menu.hidden;
        closeAllMenus();
        menu.hidden = !open;
        trigger.setAttribute("aria-expanded", open ? "true" : "false");
      });

      list.addEventListener("click", function (e) {
        var pick = e.target.closest("[data-account-pick]");
        if (!pick) return;
        setActiveId(pick.getAttribute("data-account-pick"));
        closeAllMenus();
      });

      navRight.appendChild(wrap);
    });

    document.addEventListener("click", closeAllMenus);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeAllMenus();
    });
  }

  function updateSwitcherUI() {
    var active = getActiveAccount();
    document.querySelectorAll("[data-account-avatar]").forEach(function (img) {
      img.src = active.avatar;
      img.alt = active.name + " profile";
    });
    document.querySelectorAll("[data-account-pick]").forEach(function (btn) {
      var isActive = btn.getAttribute("data-account-pick") === active.id;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-current", isActive ? "true" : "false");
    });
  }

  function updateHeroImage() {
    var active = getActiveAccount();
    document.querySelectorAll("[data-hero-image]").forEach(function (img) {
      if (active.heroImage) {
        img.src = active.heroImage;
      }
      if (active.heroAlt) {
        img.alt = active.heroAlt;
      }
    });
  }

  function formatProductPrice(product) {
    if (product.priceOld) {
      return (
        '<span class="product-price">£' +
        product.price +
        '<span class="product-price-old">£' +
        product.priceOld +
        "</span></span>"
      );
    }
    return '<span class="product-price">£' + product.price + "</span>";
  }

  function buildProductCard(product) {
    var cardClass = "product suggested-product";
    if (product.emphasized) {
      cardClass += " suggested-product--emphasized";
    }
    var btnClass = product.emphasized ? "btn btn-sm btn-primary" : "btn btn-sm btn-secondary";
    return (
      '<article class="' +
      cardClass +
      '">' +
      (product.emphasized ? '<span class="suggested-product-badge">Top pick</span>' : "") +
      '<div class="product-img product-img-real"><img src="' +
      escapeHtml(product.img) +
      '" alt="' +
      escapeHtml(product.name) +
      '"></div>' +
      '<div class="product-body">' +
      '<div class="product-brand">' +
      escapeHtml(product.brand) +
      "</div>" +
      '<h3 class="product-name">' +
      escapeHtml(product.name) +
      "</h3>" +
      '<p class="product-desc">' +
      escapeHtml(product.desc) +
      "</p>" +
      '<div class="product-foot">' +
      formatProductPrice(product) +
      '<button type="button" class="' +
      btnClass +
      '" data-suggested-add="' +
      escapeHtml(product.id) +
      '">Add to basket</button>' +
      "</div></div></article>"
    );
  }

  function renderSuggestedProducts() {
    var root = document.getElementById("suggested-for-you");
    if (!root) return;

    var active = getActiveAccount();
    var cards = active.products.map(buildProductCard).join("");

    root.innerHTML =
      '<div class="suggested-head">' +
      '<p class="eyebrow">Suggested for you</p>' +
      "<h2>Hi " +
      escapeHtml(active.name) +
      " — picks we think you&rsquo;ll <em>love</em></h2>" +
      "</div>" +
      '<div class="product-grid suggested-grid">' +
      cards +
      "</div>";

    root.querySelectorAll("[data-suggested-add]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var productId = btn.getAttribute("data-suggested-add");
        var product = active.products.find(function (p) {
          return p.id === productId;
        });
        if (!product || !window.GlowLabBasket) return;
        window.GlowLabBasket.add({
          id: product.id,
          name: product.name,
          price: product.price,
          img: product.img,
          kind: "product",
        });
      });
    });
  }

  function refreshUI() {
    updateSwitcherUI();
    updateHeroImage();
    renderSuggestedProducts();
  }

  window.GlowLabAccounts = {
    getActive: getActiveAccount,
    setActive: setActiveId,
    getAll: function () {
      return ACCOUNTS;
    },
  };

  document.addEventListener("DOMContentLoaded", function () {
    injectAccountSwitcher();
    refreshUI();
  });
})();
