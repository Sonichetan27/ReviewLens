import { getPlaceById, getPlaceIntelligence, getPlaces, getRecommendations, getReviews } from '../services/api.js';
import { useAsync } from './useAsync.js';

export function usePlaces(filters = {}) {
  return useAsync(
    () => getPlaces(filters),
    [filters.city, filters.category, filters.search, filters.budget],
  );
}

export function usePlaceDetails(id) {
  return useAsync(() => (id ? getPlaceById(id) : Promise.resolve(null)), [id]);
}

export function usePlaceReviews(placeId) {
  return useAsync(() => (placeId ? getReviews(placeId) : Promise.resolve([])), [placeId]);
}

export function useRecommendations(preferences) {
  return useAsync(() => getRecommendations(preferences), [
    preferences?.destination,
    preferences?.placeType,
    preferences?.budget,
    JSON.stringify(preferences?.priorities || {}),
  ]);
}

export function usePlaceIntelligence(placeId) {
  return useAsync(() => (placeId ? getPlaceIntelligence(placeId) : Promise.resolve(null)), [placeId]);
}
