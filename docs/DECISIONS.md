# ReviewLens — Architecture Decision Records (ADRs)

> **Document Version:** 1.0.0  
> **Status:** Active & Binding  
> **Companion Document:** `docs/ARCHITECTURE.md`

This document records the foundational architectural decisions made for the ReviewLens project, including context, options considered, decisions taken, and tradeoffs accepted.

---

## ADR-001: Separation of LLM Natural Language Understanding from Deterministic Application Scoring

### Context
Platforms utilizing Generative AI often prompt the LLM directly with candidate lists to ask: *"Which hotel should this user book?"* or *"Rank these 5 cafes based on this user's profile."*

### Decision
We establish a **hard architectural boundary**:
- **Gemini's Role:** Dedicated exclusively to single-review Natural Language Understanding (extracting sentiment, aspect scores, evidence quotes, and summary into a strict JSON schema).
- **Application's Role:** All scoring, trust evaluation, aggregation, filtering, ranking, and recommendation generation are executed deterministically by Node.js/Express services.
- Gemini is **never** asked to rank, compare, or recommend venues.

### Rationale
1. **Explainability & Trust:** Every recommendation score and "Why Recommended" bullet is 100% mathematically traceable to actual numbers, not LLM hallucination.
2. **Cost & Latency:** Ingesting and analyzing a review happens once and is persisted in MongoDB. Recommendation queries run fast, deterministic database queries and mathematical weighting with zero LLM API latency.
3. **Reproducibility:** Prevents non-deterministic ranking shifts across identical queries.

---

## ADR-002: The 8 Canonical Aspects with Nullable Values

### Context
Reviews touch on varied topics. We needed a fixed, expressive taxonomy of aspects that applies coherently across Hotels, Restaurants, Cafes, and Tourist Attractions.

### Decision
We standardize on **exactly 8 canonical aspects**:
`quality`, `cleanliness`, `service`, `price`, `crowd`, `safety`, `accessibility`, `facilities`

- If a review does not discuss an aspect, the model must output `null`. Fabricating or guessing scores for unmentioned aspects is strictly forbidden.
- Aggregation functions only average over non-null mentions.

### Rationale
1. **Cross-Category Universality:** These 8 aspects represent the decision criteria travelers and diners actually care about across all 4 categories.
2. **Data Integrity:** Enforcing `null` preserves statistical honesty; an aspect average reflects only genuine customer mentions.

---

## ADR-003: Review Trust Signal as an Advisory Heuristic (Never Auto-Delete Reviews)

### Context
Fake, incentivized, and low-effort reviews distort venue averages. We needed an approach to evaluate review authenticity without making definitive legal or censorship claims.

### Decision
We implement a deterministic heuristic engine in `server/services/trustService.js`:
- Named **"Review Trust Signal"** (never "Fake Review Detector").
- Categorizes reviews into three levels: `higher-trust`, `medium`, and `high-risk`.
- Evaluates review length, generic filler phrases, duplicate similarity across reviews for the same venue, rating-sentiment mismatches, and information density.
- **Inviolable Policy:** The system **never** automatically deletes, mutes, or hides reviews based on trust score. High-risk reviews are flagged transparently, and their statistical weight in recommendation calculations is dampened.

### Rationale
Automated censorship of reviews alienates users and risks false positives. Transparent advisory signals empower users with critical context while protecting recommendation integrity.

---

## ADR-004: Exact 40/20/15/15/10 Recommendation Scoring Formula

### Context
A multi-attribute utility formula is needed to rank places for a user based on personal preferences, situational context, authentic sentiment, quality, and baseline rating.

### Decision
We fix the recommendation formula in `server/services/scoringService.js` to exact mathematical weights:
$$\text{Final Score} = 0.40 \times \text{AspectMatch} + 0.20 \times \text{ContextMatch} + 0.15 \times \text{Sentiment} + 0.15 \times \text{TrustQuality} + 0.10 \times \text{OverallRating}$$

- **40% Preference / Aspect Match:** User's prioritized aspects against venue's aspect scores.
- **20% Context Match:** Travel party fit (solo, couple, family, business) and budget alignment.
- **15% Verified Sentiment:** Aggregated customer sentiment average ($0-100$).
- **15% Trust-Adjusted Quality:** Venue quality score modulated by the venue's overall Review Trust Signal.
- **10% Overall Rating:** Standard star rating scaled to $0-100$.

