import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  User,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  RefreshCw,
  Sparkles,
  Award,
} from 'lucide-react';
import '../../styles/RegisterForm.css';
import { useLanguage } from '../../hooks/useLanguage';
import {
  ROLES,
  ROLE_LABELS,
  ROLE_SECRET_PASSCODES,
  ROLE_PASSCODE_HINTS,
} from '../../constants/rbacConstants';
import { DEPARTMENTS, ACADEMIC_LEVELS } from '../../constants/academicScopes';

export default function RegisterForm({ onSubmit }) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState(() => ({
    nom: '',
    prenom: '',
    username: '',
    matricule: '26U' + Math.floor(1000 + Math.random() * 9000),
    email: '',
    password: '',
    filiere: 'Informatique',
    niveau: 'L1',
    role: ROLES.STUDENT,
    passcode: '',
  }));

  const [passcodeError, setPasscodeError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      // Auto-suggest username if prenom or nom changes and username was untouched
      if ((name === 'prenom' || name === 'nom') && !prev.usernameEdited) {
        const p = name === 'prenom' ? value : prev.prenom;
        const n = name === 'nom' ? value : prev.nom;
        const auto = `${p ? p.toLowerCase().replace(/\s+/g, '_') : ''}${n ? '_' + n.toLowerCase().replace(/\s+/g, '_') : ''}`;
        next.username = auto.replace(/^_+|_+$/g, '');
      }
      return next;
    });
  };

  const handleGenerateMatricule = () => {
    const randomMat = '26U' + Math.floor(1000 + Math.random() * 9000);
    setFormData((prev) => ({ ...prev, matricule: randomMat }));
  };

  const handleRoleChange = (role) => {
    setFormData((prev) => ({
      ...prev,
      role,
      passcode: role === ROLES.STUDENT ? '' : prev.passcode,
    }));
    setPasscodeError('');
  };

  const handleApplyDemoPasscode = () => {
    const demo = ROLE_SECRET_PASSCODES[formData.role] || '';
    setFormData((prev) => ({ ...prev, passcode: demo }));
    setPasscodeError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPasscodeError('');

    // If role is sensitive, verify passcode
    if (formData.role !== ROLES.STUDENT) {
      const expected = ROLE_SECRET_PASSCODES[formData.role];
      if (formData.passcode.trim().toUpperCase() !== expected) {
        setPasscodeError(
          `Code d'accès secret incorrect pour le rôle de ${ROLE_LABELS[formData.role]}. Saisissez le code officiel.`
        );
        return;
      }
    }

    onSubmit(formData);
  };

  return (
    <div className="register-page" style={{ padding: '24px 16px' }}>
      <form onSubmit={handleSubmit} className="auth-form" style={{ maxWidth: '520px' }}>
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
              color: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(79, 70, 229, 0.25)',
              marginBottom: '12px',
            }}
          >
            <GraduationCap size={28} />
          </div>
          <h2 className="auth-form__title" style={{ margin: '0 0 4px 0' }}>
            {t('auth.registerTitle')}
          </h2>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
            Inscription académique certifiée & cloisonnée par filière
          </p>
        </div>

        {/* 1. Name & First Name (Mandatory) */}
        <div className="auth-form__row">
          <div className="auth-form__field">
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={14} color="#6366f1" /> Nom de famille *
            </label>
            <input
              type="text"
              name="nom"
              required
              value={formData.nom}
              onChange={handleChange}
              placeholder="Ex : Fotsing"
            />
          </div>

          <div className="auth-form__field">
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={14} color="#6366f1" /> Prénom *
            </label>
            <input
              type="text"
              name="prenom"
              required
              value={formData.prenom}
              onChange={handleChange}
              placeholder="Ex : Yan"
            />
          </div>
        </div>

        {/* 2. Username & Unique Matricule (Mandatory) */}
        <div className="auth-form__row">
          <div className="auth-form__field">
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>@</span> Nom d'utilisateur (Username) *
            </label>
            <input
              type="text"
              name="username"
              required
              value={formData.username}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  username: e.target.value.toLowerCase().replace(/\s+/g, '_'),
                  usernameEdited: true,
                }));
              }}
              placeholder="ex: yanick_fotsing"
            />
          </div>

          <div className="auth-form__field">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Award size={14} color="#6366f1" /> Matricule unique *
              </label>
              <button
                type="button"
                onClick={handleGenerateMatricule}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6366f1',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                }}
                title="Générer un matricule aléatoire officiel"
              >
                <RefreshCw size={11} /> Auto
              </button>
            </div>
            <input
              type="text"
              name="matricule"
              required
              value={formData.matricule}
              onChange={handleChange}
              placeholder="Ex : 23S40192"
              style={{ fontFamily: 'monospace', fontWeight: 'bold' }}
            />
          </div>
        </div>

        {/* 3. Department & Academic Level (Mandatory) */}
        <div className="auth-form__row">
          <div className="auth-form__field">
            <label>{t('auth.department')} *</label>
            <select name="filiere" value={formData.filiere} onChange={handleChange}>
              {DEPARTMENTS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label} ({d.code})
                </option>
              ))}
            </select>
          </div>

          <div className="auth-form__field">
            <label>{t('auth.level')} *</label>
            <select name="niveau" value={formData.niveau} onChange={handleChange}>
              {ACADEMIC_LEVELS.map((lvl) => (
                <option key={lvl.id} value={lvl.id}>
                  {lvl.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 4. Email & Password */}
        <div className="auth-form__field">
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Mail size={14} color="#6366f1" /> {t('auth.email')} *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="etudiant@univ.cm"
            required
          />
        </div>

        <div className="auth-form__field">
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Lock size={14} color="#6366f1" /> {t('auth.password')} *
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder={t('auth.passwordPlaceholder')}
            required
          />
        </div>

        {/* 5. Role Selection with Passcode Gate for Sensitive Roles */}
        <div className="auth-form__field" style={{ marginTop: '4px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <ShieldCheck size={14} color="#6366f1" /> Rôle sollicité sur CampusHub :
          </label>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
            {[
              { id: ROLES.STUDENT, label: 'Étudiant', icon: GraduationCap },
              { id: ROLES.DELEGATE, label: 'Délégué', icon: Award },
              { id: ROLES.MODERATOR, label: 'Modérateur', icon: ShieldCheck },
            ].map((r) => {
              const active = formData.role === r.id;
              const Icon = r.icon;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleRoleChange(r.id)}
                  style={{
                    padding: '8px 6px',
                    borderRadius: '10px',
                    fontSize: '0.78rem',
                    fontWeight: active ? 800 : 600,
                    border: active ? '2px solid #6366f1' : '1px solid #e2e8f0',
                    background: active ? '#f5f3ff' : '#ffffff',
                    color: active ? '#4f46e5' : '#475569',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Icon size={16} />
                  <span>{r.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Secret Passcode Input if Delegate or Moderator */}
        {formData.role !== ROLES.STUDENT && (
          <div
            style={{
              padding: '12px',
              borderRadius: '12px',
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              marginTop: '4px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  color: '#0f172a',
                }}
              >
                <KeyRound size={14} color="#f59e0b" /> Code d'Accès Secret requis *
              </label>

              <button
                type="button"
                onClick={handleApplyDemoPasscode}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#4f46e5',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Auto-remplir
              </button>
            </div>

            <input
              type="text"
              name="passcode"
              required
              value={formData.passcode}
              onChange={(e) => {
                setFormData({ ...formData, passcode: e.target.value.toUpperCase() });
                setPasscodeError('');
              }}
              placeholder={`Ex : ${ROLE_SECRET_PASSCODES[formData.role]}`}
              style={{
                fontFamily: 'monospace',
                fontWeight: 'bold',
                letterSpacing: '1px',
                padding: '8px 10px',
                fontSize: '0.85rem',
                borderRadius: '8px',
                border: passcodeError ? '1px solid #ef4444' : '1px solid #cbd5e1',
                textTransform: 'uppercase',
              }}
            />

            <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={11} color="#f59e0b" /> {ROLE_PASSCODE_HINTS[formData.role]}
            </span>

            {passcodeError && (
              <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 600 }}>
                {passcodeError}
              </span>
            )}
          </div>
        )}

        <button
          type="submit"
          className="auth-form__submit"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '12px',
          }}
        >
          <span>{t('auth.submitRegister')}</span>
          <ArrowRight size={16} />
        </button>

        <p style={{ marginTop: '8px', textAlign: 'center', fontSize: '0.875rem', color: '#64748b' }}>
          {t('auth.alreadyRegistered')}{' '}
          <Link to="/login" style={{ color: '#4f46e5', fontWeight: 600, textDecoration: 'none' }}>
            {t('auth.goToLogin')}
          </Link>
        </p>
      </form>
    </div>
  );
}