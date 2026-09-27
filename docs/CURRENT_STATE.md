# ReviewLens — Current Project State & Implementation Roadmap

> **Document Version:** 1.0.0  
> **Status:** Scaffolding Complete / Ready for Feature Implementation  
> **Last Updated:** Current Build Stage  
> **Companion Document:** `docs/ARCHITECTURE.md`

---

## 1. Executive Summary

ReviewLens has transitioned from initial concept to a **fully specified, scaffolded repository**. The architectural foundation, technical contracts, data models, algorithm specifications, and design system guidelines are approved and codified in the `docs/` suite.

The repository is structured for clean, parallel, merge-conflict-free development between two engineers (or two AI agent workflows).

---

## 2. Repository Inventory & Component Status

```text
ReviewLens/
├── client/                     # Frontend Application (React 18 + Vite + Tailwind)
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # Button.jsx, Card.jsx, LoadingSkeleton.jsx (Scaffolded)
│   │   │   ├── navigation/     # TopNav.jsx, BottomNav.jsx (Scaffolded)
│   │   │   └── recommendations/# RecommendationCard.jsx, WhyRecommendedPanel.jsx (Scaffolded)
│   │   ├── layouts/            # MainLayout.jsx (Scaffolded)
│   │   ├── pages/              # Home, Explore, Preferences, Recommendations, PlaceDetails, ReviewIntelligence (Scaffolded)
│   │   ├── services/           # api.js (Centralized Client Stub)
│   │   ├── hooks/              # Custom hooks (To be implemented)
│   │   ├── utils/              # Client utility functions
│   │   └── data/               # Static client assets
│   ├── index.html
│   ├── package.json            # React 18, React Router v6, Tailwind CSS
│   └── vite.config.js
│
├── server/                     # Backend Application (Node.js + Express + Mongoose)
│   ├── config/                 # db.js (MongoDB Mongoose connection)
│   ├── controllers/            # placeController, reviewController, recommendationController (Stubs)
│   ├── middleware/             # errorHandler, validateRequest (Stubs)
│   ├── models/                 # Place.js, Review.js, ReviewAnalysis.js (Mongoose Schemas Defined in Architecture)
│   ├── routes/                 # placeRoutes, reviewRoutes, recommendationRoutes (Routers Mounted)
│   ├── services/               # Core Domain Logic:
│   │   ├── aiService.js        # Gemini Client & Mock Engine (Stubbed)
│   │   ├── trustService.js     # Deterministic Review Trust Signal (Stubbed)
│   │   ├── scoringService.js   # 40/20/15/15/10 Formula Engine (Stubbed)
│   │   ├── recommendationService.js # Orchestration & 'Why' Generator (Stubbed)
│   │   └── reviewService.js    # Review CRUD & Aggregator (Stubbed)
│   ├── utils/                  # seed.js (Seed script stub)
│   ├── package.json            # Express, Mongoose, Dotenv, Cors
│   └── server.js               # Express entrypoint with route mounting & error handling
│
├── data/                       # Seed Data Files
│   ├── places.json             # 24 seed places across 4 categories and 4 cities
│   └── reviews.json            # Seed reviews with varied ratings & text lengths
│
├── docs/                       # Authoritative Documentation Suite
│   ├── PROJECT_SPEC.md         # Product mission, canonical aspects, user flows, and bounds
│   ├── AGENTS.md               # Rules of engagement, parallel work boundaries, invariants
│   ├── ARCHITECTURE.md         # Full system architecture, schemas, formulas, security
│   ├── DECISIONS.md            # Architecture Decision Records (ADR 001 - 009)
│   ├── DEMO_FLOW.md            # Hackathon/judges presentation script & troubleshooting
│   ├── TEST_PLAN.md            # Test matrix, unit/integration/E2E test definitions
│   └── CURRENT_STATE.md        # This roadmap and status tracker
│
├── .env.example                # Blank environment variable template
├── .gitignore                  # Git ignore rules for node_modules, .env, and dist
└── README.md                   # Project overview & quickstart
```

---

## 3. Subsystem Implementation Status

