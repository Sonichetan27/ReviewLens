/**
 * Single integration point for all backend calls.
 * Components and hooks must import from here — never call fetch/axios directly.
 *
 * Live envelope (ARCHITECTURE.md §2.3): `{ data: ... }` unwrapped here.
 * Day 1: VITE_USE_DUMMY=true returns fixtures with the same shapes.
 * Day 2: set VITE_USE_DUMMY=false so these methods hit Express.
 */

import {
  DESTINATIONS,
  dummyRecommendations,
  filterPlaces,
  intelligenceFor,
  PLACES,
  reviewsFor,
} from '../data/fixtures.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const USE_DUMMY = import.meta.env.VITE_USE_DUMMY !== 'false';

const LATENCY_MS = 420;

function delay(ms = LATENCY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class ApiError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request(path, { method = 'GET', body, signal } = {}) {
  const url = `${API_BASE_URL}${path}`;
  let response;

  try {
    response = await fetch(url, {
      method,
      signal,
      headers: {
        Accept: 'application/json',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('Unable to reach ReviewLens. Check your connection and try again.', 0);
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new ApiError(payload?.error || `Request failed (${response.status})`, response.status);
  }

  return payload;
}

function toQuery(params = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      search.set(key, String(value));
    }
  });
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

export async function getPlaces({ city, category, search, budget } = {}) {
  if (USE_DUMMY) {
    await delay();
    return filterPlaces({ city, category, search, budget });
  }
  const payload = await request(`/api/places${toQuery({ city, category, budget })}`);
  const data = payload.data || [];
  if (!search) return data;
  const q = search.toLowerCase();
  return data.filter((p) => `${p.name} ${p.city} ${p.address}`.toLowerCase().includes(q));
}

export async function getPlaceById(id) {
  if (USE_DUMMY) {
    await delay();
    const place = PLACES.find((p) => p._id === id);
    if (!place) throw new ApiError(`Place not found: ${id}`, 404);
    return place;
  }
  const payload = await request(`/api/places/${encodeURIComponent(id)}`);
  return payload.data;
}

export async function getReviews(placeId) {
  if (USE_DUMMY) {
    await delay();
    return reviewsFor(placeId);
  }
  // Use the dedicated place reviews endpoint
  const payload = await request(`/api/places/${encodeURIComponent(placeId)}/reviews`);
  return payload.data || [];
}

export async function createReview(placeId, reviewData) {
  if (USE_DUMMY) {
    await delay();
    throw new ApiError('Review submission not yet implemented (planned for Day 2).', 501);
  }
  const payload = await request('/api/reviews', {
    method: 'POST',
    body: { placeId, ...reviewData },
  });
  return payload.data;
}

export async function getRecommendations(preferences) {
  if (USE_DUMMY) {
    await delay();
    return dummyRecommendations(preferences);
  }
  const payload = await request('/api/recommendations', {
    method: 'POST',
    body: preferences,
  });
  return payload.data || [];
}

export async function getPlaceIntelligence(placeId) {
  if (USE_DUMMY) {
    await delay();
    return intelligenceFor(placeId);
  }
  const payload = await request(`/api/reviews/intelligence/${encodeURIComponent(placeId)}`);
  return payload.data;
}

export async function getDestinations() {
  if (USE_DUMMY) {
    await delay();
    return DESTINATIONS;
  }
  const places = await getPlaces();
  const cities = [...new Set(places.map((p) => p.city))];
  return cities.map((city) => ({
    city,
    blurb: `${places.filter((p) => p.city === city).length} places in the catalog`,
    imageUrl: places.find((p) => p.city === city)?.imageUrl,
    placeCount: places.filter((p) => p.city === city).length,
  }));
}

export { API_BASE_URL, ApiError, USE_DUMMY };
