import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEYS = {
  FAVORITES: 'calchub_favorites',
  RECENT: 'calchub_recent',
};

// Global state variables to share data across all hook instances
let globalFavorites: string[] = [];
let globalRecentlyViewed: string[] = [];
let listeners: Array<() => void> = [];

const notify = () => {
  listeners.forEach(listener => listener());
};

// INITIALIZATION: Load from localStorage immediately on module load
if (typeof window !== 'undefined') {
  try {
    const f = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    if (f) globalFavorites = JSON.parse(f);
    
    const r = localStorage.getItem(STORAGE_KEYS.RECENT);
    if (r) globalRecentlyViewed = JSON.parse(r);
  } catch (e) {
    console.error("Critical: Could not load preferences from local storage", e);
  }
}

export function useUserPreferences() {
  // Local state just to trigger re-renders when global state changes
  const [, setTick] = useState(0);
  const update = useCallback(() => setTick(t => t + 1), []);

  useEffect(() => {
    listeners.push(update);
    return () => {
      listeners = listeners.filter(l => l !== update);
    };
  }, [update]);

  const toggleFavorite = useCallback((calcId: string) => {
    if (globalFavorites.includes(calcId)) {
      globalFavorites = globalFavorites.filter(id => id !== calcId);
    } else {
      globalFavorites = [calcId, ...globalFavorites];
    }
    
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(globalFavorites));
    notify();
  }, []);

  const addRecentlyViewed = useCallback((calcId: string) => {
    // Prevent redundant updates if the first item is already this ID
    if (globalRecentlyViewed[0] === calcId) return;

    // Filter out previous occurrence and bump to front
    const updated = [
      calcId, 
      ...globalRecentlyViewed.filter(id => id !== calcId)
    ].slice(0, 10);

    globalRecentlyViewed = updated;
    localStorage.setItem(STORAGE_KEYS.RECENT, JSON.stringify(globalRecentlyViewed));
    notify();
  }, []);

  const isFavorite = useCallback((calcId: string) => {
    return globalFavorites.includes(calcId);
  }, []);

  return {
    favorites: [...globalFavorites], // Return copies to ensure fresh references
    recentlyViewed: [...globalRecentlyViewed],
    toggleFavorite,
    addRecentlyViewed,
    isFavorite
  };
}
