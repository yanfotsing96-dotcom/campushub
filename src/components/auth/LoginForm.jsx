import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Lock, ArrowRight, KeyRound } from 'lucide-react';
import '../../styles/RegisterForm.css';

export default function LoginForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    email: 'kenmoe@etudiant.univ-yaounde1.cm',
    password: 'password123',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
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
          Connexion Étudiante
        </h2>
        <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
          Portail Numérique · Université de Yaoundé I
        </p>
      </div>

      <div className="auth-form__field">
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Mail size={14} color="#6366f1" /> Email Universitaire
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="nom@etudiant.univ-yaounde1.cm"
          required
        />
      </div>

      <div className="auth-form__field">
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Lock size={14} color="#6366f1" /> Mot de passe
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
        <span>Accéder au Portail</span>
        <ArrowRight size={16} />
      </button>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          fontSize: '0.78rem',
          color: '#64748b',
          backgroundColor: '#f8fafc',
          padding: '8px',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
        }}
      >
        <KeyRound size={13} color="#10b981" />
        <span>Compte démo étudiant pré-rempli pour tester l'accès</span>
      </div>

      <p style={{ marginTop: '6px', textAlign: 'center', fontSize: '0.875rem', color: '#64748b' }}>
        Pas encore inscrit ?{' '}
        <Link to="/register" style={{ color: '#4f46e5', fontWeight: 600, textDecoration: 'none' }}>
          Créer un compte étudiant
        </Link>
      </p>
    </form>
  );
}