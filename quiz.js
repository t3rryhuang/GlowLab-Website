const BUNDLES = [
  {
    id: "hair",
    name: "Stronger Hair & Nails",
    tagline: "Hair + nutrition + hydration, kept simple.",
    explanation:
      "Targeted hair support, daily nutrients, and hydration + immune support — structured for shedding and strength.",
    img: "bundle_photos/hair&nail.png",
    items: [
      ["Nutrafol", "Nutrafol Women Hair Growth Nutraceutical", "Targeted hair-support nutrients for shedding and strength."],
      ["OLLY", "OLLY Women's Multi", "Biotin + B vitamins for everyday nutrient support."],
      ["Liquid I.V.", "Liquid I.V. Hydration Multiplier + Immune Support", "Electrolytes + vitamin C and zinc for daily hydration."],
    ],
    routine: [
      ["Morning", "OLLY Women's Multi — 2 gummies daily."],
      ["Afternoon", "Liquid I.V. Hydration Multiplier + Immune Support — mix 1 stick with 500 ml water."],
      ["Evening", "Nutrafol Women Hair Growth Nutraceutical — 4 capsules once daily with a meal."],
    ],
  },
  {
    id: "skin",
    name: "Clear Glowing Skin",
    tagline: "Inside-out glow, made simple.",
    explanation:
      "Internal skin support, beauty gummies, and sugar-free hydration for a fresher-looking glow.",
    img: "bundle_photos/clear_skin.png",
    items: [
      ["Nutrafol", "Nutrafol Clear Skin Nutraceutical", "Internal skin-support for breakouts and dullness from within."],
      ["OLLY", "OLLY Glowing Skin", "Hyaluronic acid + collagen for beauty-from-within."],
      ["Liquid I.V.", "Liquid I.V. Sugar-Free Hydration Multiplier", "Sugar-free electrolytes for clean daily hydration."],
    ],
    routine: [
      ["Morning", "Nutrafol Clear Skin Nutraceutical — 4 capsules once daily with a meal."],
      ["Afternoon", "Liquid I.V. Sugar-Free Hydration Multiplier — mix 1 stick with 500 ml water."],
      ["Evening", "OLLY Glowing Skin — 2 gummies daily."],
    ],
  },
  {
    id: "stress",
    name: "Sleep & Stress Relief",
    tagline: "Calm support, without overcomplicating bedtime.",
    explanation:
      "Adaptogen support, calm gummies, and caffeine-free hydration for a gentle reset ritual.",
    img: "bundle_photos/sleep&stress.png",
    items: [
      ["Nutrafol", "Nutrafol Stress Adaptogen Booster", "Adaptogen-led stress support for high-pressure days."],
      ["OLLY", "OLLY Goodbye Stress", "GABA + L-theanine for calm during busy days."],
      ["Liquid I.V.", "Liquid I.V. Sugar-Free Hydration Multiplier", "Caffeine-free hydration for a lighter evening ritual."],
    ],
    routine: [
      ["Morning", "Nutrafol Stress Adaptogen Booster — 2 capsules once daily with a meal."],
      ["Afternoon", "OLLY Goodbye Stress — 2 gummies daily."],
      ["Evening", "Liquid I.V. Sugar-Free Hydration Multiplier — mix 1 stick with 500 ml water."],
    ],
  },
  {
    id: "energy",
    name: "Daily Energy & Focus",
    tagline: "Morning momentum, steady focus.",
    explanation:
      "B-vitamin support, energy gummies, and functional hydration for morning momentum.",
    img: "bundle_photos/daily_energy.png",
    items: [
      ["Nutrafol", "Nutrafol B-Energized Booster", "B-vitamin energy metabolism support."],
      ["OLLY", "OLLY Extra Strength Daily Energy", "B12 + CoQ10 in a simple gummy format."],
      ["Liquid I.V.", "Liquid I.V. Hydration Multiplier + Energy", "Functional hydration for work or study."],
    ],
    routine: [
      ["Morning", "Nutrafol B-Energized Booster — 1 capsule once daily with a meal."],
      ["Morning", "OLLY Extra Strength Daily Energy — 2 gummies daily."],
      ["Early afternoon", "Liquid I.V. Hydration Multiplier + Energy — mix 1 stick with 500 ml water."],
    ],
  },
  {
    id: "hormone",
    name: "Women's Hormone Health",
    tagline: "Cycle support, structured daily.",
    explanation:
      "Hormone-transition hair support, cycle gummies, and hydration + immune support in one plan.",
    img: "bundle_photos/women_hormone.png",
    items: [
      ["Nutrafol", "Nutrafol Women's Balance", "Hormone-transition hair support for life-stage changes."],
      ["OLLY", "OLLY Period Hero", "Chasteberry + vitamin B6 for cycle support."],
      ["Liquid I.V.", "Liquid I.V. Hydration Multiplier + Immune Support", "Electrolytes + immune-support nutrients."],
    ],
    routine: [
      ["Morning", "OLLY Period Hero — 2 gummies daily."],
      ["Afternoon", "Liquid I.V. Hydration Multiplier + Immune Support — mix 1 stick with 500 ml water."],
      ["Evening", "Nutrafol Women's Balance — 4 capsules once daily with a meal."],
    ],
  },
];

