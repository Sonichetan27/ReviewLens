# Next Parts — paste one prompt per session. Commit after each part.

## PART 2 — Real AI + meaningful aspect scores (server only)
Read docs/CURRENT_STATE.md, docs/ARCHITECTURE.md and server/services/*. Do not touch client/.
1. Improve runDeterministicMockAnalyzer in server/services/aiService.js: split the review into sentences,
   assign each aspect a score ONLY from the sentences that mention that aspect (positive/negative word
   counts within that sentence), so one review can be 90 on quality and 30 on service. Keep it deterministic.
2. Implement AI_MODE=live using the current official Google Gemini SDK (`@google/genai`; check its docs for
   the exact structured-output call, do not copy old tutorials). Use responseSchema/JSON mode with the exact
   schema in docs/PROJECT_SPEC.md. Validate the response, retry once, then fall back to the mock analyzer and
   log the fallback. Only this file may read AI_MODE. Never send place names or ask Gemini to rank.
3. Move the aggregation logic out of server/utils/seed.js into reviewService.recomputePlaceAggregates(placeId)
   and call it from the seed script and from a new POST /api/reviews (analyze -> trust -> save -> recompute).
4. Add POST /api/reviews/analyze { text, category } returning the analysis without saving.
5. Make context match real: accept visitType in POST /api/recommendations and derive it from crowd/service
   aspects (e.g. family -> safety+facilities, business -> service+facilities). Update validateRequest.
6. Add node:test unit tests for trustService and scoringService (deterministic, no DB).
Test: run seed, then call /api/recommendations with 4 different priority sets and paste the top-3 of each.
Ranking must visibly change. Update docs/CURRENT_STATE.md with real results only.

## PART 3 — Deploy + QA lock
1. Render (server): Build `npm install`, Start `npm start`, env: MONGODB_URI, GEMINI_API_KEY, GEMINI_MODEL,
   CLIENT_URL (your Vercel URL), NODE_ENV=production, AI_MODE=live. Atlas: allow 0.0.0.0/0 for the demo.
2. Vercel (client): root `client`, env VITE_API_URL=<render url>, VITE_USE_DUMMY=false. Add client/vercel.json
   with a rewrite of all routes to /index.html so /places/:id works on refresh.
3. Note: Render free tier sleeps; add a "waking up" state in the client for the first request.
4. QA at 360/375/390/412/430/768/1024/1280: no horizontal overflow, bottom nav on mobile, Why-Recommended
   bottom sheet on mobile and side panel on desktop, loading/error/empty states, no secrets in the client bundle.
Report issues as CRITICAL / IMPORTANT / POLISH before fixing.

## PART 4 — Wow features (new branch feature/wow, do not modify scoringService or recommendationService)
1. Recharts radar chart on PlaceDetails: user priorities vs place aspect scores (ResponsiveContainer, mobile safe).
2. Compare mode: pick 2 places from recommendations and show side-by-side aspect bars.
3. Optional live discovery: server/services/livePlacesService.js + GET /api/places/live (Google Places Text
   Search, GOOGLE_PLACES_API_KEY in env). Map results in memory to the Place/Review shape, run through existing
   aiService + scoringService, never write to MongoDB, return clean errors on failure.
4. Update README with screenshots, architecture diagram, and the one-sentence pitch:
   "Gemini understands review language; ReviewLens computes trust, scores and rankings deterministically."
