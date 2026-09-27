# ReviewLens — Interactive Demo & Presentation Flow

> **Document Version:** 1.0.0  
> **Target Audience:** Hackathon Judges, Product Evaluators, Engineering Stakeholders  
> **Demo Duration:** 3 to 5 minutes  
> **Primary Persona:** *Priya* — A remote software consultant planning a 4-day productive workation in Bhopal, seeking a quiet hotel with impeccable cleanliness, fast Wi-Fi, and courteous service on a medium budget.

---

## 1. Demo Setup & Pre-Flight Checklist

Before launching the live presentation:
1. **Environment Mode:** Verify `AI_MODE=mock` (or verified `AI_MODE=live` with valid Gemini key). *Tip: Keep `AI_MODE=mock` active during live stage presentations for instant zero-latency demo responses with 100% reliability.*
2. **Database State:** Seeded with 20–30 diverse places and 100–200 realistic, unevenly distributed reviews (`npm run seed`).
3. **Display Mode:** Chrome DevTools set to Mobile Device Emulation (e.g. **iPhone 14 Pro / 393px width**) to highlight the mobile-first UX, followed by switching to Desktop view (1280px) to showcase responsive adaptation.
4. **Local Servers Running:**
   - Client: `http://localhost:5173`
   - Server: `http://localhost:5000/health` (returns `{ status: "ok" }`)

---

## 2. Step-by-Step Presentation Script

```text
[Landing /] ──► [Explore /explore] ──► [Preferences /preferences] ──► [Recommendations /recommendations]
                                                                                │
                                           [Why Recommended Panel] ◄────────────┤
                                                                                ▼
                                                                 [Place Details /places/:id]
                                                                                │
                                                                                ▼
                                                                 [Review Intelligence /intelligence]
```

### Step 1: The Problem & Landing Page (`/`)
- **Screen:** Open mobile view at `/`.
- **Visuals:** Warm stone neutral background (`#FAFAF9`), clean typography, confident deep teal accent buttons, hero copy: *"Stop reading 1,000 reviews. Discover where is truly suitable for you."*
- **Speaker Script:**
  > *"Every travel platform shows us the same thing: generic 4.2-star averages based on thousands of reviews. But a 4.2-star hotel could have noisy hallways, spotty Wi-Fi, or hundreds of fake reviews. ReviewLens changes this fundamentally. We extract structured review intelligence using Gemini, evaluate a deterministic Review Trust Signal, and match places to your exact personal priorities."*
- **Action:** Tap the primary CTA button: **"Find My Perfect Place"** $\rightarrow$ navigates to `/explore`.

---

### Step 2: Explore & Destination Selection (`/explore`)
- **Screen:** Browse view with city destination chips and place type toggles.
- **Visuals:** City chips (*Indore*, *Bhopal*, *Jaipur*, *Mumbai*) and Place Type icons (*Hotels*, *Restaurants*, *Cafes*, *Attractions*).
- **Speaker Script:**
  > *"Priya is traveling to Bhopal for a focused workation. Let's select Bhopal and filter by Hotels."*
- **Action:**
  1. Tap destination chip: **Bhopal**.
  2. Tap category chip: **Hotels**.
  3. Notice candidate count updates in real-time.
  4. Tap the header banner prompt: **"Personalize Your Match Score"** $\rightarrow$ navigates to `/preferences`.

---

### Step 3: Setting Personal Preferences (`/preferences`)
- **Screen:** The 3-step Personalization Wizard.
- **Visuals:** Clean card layout with travel context chips, budget tier selector, and priority weight sliders for the 8 canonical aspects.
- **Speaker Script:**
  > *"Here is where ReviewLens becomes truly personal. Priya is traveling solo on business. She needs high cleanliness, exceptional service, quiet atmosphere (low crowd), and fast facilities (Wi-Fi), on a Medium budget."*
- **Action:**
  1. Travel Party: Select **"Solo / Business"**.
  2. Budget Tier: Select **"Medium"** ($$).
  3. Set Aspect Priorities:
     - **Cleanliness:** Drag to **5 (Critical)**
     - **Service:** Drag to **4 (High)**
     - **Crowd:** Drag to **4 (Prefers Quiet)**
     - **Facilities:** Drag to **4 (High)**
     - Other aspects: Left at default (2-3).
  4. Tap primary button: **"Generate My Recommendations"** $\rightarrow$ navigates to `/recommendations`.

---

