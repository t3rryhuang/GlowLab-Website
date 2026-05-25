import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GoogleGenAI } from "@google/genai";
import { sendAbandonedCartEmail } from "./email-send.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_ROOT = path.resolve(__dirname, "..");
// If you keep /data at project root, this points to ../data from /backend.
const DATA_DIR = path.join(SITE_ROOT, "data");

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(cors());
app.use(express.json({ limit: "8mb" }));

// Block accidental exposure of backend secrets when serving the site root.
app.use((req, res, next) => {
  const blocked = ["/backend", "/data"];
  if (blocked.some((prefix) => req.path === prefix || req.path.startsWith(prefix + "/"))) {
    return res.status(404).end();
  }
  next();
});

let knowledge;

async function loadJson(filename) {
  const raw = await fs.readFile(path.join(DATA_DIR, filename), "utf8");
  return JSON.parse(raw);
}

async function loadKnowledge() {
  const [products, bundles, quizRules, safetyRules] = await Promise.all([
    loadJson("products.json"),
    loadJson("bundles.json"),
    loadJson("quiz_rules.json"),
    loadJson("safety_rules.json"),
  ]);

  knowledge = {
    products: products.products || [],
    bundles: bundles.bundles || [],
    quizRules,
    safetyRules,
  };

  knowledge.productById = Object.fromEntries(
    knowledge.products.map((p) => [p.id, p])
  );
  knowledge.bundleById = Object.fromEntries(
    knowledge.bundles.map((b) => [b.id, b])
  );
}

function normalize(text = "") {
  return String(text).toLowerCase();
}

function scoreTextToBundle(message) {
  const text = normalize(message);
  const scores = Object.fromEntries(knowledge.bundles.map((b) => [b.id, 0]));

  const keywordBoosts = {
    hair: ["hair", "nail", "shedding", "breakage", "thinning", "strength"],
    skin: ["skin", "glow", "glowing", "complexion", "breakout", "breakouts", "acne", "dull"],
    stress: ["stress", "stressed", "calm", "sleep", "overloaded", "reset", "anxious", "bedtime"],
    energy: ["energy", "tired", "fatigue", "focus", "study", "work", "desk", "caffeine", "slump"],
    hormone: ["hormone", "hormonal", "cycle", "pms", "period", "perimenopause", "menopause", "life-stage"]
  };

  for (const [bundleId, words] of Object.entries(keywordBoosts)) {
    for (const word of words) {
      if (text.includes(word)) scores[bundleId] += 3;
    }
  }

  for (const bundle of knowledge.bundles) {
    const searchable = [
      bundle.name,
      bundle.tag,
      ...(bundle.goals || []),
      ...(bundle.best_for || []),
      bundle.explanation
    ].join(" ").toLowerCase();

    for (const token of text.split(/[^a-z0-9]+/).filter(Boolean)) {
      if (token.length > 3 && searchable.includes(token)) scores[bundle.id] += 1;
    }
  }

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  if (!sorted.length || sorted[0][1] === 0) return null;

  return knowledge.bundleById[sorted[0][0]];
}

function recommendFromScores(scoreInput = {}) {
  const keys = knowledge.quizRules.score_keys || ["hair", "skin", "stress", "energy", "hormone"];
  const scores = Object.fromEntries(keys.map((k) => [k, Number(scoreInput[k] || 0)]));
  let best = keys[0];
  let bestScore = -Infinity;

  for (const key of keys) {
    if (scores[key] > bestScore) {
      best = key;
      bestScore = scores[key];
    }
  }

  return knowledge.bundleById[best] || knowledge.bundles[0];
}

function getBundleContext(bundle) {
  if (!bundle) {
    return {
      products: knowledge.products,
      bundles: knowledge.bundles
    };
  }

  const products = (bundle.products || [])
    .map((id) => knowledge.productById[id])
    .filter(Boolean);

  return { bundle, products };
}

function hasSensitiveContext(message) {
  const text = normalize(message);
  return (knowledge.safetyRules.sensitive_context_triggers || [])
    .some((term) => text.includes(normalize(term)));
}

function fallbackReply(message, bundle) {
  if (!bundle) {
    return "I can help you find a GlowLab routine. What are you mainly looking for: stronger hair, clearer skin, less stress, more energy, or hormone/cycle support?";
  }

  const products = (bundle.products || [])
    .map((id) => knowledge.productById[id]?.name)
    .filter(Boolean)
    .join(", ");

  const safety = hasSensitiveContext(message)
    ? "\n\nPlease check the product label and speak to a qualified healthcare professional before using supplements, especially if you are pregnant, breastfeeding, taking medication, under 18, have allergies, or are managing a medical condition."
    : "";

  return `I’d recommend the ${bundle.name} bundle. ${bundle.explanation}\n\nIt includes: ${products}.\n\n${bundle.safety?.heads_up || ""}${safety}`;
}

