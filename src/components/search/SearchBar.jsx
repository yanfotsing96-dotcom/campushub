import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange, onClear, placeholder = 'Rechercher un cours, une UE, un mot-clé (ex: L2, Algorithmique, INF201)...' }) {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%', marginBottom: '20px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 16px',
          background: 'var(--bg-subtle, #f8fafc)',
          border: '1px solid var(--border-subtle, #cbd5e1)',
          borderRadius: '12px',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        }}
      >
        <Search size={20} color="var(--primary, #6366f1)" style={{ flexShrink: 0 }} />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            flex: 1,
            border: 'none',
            background: 'transparent',
            color: 'var(--text-main, #0f172a)',
            fontSize: '0.95rem',
            fontFamily: 'inherit',
            outline: 'none',
          }}
        />
        {value && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Effacer la recherche"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted, #64748b)',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>
        )}
      </div>
    </form>
  );
}