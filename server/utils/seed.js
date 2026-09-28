/**
 * seed.js — Load data/places.json and data/reviews.json into MongoDB Atlas.
 *
 * Execution: npm run seed (from server/ directory)
 * - Clears existing Places, Reviews, and ReviewAnalysis collections.
 * - Inserts all seed places.
 * - For each review: runs deterministic mock analysis (aiService) and trust
 *   heuristics (trustService), stores ReviewAnalysis document.
 * - Recomputes and caches Place.aggregateScores for the scoring pipeline.
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('../config/db');

const Place = require('../models/Place');
const Review = require('../models/Review');
const ReviewAnalysis = require('../models/ReviewAnalysis');

const { analyzeReview } = require('../services/aiService');
const { computeTrustSignal } = require('../services/trustService');

const PLACES_FILE  = path.join(__dirname, '..', '..', 'data', 'places.json');
const REVIEWS_FILE = path.join(__dirname, '..', '..', 'data', 'reviews.json');
const ASPECTS = ['quality', 'cleanliness', 'service', 'price', 'crowd', 'safety', 'accessibility', 'facilities'];

/**
 * Recompute and save Place.aggregateScores from all its ReviewAnalysis docs.
 */
const recomputePlaceAggregates = async (placeId, allPlaceAnalyses) => {
  const analyses = allPlaceAnalyses.filter(a => a.placeId === placeId);
  if (analyses.length === 0) return;

  // Aspect aggregates
  const aspects = {};
  for (const asp of ASPECTS) {
    const scored = analyses.filter(a => a.aspectScores && a.aspectScores[asp] != null);
    if (scored.length > 0) {
      const avg = scored.reduce((sum, a) => sum + a.aspectScores[asp], 0) / scored.length;
      aspects[asp] = { avgScore: Math.round(avg), mentionCount: scored.length };
    } else {
      aspects[asp] = { avgScore: null, mentionCount: 0 };
    }
  }

  // Trust score average
  const trustScores = analyses.map(a => a.trustSignal && a.trustSignal.trustScore != null
    ? a.trustSignal.trustScore : 100);
  const avgTrust = trustScores.reduce((s, t) => s + t, 0) / trustScores.length;

  // Sentiment aggregates
  const sentimentScores = analyses.map(a => a.sentimentScore || 0.5);
  const sentimentAvg = sentimentScores.reduce((s, v) => s + v, 0) / sentimentScores.length;
  const positiveCount  = analyses.filter(a => a.sentiment === 'positive').length;
  const neutralCount   = analyses.filter(a => a.sentiment === 'neutral').length;
  const negativeCount  = analyses.filter(a => a.sentiment === 'negative').length;

  await Place.findByIdAndUpdate(placeId, {
    reviewCount: analyses.length,
    'aggregateScores.aspects': aspects,
    'aggregateScores.trustScore': Math.round(avgTrust),
    'aggregateScores.sentimentAverage': Math.round(sentimentAvg * 100) / 100,
    'aggregateScores.sentimentSummary.positiveCount': positiveCount,
    'aggregateScores.sentimentSummary.neutralCount':  neutralCount,
    'aggregateScores.sentimentSummary.negativeCount': negativeCount,
  });
};