const PRODUCT_IMAGES = {
  "Nutrafol Women Hair Growth Nutraceutical": "individual_photos/Nutrafol_Hair_Growth.png",
  "Nutrafol Clear Skin Nutraceutical": "individual_photos/Nutrafol_Clear_Skin.png",
  "Nutrafol Stress Adaptogen Booster": "individual_photos/Nutrafol_Stress_Adaptogen.png",
  "Nutrafol B-Energized Booster": "individual_photos/Nutrafol_B-Energized.png",
  "Nutrafol Women's Balance": "individual_photos/Nutrafol_Women_Balance.png",
  "OLLY Women's Multi": "individual_photos/OLLY_Women_Multi.png",
  "OLLY Glowing Skin": "individual_photos/OLLY_Glowing_Skin.png",
  "OLLY Goodbye Stress": "individual_photos/OLLY_Goodbye_Stress.png",
  "OLLY Extra Strength Daily Energy": "individual_photos/OLLY_Daily_Energy.png",
  "OLLY Period Hero": "individual_photos/OLLY_Period_Hero.png",
  "Liquid I.V. Sugar-Free Hydration Multiplier": "individual_photos/Liquid I.V. Hydration Multiplier.png",
  "Liquid I.V. Hydration Multiplier + Energy": "individual_photos/Liquid I.V. Hydration Multiplier + Energy.png",
  "Liquid I.V. Hydration Multiplier + Immune Support":
    "individual_photos/Liquid I.V. Hydration Multiplier + Immune Support.png",
};

const KEYS = ["hair", "skin", "stress", "energy", "hormone"];

const SENSITIVITY_REVIEW = {
  hair: {
    headsUp:
      "This routine may not be suitable for customers avoiding animal-derived ingredients or marine collagen. Please check each product label before purchase, especially if you have fish, collagen, gelatin, or botanical sensitivities.",
    ingredients:
      "Nutrafol Women Hair Growth Nutraceutical: marine collagen peptides, possible fish-derived collagen concern, ashwagandha, saw palmetto, curcumin.\nOLLY Women's Multi: animal gelatin.\nLiquid I.V. Hydration Multiplier + Immune Support: electrolytes, sodium, potassium, vitamin C, zinc, immune-support ingredients.",
  },
  skin: {
    headsUp:
      "This routine includes beauty and supplement products that may contain animal-derived ingredients. Please review the label if you avoid gelatin, collagen, or have sensitivities to skin-support supplements.",
    ingredients:
      "Nutrafol Clear Skin Nutraceutical: botanical / internal skin-support blend.\nOLLY Glowing Skin: gelatin, collagen peptides.\nLiquid I.V. Sugar-Free Hydration Multiplier: sodium, potassium, magnesium, calcium, possible sweetener sensitivity.",
  },
  stress: {
    headsUp:
      "This routine includes stress-support ingredients and gummies that may not suit every dietary preference. Please check labels if you avoid gelatin or are sensitive to adaptogens, botanicals, or calming ingredients.",
    ingredients:
      "Nutrafol Stress Adaptogen Booster: ashwagandha, adaptogen blend.\nOLLY Goodbye Stress: gelatin, GABA, L-theanine, lemon balm.\nLiquid I.V. Sugar-Free Hydration Multiplier: sodium, potassium, magnesium, calcium, possible sweetener sensitivity.",
  },
  energy: {
    headsUp:
      "This routine includes energy-support products. Please review before purchase if you avoid caffeine, gelatin, or stimulant-style ingredients.",
    ingredients:
      "Nutrafol B-Energized Booster: B vitamins.\nOLLY Extra Strength Daily Energy: gelatin, B vitamins.\nLiquid I.V. Hydration Multiplier + Energy: caffeine, matcha, guayusa, electrolytes, sodium, potassium.",
  },
  hormone: {
    headsUp:
      "This routine is designed around cycle or hormone-related wellbeing and may include animal-derived or botanical ingredients. Please check labels carefully if you avoid collagen, gelatin, or have sensitivities related to women's health supplements.",
    ingredients:
      "Nutrafol Women's Balance: marine collagen peptides, possible fish-derived collagen concern.\nOLLY Period Hero: gelatin, chasteberry, vitamin B6, calcium.\nLiquid I.V. Hydration Multiplier + Immune Support: electrolytes, vitamin C, zinc, immune-support ingredients.",
  },
};

