import { useState, useMemo, useDeferredValue, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Star,
  Download,
  BookOpen,
  User,
  X,
  Eye,
} from 'lucide-react';
import SearchBar from '../components/search/SearchBar';
import FilterPanel from '../components/search/FilterPanel';
import Toast from '../components/common/Toast';
import EmptyState from '../components/common/EmptyState';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Pagination from '../components/common/Pagination';
import { useResources } from '../hooks/useResources';
import '../styles/SearchPage.css';

const ITEMS_PER_PAGE = 8;

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const deferredQuery = useDeferredValue(query);

  const [filters, setFilters] = useState({
    filiere: '',
    niveau: '',
    typeDoc: 'all',
    tri: 'date',
  });
  const [previewResource, setPreviewResource] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { resources, isFavorite, toggleFavorite, recordDownload } = useResources();

  const handleQueryChange = (val) => {
    if (val) {
      setSearchParams({ q: val }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  const handleClearQuery = () => {
    setSearchParams({}, { replace: true });
  };

  const handleResetFilters = () => {
    setFilters({ filiere: '', niveau: '', typeDoc: 'all', tri: 'date' });
    setSearchParams({}, { replace: true });
  };

  // Compute live counts by discipline and level for dynamic filters
  const { countsByFiliere, countsByNiveau } = useMemo(() => {
    const byFiliere = {};
    const byNiveau = {};

    resources.forEach((r) => {
      if (r.filiere) {
        byFiliere[r.filiere] = (byFiliere[r.filiere] || 0) + 1;
      }
      if (r.niveau) {
        byNiveau[r.niveau] = (byNiveau[r.niveau] || 0) + 1;
      }
    });

    return { countsByFiliere: byFiliere, countsByNiveau: byNiveau };
  }, [resources]);

  // Filter and sort resources intelligently with deferred query for non-blocking UI
  const filteredResults = useMemo(() => {
    const lowerQuery = deferredQuery.toLowerCase().trim();

    return resources
      .filter((item) => {
        // Multi-field intelligent matching
        const matchQuery =
          !lowerQuery ||
          item.titre?.toLowerCase().includes(lowerQuery) ||
          item.description?.toLowerCase().includes(lowerQuery) ||
          item.codeUe?.toLowerCase().includes(lowerQuery) ||
          item.enseignant?.toLowerCase().includes(lowerQuery) ||
          item.filiere?.toLowerCase().includes(lowerQuery) ||
          item.niveau?.toLowerCase().includes(lowerQuery);

        const matchFiliere = !filters.filiere || item.filiere === filters.filiere;
        const matchNiveau = !filters.niveau || item.niveau === filters.niveau;
        const matchType =
          !filters.typeDoc ||
          filters.typeDoc === 'all' ||
          item.typeDoc === filters.typeDoc;

        return matchQuery && matchFiliere && matchNiveau && matchType;
      })
      .sort((a, b) => {
        if (filters.tri === 'popularite') {
          return (b.downloads || 0) - (a.downloads || 0);
        }
        if (filters.tri === 'alpha') {
          return (a.titre || '').localeCompare(b.titre || '');
        }
        // Default: most recent
        return (b.id || 0) - (a.id || 0);
      });
  }, [resources, deferredQuery, filters]);

  // Auto-reset page on filter/search change without effect
  const filterKey = `${deferredQuery}-${filters.filiere}-${filters.niveau}-${filters.typeDoc}-${filters.tri}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setCurrentPage(1);
  }

  const totalPages = Math.ceil(filteredResults.length / ITEMS_PER_PAGE);
  const paginatedResults = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredResults.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredResults, currentPage]);

  const handleToggleFavorite = useCallback((res, e) => {
    if (e) e.stopPropagation();
    const result = toggleFavorite(res.id);
    setToastMessage({
      type: 'success',
      text: result.isFavorite
        ? `"${res.titre}" a été ajouté à vos favoris.`
        : `"${res.titre}" a été retiré des favoris.`,
    });
    setTimeout(() => setToastMessage(null), 3000);
  }, [toggleFavorite]);

  const handleDownload = useCallback((res, e) => {
    if (e) e.stopPropagation();
    recordDownload(res.id);
    setToastMessage({
      type: 'success',
      text: `Téléchargement de "${res.titre}" enregistré dans l'historique !`,
    });
    setTimeout(() => setToastMessage(null), 3500);
  }, [recordDownload]);

  // Term highlighter
  const highlightText = (text, term) => {
    if (!term || !text) return text;
    const parts = text.split(new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === term.toLowerCase() ? (
        <mark key={i} className="search-highlight">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="search-page-container">
      {/* Page Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Search size={28} color="var(--primary, #6366f1)" />
          <span>Recherche Globale & Filtres Intelligents</span>
        </h2>
        <p style={{ color: 'var(--text-muted, #64748b)', margin: 0, fontSize: '0.9375rem' }}>
          Moteur de recherche unifié : filtrez par niveau (L1, L2, L3, M1), discipline académique, enseignant ou code UE.
        </p>
      </div>

      {/* Main Search Input */}
      <SearchBar
        value={query}
        onChange={handleQueryChange}
        onClear={handleClearQuery}
        placeholder="Tapez un mot-clé (ex: L2, Informatique, Algorithmique, INF201, Maxwell)..."
      />

      {/* Dynamic Multi-Criteria Filters */}
      <FilterPanel
        filters={filters}
        onChange={setFilters}
        onReset={handleResetFilters}
        countsByFiliere={countsByFiliere}
        countsByNiveau={countsByNiveau}
        totalCount={resources.length}
      />

      {/* Toast Feedback */}
      {toastMessage && (
        <Toast
          message={toastMessage.text}
          type={toastMessage.type}
          onClose={() => setToastMessage(null)}
        />
      )}

      {/* Results Meta Row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          margin: '20px 0 14px 0',
          paddingBottom: '10px',
          borderBottom: '1px solid var(--border-subtle, #e2e8f0)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main, #0f172a)' }}>
            {filteredResults.length} ressource{filteredResults.length > 1 ? 's' : ''} trouvée{filteredResults.length > 1 ? 's' : ''}
          </span>

          {/* Active Filter Pills for Quick Removal */}
          {filters.niveau && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 8px',
                borderRadius: '999px',
                fontSize: '0.75rem',
                fontWeight: 600,
                background: 'rgba(99, 102, 241, 0.15)',
                color: 'var(--primary, #6366f1)',
              }}
            >
              Niveau: {filters.niveau}
              <X
                size={12}
                style={{ cursor: 'pointer' }}
                onClick={() => setFilters({ ...filters, niveau: '' })}
              />
            </span>
          )}

          {filters.filiere && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 8px',
                borderRadius: '999px',
                fontSize: '0.75rem',
                fontWeight: 600,
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
              }}
            >
              Filière: {filters.filiere}
              <X
                size={12}
                style={{ cursor: 'pointer' }}
                onClick={() => setFilters({ ...filters, filiere: '' })}
              />
            </span>
          )}

          {query && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 8px',
                borderRadius: '999px',
                fontSize: '0.75rem',
                fontWeight: 600,
                background: 'rgba(245, 158, 11, 0.15)',
                color: '#d97706',
              }}
            >
              Mot-clé: "{query}"
              <X size={12} style={{ cursor: 'pointer' }} onClick={handleClearQuery} />
            </span>
          )}
        </div>

        {(query || filters.filiere || filters.niveau || filters.typeDoc !== 'all') && (
          <button
            type="button"
            onClick={handleResetFilters}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary, #6366f1)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Effacer tous les critères
          </button>
        )}
      </div>

      {/* Results Grid */}
      <div className="results-container">
        {filteredResults.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="Aucune ressource ne correspond à vos critères"
            description="Essayez de réinitialiser vos filtres par filière ou d'ajuster le mot-clé recherché."
            actionLabel="Réinitialiser tous les filtres"
            onAction={handleResetFilters}
          />
        ) : (
          paginatedResults.map((res) => {
            const favorited = isFavorite(res.id);
            return (
              <div
                key={res.id}
                className="resource-card"
                onClick={() => setPreviewResource(res)}
                style={{ cursor: 'pointer' }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <Badge type="filiere" value={res.filiere} size="sm" />
                      <Badge type="niveau" value={res.niveau} size="sm" />
                      {res.codeUe && (
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '2px 6px',
                            background: 'var(--bg-subtle, #f1f5f9)',
                            color: 'var(--primary, #6366f1)',
                            borderRadius: '4px',
                            border: '1px solid var(--border-subtle, #e2e8f0)',
                          }}
                        >
                          {res.codeUe}
                        </span>
                      )}
                    </div>
                  </div>

                  <h3>{highlightText(res.titre, query)}</h3>

                  <p>{highlightText(res.description, query)}</p>
                </div>

                <div>
                  <div className="resource-card-meta">
                    {res.enseignant && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <User size={13} /> {res.enseignant}
                      </span>
                    )}
                    {res.pages && <span>· {res.pages} pages</span>}
                    {res.downloads !== undefined && (
                      <span>· {res.downloads} téléchargements</span>
                    )}
                  </div>

                  <div className="card-actions">
                    <button
                      type="button"
                      onClick={(e) => handleToggleFavorite(res, e)}
                      className="btn-action"
                      style={{
                        backgroundColor: favorited ? 'rgba(245, 158, 11, 0.15)' : undefined,
                        borderColor: favorited ? '#f59e0b' : undefined,
                        color: favorited ? '#d97706' : undefined,
                      }}
                      title={favorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                    >
                      <Star
                        size={18}
                        fill={favorited ? '#f59e0b' : 'none'}
                        color={favorited ? '#f59e0b' : 'currentColor'}
                      />
                      
                    </button>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewResource(res);
                        }}
                        className="btn-action"
                        title="Aperçu rapide"
                      >
                        <Eye size={18} />
                        
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleDownload(res, e)}
                        className="btn-action"
                        style={{
                          backgroundColor: 'var(--primary, #6366f1)',
                          borderColor: 'var(--primary, #6366f1)',
                          color: '#ffffff',
                        }}
                      >
                        <Download size={18} />
                        
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Controls */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredResults.length}
        pageSize={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
      />

      {/* Document Quick Preview Modal */}
      {previewResource && (
        <div
          className="preview-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPreviewResource(null);
          }}
        >
          <div className="preview-modal">
            <div className="preview-modal__header">
              <div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <Badge type="filiere" value={previewResource.filiere} />
                  <Badge type="niveau" value={previewResource.niveau} />
                  {previewResource.codeUe && (
                    <span
                      style={{
                        fontSize: '0.8125rem',
                        fontWeight: 700,
                        padding: '4px 8px',
                        background: 'rgba(99, 102, 241, 0.1)',
                        color: 'var(--primary, #6366f1)',
                        borderRadius: '6px',
                      }}
                    >
                      {previewResource.codeUe}
                    </span>
                  )}
                </div>
                <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main, #0f172a)' }}>
                  {previewResource.titre}
                </h3>
              </div>

              <button
                type="button"
                className="preview-modal__close"
                onClick={() => setPreviewResource(null)}
                aria-label="Fermer la prévisualisation"
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted, #64748b)', margin: '0 0 6px 0' }}>
                Description pédagogique
              </h4>
              <p style={{ margin: 0, lineHeight: 1.6, fontSize: '0.95rem', color: 'var(--text-main, #334155)' }}>
                {previewResource.description || 'Aucun résumé détaillé fourni pour ce document académique.'}
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '12px',
                padding: '16px',
                background: 'var(--bg-subtle, #f8fafc)',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle, #e2e8f0)',
                marginBottom: '24px',
              }}
            >
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)', display: 'block' }}>
                  Enseignant
                </span>
                <strong style={{ fontSize: '0.875rem', color: 'var(--text-main, #0f172a)' }}>
                  {previewResource.enseignant || 'Faculté des Sciences'}
                </strong>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)', display: 'block' }}>
                  Volume du document
                </span>
                <strong style={{ fontSize: '0.875rem', color: 'var(--text-main, #0f172a)' }}>
                  {previewResource.pages || 32} pages (PDF)
                </strong>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)', display: 'block' }}>
                  Consultations
                </span>
                <strong style={{ fontSize: '0.875rem', color: 'var(--text-main, #0f172a)' }}>
                  {previewResource.downloads || 0} téléchargements
                </strong>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)', display: 'block' }}>
                  Mise à jour
                </span>
                <strong style={{ fontSize: '0.875rem', color: 'var(--text-main, #0f172a)' }}>
                  {previewResource.updatedAt || 'Mars 2026'}
                </strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <Button
                variant={isFavorite(previewResource.id) ? 'secondary' : 'outline'}
                icon={Star}
                onClick={(e) => handleToggleFavorite(previewResource, e)}
              >
                {isFavorite(previewResource.id) ? 'Enregistré dans les favoris' : 'Épingler aux favoris'}
              </Button>

              <Button
                variant="primary"
                icon={Download}
                onClick={(e) => {
                  handleDownload(previewResource, e);
                  setPreviewResource(null);
                }}
              >
                Télécharger le cours complet
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}