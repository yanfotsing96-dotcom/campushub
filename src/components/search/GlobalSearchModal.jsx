import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  X,
  BookOpen,
  BookMarked,
  ArrowRight,
} from 'lucide-react';
import { useResources } from '../../hooks/useResources';
import { notebookService } from '../../services/notebookService';

export default function GlobalSearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all'); // 'all' | 'courses' | 'notes'
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const { resources, recordDownload } = useResources();

  const notes = useMemo(() => {
    return isOpen ? notebookService.getNotes() : [];
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Handle global ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filter matching resources memoized
  const matchedResources = useMemo(() => {
    if (!isOpen) return [];
    const lowerQuery = query.toLowerCase().trim();
    if (!lowerQuery) return resources;
    return resources.filter((item) => {
      return (
        item.titre?.toLowerCase().includes(lowerQuery) ||
        item.codeUe?.toLowerCase().includes(lowerQuery) ||
        item.filiere?.toLowerCase().includes(lowerQuery) ||
        item.niveau?.toLowerCase().includes(lowerQuery) ||
        item.enseignant?.toLowerCase().includes(lowerQuery) ||
        item.description?.toLowerCase().includes(lowerQuery)
      );
    });
  }, [isOpen, query, resources]);

  // Filter matching notes memoized
  const matchedNotes = useMemo(() => {
    if (!isOpen) return [];
    const lowerQuery = query.toLowerCase().trim();
    if (!lowerQuery) return notes;
    return notes.filter((item) => {
      return (
        item.title?.toLowerCase().includes(lowerQuery) ||
        item.content?.toLowerCase().includes(lowerQuery)
      );
    });
  }, [isOpen, query, notes]);

  // Filter matching results memoized
  const filteredItems = useMemo(() => {
    const items = [];
    if (activeCategory === 'all' || activeCategory === 'courses') {
      matchedResources.slice(0, 8).forEach((r) => {
        items.push({ type: 'course', data: r });
      });
    }
    if (activeCategory === 'all' || activeCategory === 'notes') {
      matchedNotes.slice(0, 5).forEach((n) => {
        items.push({ type: 'note', data: n });
      });
    }
    return items;
  }, [matchedResources, matchedNotes, activeCategory]);

  const handleSelect = useCallback((item) => {
    if (!item) return;
    onClose();
    if (item.type === 'course') {
      recordDownload(item.data.id);
      navigate(`/search?q=${encodeURIComponent(item.data.titre)}`);
    } else {
      navigate('/notebook');
    }
  }, [onClose, recordDownload, navigate]);

  const handleViewAllResults = useCallback(() => {
    onClose();
    navigate(`/search?q=${encodeURIComponent(query)}`);
  }, [onClose, navigate, query]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(5px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '60px 16px 20px',
        animation: 'fadeIn 0.18s ease-out',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '640px',
          backgroundColor: 'var(--bg-surface, #ffffff)',
          color: 'var(--text-main, #0f172a)',
          borderRadius: '16px',
          border: '1px solid var(--border-subtle, #e2e8f0)',
          boxShadow: 'var(--shadow-xl, 0 20px 25px -5px rgba(0, 0, 0, 0.5))',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '80vh',
        }}
      >
        {/* Search Bar Input */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-subtle, #e2e8f0)',
            gap: '12px',
          }}
        >
          <Search size={22} color="var(--primary, #6366f1)" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher par cours, filière, niveau (ex: L2, Informatique, INF201)..."
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              fontSize: '1rem',
              color: 'var(--text-main, #0f172a)',
              outline: 'none',
              fontFamily: 'inherit',
            }}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted, #64748b)',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              <X size={18} />
            </button>
          )}
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: '6px',
              background: 'var(--bg-subtle, #f1f5f9)',
              color: 'var(--text-muted, #64748b)',
              border: '1px solid var(--border-subtle, #e2e8f0)',
            }}
          >
            ESC
          </span>
        </div>

        {/* Category Filter Chips */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            background: 'var(--bg-subtle, #f8fafc)',
            borderBottom: '1px solid var(--border-subtle, #e2e8f0)',
            fontSize: '0.8125rem',
          }}
        >
          <span style={{ color: 'var(--text-muted, #64748b)', fontWeight: 600, marginRight: '4px' }}>
            Portée :
          </span>
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            style={{
              padding: '4px 10px',
              borderRadius: '999px',
              border: '1px solid transparent',
              background: activeCategory === 'all' ? 'var(--primary, #6366f1)' : 'transparent',
              color: activeCategory === 'all' ? '#ffffff' : 'var(--text-main, #0f172a)',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            Tout ({matchedResources.length + matchedNotes.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('courses')}
            style={{
              padding: '4px 10px',
              borderRadius: '999px',
              border: '1px solid transparent',
              background: activeCategory === 'courses' ? 'var(--primary, #6366f1)' : 'transparent',
              color: activeCategory === 'courses' ? '#ffffff' : 'var(--text-main, #0f172a)',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            Ressources & Cours ({matchedResources.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('notes')}
            style={{
              padding: '4px 10px',
              borderRadius: '999px',
              border: '1px solid transparent',
              background: activeCategory === 'notes' ? 'var(--primary, #6366f1)' : 'transparent',
              color: activeCategory === 'notes' ? '#ffffff' : 'var(--text-main, #0f172a)',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            Carnet Privé ({matchedNotes.length})
          </button>
        </div>

        {/* Results List */}
        <div style={{ overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {filteredItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 12px', color: 'var(--text-muted, #64748b)' }}>
              <p style={{ margin: '0 0 6px 0', fontWeight: 600 }}>Aucun résultat trouvé pour "{query}"</p>
              <p style={{ margin: 0, fontSize: '0.85rem' }}>
                Essayez d'autres mots-clés, comme "Informatique", "L2", "Maxwell" ou "Mathématiques".
              </p>
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              if (item.type === 'course') {
                const res = item.data;
                return (
                  <div
                    key={'res_' + res.id}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      backgroundColor: isSelected ? 'var(--bg-subtle, #f1f5f9)' : 'transparent',
                      border: '1px solid',
                      borderColor: isSelected ? 'var(--border-subtle, #cbd5e1)' : 'transparent',
                      transition: 'all 0.12s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(99, 102, 241, 0.1)',
                          color: 'var(--primary, #6366f1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <BookOpen size={18} />
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: '0.92rem',
                            color: 'var(--text-main, #0f172a)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {res.titre}
                        </div>
                        <div
                          style={{
                            fontSize: '0.78rem',
                            color: 'var(--text-muted, #64748b)',
                            display: 'flex',
                            gap: '8px',
                            alignItems: 'center',
                          }}
                        >
                          <span style={{ fontWeight: 600, color: 'var(--primary, #6366f1)' }}>
                            {res.codeUe || res.filiere}
                          </span>
                          <span>·</span>
                          <span>{res.filiere}</span>
                          <span>·</span>
                          <span>Niveau {res.niveau}</span>
                        </div>
                      </div>
                    </div>

                    <ArrowRight size={16} color="var(--text-muted, #94a3b8)" style={{ flexShrink: 0, marginLeft: '12px' }} />
                  </div>
                );
              }

              // Note item
              const note = item.data;
              return (
                <div
                  key={'note_' + note.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? 'var(--bg-subtle, #f1f5f9)' : 'transparent',
                    border: '1px solid',
                    borderColor: isSelected ? 'var(--border-subtle, #cbd5e1)' : 'transparent',
                    transition: 'all 0.12s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        color: '#10b981',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <BookMarked size={18} />
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: '0.92rem',
                          color: 'var(--text-main, #0f172a)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {note.title || 'Note personnelle'}
                      </div>
                      <div
                        style={{
                          fontSize: '0.78rem',
                          color: 'var(--text-muted, #64748b)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {note.content}
                      </div>
                    </div>
                  </div>

                  <ArrowRight size={16} color="var(--text-muted, #94a3b8)" style={{ flexShrink: 0, marginLeft: '12px' }} />
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer with Shortcuts */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 20px',
            background: 'var(--bg-subtle, #f8fafc)',
            borderTop: '1px solid var(--border-subtle, #e2e8f0)',
            fontSize: '0.78rem',
            color: 'var(--text-muted, #64748b)',
          }}
        >
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span>Navigation rapide</span>
            <span>·</span>
            <span>Entrée pour ouvrir</span>
          </div>

          {query && (
            <button
              type="button"
              onClick={handleViewAllResults}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary, #6366f1)',
                fontWeight: 600,
                fontSize: '0.8125rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span>Voir tous les résultats sur la page recherche</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