const QUIZ = [
  {
    label: "Question 1 — Target outcome",
    title: "What do you want your routine to help with <em>most</em>?",
    sub: "Choose the outcome that matters most for your next 4-week routine.",
    options: [
      { title: "Feel more confident in my hair and nails", desc: "Strength, shedding, and everyday hair wellness.", scores: { hair: 7 } },
      { title: "Get a fresher, clearer-looking complexion", desc: "Glow, clarity, and skin-from-within support.", scores: { skin: 7 } },
      { title: "Feel calmer and less mentally overloaded", desc: "Stress, calm, and a gentler daily reset.", scores: { stress: 7 } },
      { title: "Stay energised through work or study days", desc: "Focus, momentum, and functional hydration.", scores: { energy: 7 } },
      { title: "Support my body through cycle or hormone changes", desc: "Cycle, life-stage, and women's wellbeing.", scores: { hormone: 7 } },
    ],
  },
  {
    label: "Question 2 — Main concern",
    title: "What feels most difficult to manage <em>right now</em>?",
    sub: "Choose the issue that best explains why you want support.",
    options: [
      { title: "Keeping a consistent routine", desc: "I need structure more than a specific concern.", scores: {} },
      { title: "Skin or body feeling out of balance", desc: "Complexion, texture, or general balance.", scores: { skin: 4, hormone: 2 } },
      { title: "Stress affecting how I look or feel", desc: "Pressure shows up in mood, skin, or hair.", scores: { stress: 4, hair: 2, skin: 2 } },
      { title: "More hair shedding or visible weakness", desc: "Thinning, breakage, or nail concerns.", scores: { hair: 4, hormone: 2 } },
      { title: "Low energy during the day", desc: "Afternoon slumps or mental fatigue.", scores: { energy: 4, stress: 2 } },
      { title: "Cycle or hormone changes feeling harder to manage", desc: "PMS, perimenopause, or life-stage shifts.", scores: { hormone: 4, energy: 2 } },
      { title: "I'm not sure where to start", desc: "We'll lean on your primary goal from Q1.", scores: {} },
    ],
  },
  {
    label: "Question 3 — Lifestyle",
    title: "Which lifestyle best <em>describes</em> you?",
    sub: "This helps us make the routine realistic for your day.",
    options: [
      { title: "Desk-based work or study", desc: "Long hours sitting, working, studying, or at a screen.", scores: { energy: 2, hair: 1, stress: 1 } },
      { title: "Beauty & wellness focused", desc: "I build routines around skin, hair, glow, and self-care.", scores: { skin: 2, hair: 1, hormone: 1 } },
      { title: "Active & on-the-go", desc: "I move often, exercise regularly, or stay active daily.", scores: { energy: 2 } },
      { title: "Busy & stressed", desc: "Full, fast-paced, or mentally demanding days.", scores: { stress: 2, hair: 1, energy: 1 } },
      { title: "New mum or caring routine", desc: "Caring responsibilities and limited personal time.", scores: { stress: 2, energy: 1, hormone: 1 } },
      { title: "Cycle or life-stage focused", desc: "Cycle, hormone, or life-stage changes shape my wellbeing.", scores: { hormone: 2 } },
    ],
  },
];

