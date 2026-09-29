/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from 'react';
import { resourceService } from '../services/resourceService';
import { favoritesService } from '../services/favoritesService';
import { historyService } from '../services/historyService';

const ResourceContext = createContext(null);

export function ResourceProvider({ children }) {
  const [resources, setResources] = useState(() => resourceService.getAll());
  const [favorites, setFavorites] = useState(() => favoritesService.getFavoriteIds());
  const [history, setHistory] = useState(() => historyService.getHistory());

  const refreshResources = useCallback(() => {
    setResources(resourceService.getAll());
  }, []);

  const addResource = useCallback((resourceData) => {
    const created = resourceService.create(resourceData);
    setResources(resourceService.getAll());
    return created;
  }, []);

  const updateResource = useCallback((id, updates) => {
    const updated = resourceService.update(id, updates);
    setResources(resourceService.getAll());
    return updated;
  }, []);

  const deleteResource = useCallback((id) => {
    resourceService.delete(id);
    favoritesService.remove(id);
    setResources(resourceService.getAll());
    setFavorites(favoritesService.getFavoriteIds());
  }, []);

  const toggleFavorite = useCallback((resourceId) => {
    const result = favoritesService.toggle(resourceId);
    setFavorites([...result.favorites]);
    return result;
  }, []);

  const isFavorite = useCallback((resourceId) => {
    return favorites.some((id) => String(id) === String(resourceId));
  }, [favorites]);

  const recordDownload = useCallback((resourceId) => {
    resourceService.incrementDownloads(resourceId);
    const updatedHistory = historyService.recordConsultation(resourceId);
    setHistory([...updatedHistory]);
    setResources(resourceService.getAll());
  }, []);

  const clearHistory = useCallback(() => {
    historyService.clear();
    setHistory([]);
  }, []);

  const clearFavorites = useCallback(() => {
    favoritesService.clear();
    setFavorites([]);
  }, []);

  return (
    <ResourceContext.Provider
      value={{
        resources,
        favorites,
        history,
        favoritesCount: favorites.length,
        historyCount: history.length,
        refreshResources,
        addResource,
        updateResource,
        deleteResource,
        toggleFavorite,
        isFavorite,
        recordDownload,
        clearHistory,
        clearFavorites,
      }}
    >
      {children}
    </ResourceContext.Provider>
  );
}

export function useResources() {
  const context = useContext(ResourceContext);
  if (!context) {
    throw new Error('useResources must be used within a ResourceProvider');
  }
  return context;
}
