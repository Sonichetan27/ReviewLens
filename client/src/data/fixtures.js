/**
 * Dummy payloads matching ARCHITECTURE.md / live controller envelopes.
 * Day 2: api.js will fetch the same shapes from Express; components stay unchanged.
 */

function aspects(scores) {
  const keys = [
    'quality',
    'cleanliness',
    'service',
    'price',
    'crowd',
    'safety',
    'accessibility',
    'facilities',
  ];
  return Object.fromEntries(
    keys.map((key) => [
      key,
      {
        avgScore: scores[key] ?? null,
        mentionCount: scores[key] == null ? 0 : Math.max(3, Math.round(scores[key] / 8)),
      },
    ]),
  );
}

function place(base, scoreMap, extras = {}) {
  const trustScore = extras.trustScore ?? 84;
  return {
    reviewCount: extras.reviewCount ?? 14,
    aggregateScores: {
      aspects: aspects(scoreMap),
      trustScore,
      sentimentAverage: extras.sentimentAverage ?? 0.78,
      sentimentSummary: extras.sentimentSummary ?? {
        positiveCount: 10,
        neutralCount: 3,
        negativeCount: 1,
      },
    },
    ...base,
  };
}

export const PLACES = [
  place(
    {
      _id: 'p101',
      name: 'The Grand Meridian',
      category: 'hotel',
      city: 'Indore',
      priceLevel: 'high',
      overallRating: 4.2,
      address: '190 Station Road, Indore',
      imageUrl: 'https://picsum.photos/seed/101/800/520',
    },
    { quality: 86, cleanliness: 91, service: 80, price: 62, crowd: 74, safety: 88, accessibility: 81, facilities: 90 },
    { trustScore: 88, reviewCount: 22, sentimentAverage: 0.81 },
  ),
  place(
    {
      _id: 'p102',
      name: 'Blue Orchid Residency',
      category: 'hotel',
      city: 'Bhopal',
      priceLevel: 'low',
      overallRating: 3.7,
      address: '189 MG Road, Bhopal',
      imageUrl: 'https://picsum.photos/seed/102/800/520',
    },
    { quality: 72, cleanliness: 78, service: 70, price: 88, crowd: 66, safety: 80, accessibility: 64, facilities: 68 },
    { trustScore: 74, reviewCount: 11 },
  ),
  place(
    {
      _id: 'p103',
      name: 'Hilltop Inn',
      category: 'hotel',
      city: 'Jaipur',
      priceLevel: 'high',
      overallRating: 4.4,
      address: '140 MG Road, Jaipur',
      imageUrl: 'https://picsum.photos/seed/103/800/520',
    },
    { quality: 90, cleanliness: 93, service: 87, price: 58, crowd: 71, safety: 92, accessibility: 77, facilities: 89 },
    { trustScore: 91, reviewCount: 19, sentimentAverage: 0.86 },
  ),
  place(
    {
      _id: 'p104',
      name: 'Riverside Palace Hotel',
      category: 'hotel',
      city: 'Mumbai',
      priceLevel: 'high',
      overallRating: 4.0,
      address: '8 MG Road, Mumbai',
      imageUrl: 'https://picsum.photos/seed/104/800/520',
    },
    { quality: 84, cleanliness: 82, service: 79, price: 54, crowd: 60, safety: 85, accessibility: 83, facilities: 88 },
    { trustScore: 81, reviewCount: 16 },
  ),
  place(
    {
      _id: 'p107',
      name: 'Spice Route Kitchen',
      category: 'restaurant',
      city: 'Indore',
      priceLevel: 'medium',
      overallRating: 4.1,
      address: '151 Station Road, Indore',
      imageUrl: 'https://picsum.photos/seed/107/800/520',
    },
    { quality: 92, cleanliness: 84, service: 81, price: 76, crowd: 58, safety: 80, accessibility: 70, facilities: 73 },
    { trustScore: 87, reviewCount: 24, sentimentAverage: 0.84 },
  ),
  place(
    {
      _id: 'p108',
      name: 'The Copper Pot',
      category: 'restaurant',
      city: 'Bhopal',
      priceLevel: 'low',
      overallRating: 4.5,
      address: '41 Palace Street, Bhopal',
      imageUrl: 'https://picsum.photos/seed/108/800/520',
    },
    { quality: 94, cleanliness: 80, service: 86, price: 91, crowd: 63, safety: 78, accessibility: 61, facilities: 69 },
    { trustScore: 90, reviewCount: 28, sentimentAverage: 0.89 },
  ),
  place(
    {
      _id: 'p111',
      name: 'Rajwada Dining',
      category: 'restaurant',
      city: 'Indore',
      priceLevel: 'medium',
      overallRating: 4.2,
      address: '12 Palace Street, Indore',
      imageUrl: 'https://picsum.photos/seed/111/800/520',
    },
    { quality: 88, cleanliness: 86, service: 83, price: 74, crowd: 70, safety: 82, accessibility: 72, facilities: 75 },
    { trustScore: 85, reviewCount: 18 },
  ),
  place(
    {
      _id: 'p110',
      name: 'Bombay Bites',
      category: 'restaurant',
      city: 'Mumbai',
      priceLevel: 'low',
      overallRating: 3.5,
      address: '25 Station Road, Mumbai',
      imageUrl: 'https://picsum.photos/seed/110/800/520',
    },
    { quality: 68, cleanliness: 61, service: 64, price: 82, crowd: 48, safety: 70, accessibility: 55, facilities: 58 },
    { trustScore: 46, reviewCount: 9, sentimentAverage: 0.52, sentimentSummary: { positiveCount: 3, neutralCount: 3, negativeCount: 3 } },
  ),
  place(
    {
      _id: 'p113',
      name: 'Bean & Brew',
      category: 'cafe',
      city: 'Indore',
      priceLevel: 'high',
      overallRating: 3.8,
      address: '161 Market Lane, Indore',
      imageUrl: 'https://picsum.photos/seed/113/800/520',
    },
    { quality: 81, cleanliness: 88, service: 76, price: 60, crowd: 72, safety: 84, accessibility: 79, facilities: 91 },
    { trustScore: 83, reviewCount: 13 },
  ),
  place(
    {
      _id: 'p115',
      name: 'The Reading Corner Cafe',
      category: 'cafe',
      city: 'Jaipur',
      priceLevel: 'low',
      overallRating: 4.3,
      address: '198 Station Road, Jaipur',
      imageUrl: 'https://picsum.photos/seed/115/800/520',
    },
    { quality: 87, cleanliness: 90, service: 82, price: 89, crowd: 92, safety: 86, accessibility: 74, facilities: 85 },
    { trustScore: 92, reviewCount: 21, sentimentAverage: 0.88 },
  ),
  place(
    {
      _id: 'p116',
      name: 'Sunset Terrace Cafe',
      category: 'cafe',
      city: 'Mumbai',
      priceLevel: 'low',
      overallRating: 4.6,
      address: '26 Palace Street, Mumbai',
      imageUrl: 'https://picsum.photos/seed/116/800/520',
    },
    { quality: 91, cleanliness: 85, service: 88, price: 84, crowd: 67, safety: 81, accessibility: 69, facilities: 80 },
    { trustScore: 89, reviewCount: 26, sentimentAverage: 0.9 },
  ),
  place(
    {
      _id: 'p119',
      name: 'Lakeview Gardens',
      category: 'attraction',
      city: 'Indore',
      priceLevel: 'high',
      overallRating: 4.7,
      address: '166 MG Road, Indore',
      imageUrl: 'https://picsum.photos/seed/119/800/520',
    },
    { quality: 93, cleanliness: 87, service: 75, price: 64, crowd: 55, safety: 90, accessibility: 82, facilities: 86 },
    { trustScore: 88, reviewCount: 31, sentimentAverage: 0.91 },
  ),
  place(
    {
      _id: 'p120',
      name: 'Heritage Fort Museum',
      category: 'attraction',
      city: 'Bhopal',
      priceLevel: 'high',
      overallRating: 4.3,
      address: '137 Lake Road, Bhopal',
      imageUrl: 'https://picsum.photos/seed/120/800/520',
    },
    { quality: 89, cleanliness: 79, service: 72, price: 70, crowd: 61, safety: 84, accessibility: 58, facilities: 71 },
    { trustScore: 80, reviewCount: 17 },
  ),
  place(
    {
      _id: 'p122',
      name: 'Riverside Walkway',
      category: 'attraction',
      city: 'Mumbai',
      priceLevel: 'low',
      overallRating: 4.4,
      address: '197 MG Road, Mumbai',
      imageUrl: 'https://picsum.photos/seed/122/800/520',
    },
    { quality: 85, cleanliness: 73, service: 68, price: 95, crowd: 50, safety: 76, accessibility: 88, facilities: 64 },
    { trustScore: 77, reviewCount: 20 },
  ),
  place(
    {
      _id: 'p123',
      name: 'Old Palace Grounds',
      category: 'attraction',
      city: 'Indore',
      priceLevel: 'low',
      overallRating: 4.6,
      address: '81 Palace Street, Indore',
      imageUrl: 'https://picsum.photos/seed/123/800/520',
    },
    { quality: 90, cleanliness: 82, service: 70, price: 93, crowd: 77, safety: 87, accessibility: 80, facilities: 72 },
    { trustScore: 86, reviewCount: 15, sentimentAverage: 0.87 },
  ),
];