const PHOTO_STEP = QUIZ.length;

let step = 0;
let answers = [];
let scores = { hair: 0, skin: 0, stress: 0, energy: 0, hormone: 0 };
let skinOneLiner = null;
let photoPreviewUrl = null;
let activePhotoStream = null;

function getApiBase() {
  if (window.GLOWLAB_CHATBOT_API != null && window.GLOWLAB_CHATBOT_API !== "") {
    return window.GLOWLAB_CHATBOT_API;
  }
  if (location.protocol === "file:") {
    return "http://localhost:3000";
  }
  if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
    if (location.port === "3000") {
      return "";
    }
    return "http://localhost:3000";
  }
  return "";
}

function stopPhotoStream() {
  if (activePhotoStream) {
    activePhotoStream.getTracks().forEach(function (track) {
      track.stop();
    });
    activePhotoStream = null;
  }
}

function revokePhotoPreview() {
  stopPhotoStream();
  if (photoPreviewUrl) {
    URL.revokeObjectURL(photoPreviewUrl);
    photoPreviewUrl = null;
  }
}

function captureFromVideo(video) {
  var canvas = document.createElement("canvas");
  canvas.width = video.videoWidth || 640;
  canvas.height = video.videoHeight || 480;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.9);
}

function buildResultSubtitle(explanation) {
  if (!skinOneLiner) {
    return explanation;
  }
  var lead = skinOneLiner.trim();
  if (!/[.!?]$/.test(lead)) {
    lead += ".";
  }
  return lead + " " + explanation;
}

async function requestSkinAssessment(dataUrl) {
  var res = await fetch(getApiBase() + "/api/skin-assessment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      image: dataUrl,
      mimeType: (dataUrl.match(/^data:([^;]+);/) || [])[1] || "image/jpeg",
    }),
  });
  var data = await res.json();
  if (!res.ok && !data.oneLiner) {
    throw new Error("Skin assessment failed");
  }
  return data.oneLiner || null;
}

function $(sel) {
  return document.querySelector(sel);
}

function addScores(s) {
  KEYS.forEach(function (k) {
    scores[k] += s[k] || 0;
  });
}

function pickBundle() {
  var best = KEYS[0];
  var bestScore = -1;
  KEYS.forEach(function (k) {
    if (scores[k] > bestScore) {
      bestScore = scores[k];
      best = k;
    }
  });
  var tied = KEYS.filter(function (k) {
    return scores[k] === bestScore;
  });
  if (tied.length > 1 && answers[0]) {
    var q1 = answers[0].scores;
    for (var i = 0; i < tied.length; i++) {
      if (q1[tied[i]]) {
        best = tied[i];
        break;
      }
    }
  }
  for (var j = 0; j < BUNDLES.length; j++) {
    if (BUNDLES[j].id === best) return BUNDLES[j];
  }
  return BUNDLES[0];
}

