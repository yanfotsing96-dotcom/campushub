export default function LoadingSkeleton({
  count = 3,
  height = '110px',
  layout = 'list',
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: layout === 'grid' ? 'repeat(auto-fill, minmax(280px, 1fr))' : '1fr',
        gap: '16px',
        width: '100%',
      }}
    >
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          style={{
            height,
            borderRadius: '14px',
            background: 'linear-gradient(90deg, var(--rc-bg-surface, #f1f5f9) 25%, var(--rc-border, #e2e8f0) 50%, var(--rc-bg-surface, #f1f5f9) 75%)',
            backgroundSize: '200% 100%',
            animation: 'skeleton-shimmer 1.5s infinite',
            border: '1px solid var(--rc-border, #e2e8f0)',
          }}
        />
      ))}
    </div>
  );
}
