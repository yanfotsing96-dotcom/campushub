/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { resourceService } from '../services/resourceService';

const ResourceContext = createContext(null);

export function ResourceProvider({ children }) {
  const [resources, setResources] = useState(() => resourceService.getAll());

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
    setResources(resourceService.getAll());
  }, []);

  const recordDownload = useCallback((resourceId) => {
    resourceService.incrementDownloads(resourceId);
    setResources(resourceService.getAll());
  }, []);

  const contextValue = useMemo(() => {
    return {
      resources,
      refreshResources,
      addResource,
      updateResource,
      deleteResource,
      recordDownload,
    };
  }, [
    resources,
    refreshResources,
    addResource,
    updateResource,
    deleteResource,
    recordDownload,
  ]);

  return (
    <ResourceContext.Provider value={contextValue}>
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
