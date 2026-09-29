import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';

export default function NotFoundPage() {
  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '32px 16px',
      }}
    >
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '20px',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          color: '#6366f1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
        }}
      >
        <Compass size={36} />
      </div>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0 0 8px 0' }}>404</h1>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 12px 0' }}>Page introuvable</h2>
      <p style={{ maxWidth: '420px', color: 'var(--rc-text-secondary, #64748b)', margin: '0 0 24px 0', lineHeight: 1.5 }}>
        L'adresse demandée n'existe pas ou le document a été déplacé dans une autre section du portail.
      </p>
      <Link to="/ressources" style={{ textDecoration: 'none' }}>
        <Button variant="primary" icon={ArrowLeft}>
          Retour aux Ressources
        </Button>
      </Link>
    </div>
  );
}
