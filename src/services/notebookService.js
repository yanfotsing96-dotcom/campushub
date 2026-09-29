import { storageService } from './storageService';
import { STORAGE_KEYS, DEFAULT_NOTES } from '../constants/academicConstants';

export const notebookService = {
  getNotes() {
    const notes = storageService.get(STORAGE_KEYS.NOTES, null);
    if (!notes || !Array.isArray(notes)) {
      storageService.set(STORAGE_KEYS.NOTES, DEFAULT_NOTES);
      return [...DEFAULT_NOTES];
    }
    return notes;
  },

  create(noteData) {
    const notes = this.getNotes();
    const newNote = {
      id: Date.now(),
      title: noteData.title?.trim() || 'Note du ' + new Date().toLocaleDateString('fr-FR'),
      content: noteData.content.trim(),
      createdAt: new Date().toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      category: noteData.category || 'Général',
    };

    const updated = [newNote, ...notes];
    storageService.set(STORAGE_KEYS.NOTES, updated);
    return newNote;
  },

  update(id, updates) {
    const notes = this.getNotes();
    let updatedNote = null;

    const updated = notes.map((n) => {
      if (String(n.id) === String(id)) {
        updatedNote = {
          ...n,
          ...updates,
          updatedAt: new Date().toLocaleDateString('fr-FR'),
        };
        return updatedNote;
      }
      return n;
    });

    storageService.set(STORAGE_KEYS.NOTES, updated);
    return updatedNote;
  },

  delete(id) {
    const notes = this.getNotes();
    const filtered = notes.filter((n) => String(n.id) !== String(id));
    storageService.set(STORAGE_KEYS.NOTES, filtered);
    return true;
  },
};
