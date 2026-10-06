import { useState, useRef, useEffect, useId } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  RefreshCw,
  Sparkles,
  Award,
  Crown,
  Camera,
  Upload,
  X,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Building,
  FileText,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import {
  ROLES,
  ROLE_LABELS,
  ROLE_SECRET_PASSCODES,
  ROLE_PASSCODE_HINTS,
} from '../../constants/rbacConstants';
import { DEPARTMENTS, ACADEMIC_LEVELS } from '../../constants/academicScopes';
import { CAMEROON_UNIVERSITIES } from '../../constants/academicConstants';

export default function RegisterForm({ onSubmit, onCancel, showHeaderMotto = true }) {
  const auth = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState(() => ({
    nom: '',
    prenom: '',
    username: '',
    matricule: '26U' + Math.floor(1000 + Math.random() * 9000),
    email: '',
    password: '',
    filiere: 'Informatique',
    niveau: 'L2',
    universityId: 'UY1',
    role: ROLES.STUDENT,
    passcode: '',
    justification: '',
    avatar: null,
  }));

  const registerNomFieldId = useId();
  const registerPrenomFieldId = useId();
  const registerUsernameFieldId = useId();
  const registerMatriculeFieldId = useId();
  const registerUniversityFieldId = useId();
  const registerFiliereFieldId = useId();
  const registerNiveauFieldId = useId();
  const registerEmailFieldId = useId();
  const registerPasswordFieldId = useId();
  const registerAdminPrivilegeCheckboxId = useId();
  const registerPasscodeFieldId = useId();
  const registerJustificationFieldId = useId();

  // Photo & Preview State
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarError, setAvatarError] = useState('');

  // Password Visibility & Validation State
  const [showPassword, setShowPassword] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  // Admin / Moderator Privilege Request Toggle
  const [requestPrivilegedAccess, setRequestPrivilegedAccess] = useState(false);
  const [selectedPrivilegedRole, setSelectedPrivilegedRole] = useState(ROLES.MODERATOR);

  // Global submission & error states
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const [passcodeError, setPasscodeError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Password Strength Calculation (Strict min 6 characters rule)
  const passwordLength = formData.password.length;
  const isPasswordTooShort = passwordLength > 0 && passwordLength < 6;
  const isPasswordValid = passwordLength >= 6;

  const getPasswordStrength = (pwd) => {
    if (!pwd || pwd.length < 6) return { score: 1, label: 'Trop court (min. 6)', color: 'bg-rose-500', text: 'text-rose-400' };
    let score = 2;
    if (pwd.length >= 8) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score >= 4) return { score: 3, label: 'Fort & Sécurisé', color: 'bg-emerald-500', text: 'text-emerald-400' };
    if (score === 3) return { score: 2, label: 'Moyen', color: 'bg-amber-500', text: 'text-amber-400' };
    return { score: 2, label: 'Acceptable (6+ caractères)', color: 'bg-indigo-400', text: 'text-indigo-400' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  // Generate official random matricule
  const handleGenerateMatricule = () => {
    const randomMat = '26U' + Math.floor(1000 + Math.random() * 9000);
    setFormData((prev) => ({ ...prev, matricule: randomMat }));
  };

  // Input change handler + auto username slug suggestion
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
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

  // 1. Profile Photo Upload & Real-Time Preview
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setAvatarError('');

    if (!file) return;

    // Check image MIME type
    if (!file.type.startsWith('image/')) {
      setAvatarError('Seuls les fichiers image (JPG, PNG, WebP) sont autorisés.');
      return;
    }

    // Check max file size (max 5 MB)
    if (file.size > 5 * 1024 * 1024) {
      setAvatarError('L\'image est trop volumineuse (maximum 5 Mo).');
      return;
    }

    // Create real-time object URL preview
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);

    // Also read base64 or set object URL for persistent state injection
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

  // Cleanup object URL on unmount
  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview.startsWith('blob:')) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  // Handle Admin / Moderator privileged request toggle
  const handleTogglePrivilegedAccess = (e) => {
    const isChecked = e.target.checked;
    setRequestPrivilegedAccess(isChecked);
    setPasscodeError('');

    if (isChecked) {
      setFormData((prev) => ({
        ...prev,
        role: selectedPrivilegedRole,
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

  const handleSelectPrivilegedRole = (role) => {
    setSelectedPrivilegedRole(role);
    setFormData((prev) => ({
      ...prev,
      role,
      passcode: '',
    }));
    setPasscodeError('');
  };

  const handleApplyDemoPasscode = () => {
    const demo = ROLE_SECRET_PASSCODES[formData.role] || '';
    setFormData((prev) => ({ ...prev, passcode: demo }));
    setPasscodeError('');
  };

  // Form Validation check
  const isFormValid =
    formData.nom.trim().length > 0 &&
    formData.prenom.trim().length > 0 &&
    formData.username.trim().length > 0 &&
    formData.email.trim().length > 0 &&
    formData.password.length >= 6;

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setPasswordTouched(true);
    setGlobalError('');
    setPasscodeError('');

    // Strict Password Validation Check
    if (formData.password.length < 6) {
      setGlobalError('Le mot de passe doit comporter au moins 6 caractères pour sécuriser votre compte.');
      return;
    }

    // Verify secret passcode if requesting Administrator or Moderator
    if (formData.role !== ROLES.STUDENT) {
      const expected = ROLE_SECRET_PASSCODES[formData.role];
      if (!formData.passcode || formData.passcode.trim().toUpperCase() !== expected) {
        setPasscodeError(
          `Code d'accès secret incorrect pour le rôle ${ROLE_LABELS[formData.role]}. Veuillez saisir le code officiel ou cliquer sur "Auto-remplir".`
        );
        return;
      }
    }

    setLoading(true);

    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else if (auth?.register) {
        const res = auth.register(formData);
        setSuccessMsg('Compte académique certifié avec succès ! Redirection...');
        setTimeout(() => {
          navigate(res?.redirectPath || '/dashboard', { replace: true });
        }, 350);
      }
    } catch (err) {
      setGlobalError(err?.message || 'Erreur lors de la création du compte.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto text-slate-100">
      {/* CARD CONTAINER WITH DEEP MIDNIGHT BLUE & GLASSMORPHISM */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-indigo-950/50 relative overflow-hidden text-left">
        {/* Subtle decorative glowing bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400" />

        {/* 1. OFFICIAL MOTTO & HEADER */}
        {showHeaderMotto && (
          <div className="mb-6 pb-5 border-b border-white/10 text-center">
            {/* National Consortium Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-[11px] font-bold text-indigo-300 uppercase tracking-wider mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>CampusHub Cameroun · Inscription Nationale</span>
            </div>

            {/* Official Motto with Luminous Gradient */}
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-bold block">
                Devise Académique Officielle
              </span>
              <h2 className="text-xl sm:text-2xl font-black italic tracking-tight bg-gradient-to-r from-white via-indigo-100 to-purple-300 bg-clip-text text-transparent">
                “If you concentrate more you will have more”
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto">
              Rejoignez votre promotion universitaire et accédez aux ressources, annales et compositions en ligne.
            </p>
          </div>
        )}

        {/* ALERTS (GLOBAL ERROR / SUCCESS) */}
        {globalError && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
            <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-400" />
            <span className="leading-relaxed">{globalError}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-5 p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
            <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-emerald-400" />
            <span className="leading-relaxed">{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* ========================================================= */}
          {/* 1. UPLOAD DE PHOTO DE PROFIL INTÉGRÉ & APERÇU TEMPS RÉEL */}
          {/* ========================================================= */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col sm:flex-row items-center gap-4">
            {/* Visual Avatar Preview Circle */}
            <div className="relative group shrink-0">
              <div
                className={`w-20 h-20 rounded-full border-2 overflow-hidden flex items-center justify-center transition-all ${
                  avatarPreview
                    ? 'border-indigo-500 shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-500/20'
                    : 'border-dashed border-slate-700 bg-slate-900 group-hover:border-indigo-400'
                }`}
              >
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Aperçu photo de profil"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-500 group-hover:text-indigo-400 transition-colors">
                    <Camera size={26} className="stroke-[1.6]" />
                    <span className="text-[9px] font-bold mt-1">Photo</span>
                  </div>
                )}
              </div>

              {/* Remove button if preview exists */}
              {avatarPreview && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="absolute -top-1 -right-1 p-1 bg-rose-600 hover:bg-rose-500 text-white rounded-full shadow-md transition-transform hover:scale-110 cursor-pointer"
                  title="Supprimer la photo"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Upload Button & Format Guide */}
            <div className="flex-1 text-center sm:text-left space-y-1.5">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-xs font-bold text-white">Photo de profil étudiante</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                  Optionnel
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Affichée sur votre carte d'étudiant, vos devoirs et vos avis de promotion. JPG, PNG ou WebP (max. 5 Mo).
              </p>

              <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                {/* Hidden Native File Input */}
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
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 hover:border-indigo-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload size={13} />
                  <span>{avatarPreview ? 'Changer l\'image' : 'Choisir une photo'}</span>
                </label>

                {avatarPreview && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="text-xs text-slate-400 hover:text-rose-400 transition-colors px-2 py-1"
                  >
                    Effacer
                  </button>
                )}
              </div>

              {avatarError && (
                <p className="text-[11px] text-rose-400 font-semibold">{avatarError}</p>
              )}
            </div>
          </div>

          {/* ========================================================= */}
          {/* 2. IDENTITÉ ACADÉMIQUE (NOM, PRÉNOM, USERNAME, MATRICULE) */}
          {/* ========================================================= */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label htmlFor={registerNomFieldId} className="block text-xs font-bold text-slate-300 flex items-center gap-1">
                  <User size={12} className="text-indigo-400" />
                  <span>Nom de famille *</span>
                </label>
                <input
                  id={registerNomFieldId}
                  type="text"
                  name="nom"
                  required
                  value={formData.nom}
                  onChange={handleChange}
                  placeholder="Ex : Fotsing"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white text-xs placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor={registerPrenomFieldId} className="block text-xs font-bold text-slate-300 flex items-center gap-1">
                  <User size={12} className="text-indigo-400" />
                  <span>Prénom *</span>
                </label>
                <input
                  id={registerPrenomFieldId}
                  type="text"
                  name="prenom"
                  required
                  value={formData.prenom}
                  onChange={handleChange}
                  placeholder="Ex : Yan"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white text-xs placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label htmlFor={registerUsernameFieldId} className="block text-xs font-bold text-slate-300">
                  Nom d'utilisateur (@username) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-500 text-xs font-mono">@</span>
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
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white text-xs placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label htmlFor={registerMatriculeFieldId} className="block text-xs font-bold text-slate-300 flex items-center gap-1">
                    <Award size={12} className="text-indigo-400" />
                    <span>Matricule Unique *</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateMatricule}
                    className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                    title="Générer un matricule officiel aléatoire"
                  >
                    <RefreshCw size={10} /> Auto-générer
                  </button>
                </div>
                <input
                  id={registerMatriculeFieldId}
                  type="text"
                  name="matricule"
                  required
                  value={formData.matricule}
                  onChange={handleChange}
                  placeholder="26U1084"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white text-xs font-mono font-bold tracking-wider"
                />
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 3. CURSUS & ÉTABLISSEMENT UNIVERSITAIRE */}
          {/* ========================================================= */}
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="space-y-1">
              <label htmlFor={registerUniversityFieldId} className="block text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                <Building size={12} className="text-indigo-400" />
                <span>Établissement Universitaire d'Attache</span>
              </label>
              <select
                id={registerUniversityFieldId}
                name="universityId"
                value={formData.universityId}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-indigo-500"
              >
                {CAMEROON_UNIVERSITIES.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.shortName})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label htmlFor={registerFiliereFieldId} className="block text-[11px] font-bold text-slate-300">
                  Filière Académique *
                </label>
                <select
                  id={registerFiliereFieldId}
                  name="filiere"
                  value={formData.filiere}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-indigo-500"
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.label} ({d.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label htmlFor={registerNiveauFieldId} className="block text-[11px] font-bold text-slate-300">
                  Niveau d'Études *
                </label>
                <select
                  id={registerNiveauFieldId}
                  name="niveau"
                  value={formData.niveau}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-indigo-500"
                >
                  {ACADEMIC_LEVELS.map((lvl) => (
                    <option key={lvl.id} value={lvl.id}>
                      {lvl.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 4. EMAIL & VALIDATION STRICTE DU MOT DE PASSE (MIN. 6 CAR.) */}
          {/* ========================================================= */}
          <div className="space-y-3">
            <div className="space-y-1">
              <label htmlFor={registerEmailFieldId} className="block text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Mail size={12} className="text-indigo-400" />
                <span>Adresse Email Académique *</span>
              </label>
              <input
                id={registerEmailFieldId}
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="etudiant@univ-yaounde1.cm"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white text-xs placeholder:text-slate-500"
              />
            </div>

            {/* PASSWORD WITH STRICT REAL-TIME VALIDATION */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor={registerPasswordFieldId} className="block text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Lock size={12} className="text-indigo-400" />
                  <span>Mot de passe * (minimum 6 caractères)</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] font-semibold text-slate-400 hover:text-indigo-300 transition-colors flex items-center gap-1 cursor-pointer"
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
                  placeholder="Min. 6 caractères obligatoires"
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border text-white text-xs placeholder:text-slate-500 pr-10 transition-colors ${
                    passwordTouched && isPasswordTooShort
                      ? 'border-rose-500 focus:border-rose-400 focus:ring-1 focus:ring-rose-400'
                      : passwordTouched && isPasswordValid
                      ? 'border-emerald-500/80 focus:border-emerald-400'
                      : 'border-slate-700/80 focus:border-indigo-500'
                  }`}
                />
                {passwordTouched && (
                  <div className="absolute right-3 top-3">
                    {isPasswordValid ? (
                      <CheckCircle2 size={15} className="text-emerald-400" />
                    ) : (
                      <AlertCircle size={15} className="text-rose-400" />
                    )}
                  </div>
                )}
              </div>

              {/* REAL-TIME VALIDATION MESSAGE & STRENGTH GAUGE */}
              {passwordTouched && (
                <div className="space-y-1.5 pt-1 animate-in fade-in duration-150">
                  {/* Error notice if < 6 characters */}
                  {isPasswordTooShort && (
                    <div className="text-[11px] font-bold text-rose-400 flex items-center gap-1.5">
                      <AlertCircle size={13} className="shrink-0" />
                      <span>Le mot de passe doit contenir au moins 6 caractères ({passwordLength}/6).</span>
                    </div>
                  )}

                  {/* Character gauge bars */}
                  <div className="flex items-center gap-1.5">
                    <div className="flex-1 h-1 rounded-full bg-slate-800 overflow-hidden flex gap-1">
                      <div
                        className={`h-full transition-all duration-300 rounded-full ${
                          passwordLength >= 6 ? passwordStrength.color : passwordLength > 0 ? 'bg-rose-500 w-1/3' : 'w-0'
                        }`}
                        style={{ width: `${Math.min(100, (passwordLength / 8) * 100)}%` }}
                      />
                    </div>
                    <span className={`text-[10px] font-bold font-mono ${passwordStrength.text}`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ========================================================= */}
          {/* 5. OPTION DE DEMANDE DE COMPTE ADMINISTRATEUR / MODÉRATEUR */}
          {/* ========================================================= */}
          <div className="pt-2 border-t border-slate-800/80 space-y-3">
            {/* Interactive Checkbox */}
            <div className="p-3 rounded-2xl bg-slate-950/40 border border-slate-800 hover:border-indigo-500/40 transition-colors flex items-start gap-3 cursor-pointer">
              <input
                id={registerAdminPrivilegeCheckboxId}
                type="checkbox"
                checked={requestPrivilegedAccess}
                onChange={handleTogglePrivilegedAccess}
                className="mt-0.5 w-4 h-4 rounded-md border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
              />
              <label
                htmlFor={registerAdminPrivilegeCheckboxId}
                className="text-xs font-bold text-slate-200 cursor-pointer select-none space-y-0.5"
              >
                <div className="flex items-center gap-2">
                  <span>Demander un accès Administrateur ou Modérateur</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-400/10 text-amber-400 border border-amber-400/30 font-mono">
                    Accès Privilégié
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-normal leading-relaxed">
                  Cochez cette option si vous êtes enseignant, modérateur certifié ou responsable DSI nécessitant des droits d'administration.
                </p>
              </label>
            </div>

            {/* FLUID ANIMATED PRIVILEGED FIELDS PANEL (WHEN CHECKED) */}
            {requestPrivilegedAccess && (
              <div className="p-4 rounded-2xl bg-amber-950/25 border border-amber-500/40 space-y-3.5 animate-in fade-in zoom-in-95 duration-200 text-left">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                  <ShieldAlert size={16} className="text-amber-400" />
                  <span>Validation des Privilèges Hiérarchiques</span>
                </div>

                {/* Role Switcher between Moderator & Administrator */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelectPrivilegedRole(ROLES.MODERATOR)}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      formData.role === ROLES.MODERATOR
                        ? 'bg-sky-950/70 border-sky-400 text-sky-200 shadow-md shadow-sky-500/10'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <ShieldCheck size={14} className="text-sky-400" />
                    <span>Modérateur de Pôle</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectPrivilegedRole(ROLES.ADMIN)}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      formData.role === ROLES.ADMIN
                        ? 'bg-amber-950/70 border-amber-400 text-amber-200 shadow-md shadow-amber-500/10'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Crown size={14} className="text-amber-400" />
                    <span>Administrateur Système</span>
                  </button>
                </div>

                {/* Secret Security Passcode Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor={registerPasscodeFieldId} className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <KeyRound size={13} className="text-amber-400" />
                      <span>Code de Sécurité / Invitation Officielle *</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleApplyDemoPasscode}
                      className="text-[10px] font-bold text-amber-400 hover:text-amber-300 underline cursor-pointer"
                    >
                      Auto-remplir le code de test
                    </button>
                  </div>

                  <input
                    id={registerPasscodeFieldId}
                    type="text"
                    name="passcode"
                    required
                    value={formData.passcode}
                    onChange={(e) => {
                      setFormData({ ...formData, passcode: e.target.value.toUpperCase() });
                      setPasscodeError('');
                    }}
                    placeholder={`Ex : ${ROLE_SECRET_PASSCODES[formData.role] || 'CODE-OFFICIEL'}`}
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border text-amber-200 font-mono text-xs tracking-wider uppercase focus:border-amber-400 ${
                      passcodeError ? 'border-rose-500' : 'border-amber-500/40'
                    }`}
                  />

                  {/* Context Hint */}
                  <div className="text-[10px] text-amber-300/80 flex items-center gap-1.5">
                    <Sparkles size={11} className="shrink-0 text-amber-400" />
                    <span>{ROLE_PASSCODE_HINTS[formData.role]}</span>
                  </div>

                  {passcodeError && (
                    <p className="text-[11px] text-rose-400 font-bold">{passcodeError}</p>
                  )}
                </div>

                {/* Justification Field */}
                <div className="space-y-1">
                  <label htmlFor={registerJustificationFieldId} className="block text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                    <FileText size={12} className="text-amber-400" />
                    <span>Motif d'élévation ou département d'affectation</span>
                  </label>
                  <input
                    id={registerJustificationFieldId}
                    type="text"
                    name="justification"
                    value={formData.justification}
                    onChange={handleChange}
                    placeholder="Ex : DSI Faculté des Sciences UY1 / Enseignant INF301"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs placeholder:text-slate-600 focus:border-amber-400"
                  />
                </div>
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* 6. SUBMIT BUTTON & VALIDATION GUARD */}
          {/* ========================================================= */}
          <div className="pt-2">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Annuler
                </button>
              )}
              <button
                type="submit"
                disabled={loading || !isFormValid}
                className={`w-full py-3.5 rounded-xl text-xs font-bold text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                  isFormValid && !loading
                    ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-indigo-600/30 hover:scale-[1.01] active:scale-[0.99]'
                    : 'bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed opacity-60'
                }`}
              >
                <span>{loading ? 'Création du compte en cours...' : 'Finaliser mon inscription académique'}</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {!isFormValid && passwordTouched && isPasswordTooShort && (
              <p className="text-center text-[11px] text-rose-400 font-semibold mt-2">
                Le bouton est désactivé : saisissez au moins 6 caractères pour le mot de passe.
              </p>
            )}
          </div>

          {/* Footer note & Login redirect */}
          <div className="text-center text-xs text-slate-400 pt-1">
            <span>Vous avez déjà un compte ?</span>{' '}
            <Link
              to="/login"
              className="font-bold text-indigo-400 hover:text-indigo-300 underline ml-1"
            >
              Se connecter directement
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}