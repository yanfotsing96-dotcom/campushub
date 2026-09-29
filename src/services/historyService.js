import { storageService } from './storageService';
import { STORAGE_KEYS } from '../constants/academicConstants';

export const historyService = {
  getHistory() {
    const list = storageService.get(STORAGE_KEYS.HISTORY, []);
    return Array.isArray(list) ? list : [];
  },

  recordConsultation(resourceId) {
    const list = this.getHistory();
    const idNum = Number(resourceId) || resourceId;

    const newEntry = {
      id: idNum,
      timestamp: Date.now(),
      date: new Date().toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      time: new Date().toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    // Keep unique recent entries (move existing to top or add new)
    const filtered = list.filter((item) => String(item.id) !== String(idNum));
    const updated = [newEntry, ...filtered].slice(0, 50); // limit to 50 entries

    storageService.set(STORAGE_KEYS.HISTORY, updated);
    return updated;
  },

  clear() {
    storageService.set(STORAGE_KEYS.HISTORY, []);
    return [];
  },
};
