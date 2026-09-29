import { storageService } from './storageService';
import { STORAGE_KEYS } from '../constants/academicConstants';

export const favoritesService = {
  getFavoriteIds() {
    const favs = storageService.get(STORAGE_KEYS.FAVORITES, []);
    return Array.isArray(favs) ? favs : [];
  },

  isFavorite(resourceId) {
    const favs = this.getFavoriteIds();
    return favs.some((id) => String(id) === String(resourceId));
  },

  toggle(resourceId) {
    const favs = this.getFavoriteIds();
    const idStr = Number(resourceId) || resourceId;
    const isNowFavorite = !favs.includes(idStr);
    const updated = isNowFavorite
      ? [idStr, ...favs]
      : favs.filter((id) => id !== idStr);

    storageService.set(STORAGE_KEYS.FAVORITES, updated);
    return { isFavorite: isNowFavorite, favorites: updated };
  },

  add(resourceId) {
    const favs = this.getFavoriteIds();
    const idNum = Number(resourceId) || resourceId;
    if (!favs.includes(idNum)) {
      const updated = [idNum, ...favs];
      storageService.set(STORAGE_KEYS.FAVORITES, updated);
      return updated;
    }
    return favs;
  },

  remove(resourceId) {
    const favs = this.getFavoriteIds();
    const idNum = Number(resourceId) || resourceId;
    const updated = favs.filter((id) => id !== idNum);
    storageService.set(STORAGE_KEYS.FAVORITES, updated);
    return updated;
  },

  clear() {
    storageService.set(STORAGE_KEYS.FAVORITES, []);
    return [];
  },
};
