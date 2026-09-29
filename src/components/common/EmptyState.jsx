import Button from './Button';

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  actionIcon,
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        textAlign: 'center',
        background: 'var(--rc-bg-surface, #ffffff)',
        borderRadius: '16px',
        border: '1px dashed var(--rc-border, #e2e8f0)',
        maxWidth: '520px',
        margin: '24px auto',
      }}
    >
      {Icon && (
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            background: 'var(--rc-badge-bg, rgba(99, 102, 241, 0.1))',
            color: 'var(--rc-primary, #6366f1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
          }}
        >
          <Icon size={28} />
        </div>
      )}
      <h3
        style={{
          margin: '0 0 8px 0',
          fontSize: '1.125rem',
          fontWeight: 700,
          color: 'var(--rc-text-primary, #1e293b)',
        }}
      >
        {title}
      </h3>
      <p
        style={{
          margin: '0 0 20px 0',
          fontSize: '0.875rem',
          color: 'var(--rc-text-secondary, #64748b)',
          lineHeight: 1.5,
          maxWidth: '380px',
        }}
      >
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" icon={actionIcon} onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
