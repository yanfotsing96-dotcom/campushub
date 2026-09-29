import {
  Code2,
  Calculator,
  Atom,
  FlaskConical,
  Dna,
  BookOpen,
  GraduationCap,
  Layers,
  ArrowUpDown,
  RotateCcw,
} from 'lucide-react';
import {
  ACADEMIC_FACULTIES,
  ACADEMIC_LEVELS,
  DOCUMENT_TYPES,
} from '../../constants/academicConstants';

const FACULTY_ICONS = {
  Informatique: Code2,
  Mathématiques: Calculator,
  Physique: Atom,
  Chimie: FlaskConical,
  Biologie: Dna,
};

export default function FilterPanel({
  filters,
  onChange,
  onReset,
  countsByFiliere = {},
  countsByNiveau = {},
  totalCount = 0,
}) {
  const isAnyFilterActive =
    Boolean(filters.filiere) ||
    Boolean(filters.niveau) ||
    (filters.typeDoc && filters.typeDoc !== 'all') ||
    (filters.tri && filters.tri !== 'date');

  const handleFiliereClick = (filiereId) => {
    onChange({
      ...filters,
      filiere: filters.filiere === filiereId ? '' : filiereId,
    });
  };

  const handleNiveauClick = (niveauId) => {
    onChange({
      ...filters,
      niveau: filters.niveau === niveauId ? '' : niveauId,
    });
  };

  return (
    <div className="filter-panel">
      {/* 1. Filter by Level (Niveau L1, L2, L3, M1, M2) */}
      <div>
        <div className="filter-section-title">
          <GraduationCap size={15} />
          <span>Niveau d'études</span>
        </div>
        <div className="filter-chips-row">
          <button
            type="button"
            className={`filter-chip ${!filters.niveau ? 'active' : ''}`}
            onClick={() => onChange({ ...filters, niveau: '' })}
          >
            <span>Tous</span>
            <span className="filter-chip__count">{totalCount}</span>
          </button>
          {ACADEMIC_LEVELS.map((lvl) => {
            const count = countsByNiveau[lvl.id] || 0;
            const isActive = filters.niveau === lvl.id;
            return (
              <button
                key={lvl.id}
                type="button"
                className={`filter-chip ${isActive ? 'active' : ''}`}
                onClick={() => handleNiveauClick(lvl.id)}
              >
                <span>{lvl.id}</span>
                <span className="filter-chip__count">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Filter by Faculty / Discipline */}
      <div>
        <div className="filter-section-title">
          <Layers size={15} />
          <span>Filière & Département</span>
        </div>
        <div className="filter-chips-row">
          <button
            type="button"
            className={`filter-chip ${!filters.filiere ? 'active' : ''}`}
            onClick={() => onChange({ ...filters, filiere: '' })}
          >
            <BookOpen size={14} />
            <span>Toutes les filières</span>
            <span className="filter-chip__count">{totalCount}</span>
          </button>
          {ACADEMIC_FACULTIES.map((fac) => {
            const Icon = FACULTY_ICONS[fac.id] || BookOpen;
            const count = countsByFiliere[fac.id] || 0;
            const isActive = filters.filiere === fac.id;
            return (
              <button
                key={fac.id}
                type="button"
                className={`filter-chip ${isActive ? 'active' : ''}`}
                onClick={() => handleFiliereClick(fac.id)}
              >
                <Icon size={14} />
                <span>{fac.label}</span>
                <span className="filter-chip__count">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Secondary Controls Row: Document Type & Sorting */}
      <div className="filter-controls-row">
        {/* Document Type Selector */}
        <div className="filter-select-group">
          <label htmlFor="filter-type-doc">Type :</label>
          <select
            id="filter-type-doc"
            className="filter-select"
            value={filters.typeDoc || 'all'}
            onChange={(e) => onChange({ ...filters, typeDoc: e.target.value })}
          >
            {DOCUMENT_TYPES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sorting Selector */}
        <div className="filter-select-group">
          <ArrowUpDown size={15} color="var(--text-muted, #64748b)" />
          <label htmlFor="filter-sort">Trier par :</label>
          <select
            id="filter-sort"
            className="filter-select"
            value={filters.tri || 'date'}
            onChange={(e) => onChange({ ...filters, tri: e.target.value })}
          >
            <option value="date">Plus récents</option>
            <option value="popularite">Plus populaires (téléchargements)</option>
            <option value="alpha">Titre (A à Z)</option>
          </select>
        </div>

        {/* Reset button if any filter is active */}
        {isAnyFilterActive && (
          <button
            type="button"
            onClick={onReset}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary, #6366f1)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 10px',
              borderRadius: '6px',
            }}
          >
            <RotateCcw size={14} />
            <span>Réinitialiser les filtres</span>
          </button>
        )}
      </div>
    </div>
  );
}