function imgFor(name) {
  return PRODUCT_IMAGES[name] || "individual_photos/OLLY_Women_Multi.png";
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderSensitivityReview(bundleId) {
  var review = SENSITIVITY_REVIEW[bundleId];
  if (!review) return "";

  var items = review.ingredients
    .split(/\n+/)
    .map(function (line) {
      return line.trim();
    })
    .filter(Boolean)
    .map(function (line) {
      return "<li>" + escapeHtml(line) + "</li>";
    })
    .join("");

  return (
    '<section class="results-sensitivities" aria-labelledby="sensitivities-heading">' +
    '<p class="results-sensitivities-eyebrow">Before you buy</p>' +
    '<h4 id="sensitivities-heading">Allergies &amp; sensitivities to review</h4>' +
    '<p class="results-sensitivities-lead">' + escapeHtml(review.headsUp) + "</p>" +
    '<ul class="results-sensitivities-list">' + items + "</ul>" +
    "</section>"
  );
}

const TOTAL_QUIZ_STEPS = QUIZ.length + 1;

function progressHtml(activeStep) {
  var html = "";
  for (var i = 0; i < TOTAL_QUIZ_STEPS; i++) {
    var cls = "quiz-progress-bar";
    if (i < activeStep) cls += " done";
    else if (i === activeStep) cls += " active";
    html += '<div class="' + cls + '"></div>';
  }
  return html;
}

function renderPhotoStep() {
  var wrap = $("#quiz-app");
  wrap.innerHTML =
    '<div class="quiz-page page-fade"><div class="page quiz-photo-page">' +
    '<p class="quiz-step-label">Question 4 — Skin snapshot</p>' +
    '<h1 class="quiz-title">We&rsquo;d like a quick photo to <em>describe</em> your skin</h1>' +
    '<p class="quiz-sub">Optional — a one-line note appears on your results for fun only. It does <strong>not</strong> change which bundle we match you to.</p>' +
    '<div class="quiz-photo-card">' +
    '<ul class="quiz-photo-tips" aria-label="Photo tips">' +
    '<li><span class="quiz-photo-tip-icon" aria-hidden="true">👓</span><span>Remove your glasses</span></li>' +
    '<li><span class="quiz-photo-tip-icon" aria-hidden="true">🎀</span><span>Pull back your hair</span></li>' +
    '<li><span class="quiz-photo-tip-icon" aria-hidden="true">📷</span><span>Face the camera directly</span></li>' +
    '<li><span class="quiz-photo-tip-icon" aria-hidden="true">🙂</span><span>Keep a neutral expression</span></li>' +
    "</ul>" +
    '<div class="quiz-photo-preview" id="quiz-photo-preview">' +
    '<p class="quiz-photo-placeholder" id="quiz-photo-placeholder">Your webcam preview will appear here</p>' +
    '<video id="quiz-photo-video" class="quiz-photo-video" autoplay playsinline muted hidden></video>' +
    '<img id="quiz-photo-img" alt="Your captured selfie" hidden />' +
    "</div>" +
    '<label class="quiz-photo-consent">' +
    '<input type="checkbox" id="quiz-photo-consent" />' +
    "<span>If you use your webcam, a captured frame is sent to our server only to generate a short line for your results. It is not stored or used for product matching.</span>" +
    "</label>" +
    '<div class="quiz-photo-actions">' +
    '<button type="button" class="btn btn-secondary" id="quiz-photo-start" disabled>Start webcam</button>' +
    '<button type="button" class="btn btn-secondary" id="quiz-photo-capture" disabled>Take photo</button>' +
    '<button type="button" class="btn btn-ghost" id="quiz-photo-retake" hidden>Retake</button>' +
    '<button type="button" class="btn btn-ghost" id="quiz-photo-skip">Skip this step</button>' +
    "</div>" +
    '<p class="quiz-photo-status" id="quiz-photo-status" role="status" aria-live="polite"></p>' +
    "</div>" +
    '<div class="quiz-foot">' +
    '<button type="button" class="quiz-back" id="quiz-back">← Back</button>' +
    '<button type="button" class="btn btn-primary" id="quiz-photo-continue" disabled>See my match</button>' +
    "</div></div></div>";

  var page = wrap.querySelector(".page");
  var prog = document.createElement("div");
  prog.className = "quiz-progress";
  prog.innerHTML = progressHtml(PHOTO_STEP);
  page.insertBefore(prog, page.querySelector(".quiz-title"));

  var captureDataUrl = null;
  var consent = $("#quiz-photo-consent");
  var continueBtn = $("#quiz-photo-continue");
  var status = $("#quiz-photo-status");
  var previewImg = $("#quiz-photo-img");
  var video = $("#quiz-photo-video");
  var placeholder = $("#quiz-photo-placeholder");
  var startBtn = $("#quiz-photo-start");
  var captureBtn = $("#quiz-photo-capture");
  var retakeBtn = $("#quiz-photo-retake");

  function updateContinue() {
    continueBtn.disabled = !(captureDataUrl && consent.checked);
    startBtn.disabled = !consent.checked || !!captureDataUrl;
  }

  function showLivePreview() {
    placeholder.hidden = true;
    previewImg.hidden = true;
    video.hidden = false;
    retakeBtn.hidden = true;
    captureBtn.hidden = false;
    startBtn.hidden = true;
  }

  function showCapturedPreview(dataUrl) {
    stopPhotoStream();
    video.hidden = true;
    video.srcObject = null;
    placeholder.hidden = true;
    previewImg.src = dataUrl;
    previewImg.hidden = false;
    captureBtn.hidden = true;
    startBtn.hidden = true;
    retakeBtn.hidden = false;
  }

  function resetCapture() {
    captureDataUrl = null;
    previewImg.hidden = true;
    previewImg.removeAttribute("src");
    retakeBtn.hidden = true;
    captureBtn.hidden = false;
    captureBtn.disabled = true;
    startBtn.hidden = false;
    placeholder.hidden = false;
    updateContinue();
  }

  async function startWebcam() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      status.textContent = "Your browser does not support webcam access. Skip this step or try another browser.";
      return;
    }

    stopPhotoStream();
    status.textContent = "Requesting camera access…";

    try {
      var stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      activePhotoStream = stream;
      video.srcObject = stream;
      await video.play();
      showLivePreview();
      captureBtn.disabled = false;
      status.textContent = "Position your face in the frame, then tap Take photo.";
    } catch (err) {
      status.textContent = "Couldn't access your webcam. Check browser permissions or skip this step.";
    }
  }

  consent.addEventListener("change", updateContinue);

  startBtn.addEventListener("click", function () {
    if (!consent.checked) {
      return;
    }
    startWebcam();
  });

  captureBtn.addEventListener("click", function () {
    if (!video.srcObject || video.readyState < 2) {
      status.textContent = "Wait for the camera to load, then try again.";
      return;
    }
    captureDataUrl = captureFromVideo(video);
    showCapturedPreview(captureDataUrl);
    status.textContent = "Photo captured — continue when you're ready.";
    updateContinue();
  });

  retakeBtn.addEventListener("click", function () {
    resetCapture();
    status.textContent = "";
    if (consent.checked) {
      startWebcam();
    }
  });

  $("#quiz-back").onclick = function () {
    revokePhotoPreview();
    step = PHOTO_STEP - 1;
    renderQuiz();
  };

  $("#quiz-photo-skip").onclick = function () {
    skinOneLiner = null;
    revokePhotoPreview();
    step = PHOTO_STEP + 1;
    renderResults();
  };

  continueBtn.onclick = async function () {
    if (!captureDataUrl || !consent.checked) {
      return;
    }
    continueBtn.disabled = true;
    status.textContent = "Analysing your photo…";
    try {
      skinOneLiner = await requestSkinAssessment(captureDataUrl);
    } catch (err) {
      skinOneLiner = null;
      status.textContent = "We couldn't analyse that photo — showing your match without it.";
      await new Promise(function (r) {
        setTimeout(r, 900);
      });
    }
    revokePhotoPreview();
    step = PHOTO_STEP + 1;
    renderResults();
  };

  updateContinue();
}

