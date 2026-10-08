import { useState, useMemo, useCallback, useDeferredValue } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  FileText,
  Plus,
  Lock,
  CheckCircle2,
  X,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useAcademicFilter } from '../../hooks/useAcademicFilter';
import { departmentScopeService } from '../../services/departmentScopeService';
import { DEPARTMENTS, ACADEMIC_LEVELS } from '../../constants/academicScopes';
import { ROLES, normalizeRole } from '../../constants/rbacConstants';
import CourseMaterialCard from './CourseMaterialCard';
import Pagination from '../common/Pagination';

const MATERIALS_PER_PAGE = 6;

export default function ScopedCoursesManager() {
  const { user } = useAuth();
  const { isStudentScoped, activeFiliere, activeNiveau: studentNiveau } = useAcademicFilter();
  const currentRole = normalizeRole(user?.role);
  const isAdmin = currentRole === ROLES.ADMIN;
  const isStudent = currentRole === ROLES.STUDENT;

  const [adminDepartmentId, setAdminDepartmentId] = useState(activeFiliere);
  const [adminNiveau, setAdminNiveau] = useState(studentNiveau);

  const activeDepartmentId = isStudentScoped ? activeFiliere : (adminDepartmentId || activeFiliere);
  const activeNiveau = isStudentScoped ? studentNiveau : (adminNiveau || studentNiveau);

  const [selectedCourseId, setSelectedCourseId] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [rawPage, setRawPage] = useState(1);

  // Derive filter key to compute page without cascading setState inside useEffect
  const filterKey = `${activeDepartmentId}-${activeNiveau}-${selectedCourseId}-${selectedType}-${deferredSearchQuery}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);

  let currentPage = rawPage;
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setRawPage(1);
    currentPage = 1;
  }

  // Publication modal
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCodeUe, setNewCodeUe] = useState('INF201');
  const [newType, setNewType] = useState('pdf');
  const [newTeacher, setNewTeacher] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Get active department object
  const currentDepartment = useMemo(() => {
    return departmentScopeService.getDepartment(activeDepartmentId);
  }, [activeDepartmentId]);

  // Fetch scoped courses for this department and level
  const courses = useMemo(() => {
    return departmentScopeService.getScopedCourses(
      isAdmin ? { role: ROLES.ADMIN } : user,
      { filiereId: activeDepartmentId, niveau: activeNiveau }
    );
  }, [user, isAdmin, activeDepartmentId, activeNiveau]);

  // Fetch materials
  const materials = useMemo(() => {
    return departmentScopeService.getScopedMaterials(
      isAdmin ? { role: ROLES.ADMIN, filiereId: activeDepartmentId, niveau: activeNiveau } : user,
      {
        courseId: selectedCourseId === 'all' ? undefined : selectedCourseId,
        type: selectedType,
        searchQuery: deferredSearchQuery,
      }
    );
  }, [user, isAdmin, activeDepartmentId, activeNiveau, selectedCourseId, selectedType, deferredSearchQuery]);

  // Paginated materials
  const totalPages = Math.ceil(materials.length / MATERIALS_PER_PAGE);
  const paginatedMaterials = useMemo(() => {
    const startIndex = (currentPage - 1) * MATERIALS_PER_PAGE;
    return materials.slice(startIndex, startIndex + MATERIALS_PER_PAGE);
  }, [materials, currentPage]);

  const handleDownloadMaterial = useCallback(() => {
    setToastMessage(`Téléchargement certifié pour le matricule ${user?.matricule || 'Inscrit'}.`);
    setTimeout(() => setToastMessage(''), 4000);
  }, [user?.matricule]);

  const handlePublishSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      departmentScopeService.publishMaterial(user, {
        titre: newTitle.trim(),
        codeUe: newCodeUe,
        filiereId: activeDepartmentId,
        niveau: activeNiveau,
        type: newType,
        format: newType === 'video' ? 'MP4' : newType === 'code' ? 'IPYNB' : 'PDF',
        enseignant: newTeacher.trim() || user?.nom || 'Délégué Promotion',
        description: newDescription.trim() || 'Support pédagogique certifié conforme au syllabus.',
      });

      setPublishModalOpen(false);
      setNewTitle('');
      setNewDescription('');
      setToastMessage('Support pédagogique publié avec succès dans votre filière !');
      setTimeout(() => setToastMessage(''), 4000);
    } catch (err) {
      setToastMessage(err.message);
      setTimeout(() => setToastMessage(''), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Department Tenant Isolation Security Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                <Lock size={12} className="text-indigo-500" />
                <span>Cloisonnement par Filière Actif</span>
              </span>

              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                Matricule : <strong>{user?.matricule || 'Actif'}</strong>
              </span>

              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                {activeNiveau}
              </span>
            </div>

            <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>{currentDepartment.label}</span>
              <span className="text-xs px-2 py-0.5 rounded font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-500">
                {currentDepartment.code}
              </span>
            </h2>

            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
              {currentDepartment.description}
            </p>
          </div>

          {!isStudent && (
            <div className="flex items-center gap-2 self-start md:self-auto">
              <button
                type="button"
                onClick={() => setPublishModalOpen(true)}
                className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-indigo-500/20"
              >
                <Plus size={15} />
                <span>Déposer un support</span>
              </button>
            </div>
          )}
        </div>

        {/* Admin Switcher for Cross-Department Verification */}
        {isAdmin && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3 text-xs">
            <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <Sparkles size={13} />
              <span>Contrôle Admin (Vue Inter-Filières) :</span>
            </span>

            <select
              value={activeDepartmentId}
              onChange={(e) => {
                setAdminDepartmentId(e.target.value);
                setSelectedCourseId('all');
              }}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-xs"
            >
              {DEPARTMENTS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label} ({d.code})
                </option>
              ))}
            </select>

            <select
              value={activeNiveau}
              onChange={(e) => setAdminNiveau(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-xs"
            >
              {ACADEMIC_LEVELS.map((lvl) => (
                <option key={lvl.id} value={lvl.id}>
                  {lvl.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Courses / UEs Carousel / Tabs for the Department */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setSelectedCourseId('all')}
          className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 border ${
            selectedCourseId === 'all'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-indigo-400'
          }`}
        >
          <BookOpen size={13} />
          <span>Toutes les UEs ({courses.length})</span>
        </button>

        {courses.map((course) => (
          <button
            key={course.id}
            type="button"
            onClick={() => setSelectedCourseId(course.id)}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 border ${
              selectedCourseId === course.id
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-indigo-400'
            }`}
          >
            <span className="font-mono">{course.codeUe}</span>
            <span className="font-normal truncate max-w-[140px]">{course.titre}</span>
          </button>
        ))}
      </div>

      {/* Search and Format Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par titre, UE, mot-clé ou enseignant..."
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={14} className="text-slate-400" />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
          >
            <option value="all">Tous les formats</option>
            <option value="pdf">Polycopiés & PDF</option>
            <option value="video">Vidéos de Cours</option>
            <option value="exercise">TDs & Exercices</option>
            <option value="code">Notebooks & Code C/Python</option>
          </select>
        </div>
      </div>

      {/* Materials List */}
      {materials.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-500 flex items-center justify-center mx-auto">
            <BookOpen size={24} />
          </div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Aucun support trouvé pour ce filtre
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Tous les documents sont cloisonnés pour la filière {currentDepartment.label}. Vous pouvez déposer le premier document ou ajuster votre recherche.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paginatedMaterials.map((mat) => (
              <CourseMaterialCard
                key={mat.id}
                mat={mat}
                userMatricule={user?.matricule}
                onDownload={handleDownloadMaterial}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setRawPage}
            totalItems={materials.length}
            pageSize={MATERIALS_PER_PAGE}
          />
        </div>
      )}

      {/* Publish Material Modal */}
      {publishModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Déposer un Support Pédagogique
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPublishModalOpen(false)}
                className="p-1 rounded-xl hover:bg-slate-100 text-slate-400"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handlePublishSubmit} className="space-y-3.5 text-xs">
              <div className="p-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 text-indigo-700 dark:text-indigo-300">
                Périmètre strict : Le support sera automatiquement rattaché à votre filière <strong>{currentDepartment.label}</strong> ({activeNiveau}).
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Unité d'Enseignement (UE) * :
                </label>
                <select
                  value={newCodeUe}
                  onChange={(e) => setNewCodeUe(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.codeUe}>
                      {c.codeUe} · {c.titre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Titre du support * :
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex : Polycopié Chapitre 4 : Arbres AVL et Rotations..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Format :
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                  >
                    <option value="pdf">Polycopié PDF</option>
                    <option value="video">Enregistrement Vidéo</option>
                    <option value="exercise">TD / Exercices d'amphi</option>
                    <option value="code">Fichier Code C/Python</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Enseignant référent :
                  </label>
                  <input
                    type="text"
                    value={newTeacher}
                    onChange={(e) => setNewTeacher(e.target.value)}
                    placeholder="Ex : Dr. T. Mbarga"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description pédagogique :
                </label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Concepts abordés, prérequis, corrigé inclus..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPublishModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 font-semibold hover:bg-slate-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs"
                >
                  Publier dans ma filière
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
