import { useState } from 'react';
import {
  BookMarked,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  FileText,
  Clock,
} from 'lucide-react';
import { notebookService } from '../../services/notebookService';
import Button from '../common/Button';
import EmptyState from '../common/EmptyState';
import Toast from '../common/Toast';

export default function PrivateNotebook() {
  const [notes, setNotes] = useState(() => notebookService.getNotes());
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const handleSave = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (editingId !== null) {
      notebookService.update(editingId, {
        title: title.trim() || 'Note',
        content: content.trim(),
      });
      setToastMessage('Note mise à jour avec succès.');
      setEditingId(null);
    } else {
      notebookService.create({
        title: title.trim(),
        content: content.trim(),
      });
      setToastMessage('Nouvelle note enregistrée dans votre carnet.');
    }

    setNotes(notebookService.getNotes());
    setTitle('');
    setContent('');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleEdit = (note) => {
    setTitle(note.title || '');
    setContent(note.content || '');
    setEditingId(note.id);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
  };

  const handleDelete = (id) => {
    notebookService.delete(id);
    setNotes(notebookService.getNotes());
    if (editingId === id) {
      handleCancelEdit();
    }
    setToastMessage('Note supprimée.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="notebook-container" style={{ maxWidth: '780px', margin: '32px auto', padding: '0 16px' }}>
      {toastMessage && (
        <Toast
          message={toastMessage}
          type="info"
          onClose={() => setToastMessage(null)}
        />
      )}

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <BookMarked size={28} color="#6366f1" /> Mon Carnet Privé
        </h2>
        <p style={{ color: 'var(--rc-text-secondary, #64748b)', margin: 0, fontSize: '0.9375rem' }}>
          Espace sécurisé hors-ligne pour consigner vos brouillons, résumés de révision et mémos de cours.
        </p>
      </div>

      {/* Note Editor Form */}
      <form
        onSubmit={handleSave}
        style={{
          background: 'var(--rc-bg-surface, #ffffff)',
          borderRadius: '16px',
          border: '1px solid var(--rc-border, #e2e8f0)',
          padding: '24px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)',
          marginBottom: '28px',
        }}
      >
        <h3 style={{ margin: '0 0 16px 0', fontSize: '1.125rem', fontWeight: 700, color: 'var(--rc-text-primary, #1e293b)' }}>
          {editingId !== null ? 'Modifier la note' : 'Rédiger une nouvelle note'}
        </h3>

        <div style={{ marginBottom: '12px' }}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre de la note ou sujet (optionnel)..."
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid var(--rc-border, #cbd5e1)',
              fontFamily: 'inherit',
              fontSize: '0.9375rem',
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Formules mathématiques, définitions, rappels de TP..."
            rows={4}
            required
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: '8px',
              border: '1px solid var(--rc-border, #cbd5e1)',
              fontFamily: 'inherit',
              fontSize: '0.9375rem',
              resize: 'vertical',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          {editingId !== null && (
            <Button variant="outline" icon={X} onClick={handleCancelEdit}>
              Annuler
            </Button>
          )}
          <Button type="submit" variant="primary" icon={editingId !== null ? Check : Plus}>
            {editingId !== null ? 'Mettre à jour' : 'Enregistrer la note'}
          </Button>
        </div>
      </form>

      {/* Notes List */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: 'var(--rc-text-primary, #1e293b)' }}>
            Notes enregistrées ({notes.length})
          </h3>
        </div>

        {notes.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="Votre carnet est vide pour le moment"
            description="Utilisez le formulaire ci-dessus pour ajouter votre premier brouillon ou mémo de révision."
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {notes.map((note) => (
              <div
                key={note.id}
                style={{
                  background: 'var(--rc-bg-surface, #ffffff)',
                  border: '1px solid var(--rc-border, #e2e8f0)',
                  borderRadius: '14px',
                  padding: '18px 20px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '8px' }}>
                  <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--rc-text-primary, #1e293b)' }}>
                    {note.title || 'Note sans titre'}
                  </h4>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => handleEdit(note)}
                      title="Modifier cette note"
                      style={{
                        padding: '6px 10px',
                        background: 'rgba(99, 102, 241, 0.1)',
                        border: 'none',
                        borderRadius: '6px',
                        color: '#6366f1',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                      }}
                    >
                      <Pencil size={13} /> Modifier
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(note.id)}
                      title="Supprimer cette note"
                      style={{
                        padding: '6px 10px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: 'none',
                        borderRadius: '6px',
                        color: '#ef4444',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <p style={{ margin: '0 0 12px 0', fontSize: '0.9375rem', lineHeight: 1.5, color: 'var(--rc-text-primary, #334155)', whiteSpace: 'pre-wrap' }}>
                  {note.content}
                </p>

                {note.createdAt && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--rc-text-secondary, #94a3b8)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> Créée le {note.createdAt}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}