import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import '../../styles/RegisterForm.css';
import { useLanguage } from '../../hooks/useLanguage';
import { DEMO_PROFILES } from '../../constants/rbacConstants';
import RoleBadge from '../common/RoleBadge';

export default function LoginForm({ onSubmit }) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    email: 'yanfotsing96@gmail.com',
    password: 'password123',
    role: 'student',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleQuickDemoLogin = (profile) => {
    onSubmit({
      email: profile.email,
      password: 'password123',
      role: profile.role,
      filiere: profile.filiere,
      niveau: profile.niveau,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form" style={{ maxWidth: '460px' }}>
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
          {t('auth.loginTitle')}
        </h2>
        <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
          {t('auth.loginSubtitle')}
        </p>
      </div>

      <div className="auth-form__field">
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Mail size={14} color="#6366f1" /> {t('auth.email')}
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
          <Lock size={14} color="#6366f1" /> {t('auth.password')}
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          required
        />
      </div>

      <button
        type="submit"
        className="auth-form__submit"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginTop: '8px',
        }}
      >
        <span>{t('auth.submitLogin')}</span>
        <ArrowRight size={16} />
      </button>

      {/* Quick Demo Accounts Selection Tool */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-left space-y-2">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400">
          <Sparkles size={13} className="text-amber-500" />
          <span>Connexion Rapide Démo (Test du Cloisonnement) :</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {DEMO_PROFILES.map((p) => (
            <button
              key={p.role}
              type="button"
              onClick={() => handleQuickDemoLogin(p)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:border-indigo-400 text-left transition-colors text-[11px] space-y-0.5"
            >
              <div className="flex items-center justify-between">
                <RoleBadge role={p.role} size="xs" />
              </div>
              <div className="font-bold text-slate-800 dark:text-slate-200 truncate">
                {p.nom.split(' ')[0]}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {p.filiere} ({p.niveau})
              </div>
            </button>
          ))}
        </div>
      </div>

      <p style={{ marginTop: '8px', textAlign: 'center', fontSize: '0.875rem', color: '#64748b' }}>
        {t('auth.noAccountYet')}{' '}
        <Link to="/register" style={{ color: '#4f46e5', fontWeight: 600, textDecoration: 'none' }}>
          {t('auth.goToRegister')}
        </Link>
      </p>
    </form>
  );
}