import React from 'react';
import { getStats } from '../play/statistics';
import './profile.css';

export function Profile({ user, onUserChange }) {
  const [editing, setEditing] = React.useState(false);
  const [displayName, setDisplayName] = React.useState(user.displayName || user.email.split('@')[0]);
  const [accountError, setAccountError] = React.useState('');
  const [saving, setSaving] = React.useState(false);

  async function saveAccount(event) {
    event.preventDefault();
    if (saving) return;
    if (!displayName.trim()) {
      setAccountError('Please enter a username.');
      return;
    }
    setAccountError('');
    setSaving(true);
    try {
      const response = await fetch('/api/user/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName: displayName.trim() }),
      });
      const updated = await response.json();
      if (!response.ok) {
        setAccountError(updated.msg || 'Unable to save your account.');
        return;
      }
      onUserChange(updated);
      setEditing(false);
    } catch {
      setAccountError('Unable to connect to the server. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  const joinedDate = new Date(user.joined);
  const memberSince = user.joined && !Number.isNaN(joinedDate.getTime())
    ? joinedDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
    : 'Unknown';

  const [stats, setStats] = React.useState(null);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    try {
      setStats(getStats(user.email));
      setError('');
    } catch {
      setStats(null);
      setError('Unable to load your saved statistics. Check browser storage.');
    }
  }, [user.email]);

  const totalGames = stats ? stats.wins + stats.losses + stats.draws : 0;
  const winPercentage = totalGames ? Math.round((stats.wins / totalGames) * 100) : 0;

  return (
    <main className="container py-3">
      <div className="row g-3">
        <h1 className="col-12 h3 text-center mb-0">Player Profile</h1>

        <section className="col-12 col-md-6">
          <div className="card h-100 shadow-sm">
            <div className="card-body py-3">
              <h2 className="h5 card-title">Account Information</h2>
              <p className="mb-1">Username: {user.displayName || user.email.split('@')[0]}</p>
              <p className="mb-1">Email: {user.email}</p>
              <p className="mb-3">Member since: {memberSince}</p>
              {accountError && <p className="text-danger" role="alert">{accountError}</p>}
              {editing ? (
                <form onSubmit={saveAccount}>
                  <label htmlFor="displayName" className="form-label">Username</label>
                  <input id="displayName" className="form-control mb-2" required maxLength={40} disabled={saving}
                    value={displayName} onChange={(event) => setDisplayName(event.target.value)} />
                  <button type="submit" disabled={saving} className="btn btn-primary btn-sm me-2">{saving ? 'Saving...' : 'Save'}</button>
                  <button type="button" disabled={saving} className="btn btn-secondary btn-sm" onClick={() => {
                    setEditing(false);
                    setAccountError('');
                  }}>Cancel</button>
                </form>
              ) : (
                <button type="button" className="btn btn-primary btn-sm" onClick={() => {
                  setDisplayName(user.displayName || user.email.split('@')[0]);
                  setAccountError('');
                  setEditing(true);
                }}>Edit Account</button>
              )}
            </div>
          </div>
        </section>

        <section className="col-12 col-md-6">
          <div className="card h-100 shadow-sm">
            <div className="card-body py-3">
              <h2 className="h5 card-title">Statistics</h2>
              {error ? <p className="text-danger" role="alert">{error}</p> : stats ? (
                <>
                  <p className="mb-1">Total wins: {stats.wins}</p>
                  <p className="mb-1">Total losses: {stats.losses}</p>
                  <p className="mb-1">Total draws: {stats.draws}</p>
                  <p className="mb-1">Total games: {totalGames}</p>
                  <p className="mb-1">Win percentage: {winPercentage}%</p>
                  <p className="mb-0">Current win streak: {stats.currentWinStreak}</p>
                </>
              ) : <p>Loading statistics...</p>}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