export const DESTINATIONS = [
  {
    city: 'Indore',
    blurb: 'Street food, palaces, and lake gardens',
    imageUrl: 'https://picsum.photos/seed/indore/640/400',
    placeCount: PLACES.filter((p) => p.city === 'Indore').length,
  },
  {
    city: 'Bhopal',
    blurb: 'Lakeside cafes and heritage forts',
    imageUrl: 'https://picsum.photos/seed/bhopal/640/400',
    placeCount: PLACES.filter((p) => p.city === 'Bhopal').length,
  },
  {
    city: 'Jaipur',
    blurb: 'Heritage inns and quiet reading cafes',
    imageUrl: 'https://picsum.photos/seed/jaipur/640/400',
    placeCount: PLACES.filter((p) => p.city === 'Jaipur').length,
  },
  {
    city: 'Mumbai',
    blurb: 'Sea views, walkways, and late-night bites',
    imageUrl: 'https://picsum.photos/seed/mumbai/640/400',
    placeCount: PLACES.filter((p) => p.city === 'Mumbai').length,
  },
];

export const REVIEWS_BY_PLACE = {
  p107: [
    {
      _id: 'r107-1',
      placeId: 'p107',
      authorName: 'Ananya S.',
      rating: 5,
      text: 'Dal tadka was perfectly tempered and the baos were steaming hot. Staff noticed our empty water glasses twice without being asked.',
      visitType: 'couple',
      analyzed: true,
      createdAt: '2026-03-12T10:00:00.000Z',
      analysis: {
        sentiment: 'positive',
        sentimentScore: 0.91,
        aspectScores: { quality: 94, cleanliness: 82, service: 88, price: null, crowd: 60, safety: null, accessibility: null, facilities: null },
        mentionedAspects: ['quality', 'cleanliness', 'service', 'crowd'],
        positiveEvidence: ['Dal tadka was perfectly tempered', 'Staff noticed our empty water glasses twice'],
        negativeEvidence: [],
        summary: 'Excellent food with attentive service.',
        confidence: 0.9,
        trustSignal: {
          trustScore: 91,
          level: 'higher-trust',
          reasons: ['Detailed review with specific dish names', 'Sentiment aligns with star rating'],
        },
      },
    },
    {
      _id: 'r107-2',
      placeId: 'p107',
      authorName: 'Rohit M.',
      rating: 4,
      text: 'Great thali portions. Weekend dinner was crowded and we waited 18 minutes for a table.',
      visitType: 'family',
      analyzed: true,
      createdAt: '2026-04-02T18:30:00.000Z',
      analysis: {
        sentiment: 'neutral',
        sentimentScore: 0.62,
        aspectScores: { quality: 84, cleanliness: null, service: 70, price: 78, crowd: 48, safety: null, accessibility: null, facilities: null },
        mentionedAspects: ['quality', 'service', 'price', 'crowd'],
        positiveEvidence: ['Great thali portions'],
        negativeEvidence: ['Waited 18 minutes for a table'],
        summary: 'Solid food, busy on weekends.',
        confidence: 0.84,
        trustSignal: {
          trustScore: 86,
          level: 'higher-trust',
          reasons: ['Specific wait-time detail', 'No generic template phrases detected'],
        },
      },
    },
  ],
};

