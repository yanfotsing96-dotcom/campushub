import { storageService } from './storageService';
import { STORAGE_KEYS, DEFAULT_RESOURCES } from '../constants/academicConstants';

export const resourceService = {
  getAll() {
    const resources = storageService.get(STORAGE_KEYS.RESOURCES, null);
    if (!resources || !Array.isArray(resources) || resources.length === 0) {
      storageService.set(STORAGE_KEYS.RESOURCES, DEFAULT_RESOURCES);
      return [...DEFAULT_RESOURCES];
    }
    // Enrich with author info from defaults if missing
    const defaultMap = new Map(DEFAULT_RESOURCES.map((d) => [String(d.id), d]));
    const enriched = resources.map((r) => {
      const def = defaultMap.get(String(r.id));
      if (def && (!r.authorMatricule || !r.authorName)) {
        return {
          ...r,
          authorMatricule: r.authorMatricule || def.authorMatricule,
          authorName: r.authorName || def.authorName,
          authorRole: r.authorRole || def.authorRole,
        };
      }
      return r;
    });

    // If fewer than default resources, supplement with missing default resources
    if (enriched.length < DEFAULT_RESOURCES.length) {
      const existingIds = new Set(enriched.map((r) => String(r.id)));
      const missing = DEFAULT_RESOURCES.filter((r) => !existingIds.has(String(r.id)));
      if (missing.length > 0) {
        const merged = [...enriched, ...missing];
        storageService.set(STORAGE_KEYS.RESOURCES, merged);
        return merged;
      }
    }
    return enriched;
  },

  getById(id) {
    const list = this.getAll();
    return list.find((item) => String(item.id) === String(id)) || null;
  },

  create(resourceData) {
    const list = this.getAll();
    const newResource = {
      id: Date.now(),
      titre: resourceData.titre.trim(),
      filiere: resourceData.filiere,
      niveau: resourceData.niveau,
      description: resourceData.description?.trim() || '',
      enseignant: resourceData.enseignant?.trim() || 'Département ' + resourceData.filiere,
      codeUe: resourceData.codeUe?.trim().toUpperCase() || `${resourceData.filiere.slice(0, 3).toUpperCase()}${resourceData.niveau}`,
      pages: Number(resourceData.pages) || 24,
      downloads: 0,
      format: resourceData.format || 'PDF',
      updatedAt: new Date().toISOString().split('T')[0],
      universityName: resourceData.universityName || 'Université de Yaoundé I',
      authorId: resourceData.authorId || null,
      authorMatricule: resourceData.authorMatricule || null,
      authorName: resourceData.authorName || 'Contributeur Académique',
      authorRole: resourceData.authorRole || 'delegate',
    };

    const updated = [newResource, ...list];
    storageService.set(STORAGE_KEYS.RESOURCES, updated);
    return newResource;
  },

  update(id, updates) {
    const list = this.getAll();
    let updatedItem = null;

    const updatedList = list.map((item) => {
      if (String(item.id) === String(id)) {
        updatedItem = {
          ...item,
          ...updates,
          updatedAt: new Date().toISOString().split('T')[0],
        };
        return updatedItem;
      }
      return item;
    });

    storageService.set(STORAGE_KEYS.RESOURCES, updatedList);
    return updatedItem;
  },

  delete(id) {
    const list = this.getAll();
    const filtered = list.filter((item) => String(item.id) !== String(id));
    storageService.set(STORAGE_KEYS.RESOURCES, filtered);
    return true;
  },

  incrementDownloads(id) {
    const list = this.getAll();
    let updatedItem = null;

    const updatedList = list.map((item) => {
      if (String(item.id) === String(id)) {
        updatedItem = {
          ...item,
          downloads: (item.downloads || 0) + 1,
        };
        return updatedItem;
      }
      return item;
    });

    storageService.set(STORAGE_KEYS.RESOURCES, updatedList);
    return updatedItem;
  },

  search({ query = '', filiere = '', niveau = '', tri = 'recent' } = {}) {
    const list = this.getAll();
    const lowerQuery = query.toLowerCase().trim();

    return list
      .filter((item) => {
        const matchesQuery =
          !lowerQuery ||
          item.titre.toLowerCase().includes(lowerQuery) ||
          item.description.toLowerCase().includes(lowerQuery) ||
          (item.codeUe && item.codeUe.toLowerCase().includes(lowerQuery)) ||
          (item.enseignant && item.enseignant.toLowerCase().includes(lowerQuery));

        const matchesFiliere = !filiere || item.filiere === filiere;
        const matchesNiveau = !niveau || item.niveau === niveau;

        return matchesQuery && matchesFiliere && matchesNiveau;
      })
      .sort((a, b) => {
        if (tri === 'popularite') {
          return (b.downloads || 0) - (a.downloads || 0);
        }
        if (tri === 'alpha') {
          return a.titre.localeCompare(b.titre);
        }
        // Par défaut: date / id descendant (plus récent en premier)
        return (b.id || 0) - (a.id || 0);
      });
  },
};
