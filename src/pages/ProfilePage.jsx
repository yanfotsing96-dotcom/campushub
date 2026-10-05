import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Award,
  BookMarked,
  Mail,
  Edit3,
  Check,
  X,
  FileCheck2,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCampusHub } from '../hooks/useCampusHub';
import { CAMEROON_UNIVERSITIES } from '../constants/academicConstants';
import RoleBadge from '../components/common/RoleBadge';
import Button from '../components/common/Button';
import Toast from '../components/common/Toast';
import '../styles/ProfilePage.css';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const { student, setUniversity } = useCampusHub();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nom: user?.nom || student.name || '',
    email: user?.email || student.email || '',
    universityId: student.universityId || 'UY1',
    filiere: user?.filiere || student.filiere || 'Informatique & Génie Logiciel',
    niveau: user?.niveau || student.niveau || 'L2',
    bio: user?.bio || '',
  });
  const [toastMessage, setToastMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile(formData);
    if (formData.universityId) {
      setUniversity(formData.universityId);
    }
    setIsEditing(false);
    setToastMessage('Profil national actualisé avec succès !');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const getInitials = (name) => {
    if (!name) return 'ET';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="profile-container" style={{ maxWidth: '840px', margin: '32px auto', padding: '0 16px' }}>
      {toastMessage && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setToastMessage(null)}
        />
      )}

      {/* Header Card */}
      <div
        className="profile-header"
        style={{
          background: 'var(--rc-bg-surface, #ffffff)',
          borderRadius: '16px',
          border: '1px solid var(--rc-border, #e2e8f0)',
          padding: '28px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '20px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
          marginBottom: '24px',
        }}
      >
        <div
          style={{
            width: '76px',
            height: '76px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem',
            fontWeight: 800,
            letterSpacing: '1px',
            boxShadow: '0 8px 16px -4px rgba(99, 102, 241, 0.4)',
          }}
        >
          {getInitials(user?.nom)}
        </div>

        <div style={{ flex: 1, minWidth: '220px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: 'var(--rc-text-primary, #1e293b)' }}>
              {user?.nom}
            </h2>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: '6px',
                background: 'rgba(99, 102, 241, 0.1)',
                color: '#6366f1',
              }}
            >
              Matricule : {user?.matricule || '21U2458'}
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: '6px',
                background: 'rgba(16, 185, 129, 0.1)',
                color: '#10b981',
              }}
            >
              🇨🇲 {student.universityShortName}
            </span>
            <RoleBadge role={student.role} size="sm" />
          </div>

          <p style={{ margin: '6px 0 0 0', color: 'var(--rc-text-secondary, #64748b)', fontSize: '0.9375rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Mail size={15} /> {user?.email} · {student.department}
          </p>
        </div>

        <div>
          {!isEditing && (
            <Button
              variant="outline"
              icon={Edit3}
              onClick={() => {
                setFormData({
                  nom: user?.nom || '',
                  email: user?.email || '',
                  filiere: user?.filiere || 'Informatique',
                  niveau: user?.niveau || 'L2',
                  bio: user?.bio || '',
                });
                setIsEditing(true);
              }}
            >
              Modifier le profil
            </Button>
          )}
        </div>
      </div>

      {!isEditing ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {/* Academic Info Card */}
          <div
            style={{
              background: 'var(--rc-bg-surface, #ffffff)',
              borderRadius: '16px',
              border: '1px solid var(--rc-border, #e2e8f0)',
              padding: '24px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
            }}
          >
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.125rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--rc-text-primary, #1e293b)' }}>
              <GraduationCap size={20} color="#6366f1" /> Cursus Académique
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9375rem' }}>
              <div>
                <span style={{ color: 'var(--rc-text-secondary, #64748b)', display: 'block', fontSize: '0.8125rem' }}>
                  Filière / Département
                </span>
                <strong style={{ color: 'var(--rc-text-primary, #1e293b)' }}>{user?.filiere}</strong>
              </div>

              <div>
                <span style={{ color: 'var(--rc-text-secondary, #64748b)', display: 'block', fontSize: '0.8125rem' }}>
                  Niveau d'études actuel
                </span>
                <strong style={{ color: 'var(--rc-text-primary, #1e293b)' }}>{user?.niveau}</strong>
              </div>

              <div>
                <span style={{ color: 'var(--rc-text-secondary, #64748b)', display: 'block', fontSize: '0.8125rem' }}>
                  Présentation / Bio
                </span>
                <p style={{ margin: '4px 0 0 0', lineHeight: 1.5, color: 'var(--rc-text-secondary, #64748b)' }}>
                  {user?.bio || 'Aucune biographie rédigée pour le moment.'}
                </p>
              </div>
            </div>
          </div>

          {/* Badges & Rewards Card */}
          <div
            style={{
              background: 'var(--rc-bg-surface, #ffffff)',
              borderRadius: '16px',
              border: '1px solid var(--rc-border, #e2e8f0)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
            }}
          >
            <div>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '1.125rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--rc-text-primary, #1e293b)' }}>
                <Award size={20} color="#f59e0b" /> Distinctions & Badges
              </h3>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                {(user?.badges || []).map((badge, idx) => (
                  <span
                    key={idx}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      background: 'var(--rc-badge-bg, rgba(99, 102, 241, 0.08))',
                      border: '1px solid var(--rc-border, #e2e8f0)',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      color: 'var(--rc-text-primary, #1e293b)',
                    }}
                  >
                    <FileCheck2 size={14} color="#10b981" /> {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Shortcut to Notebook */}
            <div
              style={{
                borderTop: '1px solid var(--rc-border, #e2e8f0)',
                paddingTop: '16px',
                textAlign: 'center',
              }}
            >
              <Link to="/notebook" style={{ textDecoration: 'none' }}>
                <Button variant="secondary" icon={BookMarked} style={{ width: '100%' }}>
                  Accéder à mon Carnet Privé
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* Edit Form */
        <div
          style={{
            background: 'var(--rc-bg-surface, #ffffff)',
            borderRadius: '16px',
            border: '1px solid var(--rc-border, #e2e8f0)',
            padding: '28px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
          }}
        >
          <h3 style={{ margin: '0 0 20px 0', fontSize: '1.25rem', fontWeight: 700, color: 'var(--rc-text-primary, #1e293b)' }}>
            Modifier mes informations personnelles
          </h3>

          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: 600 }}>
                  Nom complet :
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--rc-border, #cbd5e1)', fontFamily: 'inherit' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: 600 }}>
                  Email universitaire :
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--rc-border, #cbd5e1)', fontFamily: 'inherit' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: 600 }}>
                Université ou École d'Ingénieurs au Cameroun :
              </label>
              <select
                name="universityId"
                value={formData.universityId}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--rc-border, #cbd5e1)', fontFamily: 'inherit' }}
              >
                {CAMEROON_UNIVERSITIES.map((uni) => (
                  <option key={uni.id} value={uni.id}>
                    [{uni.code}] {uni.name} ({uni.city})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: 600 }}>
                  Filière :
                </label>
                <input
                  type="text"
                  name="filiere"
                  value={formData.filiere}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--rc-border, #cbd5e1)', fontFamily: 'inherit' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: 600 }}>
                  Niveau :
                </label>
                <select
                  name="niveau"
                  value={formData.niveau}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--rc-border, #cbd5e1)', fontFamily: 'inherit' }}
                >
                  <option value="L1">Licence 1 (L1)</option>
                  <option value="L2">Licence 2 (L2)</option>
                  <option value="L3">Licence 3 (L3)</option>
                  <option value="M1">Master 1 (M1)</option>
                  <option value="M2">Master 2 (M2)</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: 600 }}>
                Bio & centres d'intérêts :
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--rc-border, #cbd5e1)', fontFamily: 'inherit', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <Button variant="outline" icon={X} onClick={() => setIsEditing(false)}>
                Annuler
              </Button>
              <Button type="submit" variant="primary" icon={Check}>
                Enregistrer les modifications
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}