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
