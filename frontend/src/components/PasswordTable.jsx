function PasswordTable({ passwords, onEdit, onDelete }) {
  return (
    <div className="table-card">
      <h2>Vos identifiants</h2>
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
                <td colSpan="5">Aucun mot de passe pour l'instant.</td>
              </tr>
            ) : (
              passwords.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.username}</td>
                  <td>{item.password}</td>
                  <td>{item.url}</td>
                  <td>
                    <button onClick={() => onEdit(item)}>Modifier</button>
                    <button className="danger" onClick={() => onDelete(item.id)}>
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

export default PasswordTable;
