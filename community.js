(function () {
  var grid = document.getElementById("posts-grid");
  var empty = document.getElementById("posts-empty");
  if (!grid) return;

  var posts = grid.querySelectorAll(".post");

  function setTopic(topic) {
    var visible = 0;
    posts.forEach(function (post) {
      var show = topic === "all" || post.getAttribute("data-topic") === topic;
      post.style.display = show ? "" : "none";
      if (show) visible += 1;
    });
    if (empty) empty.style.display = visible ? "none" : "block";

    document.querySelectorAll(".trending-tag").forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-topic") === topic);
    });
  }

  document.querySelectorAll(".trending-tag").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setTopic(btn.getAttribute("data-topic") || "all");
    });
  });

  setTopic("all");
})();
