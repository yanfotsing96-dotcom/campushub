function BadgeList({ badges }) {
  if (!badges || badges.length === 0) {
    return <p>Aucun badge pour le moment.</p>;
  }

  return (
    <div className="badge-list">
      {badges.map((badge, index) => (
        <span key={index} className="badge">
          {badge}
        </span>
      ))}
    </div>
  );
}

export default BadgeList;