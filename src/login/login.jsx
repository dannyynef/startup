import React from 'react';
import { Link } from 'react-router-dom';
import './login.css';

export function Login({ user, onLogin, onLogout }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [pending, setPending] = React.useState(false);

  async function authenticate(event) {
    event.preventDefault();
    if (pending) return;
    setError('');
    setPending(true);
    const creating = event.nativeEvent.submitter?.value === 'create';

    try {
      const response = await fetch('/api/auth', {
        method: creating ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      const account = await response.json();
      if (!response.ok) {
        setError(account.msg || 'Unable to sign in.');
        return;
      }
      onLogin(account);
      setPassword('');
    } catch {
      setError('Unable to connect to the server. Please try again.');
    } finally {
      setPending(false);
    }
  }

  async function logout() {
    setError('');
    setPending(true);
    try {
      await onLogout();
    } catch {
      setError('Unable to log out. Please try again.');
    } finally {
      setPending(false);
    }
  }

  return (
    <main>
      <div className="container-sm py-4 text-center">
        <h1 className="mb-4">Connect4</h1>
        {error && <p className="text-danger" role="alert">{error}</p>}
        {user ? (
          <div>
            <p>Welcome, {user.displayName || user.email}!</p>
            <div className="d-flex justify-content-center gap-2">
              <Link to="/play" className="btn btn-primary">Play</Link>
              <button type="button" className="btn btn-warning" onClick={logout} disabled={pending}>Logout</button>
            </div>
          </div>
        ) : (
          <form className="login-form mx-auto" onSubmit={authenticate}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input id="email" type="email" autoComplete="email" className="form-control" placeholder="your@email.com" required value={email} onChange={(event) => setEmail(event.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input id="password" type="password" autoComplete="current-password" className="form-control" placeholder="password" required value={password} onChange={(event) => setPassword(event.target.value)} />
            </div>
            <div className="d-flex justify-content-center gap-2">
              <button type="submit" disabled={pending} value="login" className="btn btn-primary">Login</button>
              <button type="submit" disabled={pending} value="create" className="btn btn-warning">Create</button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
