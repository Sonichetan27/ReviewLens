# ReviewLens — Quality Assurance & Test Plan

> **Document Version:** 1.0.0  
> **Status:** Active Standard  
> **Owner:** QA & Engineering Team  
> **Scope:** Backend Unit Tests, Algorithm Validation, AI Schema Compliance, Frontend Component Tests, Responsive Layout Verification, and End-to-End User Flow Tests.

---

## 1. Testing Philosophy & Invariants

ReviewLens relies on deterministic mathematical formulas and structured AI outputs. Testing is designed around three core principles:
1. **Mathematical Invariance:** The 40/20/15/15/10 recommendation formula and Review Trust Signal heuristics must yield identical, predictable outputs for given inputs.
2. **AI Schema Strictness:** Gemini responses (or mock responses) must strictly validate against the required JSON schema; unmentioned aspects must be `null`, never fabricated.
3. **Mobile-First UX Rigor:** All views must function without breakage at mobile viewports ($360\text{px} - 430\text{px}$) with zero horizontal overflow and accessible touch targets.

---

## 2. Test Suite Matrix

```text
┌────────────────────────────────────────────────────────┐
│                   REVIEWLENS TEST SUITE                │
├──────────────────────────┬─────────────────────────────┤
│      BACKEND SUITES      │       FRONTEND SUITES       │
│                          │                             │
│  ├── trustService.test   │  ├── api.test               │
│  ├── scoringService.test │  ├── PreferencesContext.test│
│  ├── aiService.test      │  ├── RecommendationCard.test│
│  ├── recommendation.test │  ├── WhyRecommended.test    │
│  └── seedValidation.test │  └── responsiveView.test    │
└──────────────────────────┴─────────────────────────────┘
```

---

## 3. Backend Unit & Algorithmic Test Suites

### 3.1 Review Trust Signal Tests (`trustService.test.js`)

Located in `server/tests/trustService.test.js`. Validates deterministic heuristic penalties:

| Test Case ID | Test Description | Input Conditions | Expected Output / Assertions |
|---|---|---|---|
| `TS-01` | **Short Review Length Penalty** | Review text: `"Great hotel!"` (12 chars), rating 5 | `trustScore <= 75`, `reasons` contains length penalty notice. |
| `TS-02` | **Generic Boilerplate Flag** | Review text: `"Good experience overall, nice place with family."` | `reasons` contains generic template warning, penalty applied ($\approx -20\text{ pts}$). |
| `TS-03` | **Rating vs Sentiment Mismatch** | Rating: 5 stars, Text: `"The room was filthy, AC broke down, rude staff."` | Severe penalty ($\approx -35\text{ pts}$), `level: "high-risk"`. |
| `TS-04` | **Substantive High-Density Review** | 150 words detailing specific room number, dish names, Wi-Fi speed, and bathroom cleanliness | `trustScore >= 85`, `level: "higher-trust"`, information density bonus applied. |
| `TS-05` | **Duplicate Similarity Flag** | Review with 80% word similarity to an existing review for the same place | Penalty applied ($\approx -30\text{ pts}$), `reasons` mentions duplicate pattern. |
| `TS-06` | **Output Schema Compliance** | Any review evaluation | Returns exact object `{ trustScore, level, reasons }` where `trustScore` $\in [0, 100]$ and `level` is one of `higher-trust`, `medium`, `high-risk`. |

---

### 3.2 Recommendation Scoring Formula Tests (`scoringService.test.js`)

Located in `server/tests/scoringService.test.js`. Validates the 40/20/15/15/10 composite formula:

$$\text{Final Score} = 0.40 \times \text{AspectMatch} + 0.20 \times \text{ContextMatch} + 0.15 \times \text{Sentiment} + 0.15 \times \text{TrustQuality} + 0.10 \times \text{OverallRating}$$

| Test Case ID | Test Description | Input Conditions | Expected Output / Assertions |
|---|---|---|---|
| `SS-01` | **Perfect Match Benchmark** | AspectMatch=100, ContextMatch=100, Sentiment=100, TrustQuality=100, OverallRating=100 | $\text{Final Score} = 100.0$ |
| `SS-02` | **Zero Match Benchmark** | All terms = 0 | $\text{Final Score} = 0.0$ |
| `SS-03` | **Preference Weight Dominance** | Place A has AspectMatch=90, Rating=60 vs Place B has AspectMatch=50, Rating=95 (all else equal) | Place A outscores Place B because 40% weight outweighs 10% rating. |
| `SS-04` | **Trust-Adjusted Quality Dampening** | High quality score (95) paired with a high-risk trust score (30) | TrustQuality term yields $95 \times 0.30 = 28.5$, reducing overall final score. |
| `SS-05` | **Budget Step Penalties** | User budget = `low`, Place budget = `high` (2 steps difference) | ContextMatch budget factor drops to $15/50$, penalizing mismatch. |

