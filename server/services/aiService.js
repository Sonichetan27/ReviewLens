/**
 * aiService.js — AI integration boundary (Gemini live OR deterministic mock).
 *
 * All AI_MODE branching is isolated here. No other file may inspect process.env.AI_MODE.
 * In AI_MODE=mock: returns deterministic keyword-based analysis with zero API calls.
 * In AI_MODE=live: calls Gemini 1.5 Flash with schema-constrained JSON output.
 *
 * Per ARCHITECTURE.md §5 — Gemini ONLY does NLU on individual review text.
 * Gemini is NEVER asked to rank, compare, or recommend places.
 */

const ASPECTS = ['quality', 'cleanliness', 'service', 'price', 'crowd', 'safety', 'accessibility', 'facilities'];

// Keyword dictionaries for mock NLU
const ASPECT_KEYWORDS = {
  quality: ['quality', 'taste', 'flavor', 'comfort', 'comfortable', 'cozy', 'excellent', 'mediocre',
    'subpar', 'fresh', 'stale', 'crispy', 'soft', 'hard', 'bed', 'linens', 'room', 'exhibit', 'craft'],
  cleanliness: ['clean', 'dirty', 'spotless', 'hygiene', 'hygienic', 'mold', 'mould', 'odor', 'smell',
    'sanitized', 'sanitation', 'tidy', 'messy', 'dusty', 'filthy', 'fresh linens', 'bathroom'],
  service: ['service', 'staff', 'waiter', 'waitress', 'helpful', 'rude', 'friendly', 'attentive',
    'responsive', 'check-in', 'checkout', 'manager', 'resolution', 'polite', 'courteous', 'slow service'],
  price: ['price', 'value', 'expensive', 'cheap', 'affordable', 'overpriced', 'worth', 'money',
    'budget', 'cost', 'reasonable', 'pricey', 'billing', 'charges', 'fee', 'ticket'],
  crowd: ['crowd', 'crowded', 'busy', 'quiet', 'noisy', 'peaceful', 'rush', 'wait', 'packed',
    'empty', 'serene', 'hectic', 'chaos', 'lines', 'queue', 'peak hour', 'loud'],
  safety: ['safe', 'safety', 'secure', 'security', 'unsafe', 'guard', 'night', 'well-lit', 'dark',
    'child safe', 'luggage', 'theft', 'surveillance', 'protection'],
  accessibility: ['wheelchair', 'ramp', 'elevator', 'lift', 'parking', 'accessible', 'stairs',
    'step-free', 'disabled', 'accessibility', 'entrance', 'arrive', 'location'],
  facilities: ['wifi', 'wi-fi', 'internet', 'pool', 'outlet', 'charging', 'ac', 'air conditioning',
    'restroom', 'toilet', 'amenities', 'facilities', 'equipment', 'gym', 'spa', 'projector'],
};

const POSITIVE_WORDS = ['excellent', 'outstanding', 'fantastic', 'perfect', 'amazing', 'wonderful',
  'brilliant', 'superb', 'great', 'love', 'best', 'spotless', 'fresh', 'fast', 'helpful',
  'friendly', 'clean', 'comfortable', 'peaceful', 'quiet', 'value', 'good'];
const NEGATIVE_WORDS = ['terrible', 'horrible', 'worst', 'awful', 'disgusting', 'rude', 'dirty',
  'broken', 'disappointing', 'poor', 'bad', 'slow', 'noisy', 'crowded', 'stale', 'mold',
  'smelled', 'unsafe', 'overpriced'];

/**
 * Deterministic mock analyzer — zero network calls, reproducible output.
 * @param {string} text  - Raw review text
 * @param {string} _category - Venue category (reserved for future context hints)
 * @returns {object} Schema-compliant analysis object
 */
