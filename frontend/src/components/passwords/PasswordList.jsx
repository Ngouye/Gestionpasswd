function PasswordList({ passwords, onEdit, onDelete }) {
  return (
    <div className="card glass-card list-card">
      <div className="section-headline">
        <p className="eyebrow">Liste sécurisée</p>
        <h2>Vos identifiants</h2>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Titre</th>
              <th>Utilisateur</th>
              <th>Mot de passe</th>
              <th>URL</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {passwords.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-cell">
                  Aucune entrée pour le moment.
                </td>
              </tr>
            ) : (
              passwords.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.username}</td>
                  <td>••••••••</td>
                  <td>{item.url || '—'}</td>
                  <td className="actions-cell">
                    <button type="button" onClick={() => onEdit(item)}>
                      Modifier
                    </button>
                    <button type="button" className="danger" onClick={() => onDelete(item.id)}>
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PasswordList;
