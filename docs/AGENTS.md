# ReviewLens — Agent & Developer Collaboration Guide

> **Document Version:** 1.0.0  
> **Status:** Active Standard  
> **Audience:** AI Coding Assistants (Antigravity, Cursor, Copilot) and Human Engineers  
> **Scope:** Rules of engagement, parallel work breakdown, non-negotiable invariants, and commit safety checklists.

---

## 1. Multi-Agent & Team Collaboration Architecture

ReviewLens is designed for high-velocity parallel development by two team members (or two parallel AI agent sessions) without merge conflicts.

### Safe Folder Ownership Matrix

```text
┌────────────────────────────────────────────────────────┐
│                      ReviewLens/                       │
├──────────────────────────┬─────────────────────────────┤
│   CLIENT WORKSPACE       │      SERVER WORKSPACE       │
│   (Owned by Developer A) │      (Owned by Developer B) │
│                          │                             │
│   ├── client/src/        │      ├── server/controllers/│
│   │   ├── components/    │      ├── server/middleware/ │
│   │   ├── pages/         │      ├── server/models/     │
│   │   ├── layouts/       │      ├── server/routes/     │
│   │   ├── services/      │      ├── server/services/   │
│   │   ├── hooks/         │      ├── server/utils/      │
│   │   └── utils/         │      └── server/server.js   │
│   └── client/package.json│      └── server/package.json│
├──────────────────────────┴─────────────────────────────┤
│                   SHARED CONTRACTS                     │
│         (Requires Mutual Agreement to Touch)           │
│                                                        │
│   ├── data/ (places.json, reviews.json)                │
│   ├── docs/ (ARCHITECTURE.md, DECISIONS.md, etc.)      │
│   └── .env.example                                     │
└────────────────────────────────────────────────────────┘
```

| Area | Primary Directory | Safe for Parallel Edits? | Rules & Guidelines |
|---|---|:---:|---|
| **Frontend UI & Pages** | `client/src/*` | **YES (Team A / Client Agent)** | Free to create, edit, style, and structure React components, layouts, pages, and hooks. Must only consume the backend via `client/src/services/api.js`. |
| **Backend & Domain Services** | `server/*` | **YES (Team B / Server Agent)** | Free to implement Express routes, controllers, Mongoose models, and services (`aiService`, `trustService`, `scoringService`, `recommendationService`, `reviewService`). |
| **Seed Data** | `data/` | **SHARED CONTRACT** | Do not alter schema shapes without updating `docs/ARCHITECTURE.md`. |
| **Architectural Specs** | `docs/` | **SHARED CONTRACT** | Canonical source of truth. Changes must be recorded as an ADR in `docs/DECISIONS.md`. |

---

## 2. Non-Negotiable Invariants for AI Coding Agents

Every AI agent working on this codebase must strictly observe these inviolable rules:

### Invariant 1: Separation of AI and Application Logic
- **Gemini's Only Job:** Natural Language Understanding. It receives review text + category context, and returns the strictly formatted JSON schema.
- **Prohibited:** NEVER ask Gemini to rank places, compare places, score user compatibility, or recommend places.
- **Backend's Job:** Node.js services compute the Review Trust Signal, aspect aggregations, user preference weighting, candidate ranking, and recommendation bullets.

### Invariant 2: Immutable Recommendation Formula
The recommendation formula in `server/services/scoringService.js` is fixed:
$$\text{Final Score} = 0.40 \times \text{AspectMatch} + 0.20 \times \text{ContextMatch} + 0.15 \times \text{Sentiment} + 0.15 \times \text{TrustQuality} + 0.10 \times \text{OverallRating}$$
**Do not alter, re-weight, or drop any of these 5 terms.**

### Invariant 3: The 8 Canonical Aspects
The 8 aspects used across schemas, DB models, AI extraction, and UI preferences are strictly:
`quality`, `cleanliness`, `service`, `price`, `crowd`, `safety`, `accessibility`, `facilities`
**Do not add new aspects, remove existing aspects, or rename them** (e.g. do not rename `foodQuality` or `cleanliness` — use the exact canonical keys). Any aspect not discussed in a review must be `null`, never guessed.

### Invariant 4: Review Trust Signal Terminology & Ethics
- Always call it **"Review Trust Signal"**.
- NEVER use the phrase "Fake Review Detector" in code, comments, or UI copy. It is a heuristic advisory signal, not a forensic legal judgment.
- NEVER write code that automatically deletes, mutes, or suppresses reviews based on trust score.

### Invariant 5: Security & Secret Isolation
- NEVER place `GEMINI_API_KEY` or `MONGODB_URI` in client files, Vite environment configs, or git-tracked files.
- NEVER construct raw LLM prompts inside frontend React code.

### Invariant 6: Centralized API Client Enforcement
- In `client/`, NEVER call `fetch(...)` or `axios(...)` directly inside React components or hooks.
- All HTTP interactions must pass through `client/src/services/api.js`.

---

## 3. Working in Dual AI Modes (`mock` vs `live`)

When testing or building features:
- **`AI_MODE=mock` (Default for local development):**
  - Instant response time ($< 10\text{ ms}$).
  - Zero API key required, zero quota usage.
  - Deterministically extracts keywords and sentiment to generate valid schema-compliant review analyses.
  - Ideal for UI styling, unit test suites, and rapid iterative development.
- **`AI_MODE=live`:**
  - Requires valid `GEMINI_API_KEY` in `server/.env`.
  - Calls Gemini 1.5 Flash using structured JSON response constraints.
  - Used for integration validation and production deployments.

*Rule:* All branching between `mock` and `live` is isolated inside `server/services/aiService.js`. No other file should inspect `process.env.AI_MODE`.

---

## 4. Pre-Flight Checklist Before Submitting Code

Before completing any task or pushing changes, verify:
- [ ] No secrets or API keys have been hardcoded.
- [ ] No React component calls `fetch` directly (all call `services/api.js`).
- [ ] All 8 canonical aspects are correctly spelled and nullable in schemas.
- [ ] Frontend code compiles cleanly (`npm run build` in `client/` succeeds).
- [ ] Backend boots cleanly without syntax errors (`node server.js` in `server/`).
- [ ] Empty and loading states are handled gracefully (using `LoadingSkeleton.jsx` and friendly copy).
- [ ] Mobile responsive layout tested at $360\text{px} - 430\text{px}$ viewport width.
- [ ] Any architectural changes or technical tradeoffs are recorded in `docs/DECISIONS.md`.
