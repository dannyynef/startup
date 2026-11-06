import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

import { BrowserRouter, Navigate, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Play } from './play/play';
import { Profile } from './profile/profile';
import { About } from './about/about';

export default function App() {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [sessionError, setSessionError] = React.useState('');

  React.useEffect(() => {
    const controller = new AbortController();
    async function checkSession() {
      try {
        const response = await fetch('/api/user/me', { signal: controller.signal });
        if (response.status === 401) {
          setUser(null);
        } else if (response.ok) {
          setUser(await response.json());
        } else {
          throw new Error('Session check failed');
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setSessionError('Unable to check your session. Please refresh to try again.');
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    checkSession();
    return () => controller.abort();
  }, []);

  async function logout() {
    const response = await fetch('/api/auth', { method: 'DELETE' });
    if (!response.ok) throw new Error('Logout failed');
    setUser(null);
  }

  return (
    <BrowserRouter>
      <div className="body bg-light text-dark">
        <header className="bg-dark border-bottom border-warning border-4">
          <nav className="navbar navbar-expand navbar-dark bg-dark site-navbar">
            <div className="container-fluid">
              <ul className="navbar-nav flex-row gap-3">
                <li className="nav-item">
                  <NavLink className="nav-link" to="/" end>Home</NavLink>
                </li>
                {user && (
                  <>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/play">Play</NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/profile">Profile</NavLink>
                    </li>
                  </>
                )}
                <li className="nav-item">
                  <NavLink className="nav-link" to="/about">About</NavLink>
                </li>
              </ul>
            </div>
          </nav>
        </header>

        {loading ? (
          <main className="container py-4 text-center" role="status">Checking your session...</main>
        ) : sessionError ? (
          <main className="container py-4 text-center" role="alert">{sessionError}</main>
        ) : <Routes>
          <Route path="/" element={<Login user={user} onLogin={setUser} onLogout={logout} />} />
          <Route path="/play" element={user ? <Play user={user} /> : <Navigate to="/" replace />} />
          <Route path="/profile" element={user ? <Profile user={user} onUserChange={setUser} /> : <Navigate to="/" replace />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>}

        <footer className="container-fluid d-flex justify-content-between align-items-center bg-dark text-white-50 border-top border-warning">
          <span className="text-reset">Daniel Nef</span>
          <a className="text-reset" href="https://github.com/dannyynef/startup">GitHub</a>
        </footer>
      </div>
    </BrowserRouter>

  );
}

function NotFound() {
  return (
    <main className="container-fluid bg-light text-center">
      404: Return to sender. Address unknown.
    </main>
  );
}