### Rationale
- User preferences rightfully dominate ($40\%$).
- Context ($20\%$) prevents recommending a rowdy nightlife bar to a family with toddlers.
- Trust-adjusted quality ($15\%$) defends against fake review inflation.
- Baseline star rating ($10\%$) provides ground-truth stability without overwhelming personalization.

---

## ADR-005: Lightweight State Management (React Context + Local State vs. Redux / Zustand)

### Context
User preferences (destination, category, budget, aspect priority weights) must be accessible across `/preferences`, `/recommendations`, and `/explore`.

### Decision
We choose **local component state (`useState`, `useReducer`) paired with a single React Context (`PreferencesContext`)** persisted to `localStorage`. We explicitly reject external state management libraries like **Redux Toolkit, Zustand, or MobX**.

### Rationale
1. **Minimal Bundle Footprint:** Eliminates 30-50KB of unnecessary external dependencies.
2. **Appropriate Complexity:** The application has only one cross-cutting global domain entity: user preferences. Everything else (tab switches, bottom-sheet visibility, loading states) is component-local.
3. **Instant Persistence:** Storing preferences in `localStorage` ensures customizations survive page refreshes and inter-page navigation effortlessly.

---

## ADR-006: Centralized API Client Layer (`services/api.js`)

### Context
Components require data from multiple REST endpoints (`/api/places`, `/api/reviews`, `/api/recommendations`).

### Decision
All network calls are strictly restricted to `client/src/services/api.js`. Components and hooks are forbidden from calling `fetch()` or `axios()` directly.

### Rationale
- Provides a single location for base URL resolution (`VITE_API_URL`).
- Standardizes JSON response envelope unwrapping (`{ data: ... }`).
- Provides uniform error handling and mock interception during offline development.

---

## ADR-007: Dual AI Execution Modes (`AI_MODE=mock` vs `AI_MODE=live`)

### Context
Developers need to develop and test offline without active internet connections, API keys, or burning API quotas during repetitive test runs.

### Decision
We implement a dual-mode switch inside `server/services/aiService.js`:
- `AI_MODE=live`: Invokes Google Gemini 1.5 Flash via official SDK in structured JSON output mode.
- `AI_MODE=mock`: Executes a deterministic keyword and sentiment heuristic analyzer returning schema-compliant results instantly.

### Rationale
- Guarantees 100% offline development, zero API costs, and deterministic test outcomes.
- Encapsulates all branching inside `aiService.js` so no other backend code requires mode checks.

---

## ADR-008: Mobile-First Responsive Pattern (Bottom Nav & Bottom Sheet vs. Top Nav & Side Panel)

### Context
Users researching venues on the go primarily use mobile devices, while desktop users benefit from side-by-side inspection.

### Decision
- **Mobile (< 768px):** Fixed bottom navigation (`BottomNav.jsx`) with 4 thumb-friendly tabs (Home, Explore, Saved, Insights). "Why Recommended" opens as an interactive **Bottom Sheet** modal.
- **Desktop ($\ge$ 768px):** Bottom nav is hidden; full **Top Navigation Bar** (`TopNav.jsx`) appears. "Why Recommended" renders as a persistent **Sticky Side Panel** beside recommendation cards.

### Rationale
Maximizes ergonomic usability on mobile devices while leveraging wide screen real estate on desktop without code duplication.

---

## ADR-009: Design System & Visual Palette (Warm Neutral Base + Deep Teal Accent)

### Context
ReviewLens needs to look like a trustworthy, modern consumer utility, distinct from the generic default Tailwind gray/blue aesthetic.

### Decision
- **Backgrounds:** Warm neutrals (`stone-50` `#FAFAF9`, `stone-100` `#F5F5F4`).
- **Accent:** Confident Deep Teal (`#0D9488` / `teal-600`), used for all CTAs, active nav states, and match score badges.
- **Trust Badges:** Emerald for higher-trust, amber for medium, rose for high-risk.
- **Hero Data:** Numeric scores (`NN/100` or `NN%`) rendered in bold typography with radial rings or horizontal meters.

### Rationale
Creates an inviting, premium aesthetic that conveys data clarity and trust.
