# GlowLab: Online Retail Experience

**BUSI70265 (2526) Retail & Marketing Analytics** · Imperial College Business School  
**Group coursework, Path 3: AI-driven retail layout (online)**

GlowLab is a prototype **health and wellbeing e-commerce storefront** built for the module’s AI-tool path. The site imagines a curated online retailer, partnered with a Boots-style pharmacy brand (“Roots”), that launches a lifestyle-led supplement line aligned with [Unilever’s health & wellbeing trends](https://www.unilever.com/news/news-search/2022/introducing-our-fastgrowing-health-wellbeing-business/): wellness as a lifestyle goal, benefit-led personalisation, category overlap (supplements, beauty, hydration) and community-driven routines.

This repository is the **deliverable website and backend** for that design, not a production store. Product copy, checkout and community posts are illustrative for presentation and demonstration.

---

## What we built

| Area | Implementation |
|------|----------------|
| **Brand & layout** | Multi-page static site (`index.html`, `quiz.html`, `community.html`, `checkout.html`, etc.) with goal-first navigation (“Shop by goal”), curated **5 bundles** × **3 products** and a full **13-SKU** catalogue (Nutrafol, OLLY, Liquid I.V.) |
| **Personalisation** | **90-second routine quiz** with scored matching to bundles; optional **selfie step** for a Gemini-generated one-line skin note (quiz match still driven by answers only) |
| **AI engagement** | **GlowLab Advisor** chatbot (Google Gemini) grounded in JSON product/bundle/safety data; keyword + quiz-score routing before LLM replies |
| **Community** | **Community journal** with topic filters, UGC-style posts and expert articles |
| **Omnichannel** | **`roots.html`**: demo “Roots” pharmacy site surfacing GlowLab as an in-store / online partner |
| **Conversion UX** | Basket (localStorage), checkout flow, **abandoned-cart** modal with optional SMTP email via backend |

---

## Design rationale (course alignment)

1. **Lifestyle goals:** Copy and bundles frame health as daily rituals (morning / afternoon / evening steps), not illness treatment.
2. **Benefit-led personalisation:** Navigation and quiz organise around outcomes (hair, skin, stress, energy, hormones) rather than traditional category silos.
3. **Category overlap:** Each bundle deliberately mixes Nutrafol (nutraceutical), OLLY (gummies) and Liquid I.V. (hydration) to mirror cross-merchandising in wellness retail.
4. **Sense of community:** `community.html` encourages routine sharing, hashtags and expert content to support discovery beyond the quiz.

**AI tools used in the project**

- **Site design & content:** Layout, styling and page structure developed with AI-assisted workflows (e.g. design/code generation tools).
- **Runtime AI:** [Google Gemini API](https://ai.google.dev/) (`@google/genai`) for chatbot replies and optional quiz selfie commentary, with **fallback rules** when no API key is set.
- **Retail partner mock:** `roots.html` models how GlowLab could appear inside an existing pharmacy e-commerce template.

---

## Tech stack

- **Frontend:** HTML, CSS (`glowlab.css`, `roots.css`), vanilla JavaScript
- **Backend:** Node.js (ES modules), Express: serves the static site, JSON APIs and Gemini integration
- **Data:** `data/*.json`: products, bundles, quiz rules and safety rules (single source of truth for chatbot + recommendations)
- **Email (optional):** Nodemailer for abandoned-cart demo emails

---

## Quick start

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ (20+ recommended)
- A [Gemini API key](https://aistudio.google.com/apikey) (optional but required for full chatbot and selfie features)

### 1. Install backend dependencies

```bash
cd backend
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `backend/.env`:

```env
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-3-flash-preview   # or gemini-2.5-flash if unavailable on your account
PORT=3000
```

Optional SMTP (otherwise abandoned-cart emails log to the console):

```env
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=GlowLab <noreply@glowlab.demo>
ABANDONED_CART_TO=your@email.com
```

### 3. Run the site

From `backend/`:

```bash
npm start
```

Open:

- **Home:** http://localhost:3000/index.html  
- **Routine quiz:** http://localhost:3000/quiz.html  
- **Community:** http://localhost:3000/community.html  
- **Roots partner demo:** http://localhost:3000/roots.html  
- **Chatbot smoke test:** http://localhost:3000/frontend/test-chatbot.html  

Development with auto-restart:

```bash
npm run dev
```

Free port 3000 if needed:

```bash
npm run stop
```

> **Note:** Opening HTML files directly (`file://`) will not load chatbot or skin-assessment APIs. Always use the Express server on port 3000.

---

## Key pages

| Page | Purpose |
|------|---------|
| `index.html` | Hero, shop-by-goal grid, curated bundles, individual product shop |
| `quiz.html` | Personalisation quiz + optional selfie + bundle recommendation |
| `community.html` | Community journal, trending topics, expert articles |
| `checkout.html` / `confirmation.html` | Basket checkout demo |
| `roots.html` | Partner pharmacy storefront linking into GlowLab |

---

## API endpoints (backend)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Service health check |
| `GET` | `/api/products` | Product catalogue from `data/products.json` |
| `GET` | `/api/bundles` | Bundles from `data/bundles.json` |
| `POST` | `/api/recommend` | Bundle recommendation from quiz scores or free-text message |
| `POST` | `/api/chat` | Gemini advisor (context: matched bundle + safety rules) |
| `POST` | `/api/skin-assessment` | Optional one-line selfie commentary for quiz results |
| `POST` | `/api/abandoned-cart` | Trigger abandoned-cart email (or console preview) |

The chatbot only recommends products present in the JSON knowledge base; sensitive health contexts trigger disclaimer text from `data/safety_rules.json`.

---

## Project structure

```
GlowLab-Website-main/
├── index.html, quiz.html, community.html, checkout.html, …
├── glowlab.css, basket.js, quiz.js, checkout.js, …
├── roots.html, roots.css          # Partner pharmacy demo
├── bundle_photos/, individual_photos/, images/
├── data/                          # Catalogue + quiz + safety (chatbot ground truth)
│   ├── products.json
│   ├── bundles.json
│   ├── quiz_rules.json
│   └── safety_rules.json
├── frontend/
│   ├── chatbot.js, chatbot.css    # GlowLab Advisor widget
│   └── test-chatbot.html
└── backend/
    ├── server.js                  # Express + static site + APIs
    ├── email-send.js              # Abandoned cart email
    ├── package.json
    └── .env.example
```

Additional coursework artefacts in the repo root (not required to run the site):

- `GlowLab_Platform_Proposal.pdf`: platform / design proposal  
- `GlowLab _standalone_.html`: early standalone export  
- `Bundle_details.xlsx`: bundle research spreadsheet  

---

## Coursework context

**Module:** BUSI70265 Retail & Marketing Analytics (Imperial Business School, 2025/26)

**Assessment mix (module overview):**

- **Group presentation (40%):** This project uses **Path 3**: integrating AI into retailing for health and wellbeing products via an **online store layout**.
- **Individual work (50%):** Separate simulation game performance and reflection report (not part of this repository).

**Other group paths (not implemented here):**

1. Generative AI vs. human marketing imagery (perception survey)  
2. AI-powered marketing analytics dashboard (R/Python + demand data)

---

## Team & disclaimer

© 2026 Terry Huang, Alex Nikos, Hafiz Bin Ahmad Jaafar, Kaiming Guo, Kassandra QUAN, Riddhima Tanwar, Tianne Lee, Xiyu Zhang

GlowLab is a **student demonstration**. It is not affiliated with Unilever, Nutrafol, OLLY, Liquid I.V. or Boots. Supplement claims are simplified for UX; users should follow product labels and consult healthcare professionals where appropriate. Do not commit real API keys or SMTP credentials; use `backend/.env` locally (see `.env.example`).

---

## References

- Unilever health & wellbeing business overview: https://www.unilever.com/news/news-search/2022/introducing-our-fastgrowing-health-wellbeing-business/
- Module reading (Path 1 reference): Hartmann, Exner and Domdey (2024), *International Journal of Research in Marketing*: [doi:10.1016/j.ijresmar.2024.09.002](https://doi.org/10.1016/j.ijresmar.2024.09.002)