export function reviewsFor(placeId) {
  if (REVIEWS_BY_PLACE[placeId]) return REVIEWS_BY_PLACE[placeId];
  const place = PLACES.find((p) => p._id === placeId);
  if (!place) return [];
  return [
    {
      _id: `r-${placeId}-1`,
      placeId,
      authorName: 'Priya K.',
      rating: Math.min(5, Math.round(place.overallRating)),
      text: `Quiet visit to ${place.name}. Cleanliness stood out and staff were courteous at ${place.address}.`,
      visitType: 'solo',
      analyzed: true,
      createdAt: '2026-05-01T09:00:00.000Z',
      analysis: {
        sentiment: 'positive',
        sentimentScore: 0.8,
        aspectScores: { quality: 82, cleanliness: 90, service: 84, price: null, crowd: 80, safety: null, accessibility: null, facilities: 78 },
        mentionedAspects: ['quality', 'cleanliness', 'service', 'crowd', 'facilities'],
        positiveEvidence: ['Cleanliness stood out', 'Staff were courteous'],
        negativeEvidence: [],
        summary: 'Clean venue with courteous service.',
        confidence: 0.81,
        trustSignal: {
          trustScore: place.aggregateScores.trustScore,
          level: place.aggregateScores.trustScore >= 80 ? 'higher-trust' : place.aggregateScores.trustScore >= 50 ? 'medium' : 'high-risk',
          reasons: ['Substantive detail on specific amenities'],
        },
      },
    },
  ];
}

