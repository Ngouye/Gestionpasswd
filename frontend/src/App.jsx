import { useEffect, useMemo, useState } from 'react';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';

const AUTH_KEY = 'gestionmotdepasse_auth';

const emptyPasswordForm = {
  id: null,
  title: '',
  username: '',
  password: '',
  url: '',
  notes: '',
};

const initialAuthForm = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
};

function App() {
  const [auth, setAuth] = useState(() => {
    const saved = localStorage.getItem(AUTH_KEY);
    return saved ? JSON.parse(saved) : null;
  });
  const [authMode, setAuthMode] = useState('signIn');
  const [authForm, setAuthForm] = useState(initialAuthForm);
  const [authError, setAuthError] = useState('');
  const [passwords, setPasswords] = useState([]);
  const [passwordForm, setPasswordForm] = useState(emptyPasswordForm);
  const [statusMessage, setStatusMessage] = useState('');

  const headers = useMemo(() => {
    const baseHeaders = { 'Content-Type': 'application/json' };
    if (auth?.token) {
      return { ...baseHeaders, Authorization: `Bearer ${auth.token}` };
    }
    return baseHeaders;
  }, [auth]);

  useEffect(() => {
    if (auth?.token) {
      loadPasswords(auth.token);
    }
  }, [auth]);

  const loadPasswords = async (token) => {
    if (!token) return;

    const response = await fetch('/api/passwords', {
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      setPasswords(await response.json());
    } else if (response.status === 401) {
      handleLogout();
    }
  };

  const handleAuthChange = (event) => {
    const { name, value } = event.target;
    setAuthForm((prev) => ({ ...prev, [name]: value }));
    setAuthError('');
  };

  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    setAuthError('');
    setStatusMessage('');

    if (authMode === 'signUp') {
      if (!authForm.username || !authForm.email || !authForm.password || !authForm.confirmPassword) {
        setAuthError('Tous les champs sont requis.');
        return;
      }
      if (authForm.password !== authForm.confirmPassword) {
        setAuthError('Les mots de passe ne correspondent pas.');
        return;
      }
    }

    const endpoint = authMode === 'signUp' ? '/api/auth/register' : '/api/auth/login';
    const payload = authMode === 'signUp'
      ? {
          username: authForm.username,
          email: authForm.email,
          password: authForm.password,
          confirmPassword: authForm.confirmPassword,
        }
      : {
          email: authForm.email,
          password: authForm.password,
        };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorJson = await response.json().catch(() => null);
      setAuthError(errorJson?.message || 'Impossible de se connecter.');
      return;
    }

    const data = await response.json();
    const authState = { token: data.token, username: data.username, email: data.email };
    localStorage.setItem(AUTH_KEY, JSON.stringify(authState));
    setAuth(authState);
    setAuthForm(initialAuthForm);
    setStatusMessage(authMode === 'signUp' ? 'Compte créé avec succès.' : 'Connexion réussie.');
    await loadPasswords(authState.token);
  };

  const switchAuthMode = (mode) => {
    setAuthMode(mode);
    setAuthError('');
    setStatusMessage('');
    setAuthForm(initialAuthForm);
  };

  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEY);
    setAuth(null);
    setPasswords([]);
    setPasswordForm(emptyPasswordForm);
    setStatusMessage('');
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setStatusMessage('');

    const method = passwordForm.id ? 'PUT' : 'POST';
    const url = passwordForm.id ? `/api/passwords/${passwordForm.id}` : '/api/passwords';

    const response = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(passwordForm),
    });

    if (response.ok) {
      setPasswordForm(emptyPasswordForm);
      setStatusMessage(passwordForm.id ? 'Entrée mise à jour.' : 'Entrée ajoutée.');
      await loadPasswords(auth.token);
    } else {
      setStatusMessage('Erreur lors de l’envoi du formulaire.');
    }
  };

  const handlePasswordEdit = (item) => {
    setPasswordForm(item);
    setStatusMessage('');
  };

  const handlePasswordDelete = async (id) => {
    const confirmed = window.confirm('Supprimer cette entrée ?');
    if (!confirmed) return;

    const response = await fetch(`/api/passwords/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (response.ok) {
      setStatusMessage('Entrée supprimée.');
      await loadPasswords(auth.token);
    }
  };

  if (!auth) {
    return (
      <AuthPage
        mode={authMode}
        form={authForm}
        error={authError}
        onChange={handleAuthChange}
        onSubmit={handleAuthSubmit}
        onToggle={switchAuthMode}
      />
    );
  }

  return (
    <DashboardPage
      auth={auth}
      passwords={passwords}
      passwordForm={passwordForm}
      onPasswordChange={handlePasswordChange}
      onPasswordSubmit={handlePasswordSubmit}
      onPasswordReset={() => setPasswordForm(emptyPasswordForm)}
      onEdit={handlePasswordEdit}
      onDelete={handlePasswordDelete}
      onLogout={handleLogout}
      message={statusMessage}
    />
  );
}

export default App;
