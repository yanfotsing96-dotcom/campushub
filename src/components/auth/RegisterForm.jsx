import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  User,
  Mail,
  Lock,
  Camera,
  ArrowRight,
} from 'lucide-react';
import '../../styles/RegisterForm.css';

export default function RegisterForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    password: '',
    filiere: 'Informatique',
    niveau: 'L1',
    photo: null,
  });
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, photo: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="register-page" style={{ padding: '24px 16px' }}>
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
            Créer un Compte Étudiant
          </h2>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
            Accès aux cours et ressources · UY1
          </p>
        </div>

        <div className="auth-form__photo-group">
          <div className="auth-form__avatar">
            {preview ? (
              <img src={preview} alt="Aperçu" className="auth-form__avatar-img" />
            ) : (
              <Camera size={28} color="#9ca3af" />
            )}
          </div>
          <label className="auth-form__upload-btn">
            {preview ? 'Changer la photo' : 'Ajouter une photo de profil'}
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handlePhotoChange}
              className="auth-form__file-input"
            />
          </label>
        </div>

        <div className="auth-form__field">
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <User size={14} color="#6366f1" /> Nom complet
          </label>
          <input
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            placeholder="ex: Kenmoe Fotsing"
            required
          />
        </div>

        <div className="auth-form__field">
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Mail size={14} color="#6366f1" /> Email universitaire
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="etudiant@univ-yaounde1.cm"
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
            placeholder="Au moins 6 caractères"
            required
          />
        </div>

        <div className="auth-form__row">
          <div className="auth-form__field">
            <label>Filière / Département</label>
            <select name="filiere" value={formData.filiere} onChange={handleChange}>
              <option value="Informatique">Informatique</option>
              <option value="Mathématiques">Mathématiques</option>
              <option value="Physique">Physique</option>
              <option value="Chimie">Chimie</option>
              <option value="Biologie">Biologie</option>
            </select>
          </div>

          <div className="auth-form__field">
            <label>Niveau</label>
            <select name="niveau" value={formData.niveau} onChange={handleChange}>
              <option value="L1">L1</option>
              <option value="L2">L2</option>
              <option value="L3">L3</option>
              <option value="M1">M1</option>
              <option value="M2">M2</option>
            </select>
          </div>
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
          <span>Finaliser l'inscription</span>
          <ArrowRight size={16} />
        </button>

        <p style={{ marginTop: '4px', textAlign: 'center', fontSize: '0.875rem', color: '#64748b' }}>
          Vous avez déjà un compte ?{' '}
          <Link to="/login" style={{ color: '#4f46e5', fontWeight: 600, textDecoration: 'none' }}>
            Se connecter
          </Link>
        </p>
      </form>
    </div>
  );
}