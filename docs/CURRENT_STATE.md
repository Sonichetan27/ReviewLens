# ReviewLens — Current State (audited against the repo)

_Last audit: Part 1 complete. Everything below was verified by running code, except items marked UNTESTED._

## Working (verified)
- Client builds (`cd client && npm run build`), 6 pages routed, PlaceDetails + ReviewIntelligence now real pages.
- Server modules load; deterministic pipeline verified in-memory over all 24 places / 209 reviews:
  mock analysis -> Review Trust Signal -> aspect aggregation -> 40/20/15/15/10 scoring -> ranking.
- Trust scores vary across places (66-99), so the heuristic is differentiating.

## Fixed in Part 1
1. `seed.js` did not `await analyzeReview` (async) -> every ReviewAnalysis would fail validation. Fixed.
2. Client default API port was 8000, server default is 5000. Fixed to 5000.
3. Client defaulted to dummy fixtures (`VITE_USE_DUMMY !== 'false'`); now live API unless `VITE_USE_DUMMY=true`.
4. WhyRecommendedPanel read `overallRating` but backend returns `ratingScore` (star-rating bar was always empty). Fixed.
5. Added spec endpoint `GET /api/places/:id/intelligence` (old `/api/reviews/intelligence/:placeId` kept).
6. Route `/intelligence` had no place id; now `/places/:id/intelligence`.

## UNTESTED (needs your MongoDB Atlas URI)
- `npm run seed` against Atlas, and all endpoints against real data. Run seed first; paste any error into your agent.

## Known gaps (next parts)
- `aiService` live mode (Gemini) is still a stub; falls back to mock.
- Mock analyzer gives every mentioned aspect the same score, so ranking barely reacts to priorities. Needs per-aspect sentence scoring.
- Context match is a constant 40/50 for the "visit type" half; `visitType` from the client is not sent/used by the backend.
- No `POST /api/reviews/analyze`; `POST /api/reviews` returns 501.
- No tests, no deployment config, no radar chart / live places extras.
See `docs/NEXT_PARTS.md` for ready-to-paste prompts.

## Session update (Part 2 partial — today)
Repo had moved forward since the audit above (commits `c90ee18`, `8f56bcc` — Vercel serverless prep by another agent). Re-verified and fixed:

1. **CRITICAL — server would not run locally.** The Vercel-prep commit changed `server.js` to `module.exports = app` with no `app.listen(...)`, so `npm start` / `node server.js` started nothing. Fixed: now calls `app.listen(PORT, ...)` when run directly (`require.main === module`), while still exporting `app` for serverless use. Verified by starting the server and seeing it bind to a port.
2. **Biggest demo risk fixed — mock AI analyzer now scores per aspect, not per review.** Previously every aspect mentioned in a review got the *same* score (derived from the whole review's positive/negative word count), so a review criticizing service but praising food scored both identically. Now each aspect's score comes only from the sentence(s) that mention it. Verified: a mixed review now scores quality=87 and service=15 in the same text.
   - Re-ran the 4-priority-set ranking test from the Part 1 audit: rankings now visibly reorder between quality-heavy, price-heavy and cleanliness-heavy preference sets (previously two of the three sets returned the same #1 place; now they differ).
3. **Dead nav tab fixed.** Bottom nav's "Insights" tab pointed to `/intelligence`, which had no matching route (blank screen). Added `client/src/pages/Insights.jsx` (a place picker reusing existing `PlaceCard`/`usePlaces`) and registered `/intelligence` in `App.jsx`. From there, users open a place, then "Open review intelligence" as before.

### Still UNTESTED
`npm run seed` and all endpoints against a real MongoDB Atlas URI — no DB credentials available in this session. Everything above was verified either by running the actual service files in-memory (no DB) or by starting the server process directly.

### Still open (see docs/NEXT_PARTS.md)
- Gemini `AI_MODE=live` is still a stub (falls back to mock with a console warning).
- `visitType` collected by the UI is not yet used in `contextMatch` (constant 40).
- No `POST /api/reviews/analyze`; `POST /api/reviews` still returns 501.
- No automated tests yet.
