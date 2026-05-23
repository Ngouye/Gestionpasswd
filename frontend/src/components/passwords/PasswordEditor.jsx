function PasswordEditor({ form, onChange, onSubmit, onReset, message }) {
  return (
    <div className="card glass-card editor-card">
      <div className="section-headline">
        <p className="eyebrow">Éditeur</p>
        <h2>{form.id ? 'Modifier une entrée' : 'Nouvelle entrée'}</h2>
      </div>
      {message && <p className="message">{message}</p>}
      <form className="password-form" onSubmit={onSubmit}>
        <label>
          Titre
          <input name="title" value={form.title} onChange={onChange} placeholder="Ex. Compte Gmail" required />
        </label>

        <label>
          Utilisateur
          <input name="username" value={form.username} onChange={onChange} placeholder="Identifiant ou email" required />
        </label>

        <label>
          Mot de passe
          <input name="password" type="password" value={form.password} onChange={onChange} placeholder="********" required />
        </label>

        <label>
          URL
          <input name="url" value={form.url} onChange={onChange} placeholder="https://..." />
        </label>

        <label>
          Notes
          <textarea name="notes" value={form.notes} onChange={onChange} placeholder="Informations complémentaires" rows="4" />
        </label>

        <div className="button-row">
          <button type="submit" className="primary">
            {form.id ? 'Enregistrer' : 'Ajouter'}
          </button>
          <button type="button" className="secondary" onClick={onReset}>
            Réinitialiser
          </button>
        </div>
      </form>
    </div>
  );
}

export default PasswordEditor;
