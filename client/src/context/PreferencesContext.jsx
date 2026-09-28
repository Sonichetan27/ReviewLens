import { createContext, useContext, useMemo, useState } from 'react';
import { DEFAULT_PRIORITIES, PREFERENCES_STORAGE_KEY } from '../utils/constants.js';

const defaultPreferences = {
  destination: 'Indore',
  placeType: 'restaurant',
  budget: 'medium',
  visitType: 'solo',
  priorities: { ...DEFAULT_PRIORITIES },
};

function readStored() {
  try {
    const raw = localStorage.getItem(PREFERENCES_STORAGE_KEY);
    if (!raw) return defaultPreferences;
    const parsed = JSON.parse(raw);
    return {
      ...defaultPreferences,
      ...parsed,
      priorities: { ...DEFAULT_PRIORITIES, ...(parsed.priorities || {}) },
    };
  } catch {
    return defaultPreferences;
  }
}

const PreferencesContext = createContext(null);

export function PreferencesProvider({ children }) {
  const [preferences, setPreferencesState] = useState(readStored);

  const value = useMemo(() => {
    const setPreferences = (patch) => {
      setPreferencesState((prev) => {
        const next = typeof patch === 'function' ? patch(prev) : { ...prev, ...patch };
        localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    };
    return { preferences, setPreferences };
  }, [preferences]);

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error('usePreferences must be used within PreferencesProvider');
  return ctx;
}
