import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEYS = {
  FAVORITES: 'calchub_favorites',
  RECENT: 'calchub_recent',
};

export function useUserPreferences() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const storedFavs = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (storedFavs) setFavorites(JSON.parse(storedFavs));

      const storedRecent = localStorage.getItem(STORAGE_KEYS.RECENT);
      if (storedRecent) setRecentlyViewed(JSON.parse(storedRecent));
    } catch (e) {
      console.error("Could not load preferences from local storage", e);
    }
  }, []);

  // Sync to local storage when state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RECENT, JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  const toggleFavorite = useCallback((calcId: string) => {
    setFavorites(prev => {
      if (prev.includes(calcId)) {
        return prev.filter(id => id !== calcId);
      }
      return [...prev, calcId];
    });
  }, []);

  const addRecentlyViewed = useCallback((calcId: string) => {
    setRecentlyViewed(prev => {
      // Remove it if it already exists so we can bump it to the front
      let newRecent = prev.filter(id => id !== calcId);
      newRecent = [calcId, ...newRecent];
      // Keep only the last 10
      if (newRecent.length > 10) newRecent = newRecent.slice(0, 10);
      return newRecent;
    });
  }, []);

  const isFavorite = useCallback((calcId: string) => {
    return favorites.includes(calcId);
  }, [favorites]);

  return {
    favorites,
    recentlyViewed,
    toggleFavorite,
    addRecentlyViewed,
    isFavorite
  };
}
