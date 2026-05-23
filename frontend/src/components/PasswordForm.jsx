function PasswordForm({ form, onChange, onSubmit, onReset, message }) {
  return (
    <div className="form-card">
      <div className="section-headline">
        <h2>{form.id ? 'Modifier une entrée' : 'Nouvelle entrée'}</h2>
        <p>Ajoutez ou mettez à jour un identifiant en quelques secondes.</p>
      </div>
      {message && <p className="message">{message}</p>}
      <form onSubmit={onSubmit}>
        <label>
          Titre
          <input name="title" value={form.title} onChange={onChange} required />
        </label>
        <label>
          Utilisateur
          <input name="username" value={form.username} onChange={onChange} required />
        </label>
        <label>
          Mot de passe
          <input name="password" type="password" value={form.password} onChange={onChange} required />
        </label>
        <label>
          URL
          <input name="url" value={form.url} onChange={onChange} />
        </label>
        <label>
          Notes
          <textarea name="notes" value={form.notes} onChange={onChange} rows="3" />
        </label>
        <div className="button-row">
          <button type="submit">{form.id ? 'Enregistrer' : 'Ajouter'}</button>
          <button type="button" className="secondary" onClick={onReset}>
            Réinitialiser
          </button>
        </div>
      </form>
    </div>
  );
}

export default PasswordForm;