const runDeterministicMockAnalyzer = (text, _category) => {
  const lowerText = text.toLowerCase();
  const wordCount = text.split(/\s+/).length;

  // Count positive and negative signals
  const positiveCount = POSITIVE_WORDS.filter(w => lowerText.includes(w)).length;
  const negativeCount = NEGATIVE_WORDS.filter(w => lowerText.includes(w)).length;

  // Derive sentiment
  let sentiment;
  let sentimentScore;
  if (positiveCount > negativeCount * 1.5) {
    sentiment = 'positive';
    sentimentScore = Math.min(0.95, 0.55 + (positiveCount * 0.08));
  } else if (negativeCount > positiveCount * 1.5) {
    sentiment = 'negative';
    sentimentScore = Math.max(0.05, 0.45 - (negativeCount * 0.08));
  } else {
    sentiment = 'neutral';
    sentimentScore = 0.50 + (positiveCount - negativeCount) * 0.03;
  }
  sentimentScore = Math.round(Math.min(0.98, Math.max(0.02, sentimentScore)) * 100) / 100;

  // Detect mentioned aspects and score each
  const aspectScores = {};
  const mentionedAspects = [];
  const positiveEvidence = [];
  const negativeEvidence = [];

  for (const aspect of ASPECTS) {
    const keywords = ASPECT_KEYWORDS[aspect] || [];
    const matches = keywords.filter(kw => lowerText.includes(kw));
    if (matches.length > 0) {
      mentionedAspects.push(aspect);
      // Score = 50 base + positive signals up / negative signals down
      let aspectScore = 55;
      aspectScore += positiveCount * 8;
      aspectScore -= negativeCount * 8;
      // Bonus: aspect keyword is near a positive/negative word in context
      if (POSITIVE_WORDS.some(pw => lowerText.includes(pw))) aspectScore += 10;
      if (NEGATIVE_WORDS.some(nw => lowerText.includes(nw))) aspectScore -= 15;
      aspectScore = Math.round(Math.min(100, Math.max(5, aspectScore)));
      aspectScores[aspect] = aspectScore;
    } else {
      aspectScores[aspect] = null;
    }
  }

  // Extract simple evidence sentences
  const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 15);
  for (const sentence of sentences) {
    const sl = sentence.toLowerCase();
    if (POSITIVE_WORDS.some(pw => sl.includes(pw)) && positiveEvidence.length < 3) {
      positiveEvidence.push(sentence);
    } else if (NEGATIVE_WORDS.some(nw => sl.includes(nw)) && negativeEvidence.length < 2) {
      negativeEvidence.push(sentence);
    }
  }

  // Build a concise summary (truncate to 200 chars)
  const summaryBase = sentences[0] || text.slice(0, 120);
  const summary = summaryBase.length > 200 ? summaryBase.slice(0, 197) + '…' : summaryBase;

  // Confidence based on text length (more words → higher confidence)
  const confidence = Math.round(Math.min(0.95, 0.45 + (wordCount / 120)) * 100) / 100;

  return {
    sentiment,
    sentimentScore,
    aspectScores,
    mentionedAspects,
    positiveEvidence,
    negativeEvidence,
    summary,
    confidence,
  };
};

/**
 * Analyze a review using Gemini (live) or deterministic mock.
 * This is the ONLY function that inspects process.env.AI_MODE.
 *
 * @param {string} text     - Raw review text
 * @param {string} category - Venue category ('hotel'|'restaurant'|'cafe'|'attraction')
 * @returns {Promise<object>} Schema-compliant analysis object
 */
const analyzeReview = async (text, category) => {
  const mode = process.env.AI_MODE || 'mock';

  if (mode === 'live' && process.env.GEMINI_API_KEY) {
    // TODO Day 2: wire Gemini 1.5 Flash SDK with schema-constrained JSON output
    // const { GoogleGenerativeAI } = require('@google/generative-ai');
    // ...
    console.warn('[aiService] AI_MODE=live not yet implemented — falling back to mock');
  }

  return runDeterministicMockAnalyzer(text, category);
};

module.exports = { analyzeReview };
