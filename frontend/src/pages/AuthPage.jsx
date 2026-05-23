import AuthPanel from '../components/auth/AuthPanel';

function AuthPage({ mode, form, error, onChange, onSubmit, onToggle }) {
  return (
    <main className="page-shell auth-page">
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">Gestion de mots de passe</span>
          <h1>Interface ultra-moderne pour sécuriser vos identifiants</h1>
          <p>
            Identifiez-vous ou créez un compte dès maintenant pour organiser vos logins,
            vos URL et vos notes dans un espace sécurisé et esthétique.
          </p>
          <div className="hero-stats">
            <div>
              <strong>100% sécurisé</strong>
              <span>Chiffrement AES sécurisé</span>
            </div>
            <div>
              <strong>Rapide à utiliser</strong>
              <span>Formulaire fluide et minimaliste</span>
            </div>
          </div>
        </div>
        <div className="hero-card-wrap">
          <AuthPanel
            mode={mode}
            form={form}
            error={error}
            onChange={onChange}
            onSubmit={onSubmit}
            onToggle={onToggle}
          />
        </div>
      </section>
    </main>
  );
}

export default AuthPage;
