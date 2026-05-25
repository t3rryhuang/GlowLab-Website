(function () {
  function getApiBase() {
    if (window.GLOWLAB_CHATBOT_API != null && window.GLOWLAB_CHATBOT_API !== "") {
      return window.GLOWLAB_CHATBOT_API;
    }
    if (location.protocol === "file:") {
      return "http://localhost:3000";
    }
    if (
      location.hostname === "localhost" ||
      location.hostname === "127.0.0.1"
    ) {
      if (location.port === "3000") {
        return "";
      }
      return "http://localhost:3000";
    }
    return "";
  }

  var API_BASE = getApiBase();

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function addMessage(role, text) {
    var messages = document.getElementById("gl-chatbot-messages");
    var bubble = el("div", "gl-chatbot-msg gl-chatbot-msg-" + role);
    bubble.textContent = text;
    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;
    return bubble;
  }

  function renderBundleCard(bundle) {
    if (!bundle) return;

    var messages = document.getElementById("gl-chatbot-messages");
    var card = el("div", "gl-chatbot-card");

    var img = document.createElement("img");
    img.src = bundle.image;
    img.alt = bundle.name;
    img.className = "gl-chatbot-card-img";

    var body = el("div", "gl-chatbot-card-body");
    var title = el("h4", "", bundle.name);
    var tagline = el("p", "", bundle.tagline || bundle.explanation || "");

    var add = el("button", "gl-chatbot-card-btn", "Add bundle to basket");
    add.type = "button";
    add.addEventListener("click", function () {
      if (window.GlowLabBasket && typeof window.GlowLabBasket.add === "function") {
        window.GlowLabBasket.add(bundle.add_to_basket_item || {
          id: bundle.basket_id || ("bundle-" + bundle.id),
          name: bundle.name,
          price: bundle.price || 99,
          img: bundle.image,
          kind: "bundle"
        });
        if (typeof window.GlowLabBasket.open === "function") {
          window.GlowLabBasket.open();
        }
      } else {
        addMessage("bot", "Basket integration is not loaded on this page yet. Make sure basket.js is included before chatbot.js.");
      }
    });

    body.appendChild(title);
    body.appendChild(tagline);
    body.appendChild(add);
    card.appendChild(img);
    card.appendChild(body);
    messages.appendChild(card);
    messages.scrollTop = messages.scrollHeight;
  }

  async function sendMessage(message) {
    addMessage("user", message);
    var thinking = addMessage("bot", "Thinking…");

    try {
      var res = await fetch(API_BASE + "/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message })
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      var data = await res.json();
      thinking.textContent = data.reply || "I couldn't find a good answer from the product data.";
      if (data.recommendedBundle) renderBundleCard(data.recommendedBundle);
    } catch (err) {
      thinking.textContent = "I couldn't connect to the GlowLab chatbot server. Start the backend with `npm start`, then try again.";
    }
  }

  function injectChatbot() {
    if (document.getElementById("gl-chatbot")) return;

    var root = el("div", "gl-chatbot", "");
    root.id = "gl-chatbot";
    root.innerHTML =
      '<button class="gl-chatbot-toggle" id="gl-chatbot-toggle" type="button" aria-label="Open GlowLab advisor">Ask GlowLab</button>' +
      '<section class="gl-chatbot-panel" id="gl-chatbot-panel" aria-hidden="true">' +
      '  <div class="gl-chatbot-head">' +
      '    <div><strong>GlowLab Advisor</strong><span>Product recommendations grounded in GlowLab data</span></div>' +
      '    <button type="button" id="gl-chatbot-close" aria-label="Close">×</button>' +
      '  </div>' +
      '  <div class="gl-chatbot-messages" id="gl-chatbot-messages"></div>' +
      '  <div class="gl-chatbot-quick">' +
      '    <button type="button" data-q="I am stressed and cannot sleep. What do you recommend?">Stress + sleep</button>' +
      '    <button type="button" data-q="I want clearer glowing skin. What bundle fits me?">Glowing skin</button>' +
      '    <button type="button" data-q="Does the energy bundle contain caffeine?">Caffeine?</button>' +
      '  </div>' +
      '  <form class="gl-chatbot-form" id="gl-chatbot-form">' +
      '    <input id="gl-chatbot-input" placeholder="Ask about products, routines, ingredients…" autocomplete="off" />' +
      '    <button type="submit">Send</button>' +
      '  </form>' +
      '</section>';

    document.body.appendChild(root);

    var panel = document.getElementById("gl-chatbot-panel");
    var toggle = document.getElementById("gl-chatbot-toggle");
    var close = document.getElementById("gl-chatbot-close");
    var form = document.getElementById("gl-chatbot-form");
    var input = document.getElementById("gl-chatbot-input");

    function open() {
      panel.classList.add("is-open");
      panel.setAttribute("aria-hidden", "false");
      input.focus();
      if (!document.querySelector(".gl-chatbot-msg")) {
        addMessage("bot", "Hi, I’m GlowLab’s product advisor. Tell me your goal — hair, skin, stress, energy, or hormone support — and I’ll recommend a routine from the GlowLab catalogue.");
      }
    }

    function hide() {
      panel.classList.remove("is-open");
      panel.setAttribute("aria-hidden", "true");
    }

    toggle.addEventListener("click", open);
    close.addEventListener("click", hide);

    document.querySelectorAll(".gl-chatbot-quick [data-q]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        sendMessage(btn.getAttribute("data-q"));
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var message = input.value.trim();
      if (!message) return;
      input.value = "";
      sendMessage(message);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectChatbot);
  } else {
    injectChatbot();
  }
})();
