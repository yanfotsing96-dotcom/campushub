export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  style = {},
  ...props
}) {
  const getStyles = () => {
    const base = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      fontWeight: 600,
      borderRadius: '8px',
      border: '1px solid transparent',
      cursor: disabled || loading ? 'not-allowed' : 'pointer',
      opacity: disabled || loading ? 0.6 : 1,
      transition: 'all 0.15s ease',
      fontFamily: 'inherit',
      textDecoration: 'none',
      ...style,
    };

    const sizes = {
      sm: { padding: '6px 12px', fontSize: '0.8125rem' },
      md: { padding: '8px 16px', fontSize: '0.875rem' },
      lg: { padding: '10px 20px', fontSize: '1rem' },
    };

    const variants = {
      primary: {
        backgroundColor: '#6366f1',
        color: '#ffffff',
        boxShadow: '0 1px 3px rgba(99, 102, 241, 0.3)',
      },
      secondary: {
        backgroundColor: 'var(--rc-badge-bg, rgba(99, 102, 241, 0.1))',
        color: 'var(--rc-primary, #6366f1)',
      },
      outline: {
        backgroundColor: 'transparent',
        borderColor: 'var(--rc-border, #e2e8f0)',
        color: 'var(--rc-text-primary, #1e293b)',
      },
      danger: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderColor: 'rgba(239, 68, 68, 0.25)',
        color: '#ef4444',
      },
      ghost: {
        backgroundColor: 'transparent',
        color: 'var(--rc-text-secondary, #64748b)',
      },
    };

    return { ...base, ...sizes[size], ...variants[variant] };
  };

  return (
    <button
      type={type}
      onClick={disabled || loading ? undefined : onClick}
      disabled={disabled || loading}
      className={`app-button app-button--${variant} ${className}`}
      style={getStyles()}
      {...props}
    >
      {loading ? (
        <span
          style={{
            width: '14px',
            height: '14px',
            border: '2px solid currentColor',
            borderRightColor: 'transparent',
            borderRadius: '50%',
            display: 'inline-block',
            animation: 'spin 0.6s linear infinite',
          }}
        />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon size={size === 'sm' ? 14 : 16} />}
          {children}
          {Icon && iconPosition === 'right' && <Icon size={size === 'sm' ? 14 : 16} />}
        </>
      )}
    </button>
  );
}
