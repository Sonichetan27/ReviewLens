/**
 * trustService.js — Deterministic heuristic Review Trust Signal engine.
 *
 * Official name: "Review Trust Signal" (NEVER "Fake Review Detector").
 * Advisory only — never deletes or hides reviews automatically.
 *
 * Scoring rules per ARCHITECTURE.md §6.1:
 *   Start at 100. Apply penalties. Apply information density bonus (capped at 100).
 *   Level: >=80 = higher-trust | 50-79 = medium | <50 = high-risk
 */

// Generic/template phrases that carry no specific information
const GENERIC_PHRASES = [
  'nice experience', 'must visit', 'good staff', 'great place', 'highly recommended',
  'best place', 'loved it', 'amazing experience', 'wonderful place', 'nice place',
  'good experience', 'great experience', 'must visit with family', 'nice ambience',
  'good food', 'good service', 'average experience', 'nothing special', 'not bad',
  'okay experience', 'decent place', 'nothing memorable', 'really good',
  'would recommend', 'worth visiting',
];

// Specific noun indicators that raise information density score
const SPECIFIC_INDICATORS = [
  // Room / hotel specific
  'room 2', 'room 3', 'room 4', 'suite', 'deluxe room', 'standard room', 'check-in',
  'checkout', 'front desk', 'valet', 'concierge', 'housekeeping', 'elevator', 'lobby',
  // Food / restaurant specific
  'dal makhani', 'butter chicken', 'biryani', 'paneer', 'thali', 'naan', 'kebab',
  'masala chai', 'cappuccino', 'latte', 'espresso', 'cold brew', 'filter coffee',
  'menu', 'portion', 'serving', 'chef', 'waiter', 'table',
  // Facilities
  'wi-fi', 'wifi', 'air conditioning', 'ac', 'power outlet', 'parking', 'pool',
  'bathroom', 'shower', 'water pressure', 'elevator', 'ramp', 'wheelchair',
  // Attraction
  'exhibit', 'gallery', 'monument', 'ticket', 'guide', 'trail', 'viewpoint',
];

/**
 * Compute the Review Trust Signal for a single review.
 *
 * @param {object} review - { _id, text, rating, authorName, createdAt, placeId }
 * @param {object[]} allPlaceReviews - All other reviews for the same place (for duplicate check)
 * @returns {{ trustScore: number, level: string, reasons: string[] }}
 */
const computeTrustSignal = (review, allPlaceReviews = []) => {
  let score = 100;
  const reasons = [];
  const text = review.text || '';
  const lowerText = text.toLowerCase();

  // ── 1. Length penalty (per ARCHITECTURE.md: <25 chars = up to -25) ────────
  if (text.length < 25) {
    score -= 25;
    reasons.push('Review is too brief to contain meaningful information (under 25 characters)');
  } else if (text.length < 60) {
    score -= 10;
    reasons.push('Review is short and lacks sufficient detail');
  }

  // ── 2. Generic / template language penalty (-20) ──────────────────────────
  const genericCount = GENERIC_PHRASES.filter(phrase => lowerText.includes(phrase)).length;
  if (genericCount >= 2) {
    score -= 20;
    reasons.push('Contains multiple generic template phrases without specific details');
  } else if (genericCount === 1 && text.length < 100) {
    score -= 10;
    reasons.push('Uses generic filler language with limited context');
  }

  // ── 3. Duplicate similarity check — Jaccard token overlap (-30 if >0.65) ──
  const reviewTokens = new Set(lowerText.split(/\s+/).filter(t => t.length > 3));
  const otherReviews = allPlaceReviews.filter(r => r._id !== review._id);
  let isDuplicate = false;
  for (const other of otherReviews) {
    const otherTokens = new Set((other.text || '').toLowerCase().split(/\s+/).filter(t => t.length > 3));
    if (otherTokens.size === 0) continue;
    const intersection = [...reviewTokens].filter(t => otherTokens.has(t)).length;
    const union = new Set([...reviewTokens, ...otherTokens]).size;
    const jaccard = union === 0 ? 0 : intersection / union;
    if (jaccard > 0.65) {
      isDuplicate = true;
      break;
    }
  }
  if (isDuplicate) {
    score -= 30;
    reasons.push('High text similarity to another review for this venue — possible duplicate');
  }

  // ── 4. Sentiment-rating mismatch penalty (-35) ────────────────────────────
  const rating = review.rating || 3;
  const negativeWords = ['terrible', 'horrible', 'worst', 'awful', 'disgusting', 'rude',
    'dirty', 'broken', 'scam', 'fraud', 'never again', 'waste', 'poor', 'bad', 'disappointing'];
  const positiveWords = ['excellent', 'outstanding', 'fantastic', 'perfect', 'amazing',
    'wonderful', 'brilliant', 'superb', 'great', 'love', 'best'];
  const hasStrongNegative = negativeWords.some(w => lowerText.includes(w));
  const hasStrongPositive = positiveWords.some(w => lowerText.includes(w));
  if (rating >= 4 && hasStrongNegative && !hasStrongPositive) {
    score -= 35;
    reasons.push('High star rating conflicts with strongly negative review text (sentiment-rating mismatch)');
  } else if (rating <= 2 && hasStrongPositive && !hasStrongNegative) {
    score -= 35;
    reasons.push('Low star rating conflicts with strongly positive review text (sentiment-rating mismatch)');
  }

  // ── 5. Information density bonus (+15, capped at 100) ─────────────────────
  const specificCount = SPECIFIC_INDICATORS.filter(ind => lowerText.includes(ind)).length;
  if (specificCount >= 2) {
    score = Math.min(100, score + 15);
    reasons.push('Detailed review with specific amenity, dish, or facility mentions');
  } else if (specificCount === 1) {
    score = Math.min(100, score + 7);
    reasons.push('Contains at least one specific observable detail');
  }

  // If no negative reasons so far, add a positive signal
  if (score >= 80 && reasons.length === 0) {
    reasons.push('No generic template phrases detected');
    reasons.push('Sentiment aligns with star rating');
  }

  // Clamp score
  score = Math.max(0, Math.min(100, Math.round(score)));

  // Determine level
  let level;
  if (score >= 80) {
    level = 'higher-trust';
  } else if (score >= 50) {
    level = 'medium';
  } else {
    level = 'high-risk';
  }

  return { trustScore: score, level, reasons };
};

module.exports = { computeTrustSignal };