async function askGemini({ message, bundle }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return fallbackReply(message, bundle);
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = process.env.GEMINI_MODEL || "gemini-3-flash-preview";
  const context = getBundleContext(bundle);

  const prompt = `
You are GlowLab's wellness shopping assistant.

Your job:
- Recommend only GlowLab products and bundles from the provided JSON.
- Explain why a product or bundle fits the user's stated goal.
- Answer routine, ingredient, sensitivity, caffeine, gelatin, and compatibility questions using only the provided JSON.
- Keep replies friendly and concise: 2-5 short paragraphs max.
- When recommending a bundle, include the bundle name and the three products.
- If the user asks to add something to the basket, say you can add it and mention the correct bundle/product name.

Safety rules:
${JSON.stringify(knowledge.safetyRules, null, 2)}

Relevant product/bundle context:
${JSON.stringify(context, null, 2)}

User message:
${message}
`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
  });

  return response.text || fallbackReply(message, bundle);
}

const SKIN_ASSESSMENT_FALLBACKS = [
  "Your skin could use a little extra hydration today.",
  "You look like you could use a gentle, calming routine today.",
  "Your complexion looks like it would love some steady daily support.",
];

function pickSkinFallback() {
  return SKIN_ASSESSMENT_FALLBACKS[
    Math.floor(Math.random() * SKIN_ASSESSMENT_FALLBACKS.length)
  ];
}

function normalizeSkinOneLiner(text) {
  let line = String(text || "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^["'`]+|["'`]+$/g, "");
  if (!line) return "";
  if (!/[.!?]$/.test(line)) line += ".";
  return line;
}

async function assessSkinFromPhoto({ imageBase64, mimeType }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return pickSkinFallback();
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = process.env.GEMINI_MODEL || "gemini-3-flash-preview";

  const prompt = `You are a friendly wellness copywriter for GlowLab (a supplement boutique).

Look at this selfie and write exactly ONE short phrase in plain, simple English that will appear immediately before a product routine description.

Rules:
- Maximum 14 words.
- Friendly and observational only — not medical advice, not a diagnosis.
- Do NOT name any products, brands, bundles, or supplements.
- Must end with the exact words "we recommend" (lowercase "we").
- Start with "Because" when possible, e.g. "Because your skin looks dry and you seem tired, we recommend"
- Return only that one phrase, nothing else.`;

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        role: "user",
        parts: [
          { inlineData: { mimeType, data: imageBase64 } },
          { text: prompt },
        ],
      },
    ],
  });

  const line = normalizeSkinOneLiner(response.text);
  return line || pickSkinFallback();
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "glowlab-chatbot" });
});

app.get("/api/products", (_req, res) => {
  res.json({ products: knowledge.products });
});

app.get("/api/bundles", (_req, res) => {
  res.json({ bundles: knowledge.bundles });
});

app.post("/api/recommend", (req, res) => {
  const { scores, message } = req.body || {};
  const bundle = scores ? recommendFromScores(scores) : scoreTextToBundle(message || "");
  res.json({
    recommendedBundle: bundle,
    products: bundle ? bundle.products.map((id) => knowledge.productById[id]).filter(Boolean) : []
  });
});

app.post("/api/skin-assessment", async (req, res) => {
  try {
    const { image, mimeType } = req.body || {};
    if (!image || typeof image !== "string") {
      return res.status(400).json({ error: "Image is required." });
    }

    const cleaned = image.replace(/^data:[^;]+;base64,/, "").trim();
    if (!cleaned) {
      return res.status(400).json({ error: "Invalid image data." });
    }

    const oneLiner = await assessSkinFromPhoto({
      imageBase64: cleaned,
      mimeType: mimeType || "image/jpeg",
    });

    res.json({ oneLiner });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      oneLiner: pickSkinFallback(),
      error: "SKIN_ASSESSMENT_ERROR",
    });
  }
});

app.post("/api/abandoned-cart", async (req, res) => {
  try {
    const { items } = req.body || {};
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Basket items are required." });
    }

    const origin = req.get("origin") || `http://localhost:${port}`;
    const result = await sendAbandonedCartEmail({
      items,
      checkoutUrl: `${origin}/checkout.html`,
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "ABANDONED_CART_EMAIL_FAILED" });
  }
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message, currentBundleId, scores } = req.body || {};
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required." });
    }

    let bundle = currentBundleId ? knowledge.bundleById[currentBundleId] : null;
    if (!bundle && scores) bundle = recommendFromScores(scores);
    if (!bundle) bundle = scoreTextToBundle(message);

    const reply = await askGemini({ message, bundle });

    res.json({
      reply,
      recommendedBundle: bundle || null,
      products: bundle ? bundle.products.map((id) => knowledge.productById[id]).filter(Boolean) : [],
      sensitiveContextDetected: hasSensitiveContext(message)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      reply: "Sorry, I couldn't answer that right now. Please try again.",
      error: "CHATBOT_ERROR"
    });
  }
});

await loadKnowledge();

app.use(express.static(SITE_ROOT, { index: "index.html", extensions: ["html"] }));

const server = app.listen(port, () => {
  console.log(`GlowLab chatbot backend running on http://localhost:${port}`);
  console.log(`Website: http://localhost:${port}/index.html`);
  console.log(`Chatbot test: http://localhost:${port}/frontend/test-chatbot.html`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(
      `\nPort ${port} is still in use after prestart cleanup.\n` +
        `Run:  npm run stop\n` +
        `Or:   lsof -ti :${port} | xargs kill -9\n`
    );
    process.exit(1);
  }
  throw err;
});
