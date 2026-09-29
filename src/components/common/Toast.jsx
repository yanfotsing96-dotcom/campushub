import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({
  message,
  type = 'success',
  actionLabel,
  onAction,
  onClose,
}) {
  if (!message) return null;

  const ICONS = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
  };

  const IconComponent = ICONS[type] || CheckCircle2;

  const colors = {
    success: { bg: '#ecfdf5', border: '#a7f3d0', text: '#065f46', icon: '#10b981' },
    error: { bg: '#fef2f2', border: '#fecaca', text: '#991b1b', icon: '#ef4444' },
    info: { bg: '#eff6ff', border: '#bfdbfe', text: '#1e40af', icon: '#3b82f6' },
  };

  const currentTheme = colors[type] || colors.success;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 18px',
        borderRadius: '12px',
        backgroundColor: currentTheme.bg,
        border: `1px solid ${currentTheme.border}`,
        color: currentTheme.text,
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        fontWeight: 500,
        fontSize: '0.875rem',
        animation: 'slide-up 0.25s ease-out',
        maxWidth: '420px',
      }}
    >
      <IconComponent size={20} color={currentTheme.icon} style={{ flexShrink: 0 }} />
      <span style={{ flex: 1 }}>{message}</span>

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          style={{
            background: 'rgba(0,0,0,0.06)',
            border: 'none',
            borderRadius: '6px',
            padding: '4px 10px',
            fontSize: '0.8125rem',
            fontWeight: 700,
            color: 'inherit',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          {actionLabel}
        </button>
      )}

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'inherit',
            opacity: 0.6,
            cursor: 'pointer',
            padding: '2px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