---

### 3.3 AI Service & Schema Validation Tests (`aiService.test.js`)

Located in `server/tests/aiService.test.js`:

| Test Case ID | Test Description | Assertions |
|---|---|---|
| `AI-01` | **Schema Conformance** | Output strictly validates against schema: `sentiment`, `sentimentScore`, `aspectScores`, `mentionedAspects`, `positiveEvidence`, `negativeEvidence`, `summary`, `confidence`. |
| `AI-02` | **Nullable Aspect Integrity** | Review mentions only Cleanliness and Service $\rightarrow$ `aspectScores.quality`, `price`, `crowd`, `safety`, `accessibility`, `facilities` must be strictly `null`. |
| `AI-03` | **Deterministic Mock Fallback** | When `AI_MODE=mock`, returns instant valid response within 15ms without network calls. |
| `AI-04` | **Live Mode Error Gracefulness** | If Gemini API errors or times out in live mode, falls back gracefully without crashing the server. |

---

### 3.4 Recommendation Service Tests (`recommendationService.test.js`)

Located in `server/tests/recommendationService.test.js`:

| Test Case ID | Test Description | Assertions |
|---|---|---|
| `RS-01` | **Destination Filtering** | User selects city `Bhopal` $\rightarrow$ 100% of returned candidates have `city: "Bhopal"`. |
| `RS-02` | **Category Filtering** | User selects `hotel` $\rightarrow$ 100% of returned candidates have `category: "hotel"`. |
| `RS-03` | **Descending Rank Order** | Candidate list is strictly sorted: $\text{score}_i \ge \text{score}_{i+1}$ for all $i$. |
| `RS-04` | **Traceable "Why" Bullets** | Aspect match bullet only generated if user priority $\ge 4$ and place aspect score $\ge 80$. Quotes originate verbatim from `positiveEvidence`. |

---

## 4. Frontend Component & Integration Tests

### 4.1 Centralized API Client (`services/api.js`)
- **`FE-API-01`:** Verifies all exported functions (`getPlaces`, `getPlaceById`, `getReviews`, `getRecommendations`) correctly unwrap `{ data: ... }` response payloads.
- **`FE-API-02`:** Verifies network failures return normalized `{ error: string, data: null }` and never throw uncaught exceptions to UI.

### 4.2 Preference Context & Persistence
- **`FE-CTX-01`:** Updating preferences in `Preferences.jsx` triggers re-render in `Recommendations.jsx`.
- **`FE-CTX-02`:** Verifies preferences reload accurately from `localStorage` upon page refresh.

### 4.3 Responsive UI & Component Validation
- **`FE-UI-01` (Mobile Bottom Nav):** At $< 768\text{px}$, `BottomNav.jsx` is rendered fixed at bottom; `TopNav.jsx` links are hidden.
- **`FE-UI-02` (Desktop Top Nav):** At $\ge 768\text{px}$, `BottomNav.jsx` is hidden (`md:hidden`); full `TopNav.jsx` navigation is visible.
- **`FE-UI-03` ("Why Recommended" Modal):** On mobile, renders as a slide-up **Bottom Sheet**; on desktop, renders as a **Sticky Side Panel**.
- **`FE-UI-04` (Zero Blank Screen):** Initial loading states display `LoadingSkeleton.jsx` cards; empty search queries display helpful suggestions.

---

## 5. End-to-End (E2E) Flow Validation

### Automated User Journey:
1. `GET /` $\rightarrow$ Load home page, click "Find My Perfect Place".
2. `GET /explore` $\rightarrow$ Select city "Bhopal", select category "hotel".
3. `POST /preferences` $\rightarrow$ Submit preference payload (Solo, Medium budget, Cleanliness: 5, Service: 4).
4. `GET /recommendations` $\rightarrow$ Receive ranked list, verify top venue match score $> 85\%$.
5. Inspect "Why Recommended" panel $\rightarrow$ Verify presence of traceable cleanliness match bullet.
6. `GET /places/:id` $\rightarrow$ Verify profile loaded with verified reviews and Review Trust Signal breakdown.

---

## 6. Seed Data Quality Verification

Run `npm run seed` and verify via database assertions:
- [ ] Exactly 20 to 30 places loaded across `hotel`, `restaurant`, `cafe`, `attraction`.
- [ ] Seeded venues span multiple cities (Indore, Bhopal, Jaipur, Mumbai).
- [ ] 100 to 200 reviews loaded with realistic, uneven distribution (some places have 20+ reviews, some have $< 5$).
- [ ] Reviews contain deliberate variance: short generic reviews (low trust), long detailed reviews (high trust), and mixed sentiments.
- [ ] All precomputed `aggregateScores` are populated on `Place` records.
