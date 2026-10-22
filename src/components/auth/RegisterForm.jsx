import { useState, useRef, useEffect, useId, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Lock,
  ArrowRight,
  RefreshCw,
  Camera,
  Upload,
  X,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Building,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import {
  ROLES,
  ROLE_LABELS,
  ROLE_SECRET_PASSCODES,
} from '../../constants/rbacConstants';
import { CAMEROON_UNIVERSITIES } from '../../constants/academicConstants';
import {
  nationalAcademicService,
  INSTITUTIONS_REGISTRY,
  FILIERE_PROGRAMS_MAP,
} from '../../constants/nationalAcademicData';

// Quick Demonstration Presets Across Cameroon
const NATIONAL_PRESETS = [
  {
    label: 'Étudiant UY1 · Informatique L2',
    universityId: 'UY1',
    facultyId: 'UY1_FS',
    faculty: 'Faculté des Sciences (FS)',
    filiere: 'inf',
    filiereId: 'inf',
    filiereLabel: 'Informatique',
    niveau: 'L2',
    matricule: '24S1084',
    nom: 'Fotsing',
    prenom: 'Yan',
    email: 'yan.fotsing@univ-yaounde1.cm',
    role: ROLES.STUDENT,
  },
  {
    label: 'Élève-Ingénieur ENSPY · L3',
    universityId: 'ENSPY',
    facultyId: 'ENSPY_GENIE',
    faculty: 'École Nationale Supérieure Polytechnique de Yaoundé (ENSPY)',
    filiere: 'inf',
    filiereId: 'inf',
    filiereLabel: 'Génie Informatique',
    niveau: 'L3',
    matricule: '23P4092',
    nom: 'Kamga',
    prenom: 'Brice',
    email: 'b.kamga@polytechnique.cm',
    role: ROLES.STUDENT,
  },
  {
    label: 'Étudiant Univ. Douala · IA-Data',
    universityId: 'UDLA',
    facultyId: 'UDLA_FS',
    faculty: 'Faculté des Sciences (FS)',
    filiere: 'inf',
    filiereId: 'inf',
    filiereLabel: 'IA-Data',
    niveau: 'L2',
    matricule: '24D8921',
    nom: 'Bilong',
    prenom: 'Franck',
    email: 'f.bilong@univ-douala.cm',
    role: ROLES.STUDENT,
  },
  {
    label: 'Délégué Officiel · INF201 UY1',
    universityId: 'UY1',
    facultyId: 'UY1_FS',
    faculty: 'Faculté des Sciences (FS)',
    filiere: 'inf',
    filiereId: 'inf',
    filiereLabel: 'Informatique',
    niveau: 'L2',
    matricule: '23U1084',
    nom: 'Kamga',
    prenom: 'Brice',
    email: 'delegue.inf201@univ-yaounde1.cm',
    role: ROLES.DELEGATE,
    passcode: ROLE_SECRET_PASSCODES[ROLES.DELEGATE],
  },
];

export default function RegisterForm({ onSubmit, onCancel, showHeaderMotto = true }) {
  const auth = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Form State - 5-Step Academic Cascade
  const [formData, setFormData] = useState(() => ({
    nom: '',
    prenom: '',
    username: '',
    matricule: '25U' + Math.floor(1000 + Math.random() * 9000),
    email: '',
    password: '',
    universityId: 'UY1',
    facultyId: 'UY1_FS',
    faculty: 'Faculté des Sciences (FS)',
    filiere: 'inf',
    filiereLabel: 'Informatique',
    niveau: 'L2',
    role: ROLES.STUDENT,
    passcode: '',
    justification: '',
    avatar: null,
  }));

  // IDs for accessibility
  const registerNomFieldId = useId();
  const registerPrenomFieldId = useId();
  const registerUsernameFieldId = useId();
  const registerMatriculeFieldId = useId();
  const registerUniversityFieldId = useId();
  const registerFacultyFieldId = useId();
  const registerFiliereFieldId = useId();
  const registerNiveauFieldId = useId();
  const registerEmailFieldId = useId();
  const registerPasswordFieldId = useId();
  const registerAdminPrivilegeCheckboxId = useId();
  const registerPasscodeFieldId = useId();

  // Photo & Preview State
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarError, setAvatarError] = useState('');

  // Password Visibility & Validation State
  const [showPassword, setShowPassword] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  // Admin / Moderator Privilege Request Toggle
  const [requestPrivilegedAccess, setRequestPrivilegedAccess] = useState(false);
  const [selectedPrivilegedRole, setSelectedPrivilegedRole] = useState(ROLES.DELEGATE);

  // Global submission & error states
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const [passcodeError, setPasscodeError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // 1. Université sélectionnée
  const selectedUnivObj = useMemo(() => {
    return CAMEROON_UNIVERSITIES.find((u) => u.id === formData.universityId) || CAMEROON_UNIVERSITIES[0];
  }, [formData.universityId]);

  // 2. Facultés rattachées à cette université parente
  const availableInstitutions = useMemo(() => {
    const list = nationalAcademicService.getFacultiesByUniversity(formData.universityId);
    return list.length > 0 ? list : INSTITUTIONS_REGISTRY.filter((i) => i.universityId === 'UY1');
  }, [formData.universityId]);

  const currentInstitution = useMemo(() => {
    return (
      availableInstitutions.find((i) => i.id === formData.facultyId || i.name === formData.faculty) ||
      availableInstitutions[0]
    );
  }, [availableInstitutions, formData.facultyId, formData.faculty]);

  // 3. Filières officielles rattachées à la faculté choisie
  const availableFilieres = useMemo(() => {
    if (!currentInstitution) return [{ id: 'inf', label: 'Informatique', code: 'INF' }];
    const filieres = nationalAcademicService.getFilieresForFaculty(currentInstitution.id);
    return filieres.length > 0 ? filieres : [{ id: 'inf', label: 'Informatique', code: 'INF' }];
  }, [currentInstitution]);

  const currentFiliere = useMemo(() => {
    return (
      availableFilieres.find((f) => f.id === formData.filiere || f.label === formData.filiere) ||
      availableFilieres[0]
    );
  }, [availableFilieres, formData.filiere]);

  // 4. Niveaux académiques valides pour cette filière
  const availableLevels = useMemo(() => {
    if (!currentFiliere) return ['L1', 'L2', 'L3'];
    const prog = FILIERE_PROGRAMS_MAP[currentFiliere.id];
    return prog?.levels || ['L1', 'L2', 'L3'];
  }, [currentFiliere]);

  // 5. Unités d'Enseignement (UE) chargées automatiquement pour le niveau
  const loadedUes = useMemo(() => {
    if (!currentFiliere) return [];
    return nationalAcademicService.getUesByFiliereAndLevel(currentFiliere.id, formData.niveau);
  }, [currentFiliere, formData.niveau]);

  // Password validation (min 6 characters)
  const passwordLength = formData.password.length;
  const isPasswordTooShort = passwordLength > 0 && passwordLength < 6;
  const isPasswordValid = passwordLength >= 6;

  // Generate university-specific matricule
  const handleGenerateMatricule = () => {
    const yearPrefix = '26';
    let codeLetter = 'U';
    if (formData.universityId === 'ENSPY' || formData.universityId === 'ENSPD') codeLetter = 'P';
    if (formData.universityId === 'UB') codeLetter = 'B';
    if (formData.universityId === 'UDLA') codeLetter = 'D';
    if (formData.universityId === 'UDS') codeLetter = 'DS';
    if (formData.universityId === 'UN') codeLetter = 'N';
    if (formData.universityId === 'UMA') codeLetter = 'M';
    if (formData.universityId === 'UGA') codeLetter = 'G';
    if (formData.universityId === 'UBE') codeLetter = 'BE';
    if (formData.universityId === 'UEB') codeLetter = 'EB';
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const newMatricule = `${yearPrefix}${codeLetter}${randomDigits}`;
    setFormData((prev) => ({ ...prev, matricule: newMatricule }));
  };

  // Input change handler avec cascade automatique
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };

      if (name === 'universityId') {
        const institutions = nationalAcademicService.getFacultiesByUniversity(value);
        const firstInst = institutions[0] || null;
        next.facultyId = firstInst?.id || '';
        next.faculty = firstInst?.name || '';
        const filieres = firstInst ? nationalAcademicService.getFilieresForFaculty(firstInst.id) : [];
        const firstFil = filieres[0] || null;
        next.filiere = firstFil?.id || 'inf';
        next.filiereLabel = firstFil?.label || 'Informatique';
        const prog = firstFil ? FILIERE_PROGRAMS_MAP[firstFil.id] : null;
        next.niveau = prog?.levels?.[0] || 'L1';
      } else if (name === 'facultyId') {
        const inst = INSTITUTIONS_REGISTRY.find((i) => i.id === value);
        next.facultyId = value;
        next.faculty = inst?.name || value;
        const filieres = nationalAcademicService.getFilieresForFaculty(value);
        const firstFil = filieres[0] || null;
        next.filiere = firstFil?.id || 'inf';
        next.filiereLabel = firstFil?.label || 'Informatique';
        const prog = firstFil ? FILIERE_PROGRAMS_MAP[firstFil.id] : null;
        next.niveau = prog?.levels?.[0] || 'L1';
      } else if (name === 'filiere') {
        next.filiere = value;
        const filObj = availableFilieres.find((f) => f.id === value);
        next.filiereLabel = filObj?.label || value;
        const prog = FILIERE_PROGRAMS_MAP[value];
        next.niveau = prog?.levels?.[0] || 'L1';
      }

      if ((name === 'prenom' || name === 'nom') && !prev.usernameEdited) {
        const p = name === 'prenom' ? value : prev.prenom;
        const n = name === 'nom' ? value : prev.nom;
        const auto = `${p ? p.toLowerCase().trim().replace(/\s+/g, '_') : ''}${
          n ? '_' + n.toLowerCase().trim().replace(/\s+/g, '_') : ''
        }`.replace(/^_+|_+$/g, '');
        next.username = auto;
      }
      return next;
    });
    setGlobalError('');
  };

  // Password change handler
  const handlePasswordChange = (e) => {
    setPasswordTouched(true);
    setFormData((prev) => ({ ...prev, password: e.target.value }));
    setGlobalError('');
  };

  // Apply Quick Preset
  const handleApplyPreset = (preset) => {
    const univ = CAMEROON_UNIVERSITIES.find((u) => u.id === preset.universityId) || CAMEROON_UNIVERSITIES[0];
    const defaultFac = preset.faculty || univ?.faculties?.[0] || 'Faculté des Sciences (FS)';
    const facId = preset.facultyId || (preset.universityId === 'UY1' ? 'UY1_FS' : (preset.universityId + '_FAC'));
    setFormData((prev) => ({
      ...prev,
      universityId: preset.universityId,
      facultyId: facId,
      faculty: defaultFac,
      filiere: preset.filiere || 'inf',
      filiereLabel: preset.filiereLabel || 'Informatique',
      niveau: preset.niveau,
      matricule: preset.matricule,
      nom: preset.nom,
      prenom: preset.prenom,
      email: preset.email,
      username: `${preset.prenom.toLowerCase()}_${preset.nom.toLowerCase()}`,
      role: preset.role,
      passcode: preset.passcode || '',
    }));
    if (preset.role !== ROLES.STUDENT) {
      setRequestPrivilegedAccess(true);
      setSelectedPrivilegedRole(preset.role);
    } else {
      setRequestPrivilegedAccess(false);
    }
  };

  // Profile Photo Upload & Real-Time Preview
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setAvatarError('');

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setAvatarError('Seuls les formats JPG, PNG et WebP sont autorisés.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setAvatarError('La photo ne doit pas dépasser 5 Mo.');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        avatar: reader.result || previewUrl,
        photo: file,
      }));
    };
    reader.readAsDataURL(file);
  };

  // Remove selected photo
  const handleRemoveAvatar = () => {
    if (avatarPreview && avatarPreview.startsWith('blob:')) {
      URL.revokeObjectURL(avatarPreview);
    }
    setAvatarPreview(null);
    setFormData((prev) => ({ ...prev, avatar: null, photo: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview.startsWith('blob:')) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  // Privileged access toggle
  const handleTogglePrivilegedAccess = (e) => {
    const isChecked = e.target.checked;
    setRequestPrivilegedAccess(isChecked);
    setPasscodeError('');

    if (isChecked) {
      setFormData((prev) => ({
        ...prev,
        role: selectedPrivilegedRole,
        passcode: ROLE_SECRET_PASSCODES[selectedPrivilegedRole] || '',
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        role: ROLES.STUDENT,
        passcode: '',
        justification: '',
      }));
    }
  };

  const handleSelectPrivilegedRole = (r) => {
    setSelectedPrivilegedRole(r);
    setFormData((prev) => ({
      ...prev,
      role: r,
      passcode: ROLE_SECRET_PASSCODES[r] || '',
    }));
    setPasscodeError('');
  };

  // Form Validation check
  const isFormValid =
    formData.nom.trim().length > 0 &&
    formData.prenom.trim().length > 0 &&
    formData.username.trim().length > 0 &&
    formData.email.trim().length > 0 &&
    formData.matricule.trim().length > 0 &&
    formData.password.length >= 6;

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setPasswordTouched(true);
    setGlobalError('');
    setPasscodeError('');

    if (formData.password.length < 6) {
      setGlobalError('Le mot de passe doit comporter au moins 6 caractères pour sécuriser votre compte.');
      return;
    }

    if (formData.role !== ROLES.STUDENT) {
      const expected = ROLE_SECRET_PASSCODES[formData.role];
      if (!formData.passcode || formData.passcode.trim().toUpperCase() !== expected) {
        setPasscodeError(
          `Code d'accès secret non conforme pour le rôle ${ROLE_LABELS[formData.role]}.`
        );
        return;
      }
    }

    setLoading(true);

    try {
      const selectedFacObj = INSTITUTIONS_REGISTRY.find((i) => i.id === formData.facultyId) || availableInstitutions[0];
      const payload = {
        ...formData,
        universityName: selectedUnivObj.name,
        universityShortName: selectedUnivObj.shortName,
        faculty: selectedFacObj?.name || formData.faculty,
        facultyId: selectedFacObj?.id || formData.facultyId,
        filiere: formData.filiereLabel || formData.filiere,
        filiereId: formData.filiere,
        filiereLabel: formData.filiereLabel || formData.filiere,
      };

      if (onSubmit) {
        await onSubmit(payload);
      } else if (auth?.register) {
        const res = auth.register(payload);
        setSuccessMsg('Compte certifié ! Connexion en cours...');
        setTimeout(() => {
          navigate(res?.redirectPath || '/dashboard', { replace: true });
        }, 300);
      }
    } catch (err) {
      setGlobalError(err?.message || 'Erreur lors de la création du compte.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto text-slate-100">
      {/* CARD CONTAINER: Illuminated slate-800, hairline border slate-700 */}
      <div className="bg-slate-800/95 border border-slate-700/60 rounded-3xl p-6 sm:p-8 shadow-2xl text-left">
        {/* Header & National Scope Indicator */}
        {showHeaderMotto && (
          <div className="mb-6 pb-5 border-b border-slate-700/60">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
              <span className="text-xs font-mono text-indigo-400 font-semibold tracking-wider uppercase">
                République du Cameroun · MINESUP
              </span>
              <span className="text-xs text-slate-400 font-mono">
                11 Universités d'État & Grandes Écoles
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
              Portail d'Inscription Académique National
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Sélectionnez votre établissement universitaire camerounais, votre faculté et votre filière pour générer votre compte sécurisé.
            </p>
          </div>
        )}

        {/* Quick Testing Presets Bar */}
        <div className="mb-6 p-3 rounded-2xl bg-slate-900/90 border border-slate-700/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">
              Profils de démonstration rapide (1 clic) :
            </span>
            <span className="text-[11px] text-indigo-400 font-mono font-medium">Presets Cameroun</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {NATIONAL_PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700/60 text-[11px] font-medium text-slate-200 hover:text-white text-left transition-colors truncate"
                title={p.label}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* ALERTS */}
        {globalError && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-950/40 border border-red-800 text-red-300 text-xs flex items-start gap-2.5">
            <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-400" />
            <span>{globalError}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-5 p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs flex items-start gap-2.5">
            <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. PHOTO DE PROFIL ÉTUDIANTE (Zero-pill, sobre) */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700/60 flex flex-col sm:flex-row items-center gap-4">
            <div className="relative group shrink-0">
              <div
                className={`w-18 h-18 rounded-full border overflow-hidden flex items-center justify-center transition-all ${
                  avatarPreview
                    ? 'border-indigo-500'
                    : 'border-dashed border-slate-700 bg-slate-900'
                }`}
              >
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Aperçu photo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <Camera size={22} />
                    <span className="text-[10px] font-mono mt-0.5">Photo</span>
                  </div>
                )}
              </div>

              {avatarPreview && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="absolute -top-1 -right-1 p-1 bg-red-600 hover:bg-red-500 text-white rounded-full transition-colors"
                  title="Supprimer la photo"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            <div className="flex-1 text-center sm:text-left space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-xs font-semibold text-slate-200">Photo d'identité étudiante</span>
                <span className="text-[11px] text-slate-400">· Optionnel</span>
              </div>
              <p className="text-xs text-slate-400">
                Affichée sur vos relevés officiels et travaux de recherche. JPG, PNG ou WebP (max. 5 Mo).
              </p>

              <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="campushub_avatar_upload"
                />

                <label
                  htmlFor="campushub_avatar_upload"
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload size={13} />
                  <span>{avatarPreview ? 'Changer la photo' : 'Sélectionner un fichier'}</span>
                </label>

                {avatarPreview && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="text-xs text-slate-400 hover:text-red-400 transition-colors px-2 py-1"
                  >
                    Effacer
                  </button>
                )}
              </div>

              {avatarError && (
                <p className="text-xs text-red-400 font-medium">{avatarError}</p>
              )}
            </div>
          </div>

          {/* 2. HIÉRARCHIE ACADÉMIQUE CAMEROUNAISE */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700/60 space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Building size={14} className="text-indigo-400" />
              <span>Cursus & Affectation Académique</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Université d'État ou Grande École */}
              <div className="space-y-1">
                <label htmlFor={registerUniversityFieldId} className="block text-xs font-medium text-slate-300">
                  Établissement d'Attache *
                </label>
                <select
                  id={registerUniversityFieldId}
                  name="universityId"
                  value={formData.universityId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700/70 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none"
                >
                  {CAMEROON_UNIVERSITIES.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.shortName}) — {u.city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Faculté / Institut / École */}
              <div className="space-y-1">
                <label htmlFor={registerFacultyFieldId} className="block text-xs font-medium text-slate-300">
                  Faculté / Grande École *
                </label>
                <select
                  id={registerFacultyFieldId}
                  name="facultyId"
                  value={currentInstitution?.id || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700/70 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none"
                >
                  {availableInstitutions.map((inst) => (
                    <option key={inst.id} value={inst.id}>
                      {inst.name} ({inst.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Filière / Programme officiel */}
              <div className="space-y-1">
                <label htmlFor={registerFiliereFieldId} className="block text-xs font-medium text-slate-300">
                  Filière de Formation Officielle *
                </label>
                <select
                  id={registerFiliereFieldId}
                  name="filiere"
                  value={currentFiliere?.id || formData.filiere}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700/70 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none"
                >
                  {availableFilieres.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.label} ({f.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Niveau d'études */}
              <div className="space-y-1">
                <label htmlFor={registerNiveauFieldId} className="block text-xs font-medium text-slate-300">
                  Niveau Académique *
                </label>
                <select
                  id={registerNiveauFieldId}
                  name="niveau"
                  value={formData.niveau}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700/70 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none"
                >
                  {availableLevels.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>

              {/* Aperçu dynamique des UEs chargées pour ce niveau (PDF Page 6) */}
              {loadedUes.length > 0 && (
                <div className="col-span-full p-3 rounded-xl bg-slate-800/80 border border-indigo-500/30 space-y-2 mt-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-indigo-300">
                    <span className="flex items-center gap-1.5">
                      <Sparkles size={13} className="text-indigo-400" />
                      <span>Unités d'Enseignement (UE) chargées pour ce niveau ({loadedUes.length})</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">Conforme LMD</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                    {loadedUes.map((ue, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-indigo-950/80 border border-indigo-800/60 text-[11px] text-indigo-200"
                        title={ue.title}
                      >
                        <span className="font-mono font-bold text-indigo-400">{ue.code}</span>
                        <span className="text-slate-300 truncate max-w-[150px]">· {ue.title}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 3. IDENTITÉ ACADÉMIQUE */}
          <div className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <User size={14} className="text-indigo-400" />
              <span>Identité de l'Étudiant</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label htmlFor={registerNomFieldId} className="block text-xs font-medium text-slate-300">
                  Nom de Famille *
                </label>
                <input
                  id={registerNomFieldId}
                  type="text"
                  name="nom"
                  required
                  value={formData.nom}
                  onChange={handleChange}
                  placeholder="Ex : Fotsing"
                  className="w-full px-3 py-2 rounded-xl bg-slate-850 border border-slate-700/70 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor={registerPrenomFieldId} className="block text-xs font-medium text-slate-300">
                  Prénom(s) *
                </label>
                <input
                  id={registerPrenomFieldId}
                  type="text"
                  name="prenom"
                  required
                  value={formData.prenom}
                  onChange={handleChange}
                  placeholder="Ex : Yan"
                  className="w-full px-3 py-2 rounded-xl bg-slate-850 border border-slate-700/70 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label htmlFor={registerUsernameFieldId} className="block text-xs font-medium text-slate-300">
                  Identifiant Unique (@username) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-400 text-xs font-mono">@</span>
                  <input
                    id={registerUsernameFieldId}
                    type="text"
                    name="username"
                    required
                    value={formData.username}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        username: e.target.value.toLowerCase().trim().replace(/\s+/g, '_'),
                        usernameEdited: true,
                      }))
                    }
                    placeholder="yan_fotsing"
                    className="w-full pl-7 pr-3 py-2 rounded-xl bg-slate-850 border border-slate-700/70 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label htmlFor={registerMatriculeFieldId} className="block text-xs font-medium text-slate-300">
                    Matricule Étudiant *
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateMatricule}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <RefreshCw size={11} /> Auto-générer
                  </button>
                </div>
                <input
                  id={registerMatriculeFieldId}
                  type="text"
                  name="matricule"
                  required
                  value={formData.matricule}
                  onChange={handleChange}
                  placeholder="Ex : 24S1084"
                  className="w-full px-3 py-2 rounded-xl bg-slate-850 border border-slate-700/70 text-slate-100 font-mono text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 4. EMAIL & SÉCURITÉ */}
          <div className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Lock size={14} className="text-indigo-400" />
              <span>Authentification & Mot de passe</span>
            </h2>

            <div className="space-y-1">
              <label htmlFor={registerEmailFieldId} className="block text-xs font-medium text-slate-300">
                Adresse Email *
              </label>
              <input
                id={registerEmailFieldId}
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="etudiant@univ-yaounde1.cm"
                className="w-full px-3 py-2 rounded-xl bg-slate-850 border border-slate-700/70 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label htmlFor={registerPasswordFieldId} className="block text-xs font-medium text-slate-300">
                  Mot de passe * (minimum 6 caractères)
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={12} /> : <Eye size={12} />}
                  <span>{showPassword ? 'Masquer' : 'Afficher'}</span>
                </button>
              </div>

              <div className="relative">
                <input
                  id={registerPasswordFieldId}
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handlePasswordChange}
                  placeholder="Min. 6 caractères"
                  className={`w-full px-3 py-2 rounded-xl bg-slate-850 border text-slate-100 text-xs focus:outline-none pr-10 ${
                    passwordTouched && isPasswordTooShort
                      ? 'border-red-500 focus:border-red-400'
                      : passwordTouched && isPasswordValid
                      ? 'border-emerald-500/80 focus:border-emerald-400'
                      : 'border-slate-700/70 focus:border-indigo-500'
                  }`}
                />
                {passwordTouched && (
                  <div className="absolute right-3 top-2.5">
                    {isPasswordValid ? (
                      <CheckCircle2 size={15} className="text-emerald-400" />
                    ) : (
                      <AlertCircle size={15} className="text-red-400" />
                    )}
                  </div>
                )}
              </div>

              {passwordTouched && isPasswordTooShort && (
                <p className="text-[11px] text-red-400 font-medium">
                  Le mot de passe doit comporter au moins 6 caractères ({passwordLength}/6).
                </p>
              )}
            </div>
          </div>

          {/* 5. PRIVILÈGES & RÔLES SPÉCIAUX (Délégué, Modérateur, Admin) */}
          <div className="pt-2 border-t border-slate-700/60 space-y-3">
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/60 flex items-start gap-3">
              <input
                id={registerAdminPrivilegeCheckboxId}
                type="checkbox"
                checked={requestPrivilegedAccess}
                onChange={handleTogglePrivilegedAccess}
                className="mt-0.5 rounded border-slate-600 bg-slate-800 text-indigo-600 focus:ring-0 cursor-pointer"
              />
              <label
                htmlFor={registerAdminPrivilegeCheckboxId}
                className="text-xs text-slate-300 cursor-pointer select-none space-y-0.5"
              >
                <span className="font-semibold text-slate-200 block">
                  Demande de privilèges (Délégué de classe, Modérateur, Enseignant/Admin)
                </span>
                <span className="text-[11px] text-slate-400 block">
                  Nécessite la clé de validation officielle de votre faculté ou département.
                </span>
              </label>
            </div>

            {requestPrivilegedAccess && (
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700/60 space-y-3">
                <span className="text-xs font-semibold text-slate-200 block">
                  Rôle demandé :
                </span>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { role: ROLES.DELEGATE, label: 'Délégué' },
                    { role: ROLES.MODERATOR, label: 'Modérateur' },
                    { role: ROLES.ADMIN, label: 'Administrateur' },
                  ].map((r) => (
                    <button
                      key={r.role}
                      type="button"
                      onClick={() => handleSelectPrivilegedRole(r.role)}
                      className={`py-2 px-3 rounded-xl border text-xs font-medium transition-colors ${
                        formData.role === r.role
                          ? 'bg-indigo-600 border-indigo-500 text-white font-semibold'
                          : 'bg-slate-800 border-slate-700/70 text-slate-300 hover:text-white'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label htmlFor={registerPasscodeFieldId} className="text-xs font-medium text-slate-300">
                      Code de Sécurité Officiel *
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const code = ROLE_SECRET_PASSCODES[formData.role] || '';
                        setFormData((prev) => ({ ...prev, passcode: code }));
                        setPasscodeError('');
                      }}
                      className="text-[11px] text-indigo-400 hover:underline font-medium"
                    >
                      Auto-remplir le code test
                    </button>
                  </div>
                  <input
                    id={registerPasscodeFieldId}
                    type="text"
                    name="passcode"
                    required
                    value={formData.passcode}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, passcode: e.target.value.toUpperCase() }));
                      setPasscodeError('');
                    }}
                    placeholder={`Ex : ${ROLE_SECRET_PASSCODES[formData.role] || 'CODE'}`}
                    className="w-full px-3 py-2 rounded-xl bg-slate-850 border border-slate-700/70 text-slate-100 font-mono text-xs uppercase focus:border-indigo-500 focus:outline-none"
                  />
                  {passcodeError && (
                    <p className="text-xs text-red-400 font-medium">{passcodeError}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 6. SOUMISSION */}
          <div className="pt-2">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  Annuler
                </button>
              )}
              <button
                type="submit"
                disabled={loading || !isFormValid}
                className="w-full py-3 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Validation en cours...' : 'Finaliser mon inscription académique'}</span>
                <ArrowRight size={14} />
              </button>
            </div>

            <div className="text-center text-xs text-slate-400 pt-3">
              <span>Vous possédez déjà un compte ?</span>{' '}
              <Link
                to="/login"
                className="font-medium text-indigo-400 hover:text-indigo-300 underline ml-1"
              >
                Se connecter
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}