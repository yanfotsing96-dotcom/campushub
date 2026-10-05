import { useState, useMemo } from 'react';
import {
  BookOpen,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Search,
  GraduationCap,
  Layers,
  FileText,
  Library,
  Sparkles
} from 'lucide-react';
import '../styles/ResourceCrud.css';

import { useResources } from '../hooks/useResources';

function ResourceCrud() {
  const { resources, addResource, updateResource, deleteResource } = useResources();

  const [formData, setFormData] = useState({
    titre: '',
    filiere: 'Informatique',
    niveau: 'L1',
    description: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFiliere, setFilterFiliere] = useState('all');
  const [filterNiveau, setFilterNiveau] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.titre.trim()) return;

    if (editingId !== null) {
      updateResource(editingId, {
        ...formData,
        titre: formData.titre.trim(),
      });
      setEditingId(null);
    } else {
      addResource({
        ...formData,
        titre: formData.titre.trim(),
      });
    }

    setFormData({ titre: '', filiere: 'Informatique', niveau: 'L1', description: '' });
  };

  const handleEdit = (res) => {
    setEditingId(res.id);
    setFormData({
      titre: res.titre,
      filiere: res.filiere,
      niveau: res.niveau,
      description: res.description || ''
    });
    const formElement = document.querySelector('.crud-form-card');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ titre: '', filiere: 'Informatique', niveau: 'L1', description: '' });
  };

  const handleDelete = (id) => {
    deleteResource(id);
    if (editingId === id) {
      handleCancelEdit();
    }
    setConfirmDeleteId(null);
  };

  // Filtrage et tri mémorisés
  const filteredResources = useMemo(() => {
    return resources
      .filter((res) => {
        const matchesSearch =
          res.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (res.description && res.description.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesFiliere = filterFiliere === 'all' || res.filiere === filterFiliere;
        const matchesNiveau = filterNiveau === 'all' || res.niveau === filterNiveau;
        return matchesSearch && matchesFiliere && matchesNiveau;
      })
      .sort((a, b) => {
        if (sortBy === 'title') {
          return a.titre.localeCompare(b.titre);
        }
        return b.id - a.id;
      });
  }, [resources, searchQuery, filterFiliere, filterNiveau, sortBy]);

  // Statistiques calculées
  const stats = useMemo(() => {
    const filieres = new Set(resources.map((r) => r.filiere));
    const niveaux = new Set(resources.map((r) => r.niveau));
    return {
      total: resources.length,
      filieresCount: filieres.size,
      niveauxCount: niveaux.size
    };
  }, [resources]);

  return (
    <div className="crud-container">
      {/* En-tête principal */}
      <header className="crud-header">
        <div className="crud-title-group">
          <h2>
            <Library className="crud-title-icon" size={26} />
            Gestion des Ressources Pédagogiques
          </h2>
          <p className="crud-subtitle">
            Centralisez, mettez à jour et organisez les supports de cours universitaires.
          </p>
        </div>
      </header>

      {/* Cartes d'indicateurs rapides */}
      <section className="crud-stats-row">
        <div className="crud-stat-card">
          <div className="crud-stat-icon-wrapper">
            <BookOpen size={20} />
          </div>
          <div className="crud-stat-info">
            <span className="crud-stat-value">{stats.total}</span>
            <span className="crud-stat-label">Ressources répertoriées</span>
          </div>
        </div>

        <div className="crud-stat-card">
          <div className="crud-stat-icon-wrapper">
            <Layers size={20} />
          </div>
          <div className="crud-stat-info">
            <span className="crud-stat-value">{stats.filieresCount}</span>
            <span className="crud-stat-label">Filières actives</span>
          </div>
        </div>

        <div className="crud-stat-card">
          <div className="crud-stat-icon-wrapper">
            <GraduationCap size={20} />
          </div>
          <div className="crud-stat-info">
            <span className="crud-stat-value">{stats.niveauxCount}</span>
            <span className="crud-stat-label">Niveaux d'études</span>
          </div>
        </div>
      </section>

      {/* Formulaire de création / modification */}
      <div className={`crud-form-card ${editingId !== null ? 'editing' : ''}`}>
        <div className="form-header-row">
          <h3>
            {editingId !== null ? (
              <>
                <Pencil size={18} className="form-label-icon" />
                Modifier la ressource
              </>
            ) : (
              <>
                <Plus size={18} className="form-label-icon" />
                Ajouter une nouvelle ressource
              </>
            )}
          </h3>
          {editingId !== null && (
            <span className="form-badge-mode">Mode Édition</span>
          )}
        </div>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label htmlFor="titre">
              <FileText size={15} className="form-label-icon" />
              Titre du cours ou document :
            </label>
            <div className="input-with-icon">
              <BookOpen size={16} className="input-prefix-icon" />
              <input
                id="titre"
                type="text"
                name="titre"
                value={formData.titre}
                onChange={handleChange}
                placeholder="Ex: Programmation Web Avancée (React & Node.js)"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="filiere">
                <Layers size={15} className="form-label-icon" />
                Filière académique :
              </label>
              <select
                id="filiere"
                name="filiere"
                value={formData.filiere}
                onChange={handleChange}
              >
                <option value="Informatique">Informatique</option>
                <option value="Mathématiques">Mathématiques</option>
                <option value="Physique">Physique</option>
                <option value="Chimie">Chimie</option>
                <option value="Biologie">Biologie</option>
                <option value="Économie">Économie</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="niveau">
                <GraduationCap size={15} className="form-label-icon" />
                Niveau d'études :
              </label>
              <select
                id="niveau"
                name="niveau"
                value={formData.niveau}
                onChange={handleChange}
              >
                <option value="L1">Licence 1 (L1)</option>
                <option value="L2">Licence 2 (L2)</option>
                <option value="L3">Licence 3 (L3)</option>
                <option value="M1">Master 1 (M1)</option>
                <option value="M2">Master 2 (M2)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">
              <FileText size={15} className="form-label-icon" />
              Description & Objectifs :
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Ex: Contenu du cours, chapitres clés, références bibliographiques ou prérequis..."
              rows={3}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {editingId !== null ? (
                <>
                  <Check size={16} /> Mettre à jour
                </>
              ) : (
                <>
                  <Plus size={16} /> Ajouter la ressource
                </>
              )}
            </button>

            {editingId !== null && (
              <button
                type="button"
                className="btn-secondary"
                onClick={handleCancelEdit}
              >
                <X size={15} /> Annuler
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Barre d'outils et recherche de la liste */}
      <section className="crud-list-section">
        <div className="section-toolbar">
          <div className="section-toolbar-left">
            <h3>
              Ressources disponibles
              <span className="count-pill">{filteredResources.length}</span>
            </h3>
          </div>

          <div className="section-toolbar-right">
            <div className="search-box">
              <Search size={15} className="search-box-icon" />
              <input
                type="text"
                placeholder="Filtrer les cours..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              className="filter-select"
              value={filterFiliere}
              onChange={(e) => setFilterFiliere(e.target.value)}
              aria-label="Filtrer par filière"
            >
              <option value="all">Toutes les filières</option>
              <option value="Informatique">Informatique & Génie Logiciel (Tech)</option>
              <option value="IA-Data">IA & Data Science (Tech)</option>
              <option value="Cyber-Reseaux">Systèmes, Réseaux & Cyber (Tech)</option>
              <option value="Mathématiques">Mathématiques & Modélisation</option>
              <option value="Physique">Physique & Électronique</option>
              <option value="Chimie">Chimie & Matériaux</option>
              <option value="Biologie">Biosciences & Santé</option>
              <option value="Genie-Civil">Génie Civil & Environnement</option>
            </select>

            <select
              className="filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Trier la liste"
            >
              <option value="recent">Plus récent</option>
              <option value="title">Titre (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Liste des ressources ou état vide */}
        {filteredResources.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Sparkles size={28} />
            </div>
            <h4>Aucune ressource trouvée</h4>
            <p>
              {searchQuery || filterFiliere !== 'all' || filterNiveau !== 'all'
                ? 'Aucun résultat ne correspond à vos filtres actuels. Réinitialisez la recherche pour afficher la totalité des ressources.'
                : 'Votre catalogue est vide. Utilisez le formulaire ci-dessus pour ajouter votre premier cours ou document.'}
            </p>
            {(searchQuery || filterFiliere !== 'all') && (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setSearchQuery('');
                  setFilterFiliere('all');
                  setFilterNiveau('all');
                }}
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
        ) : (
          <ul className="crud-list">
            {filteredResources.map((res) => {
              const isBeingEdited = editingId === res.id;
              const isConfirmingDelete = confirmDeleteId === res.id;

              return (
                <li
                  key={res.id}
                  className={`crud-item-card ${isBeingEdited ? 'is-active-edit' : ''}`}
                >
                  <div className="crud-item-content">
                    <div className="crud-item-title-row">
                      <h4 className="crud-item-title">{res.titre}</h4>
                    </div>

                    {/* Zero-Pill Typography Metadata avec séparateurs typographiques */}
                    <div className="crud-item-meta">
                      <span className="meta-field">{res.filiere}</span>
                      <span className="meta-separator" aria-hidden="true">·</span>
                      <span className="meta-field">{res.niveau}</span>
                      {res.universityName && (
                        <>
                          <span className="meta-separator" aria-hidden="true">·</span>
                          <span className="meta-field font-semibold text-indigo-600 dark:text-indigo-400">
                            🏛️ {res.universityName}
                          </span>
                        </>
                      )}
                      {res.updatedAt && (
                        <>
                          <span className="meta-separator" aria-hidden="true">·</span>
                          <span>Mis à jour le {res.updatedAt}</span>
                        </>
                      )}
                    </div>

                    {res.description && (
                      <p className="crud-item-desc">{res.description}</p>
                    )}
                  </div>

                  <div className="crud-item-actions">
                    {isConfirmingDelete ? (
                      <div className="delete-confirm-box">
                        <span className="delete-confirm-text">Supprimer ?</span>
                        <button
                          type="button"
                          className="btn-confirm-yes"
                          onClick={() => handleDelete(res.id)}
                        >
                          Oui
                        </button>
                        <button
                          type="button"
                          className="btn-confirm-no"
                          onClick={() => setConfirmDeleteId(null)}
                        >
                          Non
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="action-btn action-btn-edit"
                          onClick={() => handleEdit(res)}
                          title="Modifier cette ressource"
                        >
                          <Pencil size={14} />
                          <span>Modifier</span>
                        </button>

                        <button
                          type="button"
                          className="action-btn action-btn-delete"
                          onClick={() => setConfirmDeleteId(res.id)}
                          title="Supprimer cette ressource"
                        >
                          <Trash2 size={14} />
                          <span>Supprimer</span>
                        </button>
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

export default ResourceCrud;