const seed = async () => {
  console.log('\n🌱  ReviewLens Seed Script\n');

  await connectDB();

  // Load JSON files
  const places  = require(PLACES_FILE);
  const reviews = require(REVIEWS_FILE);
  console.log(`📂  Loaded ${places.length} places and ${reviews.length} reviews from data/`);

  // ── Clear existing data ────────────────────────────────────────────────────
  console.log('🗑   Clearing existing collections…');
  await Promise.all([
    Place.deleteMany({}),
    Review.deleteMany({}),
    ReviewAnalysis.deleteMany({}),
  ]);
  console.log('    Collections cleared.');

  // ── Insert Places ──────────────────────────────────────────────────────────
  console.log(`\n📍  Inserting ${places.length} places…`);
  await Place.insertMany(places, { ordered: false });
  console.log(`    ✅  ${places.length} places inserted.`);

  // ── Insert Reviews with Analysis + Trust ────────────────────────────────────
  console.log(`\n💬  Processing ${reviews.length} reviews (mock AI analysis + trust scoring)…`);

  // Group reviews by place for duplicate detection
  const reviewsByPlace = {};
  for (const r of reviews) {
    if (!reviewsByPlace[r.placeId]) reviewsByPlace[r.placeId] = [];
    reviewsByPlace[r.placeId].push(r);
  }

  const allAnalyses = [];
  let processedCount = 0;

  for (const review of reviews) {
    // Determine visitType (seed data may not have it — default to 'other')
    const reviewDoc = {
      _id:        review._id,
      placeId:    review.placeId,
      authorName: review.authorName,
      rating:     review.rating,
      text:       review.text,
      visitType:  review.visitType || 'other',
      analyzed:   false,
      createdAt:  review.createdAt || new Date(),
    };

    // Run deterministic mock analysis
    const placeRecord = places.find(p => p._id === review.placeId);
    const category = placeRecord ? placeRecord.category : 'hotel';
    const aiResult = analyzeReview(review.text, category);

    // Run trust signal (pass sibling reviews for Jaccard duplicate check)
    const siblings = (reviewsByPlace[review.placeId] || []).filter(r => r._id !== review._id);
    const trustResult = computeTrustSignal(review, siblings);

    // Build ReviewAnalysis document
    const analysisDoc = {
      reviewId:        review._id,
      placeId:         review.placeId,
      sentiment:       aiResult.sentiment,
      sentimentScore:  aiResult.sentimentScore,
      aspectScores:    aiResult.aspectScores,
      mentionedAspects: aiResult.mentionedAspects,
      positiveEvidence: aiResult.positiveEvidence,
      negativeEvidence: aiResult.negativeEvidence,
      summary:         aiResult.summary,
      confidence:      aiResult.confidence,
      trustSignal: {
        trustScore: trustResult.trustScore,
        level:      trustResult.level,
        reasons:    trustResult.reasons,
      },
      aiModel:     'mock',
      processedAt: new Date(),
    };

    allAnalyses.push(analysisDoc);

    // Insert the review with analyzed flag
    await Review.create({ ...reviewDoc, analyzed: true });
    processedCount++;

    if (processedCount % 50 === 0) {
      process.stdout.write(`    … ${processedCount}/${reviews.length}\n`);
    }
  }

  // Bulk insert all analyses
  console.log(`    Inserting ${allAnalyses.length} ReviewAnalysis documents…`);
  await ReviewAnalysis.insertMany(allAnalyses, { ordered: false });

  // Update review documents to link analysisId
  console.log('    Linking analysisId back to Reviews…');
  const analysisDocs = await ReviewAnalysis.find({}).select('_id reviewId').lean();
  for (const ad of analysisDocs) {
    await Review.findByIdAndUpdate(ad.reviewId, { analysisId: ad._id, analyzed: true });
  }

  // ── Recompute Place aggregates ─────────────────────────────────────────────
  console.log('\n📊  Recomputing place aggregate scores…');
  const placeIds = [...new Set(allAnalyses.map(a => a.placeId))];
  for (const placeId of placeIds) {
    await recomputePlaceAggregates(placeId, allAnalyses);
  }
  console.log(`    ✅  Aggregates recomputed for ${placeIds.length} places.`);

  // ── Summary ───────────────────────────────────────────────────────────────
  const finalPlaceCount   = await Place.countDocuments();
  const finalReviewCount  = await Review.countDocuments();
  const finalAnalysisCount= await ReviewAnalysis.countDocuments();

  console.log('\n✅  Seed complete!');
  console.log(`    Places:        ${finalPlaceCount}`);
  console.log(`    Reviews:       ${finalReviewCount}`);
  console.log(`    Analyses:      ${finalAnalysisCount}`);

  await mongoose.disconnect();
  console.log('\n🔌  MongoDB disconnected. Seed finished.\n');
};

if (require.main === module) {
  seed().catch(err => {
    console.error('❌  Seed failed:', err.message);
    process.exit(1);
  });
}

module.exports = seed;