| Subsystem / Layer | Component / File | Current State | Next Action Required |
|---|---|:---:|---|
| **Documentation** | `docs/*.md` (7 files) | **100% COMPLETE** | Authoritative source of truth for all subsequent code changes. |
| **Data Persistence** | `server/models/Place.js` | Schema stub | Implement schema according to `ARCHITECTURE.md` (8 canonical aspects). |
| | `server/models/Review.js` | Schema stub | Implement schema according to `ARCHITECTURE.md`. |
| | `server/models/ReviewAnalysis.js` | Schema stub | Implement schema according to `ARCHITECTURE.md`. |
| | `server/utils/seed.js` | Stub | Load `places.json` and `reviews.json` into MongoDB Atlas with initial aggregates. |
| **Domain Services** | `server/services/aiService.js` | Stub | Implement Gemini SDK structured JSON output + deterministic mock generator (`AI_MODE` switch). |
| | `server/services/trustService.js` | Stub | Implement deterministic Review Trust Signal heuristics (length, generic, mismatch, density). |
| | `server/services/scoringService.js`| Stub | Implement exact 40/20/15/15/10 recommendation formula. |
| | `server/services/recommendationService.js`| Stub | Implement candidate filtering, ranking, and traceable "Why Recommended" bullets. |
| | `server/services/reviewService.js`| Stub | Implement review retrieval, CRUD, and place aggregate recomputation. |
| **API & Controllers** | `server/controllers/*` | Stubs | Wire controllers to invoke corresponding domain services and return JSON envelopes. |
| **Frontend API Layer**| `client/src/services/api.js` | Stubs | Implement centralized `fetch` client unwrapping `{ data: ... }` with error normalization. |
| **State Management** | `client/src/context/PreferencesContext.jsx` | Pending | Implement lightweight Context persisted to `localStorage`. |
| **UI Components** | `client/src/components/navigation/*` | Stubs | Implement mobile `BottomNav.jsx` and responsive `TopNav.jsx`. |
| | `client/src/components/recommendations/*` | Stubs | Implement `RecommendationCard.jsx` and `WhyRecommendedPanel.jsx` (Bottom Sheet vs Side Panel). |
| | `client/src/components/common/*` | Stubs | Implement `Button.jsx`, `Card.jsx`, `LoadingSkeleton.jsx`. |
| **Pages** | `client/src/pages/*` (6 pages) | Stubs | Connect views to `api.js` and `PreferencesContext` using warm neutral + deep teal design brief. |

---

## 4. Phase-by-Phase Execution Plan

### Phase 1: Persistence & Data Seeding (Server Focus)
- Finalize Mongoose schemas for `Place`, `Review`, and `ReviewAnalysis`.
- Implement `server/utils/seed.js` to ingest `data/places.json` and `data/reviews.json`.
- Populate initial `aggregateScores` and verify data in MongoDB Atlas.

### Phase 2: Domain Services & Algorithmic Core (Server Focus)
- Implement `aiService.js` with structured output schema enforcement and `AI_MODE=mock` fallback.
- Implement `trustService.js` heuristic Review Trust Signal engine.
- Implement `scoringService.js` with the strict 40/20/15/15/10 composite formula.
- Implement `recommendationService.js` with candidate filtering, ranking, and traceable "Why" bullets.
- Connect Express controllers and verify endpoints with Postman/cURL.

### Phase 3: Frontend Foundation & Centralized Client (Client Focus)
- Implement `client/src/services/api.js` with robust error normalization and envelope unwrapping.
- Build `PreferencesContext` with `localStorage` synchronization.
- Build shared UI components (`Button`, `Card`, `LoadingSkeleton`) applying warm neutral (`#FAFAF9`) + deep teal (`#0D9488`) design brief.

### Phase 4: Page Assembly & Responsive Polishing (Client Focus)
- Implement `Explore.jsx` with city/category chips and search.
- Implement `Preferences.jsx` interactive priority wizard.
- Implement `Recommendations.jsx` with hero score badges (`NN%`) and the "Why Recommended" panel (Bottom Sheet on mobile, Sticky Side Panel on desktop).
- Implement `PlaceDetails.jsx` and `ReviewIntelligence.jsx` showing the Review Trust Signal breakdown.

### Phase 5: End-to-End Integration, Validation & Demo Polish
- Run full test suite according to `docs/TEST_PLAN.md`.
- Verify mobile responsiveness ($360\text{px} - 430\text{px}$).
- Rehearse the live demo scenario outlined in `docs/DEMO_FLOW.md`.
