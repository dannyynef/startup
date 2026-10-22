import React from 'react';
import { Link } from 'react-router-dom';
import './login.css';

export function Login({ user, onLogin, onLogout }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  function authenticate(event) {
    event.preventDefault();
    setError('');
    const normalizedEmail = email.trim().toLowerCase();
    const creating = event.nativeEvent.submitter?.value === 'create';

    try {
      // Mock account service: only account profiles are stored, never passwords.
      const accounts = JSON.parse(localStorage.getItem('connect4.accounts') || '{}');
      if (!accounts || typeof accounts !== 'object' || Array.isArray(accounts)) {
        throw new Error('Invalid account storage');
      }
      const existing = Object.hasOwn(accounts, normalizedEmail) ? accounts[normalizedEmail] : null;
      if (creating && existing) {
        setError('An account with this email already exists. Please log in.');
        return;
      }
      if (!creating && !existing) {
        setError('Account not found. Click Create to make an account first.');
        return;
      }

      const account = existing || { email: normalizedEmail, joined: new Date().toISOString() };
      if (creating) {
        accounts[normalizedEmail] = account;
        localStorage.setItem('connect4.accounts', JSON.stringify(accounts));
      }
      onLogin(account);
      setPassword('');
    } catch {
      setError('Unable to read or save accounts. Check that browser storage is available.');
    }
  }

  return (
    <main>
      <div className="container-sm py-4 text-center">
        <h1 className="mb-4">Connect4</h1>
        {user ? (
          <div>
            <p>Welcome, {user.displayName || user.email}!</p>
            <div className="d-flex justify-content-center gap-2">
              <Link to="/play" className="btn btn-primary">Play</Link>
              <button type="button" className="btn btn-warning" onClick={onLogout}>Logout</button>
            </div>
          </div>
        ) : (
          <form className="login-form mx-auto" onSubmit={authenticate}>
            <p className="small text-muted">Mock login: create an account, then log in with any nonempty password. Passwords are not saved or verified yet.</p>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input id="email" type="email" autoComplete="email" className="form-control" placeholder="your@email.com" required value={email} onChange={(event) => setEmail(event.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input id="password" type="password" autoComplete="current-password" className="form-control" placeholder="password" required value={password} onChange={(event) => setPassword(event.target.value)} />
            </div>
            {error && <p className="text-danger" role="alert">{error}</p>}
            <div className="d-flex justify-content-center gap-2">
              <button type="submit" value="login" className="btn btn-primary">Login</button>
              <button type="submit" value="create" className="btn btn-warning">Create</button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
