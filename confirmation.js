(function () {
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

  document.addEventListener("DOMContentLoaded", function () {
    var root = document.getElementById("confirmation-root");
    if (!root) {
      return;
    }

    var raw = sessionStorage.getItem("glowlab-last-order");
    if (!raw) {
      root.innerHTML =
        '<div class="confirmation-card">' +
        "<h1>No order found</h1>" +
        "<p>Place an order from checkout first.</p>" +
        '<a href="index.html" class="btn btn-primary">Back to home</a>' +
        "</div>";
      return;
    }

    var order;
    try {
      order = JSON.parse(raw);
    } catch (e) {
      root.innerHTML = '<p class="checkout-lead">Could not read order details.</p>';
      return;
    }

    var lines = (order.items || [])
      .map(function (item) {
        var label = escapeHtml(item.name);
        if (item.subscription) {
          label += ' <span class="confirmation-sub-badge">Subscription</span>';
        }
        return (
          "<li>" +
          label +
          " · " +
          formatPrice(item.price * (item.qty || 1)) +
          "</li>"
        );
      })
      .join("");

    root.innerHTML =
      '<div class="confirmation-card">' +
      '<div class="confirmation-icon" aria-hidden="true">✓</div>' +
      "<p class=\"eyebrow\">Order confirmed</p>" +
      '<h1 class="quiz-title">Thank you — your <em>routine</em> is on its way</h1>' +
      "<p class=\"checkout-lead\">This is a demo confirmation. No payment was processed.</p>" +
      '<p class="confirmation-order-id">Order <strong>' +
      escapeHtml(order.id) +
      "</strong></p>" +
      "<ul class=\"confirmation-items\">" +
      lines +
      "</ul>" +
      '<p class="confirmation-total">Total · <strong>' +
      formatPrice(order.total) +
      "</strong></p>" +
      '<div class="confirmation-actions">' +
      '<a href="index.html" class="btn btn-primary">Continue shopping</a>' +
      '<a href="quiz.html" class="btn btn-secondary">Take the quiz</a>' +
      "</div></div>";
  });
})();