function renderQuiz() {
  var wrap = $("#quiz-app");
  if (step === PHOTO_STEP) {
    renderPhotoStep();
    return;
  }
  if (step > PHOTO_STEP) {
    renderResults();
    return;
  }
  var q = QUIZ[step];
  wrap.innerHTML =
    '<div class="quiz-page page-fade"><div class="page">' +
    '<p class="quiz-step-label">' + q.label + '</p>' +
    '<h1 class="quiz-title">' + q.title + '</h1>' +
    '<p class="quiz-sub">' + q.sub + '</p>' +
    '<div class="quiz-options" id="quiz-options"></div>' +
    '<div class="quiz-foot">' +
    '<button type="button" class="quiz-back" id="quiz-back"' + (step === 0 ? ' style="visibility:hidden"' : '') + '>← Back</button>' +
    '<button type="button" class="btn btn-primary" id="quiz-next" disabled>Continue</button>' +
    '</div></div></div>';
  var page = wrap.querySelector(".page");
  var prog = document.createElement("div");
  prog.className = "quiz-progress";
  prog.id = "quiz-progress";
  prog.innerHTML = progressHtml(step);
  page.insertBefore(prog, page.querySelector(".quiz-title"));
  var opts = $("#quiz-options");
  q.options.forEach(function (opt, idx) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "quiz-option";
    btn.innerHTML = '<div class="quiz-option-icon">' + String.fromCharCode(65 + idx) + '</div><div class="quiz-option-body"><div class="quiz-option-title">' + opt.title + '</div><div class="quiz-option-desc">' + opt.desc + '</div></div>';
    btn.addEventListener("click", function () {
      document.querySelectorAll(".quiz-option").forEach(function (o) { o.classList.remove("selected"); });
      btn.classList.add("selected");
      answers[step] = opt;
      $("#quiz-next").disabled = false;
    });
    if (answers[step] === opt) btn.classList.add("selected");
    opts.appendChild(btn);
  });
  $("#quiz-back").onclick = function () { if (step > 0) { step--; renderQuiz(); } };
  $("#quiz-next").onclick = function () {
    if (!answers[step]) return;
    addScores(answers[step].scores);
    step++;
    renderQuiz();
  };
  if (answers[step]) $("#quiz-next").disabled = false;
}

