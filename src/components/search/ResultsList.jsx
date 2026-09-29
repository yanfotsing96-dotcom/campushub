function ResultsList({ results }) {
  if (results.length === 0) {
    return <p>Aucun résultat.</p>;
  }

  return (
    <ul className="results-list">
      {results.map((item) => (
        <li key={item.id}>
          <strong>{item.titre}</strong> — {item.filiere} ({item.niveau})
          <p>{item.description}</p>
        </li>
      ))}
    </ul>
  );
}

export default ResultsList;