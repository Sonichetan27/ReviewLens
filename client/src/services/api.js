const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// TODO: implement in Day 2 — centralized fetch wrappers for places, reviews, and recommendations

export async function getPlaces() {
  return [];
}

export async function getPlaceById(_id) {
  return null;
}

export async function getReviews(_placeId) {
  return [];
}

export async function getRecommendations(_preferences) {
  return [];
}

export { API_BASE_URL };
