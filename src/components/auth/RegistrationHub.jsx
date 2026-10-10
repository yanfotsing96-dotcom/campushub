import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  CheckCircle2,
  ArrowRight,
  Search,
  Building,
  Sparkles,
  BookOpen,
  Cpu,
  FlaskConical,
  Atom,
  Binary,
  Dna,
  Mountain,
  Languages,
  Compass,
  Palette,
  Film,
  Landmark,
  ShieldCheck,
  Check,
  User,
  Mail,
  ChevronRight,
  ChevronLeft,
  Zap,
  BookMarked,
  Layers,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../constants/rbacConstants';
import { storageService } from '../../services/storageService';
import { STORAGE_KEYS } from '../../constants/academicConstants';

/**
 * Données Officielles des Facultés & Filières - Université de Yaoundé I (UY1)
 */
const UY1_FACULTIES = {
  FS: {
    id: 'FS',
    name: 'Faculté des Sciences (FS)',
    shortName: 'Faculté des Sciences',
    code: 'FS',
    badge: 'Pôle Scientifique & Recherche',
    campus: 'Campus Principal de Ngoa-Ekellé',
    color: 'indigo',
    accentHex: '#6366f1',
    borderClass: 'border-indigo-500/40 hover:border-indigo-500',
    bgActive: 'bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/30',
    description: 'Sciences fondamentales, informatique, modélisation mathématique et laboratoires expérimentaux.',
    targetHub: '/dashboard',
    toolsList: [
      'Playground multi-langages (C, Python, SQL, HTML/JS)',
      'Laboratoire virtuel de Chimie (Molarité, pH, Équations)',
      'Simulateurs de Physique (RLC, Optique, Mécanique, Quantique)',
      'Atlas cellulaire de Biologie & génétique mendélienne',
    ],
    filieres: [
      { id: 'Informatique', name: 'Informatique', code: 'INF', icon: Cpu, desc: 'Génie logiciel, algorithmique, IA & systèmes d\'exploitation' },
      { id: 'Chimie', name: 'Chimie', code: 'CHM', icon: FlaskConical, desc: 'Chimie organique, minérale, cinétique & génie des procédés' },
      { id: 'Physique', name: 'Physique', code: 'PHY', icon: Atom, desc: 'Mécanique quantique, électromagnétisme, optique & RLC' },
      { id: 'Mathématiques', name: 'Mathématiques', code: 'MAT', icon: Binary, desc: 'Algèbre linéaire, analyse réelle, probabilités & statistiques' },
      { id: 'Biochimie', name: 'Biochimie', code: 'BCH', icon: Dna, desc: 'Enzymologie, métabolisme, génétique & biotechnologies' },
      { id: 'Biologie', name: 'Biologie', code: 'BIO', icon: Dna, desc: 'Biologie animale, végétale, microbiologie & écologie' },
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
    color: 'amber',
    accentHex: '#f59e0b',
    borderClass: 'border-amber-500/40 hover:border-amber-500',
    bgActive: 'bg-amber-950/40 border-amber-500 ring-2 ring-amber-500/30',
    description: 'Littératures patrimoniales, linguistique, sciences sociales, philosophie et études patrimoniales.',
    targetHub: '/falsh-hub',
    toolsList: [
      'Assistant de dissertation en 3 parties & commentaire composé',
      'Guide interactif des 25 figures de style avec double corpus classique & africain',
      'Générateur de citations et bibliographies certifié APA, MLA, Chicago / ISO',
      'Banque de fiches de lecture intégrales (Césaire, Oyono, Towa, Histoire nationale)',
    ],
    domaines: [
      {
        id: 'langues',
        nom: 'Lettres & Langues',
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
        nom: 'Sciences Humaines & Sociales',
        badge: 'Société & Pensée',
        filieres: [
          { id: 'Anthropologie', name: 'Anthropologie', code: 'ANT', icon: User, desc: 'Ethnographie, cultures matérielles et anthropologie du développement' },
          { id: 'Géographie', name: 'Géographie', code: 'GEO', icon: Compass, desc: 'Aménagement du territoire, géomatique, climatologie et cartographie' },
          { id: 'Histoire', name: 'Histoire', code: 'HIS', icon: Landmark, desc: 'Histoire précoloniale de l\'Afrique, historiographie et Cameroun contemporain' },
          { id: 'Langues africaines et linguistique', name: 'Langues africaines et linguistique', code: 'LAL', icon: Languages, desc: 'Description des langues nationales camerounaises, alphabets et phonologie' },
          { id: 'Linguistique générale et appliquée', name: 'Linguistique générale et appliquée', code: 'LIN', icon: BookOpen, desc: 'Morphosyntaxe, pragmatique, sociolinguistique et Camfranglais' },
          { id: 'Philosophie', name: 'Philosophie', code: 'PHI', icon: Sparkles, desc: 'Logique formelle, philosophie africaine (Towa, Eboussi) et éthique politique' },
          { id: 'Psychologie', name: 'Psychologie', code: 'PSY', icon: User, desc: 'Psychologie clinique, cognitive, du travail et psychopathologie' },
          { id: 'Sciences du langage', name: 'Sciences du langage', code: 'SDL', icon: Languages, desc: 'Analyse du discours, sémiotique textuelle et communication' },
          { id: 'Sociologie', name: 'Sociologie', code: 'SOC', icon: Building, desc: 'Sociologie des organisations, mutations urbaines et développement' },
        ],
      },
      {
        id: 'arts',
        nom: 'Arts & Industries Culturelles',
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

const ACADEMIC_LEVELS_LIST = [
  { id: 'L1', label: 'Licence 1 (L1)', cycle: 'Premier Cycle' },
  { id: 'L2', label: 'Licence 2 (L2)', cycle: 'Premier Cycle' },
  { id: 'L3', label: 'Licence 3 (L3)', cycle: 'Premier Cycle' },
  { id: 'M1', label: 'Master 1 (M1)', cycle: 'Second Cycle' },
  { id: 'M2', label: 'Master 2 (M2)', cycle: 'Second Cycle' },
  { id: 'Doctorat', label: 'Doctorat / Ph.D', cycle: 'Troisième Cycle' },
];

export default function RegistrationHub({ onSuccessRedirect }) {
  const navigate = useNavigate();
  const { user, register, updateProfile } = useAuth();

  // Étape courante (1 = Faculté, 2 = Filière & Niveau, 3 = Informations & Validation)
  const [currentStep, setCurrentStep] = useState(1);

  // État de sélection
  const [selectedFaculty, setSelectedFaculty] = useState('FS'); // 'FS' | 'FALSH'
  const [selectedFiliere, setSelectedFiliere] = useState('Informatique');
  const [selectedNiveau, setSelectedNiveau] = useState('L1');
  const [activeFalshDomaine, setActiveFalshDomaine] = useState('all'); // 'all' | 'langues' | 'humaines' | 'arts'
  const [searchFilter, setSearchFilter] = useState('');

  // Informations de profil étudiant
  const [studentNom, setStudentNom] = useState(user?.nom || user?.fullName || '');
  const [studentPrenom, setStudentPrenom] = useState(user?.prenom || '');
  const [studentMatricule, setStudentMatricule] = useState(() => {
    return user?.matricule || '26U1042';
  });
  const [studentEmail, setStudentEmail] = useState(user?.email || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState(null);

  // Configuration de la faculté sélectionnée
  const facultyConfig = UY1_FACULTIES[selectedFaculty];

  // Gestion du basculement de faculté (Étape 1 -> Étape 2 automatique)
  const handleSelectFaculty = (facultyId) => {
    setSelectedFaculty(facultyId);
    setSearchFilter('');
    if (facultyId === 'FS') {
      setSelectedFiliere('Informatique');
    } else {
      setSelectedFiliere('Lettres modernes françaises');
      setActiveFalshDomaine('all');
    }
    // Avancement fluide vers l'étape suivante
    setCurrentStep(2);
  };

  // Liste plate ou filtrée des filières de la faculté
  const displayedFilieres = useMemo(() => {
    if (selectedFaculty === 'FS') {
      return facultyConfig.filieres.filter((f) =>
        f.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        f.desc.toLowerCase().includes(searchFilter.toLowerCase())
      );
    }

    // Pour la FALSH : aplatit selon le domaine
    let allFALSH = [];
    facultyConfig.domaines.forEach((dom) => {
      if (activeFalshDomaine === 'all' || activeFalshDomaine === dom.id) {
        dom.filieres.forEach((f) => {
          allFALSH.push({ ...f, domaineNom: dom.nom, domaineId: dom.id });
        });
      }
    });

    if (!searchFilter.trim()) return allFALSH;

    return allFALSH.filter((f) =>
      f.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      f.desc.toLowerCase().includes(searchFilter.toLowerCase()) ||
      f.domaineNom.toLowerCase().includes(searchFilter.toLowerCase())
    );
  }, [selectedFaculty, facultyConfig, activeFalshDomaine, searchFilter]);

  // Génération automatique d'un nouveau matricule UY1 conforme
  const handleRegenerateMatricule = () => {
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    setStudentMatricule(`26U${randomCode}`);
  };

  // Validation finale du profil & synchronisation multi-niveaux
  const handleValidateRegistration = async (e) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);

    try {
      const finalNom = studentNom.trim() || 'Étudiant UY1';
      const finalPrenom = studentPrenom.trim();
      const finalFullName = finalPrenom ? `${finalPrenom} ${finalNom}` : finalNom;
      const finalEmail = studentEmail.trim() || `${studentMatricule.toLowerCase()}@uy1.uninet.cm`;

      const payload = {
        nom: finalNom,
        prenom: finalPrenom,
        fullName: finalFullName,
        name: finalFullName,
        matricule: studentMatricule.trim().toUpperCase(),
        email: finalEmail,
        filiere: selectedFiliere,
        filiereId: selectedFiliere,
        niveau: selectedNiveau,
        faculty: selectedFaculty,
        faculte: facultyConfig.name,
        universityId: 'UY1',
        universityName: 'Université de Yaoundé I',
        role: ROLES.STUDENT,
        isPro: true,
      };

      // 1. Sauvegarde dans le State Global d'Authentification
      if (user && user.id) {
        updateProfile(payload);
      } else {
        register(payload);
      }

      // 2. Synchronisation directe des clés localStorage pour tous les modules
      try {
        localStorage.setItem('campushub_user_filiere', selectedFiliere);
        localStorage.setItem('campushub_user_niveau', selectedNiveau);
        localStorage.setItem('campushub_user_faculty', selectedFaculty);
        localStorage.setItem('campushub_selected_university', 'UY1');
        storageService.set(STORAGE_KEYS.AUTH_USER, payload);
      } catch (err) {
        console.warn('Storage sync warning:', err);
      }

      // 3. Déclenchement de l'événement système de mise à jour du profil
      window.dispatchEvent(new CustomEvent('campushub:auth_changed', { detail: payload }));

      setNotificationMsg(`Profil synchronisé avec succès ! Redirection vers vos espaces...`);

      // 4. Redirection vers l'espace de travail dédié
      setTimeout(() => {
        setIsSubmitting(false);
        if (onSuccessRedirect) {
          onSuccessRedirect(payload);
        } else {
          // Redirection intelligente selon la faculté
          if (selectedFaculty === 'FALSH') {
            navigate('/falsh-hub');
          } else if (selectedFiliere === 'Informatique') {
            navigate('/tech-hub');
          } else {
            navigate('/dashboard');
          }
        }
      }, 700);
    } catch (error) {
      console.error('Erreur lors de la validation :', error);
      setIsSubmitting(false);
      setNotificationMsg('Une erreur est survenue lors de l\'enregistrement.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 text-slate-100 text-left">
      {/* 1. En-tête Principal Institutionnel */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl transition-all">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              <Building size={13} />
              <span>Portail Officiel d'Inscription · Université de Yaoundé I (UY1)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Orientation Académique & Profilage Étudiant
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Sélectionnez votre faculté pour filtrer dynamiquement vos filières officielles et activer les outils pratiques correspondants (Playgrounds scientifiques ou Pôle Lettres & Humanités).
            </p>
          </div>

          {/* Stepper des 3 Étapes */}
          <div className="flex items-center gap-2 self-start md:self-auto bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            {[
              { num: 1, label: 'Faculté' },
              { num: 2, label: 'Filière' },
              { num: 3, label: 'Finalisation' },
            ].map((step) => {
              const isActive = currentStep === step.num;
              const isPast = currentStep > step.num;
              return (
                <button
                  key={step.num}
                  type="button"
                  onClick={() => setCurrentStep(step.num)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md'
                      : isPast
                      ? 'bg-slate-800 text-emerald-400'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-mono bg-white/20">
                    {isPast ? <Check size={10} /> : step.num}
                  </span>
                  <span className="hidden sm:inline">{step.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Message de notification si opération réussie */}
      {notificationMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-300">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* ============================================================== */}
      {/* ÉTAPE 1 : Choix de la Faculté (FS ou FALSH)                   */}
      {/* ============================================================== */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <GraduationCap size={16} className="text-indigo-400" />
              <span>Étape 1 · Sélectionnez votre Faculté de rattachement à UY1 :</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Carte Faculté des Sciences (FS) */}
            <div
              onClick={() => handleSelectFaculty('FS')}
              className={`p-6 rounded-3xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between space-y-4 ${
                selectedFaculty === 'FS'
                  ? UY1_FACULTIES.FS.bgActive
                  : 'bg-slate-900 border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900/90'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    FS · Ngoa-Ekellé
                  </span>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                      selectedFaculty === 'FS'
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
                <p className="text-xs text-indigo-300/90 font-medium mb-3">
                  7 Filières Scientifiques Majeures
                </p>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {UY1_FACULTIES.FS.description}
                </p>

                {/* Échantillon des filières */}
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/80">
                  {UY1_FACULTIES.FS.filieres.map((f) => (
                    <span
                      key={f.id}
                      className="px-2 py-0.5 rounded-lg text-[10px] font-mono bg-slate-950/80 text-slate-300 border border-slate-800"
                    >
                      {f.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-indigo-400 font-bold">
                <span>Accès aux Playgrounds & Labos</span>
                <ArrowRight size={14} />
              </div>
            </div>

            {/* Carte Faculté des Arts, Lettres et Sciences Humaines (FALSH) */}
            <div
              onClick={() => handleSelectFaculty('FALSH')}
              className={`p-6 rounded-3xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between space-y-4 ${
                selectedFaculty === 'FALSH'
                  ? UY1_FACULTIES.FALSH.bgActive
                  : 'bg-slate-900 border-slate-800 hover:border-amber-500/50 hover:bg-slate-900/90'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    FALSH · Campus Château
                  </span>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                      selectedFaculty === 'FALSH'
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
                <p className="text-xs text-amber-300/90 font-medium mb-3">
                  19 Filières Officielles (3 Pôles d'Excellence)
                </p>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {UY1_FACULTIES.FALSH.description}
                </p>

                {/* Échantillon des domaines */}
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/80">
                  {UY1_FACULTIES.FALSH.domaines.map((d) => (
                    <span
                      key={d.id}
                      className="px-2 py-0.5 rounded-lg text-[10px] font-mono bg-slate-950/80 text-amber-300/80 border border-slate-800"
                    >
                      {d.nom} ({d.filieres.length})
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-amber-400 font-bold">
                <span>Accès à l'Assistant Dissertation & Figures de Style</span>
                <ArrowRight size={14} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* ÉTAPE 2 : Filtrage Dynamique en Cascade des Filières & Niveau */}
      {/* ============================================================== */}
      {currentStep === 2 && (
        <div className="space-y-5">
          {/* Bannière de Faculté Active */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: facultyConfig.accentHex }}
              />
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  Faculté choisie :
                </span>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span>{facultyConfig.name}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-800 text-slate-300 hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
            >
              <ChevronLeft size={13} />
              <span>Changer de Faculté</span>
            </button>
          </div>

          {/* Si FALSH : Sélecteur de Domaines (Lettres, Humaines, Arts) */}
          {selectedFaculty === 'FALSH' && (
            <div className="flex flex-wrap items-center gap-2 bg-slate-900 p-2 rounded-2xl border border-slate-800">
              <span className="text-xs font-bold text-slate-400 px-2 flex items-center gap-1.5">
                <Layers size={13} className="text-amber-400" />
                <span>Domaine :</span>
              </span>

              <button
                type="button"
                onClick={() => setActiveFalshDomaine('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeFalshDomaine === 'all'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Toutes les 19 filières
              </button>

              {UY1_FACULTIES.FALSH.domaines.map((dom) => (
                <button
                  key={dom.id}
                  type="button"
                  onClick={() => setActiveFalshDomaine(dom.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeFalshDomaine === dom.id
                      ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {dom.nom} ({dom.filieres.length})
                </button>
              ))}
            </div>
          )}

          {/* Barre de Recherche Rapide dans les Filières */}
          <div className="relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder={`Rechercher une filière en ${facultyConfig.shortName} (ex: info, philo, anglais, sociologie)...`}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Grille des Filières Disponibles */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Filières officielles disponibles ({displayedFilieres.length}) :</span>
              <span className="font-mono text-[11px]">Cliquez sur votre filière</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {displayedFilieres.map((filiere) => {
                const isSelected = selectedFiliere === filiere.id;
                const FiliereIcon = filiere.icon || BookOpen;

                return (
                  <div
                    key={filiere.id}
                    onClick={() => setSelectedFiliere(filiere.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? selectedFaculty === 'FS'
                          ? 'bg-indigo-950/60 border-indigo-500 shadow-md ring-1 ring-indigo-500/50'
                          : 'bg-amber-950/60 border-amber-500 shadow-md ring-1 ring-amber-500/50'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isSelected
                          ? selectedFaculty === 'FS'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-amber-500 text-slate-950'
                          : 'bg-slate-950 border border-slate-800 text-slate-400'
                      }`}
                    >
                      <FiliereIcon size={18} />
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
                      <p className="text-[11px] text-slate-400 leading-tight line-clamp-2">
                        {filiere.desc}
                      </p>
                      {filiere.domaineNom && (
                        <span className="inline-block mt-1 text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-950 text-amber-300/80 border border-slate-800">
                          {filiere.domaineNom}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Choix du Niveau d'Études (L1 à Doctorat) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <GraduationCap size={15} className="text-indigo-400" />
              <span>Niveau Académique Actuel (Promotion 2025-2026) :</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {ACADEMIC_LEVELS_LIST.map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setSelectedNiveau(lvl.id)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    selectedNiveau === lvl.id
                      ? selectedFaculty === 'FS'
                        ? 'bg-indigo-600 border-indigo-500 text-white font-bold shadow-md'
                        : 'bg-amber-500 border-amber-400 text-slate-950 font-black shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="text-xs font-bold">{lvl.id}</div>
                  <div className="text-[10px] opacity-80 mt-0.5">{lvl.cycle.split(' ')[0]}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Boutons d'Action vers Étape 3 */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-800 text-slate-300 hover:bg-slate-800 flex items-center gap-1.5"
            >
              <ChevronLeft size={14} />
              <span>Retour</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <span>Continuer vers mes informations</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* ÉTAPE 3 : Informations Personnelles & Validation Profil        */}
      {/* ============================================================== */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Formulaire des Coordonnées (7 colonnes) */}
            <form
              onSubmit={handleValidateRegistration}
              className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4"
            >
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <User size={15} className="text-indigo-400" />
                  <span>Dossier d'Inscription de l'Étudiant</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Remplissez vos coordonnées pour certifier votre compte institutionnel UY1.
                </p>
              </div>

              {/* Nom & Prénom */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Nom de famille :
                  </label>
                  <input
                    type="text"
                    required
                    value={studentNom}
                    onChange={(e) => setStudentNom(e.target.value)}
                    placeholder="Ex: Kamga Fotso"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Prénom(s) :
                  </label>
                  <input
                    type="text"
                    value={studentPrenom}
                    onChange={(e) => setStudentPrenom(e.target.value)}
                    placeholder="Ex: Alain Boris"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Matricule UY1 avec bouton de régénération */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Matricule Universitaire Officiel :
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    value={studentMatricule}
                    onChange={(e) => setStudentMatricule(e.target.value)}
                    placeholder="Ex: 26U1420"
                    className="flex-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleRegenerateMatricule}
                    className="px-3 py-2.5 rounded-xl text-xs font-semibold bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800"
                    title="Générer un matricule aléatoire"
                  >
                    Générer
                  </button>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Format standard MINESUP : Année + Lettre Université + Numéro (ex: 26U...)
                </span>
              </div>

              {/* Email Académique */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Adresse e-mail institutionnelle :
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    placeholder={`${studentMatricule.toLowerCase()}@uy1.uninet.cm`}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Bouton de Validation du Profil */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-800 text-slate-300 hover:bg-slate-800 flex items-center gap-1.5"
                >
                  <ChevronLeft size={14} />
                  <span>Modifier filière</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-3 rounded-2xl text-xs font-extrabold text-white flex items-center gap-2 shadow-xl transition-all cursor-pointer ${
                    selectedFaculty === 'FS'
                      ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
                      : 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30'
                  }`}
                >
                  <ShieldCheck size={16} />
                  <span>{isSubmitting ? 'Validation en cours...' : 'Valider mon profil & Démarrer'}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </form>

            {/* Récapitulatif & Outils Synchronisés (5 colonnes) */}
            <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                    Synthèse de votre Cloisonnement
                  </span>
                  <h4 className="text-base font-bold text-white mt-0.5">
                    {facultyConfig.name}
                  </h4>
                </div>

                {/* Badge Récapitulatif */}
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Filière choisie :</span>
                    <span className="font-bold text-white">{selectedFiliere}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Niveau d'études :</span>
                    <span className="font-mono font-bold text-indigo-400">{selectedNiveau}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Établissement :</span>
                    <span className="font-mono text-slate-300">UY1 Ngoa-Ekellé</span>
                  </div>
                </div>

                {/* Outils Immédiatement Activés */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <Zap size={13} />
                    <span>Outils Académiques Immédiatement Activés :</span>
                  </span>

                  <ul className="space-y-1.5 text-[11px] text-slate-300">
                    {facultyConfig.toolsList.map((tool, idx) => (
                      <li key={idx} className="flex items-start gap-2 p-1.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
                        <CheckCircle2 size={13} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{tool}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-500 font-mono flex items-center justify-between">
                <span>Synchronisation immédiate</span>
                <span>Portail UY1 Certifié</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
