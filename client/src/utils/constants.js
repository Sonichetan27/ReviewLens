export const CITIES = ['Bangalore', 'Bhopal', 'Delhi', 'Goa', 'Indore', 'Jaipur', 'Lucknow', 'Mumbai', 'Pune', 'Udaipur'];

export const PLACE_TYPES = [
  { id: 'hotel', label: 'Hotels' },
  { id: 'restaurant', label: 'Restaurants' },
  { id: 'cafe', label: 'Cafes' },
  { id: 'attraction', label: 'Attractions' },
];

export const BUDGETS = [
  { id: 'low', label: 'Low', hint: '₹' },
  { id: 'medium', label: 'Medium', hint: '₹₹' },
  { id: 'high', label: 'High', hint: '₹₹₹' },
];

export const VISIT_TYPES = [
  { id: 'solo', label: 'Solo' },
  { id: 'couple', label: 'Couple' },
  { id: 'family', label: 'Family' },
  { id: 'business', label: 'Business' },
  { id: 'friends', label: 'Friends' },
];

export const ASPECTS = [
  { key: 'quality', label: 'Quality' },
  { key: 'cleanliness', label: 'Cleanliness' },
  { key: 'service', label: 'Service' },
  { key: 'price', label: 'Price' },
  { key: 'crowd', label: 'Crowd' },
  { key: 'safety', label: 'Safety' },
  { key: 'accessibility', label: 'Access' },
  { key: 'facilities', label: 'Facilities' },
];

export const CORE_ASPECTS = ['quality', 'cleanliness', 'price', 'service'];

export const DEFAULT_PRIORITIES = {
  quality: 4,
  cleanliness: 4,
  service: 3,
  price: 3,
  crowd: 3,
  safety: 3,
  accessibility: 3,
  facilities: 3,
};

export const PREFERENCES_STORAGE_KEY = 'reviewlens_user_preferences';
export const SAVED_STORAGE_KEY = 'reviewlens_saved_places';

export const PRICE_LABELS = {
  low: '₹',
  medium: '₹₹',
  high: '₹₹₹',
};

export function categoryLabel(category) {
  return PLACE_TYPES.find((t) => t.id === category)?.label ?? category;
}

export function trustLevelFromScore(trustScore) {
  if (trustScore >= 80) return 'higher-trust';
  if (trustScore >= 50) return 'medium';
  return 'high-risk';
}

export function trustLabel(level) {
  if (level === 'higher-trust') return 'Higher-Trust';
  if (level === 'high-risk') return 'High-Risk';
  return 'Medium';
}

export function topAspects(place, count = 2) {
  const aspects = place?.aggregateScores?.aspects || {};
  return Object.entries(aspects)
    .filter(([, v]) => v && v.avgScore != null)
    .sort((a, b) => b[1].avgScore - a[1].avgScore)
    .slice(0, count)
    .map(([key, value]) => ({
      key,
      label: ASPECTS.find((a) => a.key === key)?.label ?? key,
      avgScore: value.avgScore,
      mentionCount: value.mentionCount,
    }));
}
