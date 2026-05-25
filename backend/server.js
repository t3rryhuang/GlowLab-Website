import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// If you keep /data at project root, this points to ../data from /backend.
const DATA_DIR = path.resolve(__dirname, "../data");

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.resolve(__dirname, "../frontend")));

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

app.listen(port, () => {
  console.log(`GlowLab chatbot backend running on http://localhost:${port}`);
  console.log(`Open widget test page at http://localhost:${port}/test-chatbot.html`);
});
