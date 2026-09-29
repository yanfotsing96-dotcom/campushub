import { Code2, Calculator, Atom, FlaskConical, Dna, GraduationCap } from 'lucide-react';

const ICONS = {
  Informatique: Code2,
  Mathématiques: Calculator,
  Physique: Atom,
  Chimie: FlaskConical,
  Biologie: Dna,
};

export default function Badge({ type = 'filiere', value, size = 'md' }) {
  if (!value) return null;

  if (type === 'niveau') {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: size === 'sm' ? '2px 8px' : '4px 10px',
          borderRadius: '999px',
          fontSize: size === 'sm' ? '0.75rem' : '0.8125rem',
          fontWeight: 600,
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          color: '#6366f1',
          border: '1px solid rgba(99, 102, 241, 0.25)',
        }}
      >
        <GraduationCap size={size === 'sm' ? 12 : 14} />
        {value}
      </span>
    );
  }

  const IconComponent = ICONS[value] || Code2;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: size === 'sm' ? '2px 8px' : '4px 10px',
        borderRadius: '999px',
        fontSize: size === 'sm' ? '0.75rem' : '0.8125rem',
        fontWeight: 600,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        color: '#059669',
        border: '1px solid rgba(16, 185, 129, 0.25)',
      }}
    >
      <IconComponent size={size === 'sm' ? 12 : 14} />
      {value}
    </span>
  );
}
