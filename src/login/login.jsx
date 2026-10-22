import React from 'react';
import { Link } from 'react-router-dom';
import './login.css';

export function Login({ user, onLogin, onLogout }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  function authenticate(event) {
    event.preventDefault();
    // Mock sign-in: real account lookup and password verification come later.
    onLogin({ email: email.trim().toLowerCase() });
    setPassword('');
  }

  return (
    <main>
      <div className="container-sm py-4 text-center">
        <h1 className="mb-4">Connect4</h1>
        {user ? (
          <div>
            <p>Welcome, {user.email}!</p>
            <div className="d-flex justify-content-center gap-2">
              <Link to="/play" className="btn btn-primary">Play</Link>
              <button type="button" className="btn btn-warning" onClick={onLogout}>Logout</button>
            </div>
          </div>
        ) : (
          <form className="login-form mx-auto" onSubmit={authenticate}>
            <p className="small text-muted">Mock login: enter an email and any nonempty password. Passwords are not saved or verified yet.</p>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input id="email" type="email" autoComplete="email" className="form-control" placeholder="your@email.com" required value={email} onChange={(event) => setEmail(event.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input id="password" type="password" autoComplete="current-password" className="form-control" placeholder="password" required value={password} onChange={(event) => setPassword(event.target.value)} />
            </div>
            <div className="d-flex justify-content-center gap-2">
              <button type="submit" value="login" className="btn btn-primary">Login</button>
              <button type="button" className="btn btn-warning" disabled>Create</button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