export function intelligenceFor(placeId) {
  const place = PLACES.find((p) => p._id === placeId);
  const reviews = reviewsFor(placeId);
  const agg = place?.aggregateScores;
  return {
    placeId,
    trustDistribution: {
      higherTrust: agg?.trustScore >= 80 ? 12 : 5,
      medium: 4,
      highRisk: agg?.trustScore < 50 ? 6 : 1,
    },
    sentimentSummary: agg?.sentimentSummary ?? { positiveCount: 8, neutralCount: 2, negativeCount: 1 },
    positiveEvidence: reviews.flatMap((r) => r.analysis?.positiveEvidence || []).slice(0, 4),
    negativeEvidence: reviews.flatMap((r) => r.analysis?.negativeEvidence || []).slice(0, 4),
    trustScore: agg?.trustScore ?? 80,
  };
}

export function filterPlaces({ city, category, search, budget } = {}) {
  return PLACES.filter((p) => {
    if (city && p.city.toLowerCase() !== city.toLowerCase()) return false;
    if (category && p.category !== category.toLowerCase()) return false;
    if (budget && p.priceLevel !== budget.toLowerCase()) return false;
    if (search) {
      const q = search.toLowerCase();
      const hay = `${p.name} ${p.city} ${p.address} ${p.category}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

const PRECOMPUTED_RECS = {
  p101: {
    finalScore: 86.4,
    breakdown: { aspectMatch: 88, contextMatch: 70, sentiment: 81, trustQuality: 76, overallRating: 80 },
    whyBullets: [
      'Cleanliness rated 91/100 across 11 review mentions, matching your top preference.',
      '88% Review Trust Signal (Higher-Trust): 22 customer reviews evaluated.',
    ],
  },
  p102: {
    finalScore: 74.1,
    breakdown: { aspectMatch: 76, contextMatch: 90, sentiment: 78, trustQuality: 53, overallRating: 68 },
    whyBullets: [
      'Strong budget compatibility — low price tier aligns with a value-focused stay.',
      '74% Review Trust Signal (Medium): 11 customer reviews evaluated.',
    ],
  },
  p103: {
    finalScore: 90.2,
    breakdown: { aspectMatch: 91, contextMatch: 70, sentiment: 86, trustQuality: 82, overallRating: 85 },
    whyBullets: [
      'Quality rated 90/100 across 11 review mentions, matching your top preference.',
      '91% Review Trust Signal (Higher-Trust): 19 customer reviews evaluated.',
    ],
  },
  p104: {
    finalScore: 81.5,
    breakdown: { aspectMatch: 82, contextMatch: 70, sentiment: 78, trustQuality: 68, overallRating: 75 },
    whyBullets: [
      'Facilities rated 88/100 across 11 review mentions, matching your top preference.',
      '81% Review Trust Signal (Higher-Trust): 16 customer reviews evaluated.',
    ],
  },
  p107: {
    finalScore: 88.7,
    breakdown: { aspectMatch: 90, contextMatch: 90, sentiment: 84, trustQuality: 80, overallRating: 78 },
    whyBullets: [
      'Quality rated 92/100 across 12 review mentions, matching your top preference.',
      'Strong budget compatibility — medium price tier aligns with your medium budget preference.',
      '87% Review Trust Signal (Higher-Trust): 24 customer reviews evaluated.',
    ],
  },
  p108: {
    finalScore: 91.8,
    breakdown: { aspectMatch: 93, contextMatch: 90, sentiment: 89, trustQuality: 85, overallRating: 88 },
    whyBullets: [
      'Quality rated 94/100 across 12 review mentions, matching your top preference.',
      '90% Review Trust Signal (Higher-Trust): 28 customer reviews evaluated.',
    ],
  },
  p111: {
    finalScore: 85.9,
    breakdown: { aspectMatch: 86, contextMatch: 90, sentiment: 78, trustQuality: 75, overallRating: 80 },
    whyBullets: [
      'Cleanliness rated 86/100 across 11 review mentions, matching your top preference.',
      '85% Review Trust Signal (Higher-Trust): 18 customer reviews evaluated.',
    ],
  },
  p110: {
    finalScore: 58.4,
    breakdown: { aspectMatch: 64, contextMatch: 90, sentiment: 52, trustQuality: 31, overallRating: 63 },
    whyBullets: ['46% Review Trust Signal (High-Risk): 9 customer reviews evaluated.'],
  },
  p113: {
    finalScore: 80.6,
    breakdown: { aspectMatch: 82, contextMatch: 70, sentiment: 78, trustQuality: 67, overallRating: 70 },
    whyBullets: [
      'Facilities rated 91/100 across 11 review mentions, matching your top preference.',
      '83% Review Trust Signal (Higher-Trust): 13 customer reviews evaluated.',
    ],
  },
  p115: {
    finalScore: 89.3,
    breakdown: { aspectMatch: 88, contextMatch: 90, sentiment: 88, trustQuality: 80, overallRating: 83 },
    whyBullets: [
      'Cleanliness rated 90/100 across 11 review mentions, matching your top preference.',
      '92% Review Trust Signal (Higher-Trust): 21 customer reviews evaluated.',
    ],
  },
  p116: {
    finalScore: 90.1,
    breakdown: { aspectMatch: 90, contextMatch: 90, sentiment: 90, trustQuality: 81, overallRating: 90 },
    whyBullets: [
      'Quality rated 91/100 across 11 review mentions, matching your top preference.',
      '89% Review Trust Signal (Higher-Trust): 26 customer reviews evaluated.',
    ],
  },
  p119: {
    finalScore: 87.4,
    breakdown: { aspectMatch: 89, contextMatch: 70, sentiment: 91, trustQuality: 82, overallRating: 93 },
    whyBullets: [
      'Quality rated 93/100 across 12 review mentions, matching your top preference.',
      '88% Review Trust Signal (Higher-Trust): 31 customer reviews evaluated.',
    ],
  },
  p120: {
    finalScore: 79.8,
    breakdown: { aspectMatch: 81, contextMatch: 70, sentiment: 78, trustQuality: 71, overallRating: 83 },
    whyBullets: ['80% Review Trust Signal (Higher-Trust): 17 customer reviews evaluated.'],
  },
  p122: {
    finalScore: 82.2,
    breakdown: { aspectMatch: 83, contextMatch: 90, sentiment: 78, trustQuality: 65, overallRating: 85 },
    whyBullets: [
      'Price & Value rated 95/100 across 12 review mentions, matching your top preference.',
      '77% Review Trust Signal (Medium): 20 customer reviews evaluated.',
    ],
  },
  p123: {
    finalScore: 88.0,
    breakdown: { aspectMatch: 88, contextMatch: 90, sentiment: 87, trustQuality: 77, overallRating: 90 },
    whyBullets: [
      'Quality rated 90/100 across 11 review mentions, matching your top preference.',
      '86% Review Trust Signal (Higher-Trust): 15 customer reviews evaluated.',
    ],
  },
};

export function dummyRecommendations(preferences = {}) {
  const { destination, placeType } = preferences;
  return filterPlaces({ city: destination, category: placeType })
    .map((p) => {
      const rec = PRECOMPUTED_RECS[p._id] || {
        finalScore: 72,
        breakdown: { aspectMatch: 72, contextMatch: 70, sentiment: 70, trustQuality: 70, overallRating: 70 },
        whyBullets: [`${p.aggregateScores.trustScore}% Review Trust Signal: ${p.reviewCount} customer reviews evaluated.`],
      };
      return { place: p, ...rec };
    })
    .sort((a, b) => b.finalScore - a.finalScore);
}
