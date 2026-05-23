function AuthPanel({ mode, form, error, onChange, onSubmit, onToggle }) {
  return (
    <div className="auth-panel glass-card">
      <div className="auth-panel-header">
        <div>
          <p className="eyebrow">Accès rapide</p>
          <h2>{mode === 'signUp' ? "Créer un compte" : "Connexion"}</h2>
        </div>
      </div>

      <div className="auth-panel-switcher">
        <button type="button" className={mode === 'signIn' ? 'active' : ''} onClick={() => onToggle('signIn')}>
          Se connecter
        </button>
        <button type="button" className={mode === 'signUp' ? 'active' : ''} onClick={() => onToggle('signUp')}>
          S'inscrire
        </button>
      </div>

      <form className="auth-form" onSubmit={onSubmit}>
        {mode === 'signUp' && (
          <label>
            Nom d'utilisateur
            <input name="username" type="text" value={form.username} onChange={onChange} placeholder="Ex. Ana" required />
          </label>
        )}

        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={onChange} placeholder="email@domaine.com" required />
        </label>

        <label>
          Mot de passe
          <input name="password" type="password" value={form.password} onChange={onChange} placeholder="********" required />
        </label>

        {mode === 'signUp' && (
          <label>
            Confirmer
            <input
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={onChange}
              placeholder="Retapez le mot de passe"
              required
            />
          </label>
        )}

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" className="primary">
          {mode === 'signUp' ? 'Créer un compte' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
}

export default AuthPanel;
