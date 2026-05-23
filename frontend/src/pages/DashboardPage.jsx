import PasswordEditor from '../components/passwords/PasswordEditor';
import PasswordList from '../components/passwords/PasswordList';

function DashboardPage({ auth, passwords, passwordForm, onPasswordChange, onPasswordSubmit, onPasswordReset, onEdit, onDelete, onLogout, message }) {
  return (
    <main className="page-shell dashboard-page">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Tableau de bord</p>
          <h1>Bienvenue, {auth.username}</h1>
          <p>Gérez facilement vos identifiants avec un design épuré et professionnel.</p>
        </div>
        <button className="secondary logout" onClick={onLogout}>
          Déconnexion
        </button>
      </header>

      <section className="dashboard-grid">
        <div className="card glass-card summary-card">
          <h2>Vue globale</h2>
          <p>{passwords.length} entrées actives</p>
          <div className="summary-list">
            <div>
              <span>Identifiants</span>
              <strong>{passwords.length}</strong>
            </div>
            <div>
              <span>Email</span>
              <strong>{auth.email}</strong>
            </div>
          </div>
        </div>

        <PasswordEditor
          form={passwordForm}
          onChange={onPasswordChange}
          onSubmit={onPasswordSubmit}
          onReset={onPasswordReset}
          message={message}
        />
      </section>

      <section className="table-panel">
        <PasswordList passwords={passwords} onEdit={onEdit} onDelete={onDelete} />
      </section>
    </main>
  );
}

export default DashboardPage;