function renderResults() {
  var bundle = pickBundle();
  var wrap = $("#quiz-app");
  wrap.innerHTML =
    '<div class="page page-fade" style="padding:40px 0 100px">' +
    '<div class="results-hero"><span class="pill">Your match</span>' +
    '<h1 class="quiz-title">' + bundle.name + '</h1>' +
    '<p class="quiz-sub" id="result-subtitle">' + escapeHtml(buildResultSubtitle(bundle.explanation)) + '</p>' +
    '<p id="result-tagline" style="font-size:26px;color:var(--purple-deep);margin-top:8px;font-family:\'Instrument Serif\',Georgia,serif"></p>' +
    '<div style="max-width:640px;margin:32px auto 0;border-radius:var(--radius-xl);overflow:hidden;box-shadow:var(--shadow-hover)">' +
    '<img src="' + bundle.img + '" alt="' + bundle.name + '" style="width:100%;display:block;aspect-ratio:16/10;object-fit:cover">' +
    '</div></div>' +
    '<div class="results-grid page"><div class="results-products" id="results-products"></div>' +
    '<div class="results-sidebar" id="results-sidebar"></div>' +
    '<div style="text-align:center;margin-top:48px;display:flex;gap:14px;justify-content:center;flex-wrap:wrap">' +
    '<a href="index.html#bundles" class="btn btn-secondary">View all bundles</a>' +
    '<button type="button" class="btn btn-primary" id="add-bundle-basket">Add bundle to basket</button>' +
    '<button type="button" class="btn btn-ghost" id="retake">Retake quiz</button></div></div>';
  document.getElementById("result-tagline").textContent = bundle.tagline;
  var rp = $("#results-products");
  bundle.items.forEach(function (it) {
    var art = document.createElement("article");
    art.className = "result-product";
    art.innerHTML = '<div class="result-product-img product-img-real"><img src="' + imgFor(it[1]) + '" alt="' + it[1] + '"></div><div class="result-product-body"><span class="product-brand">' + it[0] + '</span><h3 class="product-name" style="font-size:20px">' + it[1] + '</h3><div class="result-why"><strong>Why this fits you</strong> · ' + it[2] + '</div></div>';
    rp.appendChild(art);
  });
  var sidebar = $("#results-sidebar");
  sidebar.innerHTML =
    '<aside class="results-ritual"><h3>Your daily ritual</h3></aside>' +
    renderSensitivityReview(bundle.id);
  var ritual = sidebar.querySelector(".results-ritual");
  bundle.routine.forEach(function (pair) {
    var block = document.createElement("div");
    block.className = "ritual-block";
    block.innerHTML =
      '<div class="ritual-time">' +
      pair[0] +
      '</div><div class="ritual-items"><div class="ritual-item"><span class="ritual-item-dot"></span><span>' +
      pair[1] +
      "</span></div></div>";
    ritual.appendChild(block);
  });
  $("#add-bundle-basket").onclick = function () {
    if (window.GlowLabBasket) {
      window.GlowLabBasket.add({
        id: "bundle-" + bundle.id,
        name: bundle.name,
        price: 99,
        img: bundle.img,
        kind: "bundle",
      });
    }
  };
  $("#retake").onclick = function () {
    step = 0;
    answers = [];
    scores = { hair: 0, skin: 0, stress: 0, energy: 0, hormone: 0 };
    skinOneLiner = null;
    revokePhotoPreview();
    renderQuiz();
  };
}

document.addEventListener("DOMContentLoaded", function () {
  var start = document.getElementById("start-quiz");
  if (start) {
    start.onclick = function () {
      document.getElementById("quiz-intro").style.display = "none";
      renderQuiz();
    };
  } else {
    renderQuiz();
  }
});
