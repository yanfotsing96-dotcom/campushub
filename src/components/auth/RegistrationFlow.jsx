import { useState, useId, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Lock,
  GraduationCap,
  School,
  Upload,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Building2,
  Eye,
  EyeOff,
  Sparkles,
  Camera,
  Trash2,
  Cpu,
  FlaskConical,
  Atom,
  Binary,
  Dna,
  Mountain,
  Languages,
  BookOpen,
  BookMarked,
  Landmark,
  Compass,
  Palette,
  Film,
  Check,
  ShieldCheck,
  QrCode,
  Wifi,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../constants/rbacConstants';
import { storageService } from '../../services/storageService';
import { STORAGE_KEYS, CAMEROON_UNIVERSITIES } from '../../constants/academicConstants';

/**
 * Configuration officielle des Facultés & Filières
 * Université de Yaoundé I (FS & FALSH)
 */
const FACULTIES_CONFIG = {
  FS: {
    id: 'FS',
    name: 'Faculté des Sciences (FS)',
    shortName: 'Faculté des Sciences',
    code: 'FS',
    badge: 'Pôle Scientifique & Recherche',
    campus: 'Campus Principal de Ngoa-Ekellé',
    themeColor: 'indigo',
    accentHex: '#6366f1',
    borderClass: 'border-indigo-500/40 hover:border-indigo-500',
    activeBg: 'bg-indigo-950/50 border-indigo-500 ring-2 ring-indigo-500/40',
    description: 'Sciences fondamentales, modélisation mathématique, algorithmique & informatique, chimie et biotechnologies.',
    targetUrl: '/dashboard',
    filieres: [
      { id: 'Informatique', name: 'Informatique', code: 'INF', icon: Cpu, desc: 'Génie logiciel, algorithmes, IA & systèmes d\'exploitation' },
      { id: 'Chimie', name: 'Chimie', code: 'CHM', icon: FlaskConical, desc: 'Chimie organique, minérale, cinétique & procédés industriels' },
      { id: 'Physique', name: 'Physique', code: 'PHY', icon: Atom, desc: 'Mécanique quantique, électromagnétisme, optique & électronique' },
      { id: 'Mathématiques', name: 'Mathématiques', code: 'MAT', icon: Binary, desc: 'Algèbre, analyse réelle, probabilités & statistiques appliquées' },
      { id: 'Biochimie', name: 'Biochimie', code: 'BCH', icon: Dna, desc: 'Enzymologie, métabolisme, génétique & biologie moléculaire' },
      { id: 'Biologie', name: 'Biologie', code: 'BIO', icon: Dna, desc: 'Biologie animale & végétale, microbiologie & écosystèmes' },
      { id: 'Sciences de la Terre', name: 'Sciences de la Terre', code: 'ST', icon: Mountain, desc: 'Géologie, minéralogie, géodynamique & hydrologie' },
    ],
  },

  FALSH: {
    id: 'FALSH',
    name: 'Faculté des Arts, Lettres et Sciences Humaines (FALSH)',
    shortName: 'FALSH',
    code: 'FALSH',
    badge: 'Pôle Humanités & Pensée Critique',
    campus: 'Campus Historique de Ngoa-Ekellé (Château)',
    themeColor: 'amber',
    accentHex: '#f59e0b',
    borderClass: 'border-amber-500/40 hover:border-amber-500',
    activeBg: 'bg-amber-950/50 border-amber-500 ring-2 ring-amber-500/40',
    description: 'Sciences sociales, littératures patrimoniales, études bilingues, arts visuels, cinéma et philosophie.',
    targetUrl: '/falsh-hub',
    departments: [
      {
        id: 'langues',
        title: 'Lettres & Langues',
        badge: 'Littérature & Poétique',
        filieres: [
          { id: 'Allemand', name: 'Allemand', code: 'ALL', icon: Languages, desc: 'Langue, civilisation germanique et littérature comparée' },
          { id: 'Anglais', name: 'Anglais', code: 'ENG', icon: Languages, desc: 'Littérature anglophone, linguistique et études postcoloniales' },
          { id: 'Espagnol', name: 'Espagnol', code: 'ESP', icon: Languages, desc: 'Langue hispanique, cultures d\'Espagne et d\'Amérique latine' },
          { id: 'Études bilingues (Français-Anglais)', name: 'Études bilingues (Français-Anglais)', code: 'BIL', icon: BookOpen, desc: 'Bilinguisme officiel camerounais, traductologie et terminologie' },
          { id: 'Lettres modernes françaises', name: 'Lettres modernes françaises', code: 'LMF', icon: BookMarked, desc: 'Littérature française, francophone, stylistique et critique textuelle' },
          { id: 'Littérature et civilisations africaines', name: 'Littérature et civilisations africaines', code: 'LCA', icon: Landmark, desc: 'Traditions orales, roman négro-africain et poétique césairienne' },
        ],
      },
      {
        id: 'humaines',
        title: 'Sciences Humaines',
        badge: 'Société & Pensée',
        filieres: [
          { id: 'Anthropologie', name: 'Anthropologie', code: 'ANT', icon: User, desc: 'Ethnographie, cultures matérielles et anthropologie culturelle' },
          { id: 'Géographie', name: 'Géographie', code: 'GEO', icon: Compass, desc: 'Aménagement du territoire, géomatique, climatologie et cartographie' },
          { id: 'Histoire', name: 'Histoire', code: 'HIS', icon: Landmark, desc: 'Histoire précoloniale de l\'Afrique, historiographie et Cameroun contemporain' },
          { id: 'Langues africaines et linguistique', name: 'Langues africaines et linguistique', code: 'LAL', icon: Languages, desc: 'Description des langues nationales camerounaises et phonologie' },
          { id: 'Linguistique générale et appliquée', name: 'Linguistique générale et appliquée', code: 'LIN', icon: BookOpen, desc: 'Morphosyntaxe, pragmatique, sociolinguistique et Camfranglais' },
          { id: 'Philosophie', name: 'Philosophie', code: 'PHI', icon: Sparkles, desc: 'Logique formelle, philosophie africaine (Towa, Eboussi) et éthique politique' },
          { id: 'Psychologie', name: 'Psychologie', code: 'PSY', icon: User, desc: 'Psychologie clinique, cognitive, du travail et psychopathologie' },
          { id: 'Sciences du langage', name: 'Sciences du langage', code: 'SDL', icon: Languages, desc: 'Analyse du discours, sémiotique textuelle et communication' },
          { id: 'Sociologie', name: 'Sociologie', code: 'SOC', icon: Building2, desc: 'Sociologie des organisations, mutations urbaines et développement' },
        ],
      },
      {
        id: 'arts',
        title: 'Arts & Industries Culturelles',
        badge: 'Création & Patrimoine',
        filieres: [
          { id: 'Arts du spectacle et cinématographie', name: 'Arts du spectacle et cinématographie', code: 'ASC', icon: Film, desc: 'Dramaturgie, mise en scène théâtrale, cinéma documentaire et régie' },
          { id: 'Arts plastiques et histoire de l\'art', name: 'Arts plastiques et histoire de l\'art', code: 'APH', icon: Palette, desc: 'Peinture, sculpture, design graphique et esthétique comparée' },
          { id: 'Archéologie et gestion du patrimoine', name: 'Archéologie et gestion du patrimoine', code: 'AGP', icon: Landmark, desc: 'Fouilles de terrain, conservation muséale et sauvegarde patrimoniale' },
          { id: 'Tourisme et Hôtellerie', name: 'Tourisme et Hôtellerie', code: 'TH', icon: Compass, desc: 'Management hôtelier, écotourisme et valorisation culturelle' },
        ],
      },
    ],
  },
};

const STUDY_LEVELS = [
  { id: 'L1', label: 'Licence 1', code: 'L1' },
  { id: 'L2', label: 'Licence 2', code: 'L2' },
  { id: 'L3', label: 'Licence 3', code: 'L3' },
  { id: 'M1', label: 'Master 1', code: 'M1' },
  { id: 'M2', label: 'Master 2', code: 'M2' },
];

export default function RegistrationFlow() {
  const navigate = useNavigate();
  const { register, updateProfile } = useAuth();
  const fileInputRef = useRef(null);

  // Étape stricte ordonnée : 1 (Orientation académique) ou 2 (Formulaire d'inscription & carte)
  const [currentStep, setCurrentStep] = useState(1);

  // Structure stricte du state global demandée
  const [formData, setFormData] = useState(() => ({
    university: 'Université de Yaoundé I',
    faculty: 'FS',   // 'FS' ou 'FALSH'
    filiere: 'Informatique',   // Nom de la filière sélectionnée
    avatarUrl: null, // Placé en premier dans le state et l'UI
    lastName: '',
    firstName: '',
    username: '',
    email: '',
    password: '',
    matricule: '23Y1042',
    level: 'L1',
  }));

  // Onglet département FALSH
  const [activeFalshTab, setActiveFalshTab] = useState('all');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [notification, setNotification] = useState(null);

  // Accessibilité des champs
  const lastNameId = useId();
  const firstNameId = useId();
  const usernameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const matriculeId = useId();

  // Mise à jour de champ
  const updateFormField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  // Sélection d'une Faculté
  const handleSelectFaculty = (facultyId) => {
    const defaultFiliere = facultyId === 'FS' ? 'Informatique' : 'Lettres modernes françaises';
    setFormData((prev) => ({
      ...prev,
      faculty: facultyId,
      filiere: defaultFiliere,
    }));
    setActiveFalshTab('all');
  };

  // Liste réactive des filières à afficher
  const displayedFilieres = useMemo(() => {
    if (!formData.faculty) return [];

    if (formData.faculty === 'FS') {
      return FACULTIES_CONFIG.FS.filieres;
    }

    const depts = FACULTIES_CONFIG.FALSH.departments;
    if (activeFalshTab === 'all') {
      let combined = [];
      depts.forEach((d) => {
        d.filieres.forEach((f) => combined.push({ ...f, deptTitle: d.title }));
      });
      return combined;
    }

    const targetDept = depts.find((d) => d.id === activeFalshTab);
    return targetDept
      ? targetDept.filieres.map((f) => ({ ...f, deptTitle: targetDept.title }))
      : [];
  }, [formData.faculty, activeFalshTab]);

  // Validation passage Étape 1 vers Étape 2
  const handleProceedToStep2 = () => {
    if (!formData.university || !formData.faculty || !formData.filiere) {
      setNotification({
        type: 'error',
        text: 'Veuillez sélectionner votre université, votre faculté et votre filière pour continuer.',
      });
      return;
    }
    setNotification(null);
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Gestion du téléversement de la photo
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        setNotification({ type: 'error', text: 'La photo ne doit pas dépasser 4 Mo.' });
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        updateFormField('avatarUrl', event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    updateFormField('avatarUrl', null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Générateur de matricule UY1
  const handleGenerateMatricule = () => {
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    updateFormField('matricule', `23Y${randomCode}`);
  };

  // Soumission finale et synchronisation
  const handleSubmitFinal = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!formData.lastName.trim()) errors.lastName = 'Le nom de famille est obligatoire.';
    if (!formData.email.trim()) errors.email = 'L\'adresse email institutionnelle est requise.';
    if (!formData.password || formData.password.length < 6) {
      errors.password = 'Le mot de passe doit comporter au moins 6 caractères.';
    }
    if (!formData.matricule.trim()) errors.matricule = 'Le matricule étudiant est obligatoire.';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setNotification(null);

    try {
      const finalFullName = formData.firstName.trim()
        ? `${formData.firstName.trim()} ${formData.lastName.trim()}`
        : formData.lastName.trim();

      const facultyData = FACULTIES_CONFIG[formData.faculty] || {
        name: formData.faculty === 'FS' ? 'Faculté des Sciences (FS)' : 'FALSH',
      };

      const userPayload = {
        nom: formData.lastName.trim(),
        prenom: formData.firstName.trim(),
        fullName: finalFullName,
        name: finalFullName,
        username: formData.username.trim() || formData.email.split('@')[0],
        email: formData.email.trim(),
        matricule: formData.matricule.trim().toUpperCase(),
        university: formData.university,
        universityName: formData.university,
        universityId: 'UY1',
        faculty: formData.faculty,
        faculte: facultyData.name,
        filiere: formData.filiere,
        filiereId: formData.filiere,
        niveau: formData.level,
        avatar: formData.avatarUrl,
        avatarUrl: formData.avatarUrl,
        role: ROLES.STUDENT,
        isPro: true,
      };

      // 1. Enregistrement AuthContext
      if (typeof register === 'function') {
        register(userPayload);
      } else if (typeof updateProfile === 'function') {
        updateProfile(userPayload);
      }

      // 2. Synchronisation LocalStorage
      try {
        localStorage.setItem('campushub_user_filiere', formData.filiere || 'Informatique');
        localStorage.setItem('campushub_user_niveau', formData.level || 'L1');
        localStorage.setItem('campushub_user_faculty', formData.faculty || 'FS');
        localStorage.setItem('campushub_selected_university', formData.university);
        storageService.set(STORAGE_KEYS.AUTH_USER, userPayload);
      } catch (err) {
        console.warn('Storage sync warn:', err);
      }

      // 3. Événement global
      window.dispatchEvent(new CustomEvent('campushub:auth_changed', { detail: userPayload }));

      setNotification({
        type: 'success',
        text: 'Compte créé avec succès ! Accès immédiat à votre espace CampusHub...',
      });

      // 4. Redirection contextuelle vers l'espace de travail
      setTimeout(() => {
        setIsSubmitting(false);
        if (formData.faculty === 'FALSH') {
          navigate('/falsh-hub');
        } else if (formData.filiere === 'Informatique') {
          navigate('/tech-hub');
        } else {
          navigate('/dashboard');
        }
      }, 700);
    } catch (err) {
      console.error('Erreur inscription :', err);
      setIsSubmitting(false);
      setNotification({
        type: 'error',
        text: 'Une erreur est survenue lors de l\'enregistrement de votre profil.',
      });
    }
  };

  const currentFacultyConfig = formData.faculty ? FACULTIES_CONFIG[formData.faculty] : null;
  const displayName = formData.firstName || formData.lastName
    ? `${formData.firstName} ${formData.lastName}`.trim()
    : 'Étudiant CampusHub';

  const userInitials = useMemo(() => {
    const f = formData.firstName?.[0] || '';
    const l = formData.lastName?.[0] || '';
    return (f + l).toUpperCase() || 'UY1';
  }, [formData.firstName, formData.lastName]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-slate-100 text-left font-sans">
      {/* Barre Supérieure Institutionnelle & Stepper */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        <div
          className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-500"
          style={{ backgroundColor: currentFacultyConfig?.accentHex || '#6366f1' }}
        />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-indigo-300">
              <School size={14} className="text-amber-400" />
              <span>{formData.university} · Campus de Ngoa-Ekellé</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>Onboarding & Inscription Étudiante</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Configurez votre parcours académique en 2 étapes strictement ordonnées et synchronisées.
            </p>
          </div>

          {/* Stepper Dynamique 2 Étapes */}
          <div className="flex items-center gap-2 self-start md:self-auto bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                currentStep === 1
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'bg-slate-800/80 text-emerald-400 hover:text-white'
              }`}
            >
              <span className="w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-mono bg-white/20">
                {currentStep > 1 ? <Check size={11} /> : '1'}
              </span>
              <span>1. Université, Faculté & Filière</span>
            </button>

            <span className="text-slate-600 text-xs">→</span>

            <button
              type="button"
              onClick={() => handleProceedToStep2()}
              disabled={!formData.university || !formData.faculty || !formData.filiere}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                currentStep === 2
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed'
              }`}
            >
              <span className="w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-mono bg-white/20">
                2
              </span>
              <span>2. Formulaire & Photo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-2.5 animate-in fade-in duration-200 ${
            notification.type === 'success'
              ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300'
              : 'bg-rose-950/70 border-rose-500/50 text-rose-300'
          }`}
        >
          <CheckCircle size={16} />
          <span>{notification.text}</span>
        </div>
      )}

      {/* ============================================================== */}
      {/* 📌 ÉTAPE 1 : Université, Faculté & Filière                       */}
      {/* ============================================================== */}
      {currentStep === 1 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* 1.1 Choix de l'Université */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Building2 size={16} className="text-indigo-400" />
                <span>1. Choix de l'Université :</span>
              </h2>
              <span className="text-xs font-mono text-indigo-300 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                Établissement sélectionné : {formData.university}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {/* Option principale : UY1 */}
              <div
                onClick={() => updateFormField('university', 'Université de Yaoundé I')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                  formData.university === 'Université de Yaoundé I'
                    ? 'bg-indigo-950/60 border-indigo-500 ring-2 ring-indigo-500/30'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shrink-0 font-bold font-mono text-xs">
                  UY1
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-white truncate">Université de Yaoundé I</h3>
                    {formData.university === 'Université de Yaoundé I' && <Check size={14} className="text-indigo-400 shrink-0" />}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Campus Principal de Ngoa-Ekellé</p>
                </div>
              </div>

              {/* Option 2 : UDO */}
              <div
                onClick={() => updateFormField('university', 'Université de Douala')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                  formData.university === 'Université de Douala'
                    ? 'bg-indigo-950/60 border-indigo-500 ring-2 ring-indigo-500/30'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200 shrink-0 font-bold font-mono text-xs">
                  UDO
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-white truncate">Université de Douala</h3>
                    {formData.university === 'Université de Douala' && <Check size={14} className="text-indigo-400 shrink-0" />}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Campus Ange Raphaël / PK17</p>
                </div>
              </div>

              {/* Option 3 : Université de Dschang */}
              <div
                onClick={() => updateFormField('university', 'Université de Dschang')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                  formData.university === 'Université de Dschang'
                    ? 'bg-indigo-950/60 border-indigo-500 ring-2 ring-indigo-500/30'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200 shrink-0 font-bold font-mono text-xs">
                  UDS
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-white truncate">Université de Dschang</h3>
                    {formData.university === 'Université de Dschang' && <Check size={14} className="text-indigo-400 shrink-0" />}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Campus Principal & IUT Bandjoun</p>
                </div>
              </div>
            </div>

            {/* Menu sélecteur étendu pour toutes les universités d'État */}
            <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
              <span className="text-[11px]">Autre établissement du Cameroun ?</span>
              <select
                value={formData.university}
                onChange={(e) => updateFormField('university', e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {CAMEROON_UNIVERSITIES.map((univ) => (
                  <option key={univ.id} value={univ.name}>
                    {univ.name} ({univ.city})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 1.2 Sélection de la Faculté (Cartes Interactives Cliquables) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <GraduationCap size={16} className="text-indigo-400" />
                <span>2. Sélection de la Faculté de rattachement :</span>
              </h2>
              <span className="text-xs text-slate-500 font-mono">2 Facultés Officielles</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Carte FS */}
              <div
                onClick={() => handleSelectFaculty('FS')}
                className={`p-6 rounded-3xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between space-y-4 ${
                  formData.faculty === 'FS'
                    ? FACULTIES_CONFIG.FS.activeBg
                    : 'bg-slate-900/60 border-slate-800 hover:border-indigo-500/40 hover:bg-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      FS · Ngoa-Ekellé
                    </span>
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                        formData.faculty === 'FS'
                          ? 'bg-indigo-600 border-indigo-400 text-white'
                          : 'border-slate-700 bg-slate-950 text-transparent'
                      }`}
                    >
                      <Check size={14} />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1">
                    Faculté des Sciences (FS)
                  </h3>
                  <p className="text-xs text-indigo-300 font-medium mb-2">
                    7 Filières Scientifiques Majeures
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {FACULTIES_CONFIG.FS.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-800">
                    {FACULTIES_CONFIG.FS.filieres.map((f) => (
                      <span
                        key={f.id}
                        className="px-2 py-0.5 rounded-lg text-[10px] font-mono bg-slate-950 text-slate-300 border border-slate-800"
                      >
                        {f.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-indigo-400 font-bold">
                  <span>Sélectionner la Faculté des Sciences</span>
                  <ArrowRight size={14} />
                </div>
              </div>

              {/* Carte FALSH */}
              <div
                onClick={() => handleSelectFaculty('FALSH')}
                className={`p-6 rounded-3xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between space-y-4 ${
                  formData.faculty === 'FALSH'
                    ? FACULTIES_CONFIG.FALSH.activeBg
                    : 'bg-slate-900/60 border-slate-800 hover:border-amber-500/40 hover:bg-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      FALSH · Campus Château
                    </span>
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                        formData.faculty === 'FALSH'
                          ? 'bg-amber-500 border-amber-400 text-slate-950 font-bold'
                          : 'border-slate-700 bg-slate-950 text-transparent'
                      }`}
                    >
                      <Check size={14} />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1">
                    Faculté des Arts, Lettres et Sciences Humaines (FALSH)
                  </h3>
                  <p className="text-xs text-amber-300 font-medium mb-2">
                    19 Filières Officielles (3 Départements / Domaines)
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {FACULTIES_CONFIG.FALSH.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-800">
                    {FACULTIES_CONFIG.FALSH.departments.map((d) => (
                      <span
                        key={d.id}
                        className="px-2 py-0.5 rounded-lg text-[10px] font-mono bg-slate-950 text-amber-300 border border-slate-800"
                      >
                        {d.title} ({d.filieres.length})
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-amber-400 font-bold">
                  <span>Sélectionner la FALSH</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </div>
          </div>

          {/* 1.3 Filtrage Dynamique Instantané de la Filière */}
          {formData.faculty && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: currentFacultyConfig?.accentHex || '#6366f1' }}
                    />
                    <span>3. Choisissez votre Filière ({currentFacultyConfig?.shortName}) :</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Filière sélectionnée : <strong className="text-white">{formData.filiere || 'Aucune sélection'}</strong>
                  </p>
                </div>

                {/* Si FALSH : Filtres dynamiques par département */}
                {formData.faculty === 'FALSH' && (
                  <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs">
                    <button
                      type="button"
                      onClick={() => setActiveFalshTab('all')}
                      className={`px-3 py-1 rounded-xl font-bold transition-all ${
                        activeFalshTab === 'all'
                          ? 'bg-amber-500 text-slate-950 shadow-xs'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Toutes (19)
                    </button>
                    {FACULTIES_CONFIG.FALSH.departments.map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setActiveFalshTab(d.id)}
                        className={`px-3 py-1 rounded-xl font-bold transition-all ${
                          activeFalshTab === d.id
                            ? 'bg-amber-500 text-slate-950 shadow-xs'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        {d.title} ({d.filieres.length})
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Grille des Filières */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                {displayedFilieres.map((filiere) => {
                  const isSelected = formData.filiere === filiere.id;
                  const FiliereIcon = filiere.icon || BookOpen;

                  return (
                    <div
                      key={filiere.id}
                      onClick={() => updateFormField('filiere', filiere.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 text-left ${
                        isSelected
                          ? formData.faculty === 'FS'
                            ? 'bg-indigo-950/70 border-indigo-500 shadow-md ring-1 ring-indigo-500/40'
                            : 'bg-amber-950/70 border-amber-500 shadow-md ring-1 ring-amber-500/40'
                          : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected
                            ? formData.faculty === 'FS'
                              ? 'bg-indigo-600 text-white'
                              : 'bg-amber-500 text-slate-950'
                            : 'bg-slate-900 border border-slate-800 text-slate-400'
                        }`}
                      >
                        <FiliereIcon size={17} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <h4 className="text-xs font-bold text-white truncate">
                            {filiere.name}
                          </h4>
                          <span className="text-[10px] font-mono text-slate-400">
                            {filiere.code}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                          {filiere.desc}
                        </p>
                        {filiere.deptTitle && (
                          <span className="inline-block mt-1 text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-900 text-amber-300 border border-slate-800">
                            {filiere.deptTitle}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bouton pour Continuer vers l'Étape 2 */}
              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  type="button"
                  onClick={handleProceedToStep2}
                  disabled={!formData.university || !formData.faculty || !formData.filiere}
                  className={`px-6 py-3 rounded-2xl text-xs font-extrabold text-white flex items-center gap-2 shadow-xl transition-all cursor-pointer ${
                    formData.faculty === 'FS'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-indigo-600/30'
                      : 'bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 shadow-amber-600/30'
                  }`}
                >
                  <span>Continuer vers l'inscription</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* 📌 ÉTAPE 2 : Formulaire d'Inscription & Photo en Premier Plan   */}
      {/* ============================================================== */}
      {currentStep === 2 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Rappel Visuel du Cursus Choisi en Haut */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span
                className="w-3.5 h-3.5 rounded-full"
                style={{ backgroundColor: currentFacultyConfig?.accentHex || '#6366f1' }}
              />
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  Cursus Validé à l'Étape 1 :
                </span>
                <div className="text-sm font-bold text-white flex flex-wrap items-center gap-2">
                  <span>{formData.university}</span>
                  <span className="text-slate-600">/</span>
                  <span className="text-indigo-300">{currentFacultyConfig?.name || formData.faculty}</span>
                  <span className="text-slate-600">/</span>
                  <span className="text-amber-400 font-mono">Filière {formData.filiere}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-800 text-slate-300 hover:bg-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft size={13} />
              <span>Modifier Université / Filière</span>
            </button>
          </div>

          {/* Grille 2 Colonnes : Formulaire (Gauche) & Carte Virtuelle (Droite) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Colonne Gauche : Formulaire d'Inscription Complet (7 cols) */}
            <form
              onSubmit={handleSubmitFinal}
              className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5"
            >
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <User size={16} className="text-indigo-400" />
                  <span>Dossier d'Identification & Inscription Étudiante</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Importez votre photo d'identité et renseignez vos coordonnées pour valider votre profil.
                </p>
              </div>

              {/* 📷 MISE EN AVANT DE LA PHOTO (EN PREMIER LIEU TOUT EN HAUT) */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-950/90 to-indigo-950/30 border border-indigo-500/20 shadow-inner">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Cercle d'Avatar avec effet Hover */}
                  <div className="relative group shrink-0">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-indigo-500/60 p-0.5 shadow-xl bg-slate-900 transition-all group-hover:border-indigo-400 group-hover:scale-105">
                      {formData.avatarUrl ? (
                        <img
                          src={formData.avatarUrl}
                          alt="Avatar officiel"
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-slate-900 flex flex-col items-center justify-center text-slate-400 group-hover:text-white transition-colors">
                          <Camera size={22} className="text-indigo-400 group-hover:scale-110 transition-transform" />
                          <span className="text-[9px] font-mono mt-0.5 opacity-80">Photo</span>
                        </div>
                      )}
                    </div>

                    {/* Badge caméra au survol */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-lg border border-slate-950 transition-transform active:scale-95 cursor-pointer"
                      title="Changer de photo"
                    >
                      <Upload size={12} />
                    </button>
                  </div>

                  {/* Actions & Explications de l'Avatar */}
                  <div className="flex-1 text-center sm:text-left space-y-1.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-white flex items-center justify-center sm:justify-start gap-1.5">
                        <Camera size={13} className="text-amber-400" />
                        <span>Photo de profil / Avatar officiel (Recommandé)</span>
                      </h4>
                      {formData.avatarUrl && (
                        <span className="text-[10px] text-emerald-400 font-mono flex items-center justify-center gap-1">
                          <CheckCircle size={11} /> Photo chargée
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      Positionnée en premier plan pour personnaliser votre carte d'étudiant numérique officielle. Formats : JPG, PNG ou WebP (max 4 Mo).
                    </p>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600/90 hover:bg-indigo-600 text-white flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                      >
                        <Upload size={12} />
                        <span>{formData.avatarUrl ? 'Changer la photo' : 'Importer ma photo'}</span>
                      </button>

                      {formData.avatarUrl && (
                        <button
                          type="button"
                          onClick={handleRemoveAvatar}
                          className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-950 hover:bg-rose-950/60 border border-slate-800 text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <Trash2 size={12} />
                          <span>Supprimer</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 📝 CHAMPS DU FORMULAIRE : Nom & Prénom */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label htmlFor={lastNameId} className="block text-xs font-semibold text-slate-300 mb-1">
                    Nom de famille *
                  </label>
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      id={lastNameId}
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => updateFormField('lastName', e.target.value)}
                      placeholder="Ex: Kamga Fotso"
                      className={`w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        formErrors.lastName ? 'border-rose-500' : 'border-slate-800'
                      }`}
                    />
                  </div>
                  {formErrors.lastName && (
                    <span className="text-[10px] text-rose-400 mt-0.5 block">{formErrors.lastName}</span>
                  )}
                </div>

                <div>
                  <label htmlFor={firstNameId} className="block text-xs font-semibold text-slate-300 mb-1">
                    Prénom(s)
                  </label>
                  <input
                    id={firstNameId}
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => updateFormField('firstName', e.target.value)}
                    placeholder="Ex: Alain Boris"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Nom d'utilisateur (Username) & Adresse Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label htmlFor={usernameId} className="block text-xs font-semibold text-slate-300 mb-1">
                    Nom d'utilisateur (Username)
                  </label>
                  <input
                    id={usernameId}
                    type="text"
                    value={formData.username}
                    onChange={(e) => updateFormField('username', e.target.value)}
                    placeholder="Ex: akamga"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label htmlFor={emailId} className="block text-xs font-semibold text-slate-300 mb-1">
                    Adresse Email institutionnelle *
                  </label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      id={emailId}
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => updateFormField('email', e.target.value)}
                      placeholder="alain.kamga@uy1.uninet.cm"
                      className={`w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        formErrors.email ? 'border-rose-500' : 'border-slate-800'
                      }`}
                    />
                  </div>
                  {formErrors.email && (
                    <span className="text-[10px] text-rose-400 mt-0.5 block">{formErrors.email}</span>
                  )}
                </div>
              </div>

              {/* Mot de passe (avec Affichage / Masquage) */}
              <div>
                <label htmlFor={passwordId} className="block text-xs font-semibold text-slate-300 mb-1">
                  Mot de passe confidentiel *
                </label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    id={passwordId}
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => updateFormField('password', e.target.value)}
                    placeholder="Minimum 6 caractères"
                    className={`w-full pl-9 pr-10 py-2 rounded-xl bg-slate-950 border text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      formErrors.password ? 'border-rose-500' : 'border-slate-800'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                    title={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {formErrors.password && (
                  <span className="text-[10px] text-rose-400 mt-0.5 block">{formErrors.password}</span>
                )}
              </div>

              {/* Matricule (ex: 23Y1234) */}
              <div>
                <label htmlFor={matriculeId} className="block text-xs font-semibold text-slate-300 mb-1">
                  Matricule officiel de l'étudiant *
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id={matriculeId}
                    type="text"
                    required
                    value={formData.matricule}
                    onChange={(e) => updateFormField('matricule', e.target.value)}
                    placeholder="Ex: 23Y1234"
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleGenerateMatricule}
                    className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 cursor-pointer"
                  >
                    Générer
                  </button>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Format standard : Année (23) + Code Campus (Y) + N° Unique
                </span>
              </div>

              {/* Niveau d'études (Badges : L1, L2, L3, M1, M2) */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Niveau d'études académique *
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {STUDY_LEVELS.map((lvl) => {
                    const isLvlSelected = formData.level === lvl.id;
                    return (
                      <button
                        key={lvl.id}
                        type="button"
                        onClick={() => updateFormField('level', lvl.id)}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          isLvlSelected
                            ? formData.faculty === 'FS'
                              ? 'bg-indigo-600 border-indigo-500 text-white font-bold shadow-md'
                              : 'bg-amber-500 border-amber-400 text-slate-950 font-bold shadow-md'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="text-xs font-bold font-mono">{lvl.code}</div>
                        <div className="text-[9px] opacity-80 mt-0.5">{lvl.label.split(' ')[0]}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Validation Finalisée : Bouton de Soumission */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-800 text-slate-300 hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft size={13} />
                  <span>Retour</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-3 rounded-2xl text-xs font-extrabold text-white flex items-center gap-2 shadow-xl transition-all cursor-pointer ${
                    formData.faculty === 'FS'
                      ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-indigo-600/30'
                      : 'bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 shadow-amber-600/30 text-slate-950 font-black'
                  }`}
                >
                  <ShieldCheck size={16} />
                  <span>{isSubmitting ? 'Création en cours...' : 'Créer mon compte & Accéder à CampusHub'}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </form>

            {/* Colonne Droite : Carte Étudiante Virtuelle en Direct (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Sparkles size={13} className="text-amber-400" />
                  <span>Carte Étudiante Virtuelle CampusHub</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Aperçu en Direct</span>
                </span>
              </div>

              {/* Badge Graphique de l'Étudiant */}
              <div className="relative rounded-3xl overflow-hidden p-6 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 shadow-2xl space-y-5">
                {/* En-tête de la Carte avec Logo & NFC */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md">
                      <GraduationCap size={18} />
                    </div>
                    <div>
                      <div className="text-xs font-black text-white tracking-wide">
                        CAMPUSHUB PASS
                      </div>
                      <div className="text-[9px] font-mono text-slate-400 uppercase">
                        {formData.university}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-slate-500">
                    <Wifi size={15} className="rotate-90 text-indigo-400" />
                    <span className="text-[9px] font-mono uppercase bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
                      NFC Pass
                    </span>
                  </div>
                </div>

                {/* Photo & Identité de l'Étudiant */}
                <div className="flex items-center gap-4">
                  {formData.avatarUrl ? (
                    <img
                      src={formData.avatarUrl}
                      alt={displayName}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500/60 shadow-lg shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-700 via-purple-700 to-amber-600 flex items-center justify-center font-bold text-white text-lg tracking-wider border-2 border-white/20 shrink-0 shadow-lg">
                      {userInitials}
                    </div>
                  )}

                  <div className="space-y-0.5 min-w-0 flex-1">
                    <div className="text-sm font-black text-white truncate leading-tight">
                      {displayName}
                    </div>
                    <div className="text-[11px] font-mono text-indigo-400 font-bold">
                      Matricule : {formData.matricule || '23Y----'}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {formData.email || 'etudiant@uy1.uninet.cm'}
                    </div>
                  </div>
                </div>

                {/* Badges Faculté & Niveau */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-0.5">
                    <div className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">
                      Faculté
                    </div>
                    <div className="text-[11px] font-bold text-white flex items-center gap-1.5 truncate">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: currentFacultyConfig?.accentHex || '#6366f1' }}
                      />
                      <span className="truncate">{formData.faculty === 'FS' ? 'Sciences (FS)' : 'FALSH'}</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-0.5">
                    <div className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">
                      Niveau
                    </div>
                    <div className="text-[11px] font-mono font-bold text-amber-400">
                      {formData.level} · {STUDY_LEVELS.find((l) => l.id === formData.level)?.label}
                    </div>
                  </div>
                </div>

                {/* Filière Complète */}
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <div className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">
                      Filière académique
                    </div>
                    <div className="text-xs font-bold text-slate-200 truncate">
                      {formData.filiere || 'Filière non définie'}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    UY1 Pass
                  </span>
                </div>

                {/* QR Code & Homologation */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                  <div className="flex items-center gap-2">
                    <QrCode size={26} className="text-slate-400" />
                    <div>
                      <div className="font-mono text-slate-400">ID: UY1-{formData.matricule || '23Y----'}</div>
                      <div>Certifié MINESUP Cameroun</div>
                    </div>
                  </div>

                  <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Valide 2025-2026
                  </span>
                </div>
              </div>

              {/* Rappel des Espaces Débloqués */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs space-y-2">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <CheckCircle size={13} className="text-emerald-400" />
                  <span>Espaces Débloqués après Création :</span>
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {formData.faculty === 'FS'
                    ? 'Accès immédiat aux laboratoires virtuels de la Faculté des Sciences (CodePlayground C/Python/SQL, simulations Chimie & Physique).'
                    : 'Accès immédiat au pôle FALSH Hub (Assistant méthodologique, dictionnaire des 25 figures de style, générateur de citations APA/MLA).'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
