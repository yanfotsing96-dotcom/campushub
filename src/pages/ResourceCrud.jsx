import { useState, useMemo, useEffect, useCallback } from 'react';
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
  Sparkles,
  ShieldCheck,
  Crown,
  Award,
  Lock,
  Download,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import '../styles/ResourceCrud.css';
import ResourceItemCard from '../components/resources/ResourceItemCard';
import Pagination from '../components/common/Pagination';

import { useResources } from '../hooks/useResources';
import { usePermissions } from '../hooks/usePermissions';
import { ROLES, ROLE_LABELS } from '../constants/rbacConstants';

const ITEMS_PER_PAGE = 8;

function ResourceCrud() {
  const { resources, addResource, updateResource, deleteResource, recordDownload } = useResources();
  const {
    user,
    role,
    roleLabel,
    isStudent,
    isDelegate,
    isModerator,
    isAdmin,
    canAddResource,
    canModifyResource,
    canDeleteResource,
    switchRole,
    demoProfiles,
  } = usePermissions();

  const userFiliere = user?.filiereId || user?.filiere || 'Informatique';

  const [formData, setFormData] = useState({
    titre: '',
    filiere: userFiliere,
    niveau: user?.niveau || 'L1',
    description: '',
  });

  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFiliere, setFilterFiliere] = useState('all');
  const [filterNiveau, setFilterNiveau] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [feedbackNotice, setFeedbackNotice] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Derive effective editing state securely: if user role no longer permits editing, effectiveEditingId is null
  const activeEditingResource = useMemo(() => {
    return editingId !== null ? resources.find((r) => r.id === editingId) : null;
  }, [editingId, resources]);

  const canEditActive = useMemo(() => {
    return activeEditingResource ? canModifyResource(activeEditingResource) : false;
  }, [activeEditingResource, canModifyResource]);

  const effectiveEditingId = canEditActive ? editingId : null;

  // Derive the active filière value for the form:
  // If editing an existing resource, use formData.filiere.
  // If adding as delegate, force userFiliere. Otherwise, use formData.filiere.
  const effectiveFiliere = effectiveEditingId !== null
    ? formData.filiere
    : (isDelegate ? userFiliere : (formData.filiere || 'Informatique'));

  // Auto-dismiss feedback notice
  useEffect(() => {
    if (feedbackNotice) {
      const timer = setTimeout(() => setFeedbackNotice(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [feedbackNotice]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.titre.trim()) return;

    if (effectiveEditingId !== null) {
      const targetResource = resources.find((r) => r.id === effectiveEditingId);
      if (!targetResource || !canModifyResource(targetResource)) {
        setFeedbackNotice({
          type: 'error',
          message: 'Action refusée : Vous n\'avez pas les permissions pour modifier cette ressource.',
        });
        return;
      }

      updateResource(effectiveEditingId, {
        ...formData,
        filiere: effectiveFiliere,
        titre: formData.titre.trim(),
      });
      setEditingId(null);
      setFeedbackNotice({
        type: 'success',
        message: 'Ressource mise à jour avec succès.',
      });
    } else {
      // Check RBAC permission for creation
      if (!canAddResource(effectiveFiliere)) {
        setFeedbackNotice({
          type: 'error',
          message: isStudent
            ? 'Action non autorisée : Les étudiants ont un accès en lecture seule.'
            : `Action non autorisée : En tant que délégué, vous ne pouvez publier que dans votre filière (${userFiliere}).`,
        });
        return;
      }

      addResource({
        ...formData,
        filiere: effectiveFiliere,
        titre: formData.titre.trim(),
        universityName: user?.universityName || 'Université de Yaoundé I',
        authorId: user?.id || null,
        authorMatricule: user?.matricule || '23U1084',
        authorName: user?.fullName || user?.nom || 'Délégué Promotion',
        authorRole: role,
      });

      setFeedbackNotice({
        type: 'success',
        message: `Ressource publiée avec succès pour la filière ${effectiveFiliere} !`,
      });
    }

    setFormData({
      titre: '',
      filiere: isDelegate ? userFiliere : 'Informatique',
      niveau: 'L1',
      description: '',
    });
  };

  const handleEdit = useCallback((res) => {
    if (!canModifyResource(res)) {
      setFeedbackNotice({
        type: 'error',
        message: 'Modification interdite pour ce document.',
      });
      return;
    }

    setEditingId(res.id);
    setFormData({
      titre: res.titre,
      filiere: res.filiere,
      niveau: res.niveau,
      description: res.description || '',
    });

    const formElement = document.querySelector('.crud-form-card');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [canModifyResource]);

  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
    setFormData({
      titre: '',
      filiere: isDelegate ? userFiliere : 'Informatique',
      niveau: 'L1',
      description: '',
    });
  }, [isDelegate, userFiliere]);

  const handleDelete = useCallback((id) => {
    const targetResource = resources.find((r) => r.id === id);
    if (!targetResource || !canDeleteResource(targetResource)) {
      setFeedbackNotice({
        type: 'error',
        message: 'Suppression interdite pour ce document.',
      });
      setConfirmDeleteId(null);
      return;
    }

    deleteResource(id);
    if (editingId === id) {
      handleCancelEdit();
    }
    setConfirmDeleteId(null);
    setFeedbackNotice({
      type: 'success',
      message: 'Ressource supprimée du catalogue.',
    });
  }, [resources, canDeleteResource, deleteResource, editingId, handleCancelEdit]);

  const handleDownload = useCallback((res) => {
    recordDownload(res.id);
    setFeedbackNotice({
      type: 'success',
      message: `Téléchargement lancé pour "${res.titre}" (Format ${res.format || 'PDF'}).`,
    });
  }, [recordDownload]);

  const handleConfirmDelete = useCallback((id) => {
    setConfirmDeleteId(id);
  }, []);

  const handleCancelDelete = useCallback(() => {
    setConfirmDeleteId(null);
  }, []);

  // Filtrage et tri mémorisés
  const filteredResources = useMemo(() => {
    return resources
      .filter((res) => {
        const matchesSearch =
          res.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (res.description && res.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (res.codeUe && res.codeUe.toLowerCase().includes(searchQuery.toLowerCase()));
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

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterFiliere, filterNiveau, sortBy]);

  // Paginated Resources
  const totalPages = Math.ceil(filteredResources.length / ITEMS_PER_PAGE);
  const paginatedResources = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredResources.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredResources, currentPage]);

  // Statistiques calculées
  const stats = useMemo(() => {
    const filieres = new Set(resources.map((r) => r.filiere));
    const niveaux = new Set(resources.map((r) => r.niveau));
    return {
      total: resources.length,
      filieresCount: filieres.size,
      niveauxCount: niveaux.size,
    };
  }, [resources]);

  return (
    <div className="crud-container">
      {/* 1. Simulateur RBAC en Direct pour Tests Rapides */}
      <section className="rbac-simulator-bar" aria-label="Simulateur RBAC de Profils Démo">
        <div className="rbac-sim-label">
          <ShieldCheck size={16} className="text-indigo-600 dark:text-indigo-400" />
          <span>Contrôle d'Accès RBAC :</span>
        </div>
        <div className="rbac-sim-buttons">
          {demoProfiles && demoProfiles.map((p) => {
            const isActive = role === p.role;
            const Icon = p.role === ROLES.ADMIN ? Crown : p.role === ROLES.MODERATOR ? ShieldCheck : p.role === ROLES.DELEGATE ? Award : BookOpen;
            return (
              <button
                key={p.role}
                type="button"
                className={`rbac-sim-btn ${isActive ? 'active' : ''}`}
                onClick={() => switchRole(p.role)}
                title={`Basculer vers le profil démo ${ROLE_LABELS[p.role]} (${p.nom})`}
              >
                <Icon size={14} />
                <span>{ROLE_LABELS[p.role]}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. Bannière de Périmètre Sécurisé (Scope & Permissions) */}
      <section className={`rbac-scope-banner ${role}`} aria-live="polite">
        <div className="rbac-scope-left">
          <span className={`rbac-role-pill ${
            isAdmin
              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300'
              : isModerator
              ? 'bg-sky-100 text-sky-800 dark:bg-sky-900/60 dark:text-sky-300'
              : isDelegate
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
              : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300'
          }`}>
            {isAdmin && <Crown size={13} />}
            {isModerator && <ShieldCheck size={13} />}
            {isDelegate && <Award size={13} />}
            {isStudent && <BookOpen size={13} />}
            <span>Profil : {roleLabel}</span>
          </span>

          <div className="rbac-scope-text">
            {isStudent && (
              <span>
                <strong>Mode Lecture Seule :</strong> Vous pouvez consulter et télécharger les cours. Le dépôt et la modification de ressources sont réservés aux délégués et modérateurs.
              </span>
            )}
            {isDelegate && (
              <span>
                <strong>Écriture Ciblée ({userFiliere}) :</strong> Vous pouvez ajouter des cours pour votre filière et gérer les ressources publiées par votre classe.
              </span>
            )}
            {(isAdmin || isModerator) && (
              <span>
                <strong>Accès Intégral :</strong> Vous disposez des autorisations complètes d'ajout, modification et suppression sur tous les départements.
              </span>
            )}
          </div>
        </div>

        <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
          Matricule : <strong>{user?.matricule || 'Actif'}</strong>
        </div>
      </section>

      {/* 3. Feedback toast interactif */}
      {feedbackNotice && (
        <div
          className={`flex items-center gap-2.5 p-3.5 mb-6 rounded-xl border text-sm font-semibold transition-all ${
            feedbackNotice.type === 'error'
              ? 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800'
              : feedbackNotice.type === 'warning'
              ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
              : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
          }`}
        >
          {feedbackNotice.type === 'error' && <AlertCircle size={18} className="text-red-600 flex-shrink-0" />}
          {feedbackNotice.type === 'warning' && <AlertCircle size={18} className="text-amber-600 flex-shrink-0" />}
          {feedbackNotice.type === 'success' && <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />}
          <span>{feedbackNotice.message}</span>
        </div>
      )}

      {/* 4. En-tête principal */}
      <header className="crud-header">
        <div className="crud-title-group">
          <h2>
            <Library className="crud-title-icon" size={26} />
            Gestion des Ressources Pédagogiques
          </h2>
          <p className="crud-subtitle">
            Catalogue académique vérifié des universités et grandes écoles du Cameroun.
          </p>
        </div>
      </header>

      {/* 5. Cartes d'indicateurs rapides */}
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

      {/* 6. Formulaire conditionnel : Masqué pour les Étudiants / Affiché pour Délégués, Modérateurs, Admins */}
      {isStudent ? (
        <div className="rbac-read-only-card" role="region" aria-label="Notice lecture seule étudiant">
          <div className="rbac-read-only-icon">
            <Lock size={20} />
          </div>
          <div className="rbac-read-only-content">
            <h4>Accès Consultation Étudiant Actif</h4>
            <p>
              En tant qu'étudiant standard, vous bénéficiez d'un accès libre pour consulter, filtrer et télécharger l'ensemble des cours et annales. Le formulaire d'ajout et les outils d'édition sont réservés aux délégués de filière et administrateurs.
            </p>
          </div>
        </div>
      ) : (
        <div className={`crud-form-card ${editingId !== null ? 'editing' : ''}`}>
          <div className="form-header-row">
            <h3>
              {editingId !== null ? (
                <>
                  <Pencil size={18} className="form-label-icon" />
                  Modifier la ressource pédagogique
                </>
              ) : (
                <>
                  <Plus size={18} className="form-label-icon" />
                  Ajouter une nouvelle ressource {isDelegate && `(Filière : ${userFiliere})`}
                </>
              )}
            </h3>
            {editingId !== null && (
              <span className="form-badge-mode">Mode Édition Sécurisé</span>
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
                  placeholder="Ex: Algorithmes Gloutons et Programmation Dynamique (Python & C)"
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
                  {isDelegate ? (
                    <option value={userFiliere}>{userFiliere} (Votre filière assignée)</option>
                  ) : (
                    <>
                      <option value="Informatique">Informatique & Génie Logiciel</option>
                      <option value="IA-Data">IA & Data Science</option>
                      <option value="Cyber-Reseaux">Systèmes, Réseaux & Cyber</option>
                      <option value="Mathématiques">Mathématiques & Modélisation</option>
                      <option value="Physique">Physique & Électronique</option>
                      <option value="Chimie">Chimie & Matériaux</option>
                      <option value="Biologie">Biosciences & Santé</option>
                      <option value="Genie-Civil">Génie Civil & Environnement</option>
                    </>
                  )}
                </select>
                {isDelegate && (
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                    ✓ Autorisation accordée uniquement sur votre filière de mandat ({userFiliere}).
                  </span>
                )}
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
                Description & Objectifs d'apprentissage :
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Ex: Contenu du syllabus, chapitres clés, références bibliographiques ou prérequis d'examen..."
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
                    <Plus size={16} /> Publier la ressource
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
      )}

      {/* 7. Barre d'outils et filtres de recherche */}
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
                placeholder="Rechercher par titre ou mot-clé..."
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
              <option value="Informatique">Informatique & Génie Logiciel</option>
              <option value="IA-Data">IA & Data Science</option>
              <option value="Cyber-Reseaux">Systèmes, Réseaux & Cyber</option>
              <option value="Mathématiques">Mathématiques & Modélisation</option>
              <option value="Physique">Physique & Électronique</option>
              <option value="Chimie">Chimie & Matériaux</option>
              <option value="Biologie">Biosciences & Santé</option>
              <option value="Genie-Civil">Génie Civil & Environnement</option>
            </select>

            <select
              className="filter-select"
              value={filterNiveau}
              onChange={(e) => setFilterNiveau(e.target.value)}
              aria-label="Filtrer par niveau"
            >
              <option value="all">Tous les niveaux</option>
              <option value="L1">Licence 1 (L1)</option>
              <option value="L2">Licence 2 (L2)</option>
              <option value="L3">Licence 3 (L3)</option>
              <option value="M1">Master 1 (M1)</option>
              <option value="M2">Master 2 (M2)</option>
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

        {/* 8. Liste des ressources conditionnée selon les permissions RBAC */}
        {filteredResources.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Sparkles size={28} />
            </div>
            <h4>Aucune ressource trouvée</h4>
            <p>
              {searchQuery || filterFiliere !== 'all' || filterNiveau !== 'all'
                ? 'Aucun résultat ne correspond à vos filtres actuels. Réinitialisez la recherche pour afficher la totalité des ressources.'
                : 'Votre catalogue est vide pour le moment.'}
            </p>
            {(searchQuery || filterFiliere !== 'all' || filterNiveau !== 'all') && (
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
          <>
            <ul className="crud-list">
              {paginatedResources.map((res) => {
                const isBeingEdited = editingId === res.id;
                const isConfirmingDelete = confirmDeleteId === res.id;
                const canEditThis = canModifyResource(res);
                const canDeleteThis = canDeleteResource(res);

                return (
                  <ResourceItemCard
                    key={res.id}
                    res={res}
                    isBeingEdited={isBeingEdited}
                    isConfirmingDelete={isConfirmingDelete}
                    canEditThis={canEditThis}
                    canDeleteThis={canDeleteThis}
                    isDelegate={isDelegate}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onConfirmDelete={handleConfirmDelete}
                    onCancelDelete={handleCancelDelete}
                    onDownload={handleDownload}
                  />
                );
              })}
            </ul>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredResources.length}
              pageSize={ITEMS_PER_PAGE}
            />
          </>
        )}
      </section>
    </div>
  );
}

export default ResourceCrud;
