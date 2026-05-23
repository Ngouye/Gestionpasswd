function AuthForm({ mode, form, error, onChange, onSubmit, onToggle }) {
  return (
    <div className="auth-card">
      <div className="auth-header">
        <h1>Gestionnaire de mots de passe</h1>
        <p>Connectez-vous ou créez un compte pour gérer vos identifiants en toute sécurité.</p>
      </div>

      <div className="auth-toggle">
        <button type="button" className={mode === 'signIn' ? 'active' : ''} onClick={() => onToggle('signIn')}>
          Connexion
        </button>
        <button type="button" className={mode === 'signUp' ? 'active' : ''} onClick={() => onToggle('signUp')}>
          Inscription
        </button>
      </div>

      <form className="auth-form" onSubmit={onSubmit}>
        {mode === 'signUp' && (
          <label>
            Nom d'utilisateur
            <input name="username" type="text" value={form.username} onChange={onChange} placeholder="Votre nom" required />
          </label>
        )}

        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={onChange} placeholder="email@example.com" required />
        </label>

        <label>
          Mot de passe
          <input name="password" type="password" value={form.password} onChange={onChange} placeholder="********" required />
        </label>

        {mode === 'signUp' && (
          <label>
            Confirmer le mot de passe
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

export default AuthForm;