### Step 4: Personalized Recommendations (`/recommendations`)
- **Screen:** Ranked candidate list sorted by the deterministic 40/20/15/15/10 formula.
- **Visuals:**
  - Rank #1: **"Blue Orchid Residency"** — **93% Match**, **88/100 Review Trust Signal (Higher-Trust)**.
  - Rank #2: **"Sunrise Heritage Hotel"** — **78% Match**, **62/100 Review Trust Signal (Medium)**.
  - Rank #3: **"Green Lake Resort"** — **64% Match**, **38/100 Review Trust Signal (High-Risk)** (high star rating but penalized for short, generic reviews).
- **Speaker Script:**
  > *"Look at the results. Notice that the highest-ranked hotel isn't just the one with the highest star rating. Blue Orchid Residency has a 93% match because its cleanliness and service ratings directly satisfy Priya's preferences, backed by an 88/100 Review Trust Signal. Notice Green Lake Resort: it has 4.6 stars on standard platforms, but our Review Trust Signal flagged suspicious generic patterns, demoting its confidence."*
- **Action:** Tap the card button on Rank #1: **"Why Recommended?"**.

---

### Step 5: "Why Recommended?" Bottom Sheet / Side Panel
- **Screen:**
  - On Mobile: Smooth animated **Bottom Sheet** slides up from the bottom with backdrop blur.
  - Switch DevTools to Desktop (1280px): Instantly demonstrates the responsive transformation into a **Sticky Side Panel**.
- **Visuals:** Clear breakdown of the 40/20/15/15/10 formula drivers with verifiable numbers and evidence quotes.
- **Speaker Script:**
  > *"Every single bullet here is mathematically traceable. It states: 'Cleanliness rated 95/100 across 24 verified reviews, matching your #1 preference.' And look at the authentic quote extracted directly from the reviews: 'Linens were spotless and the quiet courtyard made remote meetings seamless.' No hallucinations, no generic platitudes."*
- **Action:** Dismiss panel and tap card to navigate to `/places/p102` (Place Details).

---

### Step 6: Place Details & Aggregated Intelligence (`/places/:id`)
- **Screen:** Venue profile with hero imagery, key metrics, and aggregated aspect distribution.
- **Visuals:**
  - Star Rating: 4.4 / 5.0 (24 reviews).
  - Review Trust Signal: 88/100 (Higher-Trust badge in Emerald).
  - Aspect Score Bars: Cleanliness (95%), Service (91%), Facilities (86%), Crowd (78% quiet).
- **Speaker Script:**
  > *"Instead of scrolling through 200 reviews, Priya sees the complete picture in 10 seconds. The 8 canonical aspects show exact strengths and potential weaknesses."*
- **Action:** Tap the tab: **"Review Intelligence"** (or navigate to `/intelligence`).

---

### Step 7: Review Intelligence & Trust Signal Audit (`/intelligence`)
- **Screen:** Credibility inspection dashboard for the venue's reviews.
- **Visuals:**
  - Review Trust Signal breakdown: 82% Higher-Trust, 14% Medium, 4% High-Risk.
  - Side-by-side **Positive Evidence** vs. **Negative Evidence** quotes.
  - Individual reviews tagged with their specific Review Trust Signal level and reasons.
- **Speaker Script:**
  > *"Here is ReviewLens's integrity in action. Under Review Trust Signal, we show why each review was scored. Detailed reviews with specific room amenities earn 'Higher-Trust'. One-line reviews like 'good hotel' are flagged as 'High-Risk' with reasons: 'Length penalty, generic template match.' We never delete reviews; we empower users with transparency."*

---

## 3. Key Takeaway & Closing Statement

> *"ReviewLens bridges the gap between raw customer reviews and personal decision-making. By letting Gemini do what it does best — understand language — and letting our deterministic backend calculate trust, scoring, and ranking, we deliver a mobile-first experience that travelers can genuinely trust."*

---

## 4. Live Demo Troubleshooting & Contingency Matrix

| Scenario | Immediate Action |
|---|---|
| Internet connectivity drops | Switch `AI_MODE=mock` in `server/.env` (no internet or Gemini API key required). |
| Database connection times out | Ensure MongoDB Atlas IP whitelist includes `0.0.0.0/0` or run local `mongod`. |
| Port conflict on 5000 or 5173 | Set `PORT=5001` in `server/.env` and update `VITE_API_URL=http://localhost:5001` in `client/.env`. |
