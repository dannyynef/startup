import React from 'react';
import { getStats } from '../play/statistics';
import './profile.css';

export function Profile({ user, onUserChange }) {
  const [editing, setEditing] = React.useState(false);
  const [displayName, setDisplayName] = React.useState(user.displayName || user.email.split('@')[0]);
  const [accountError, setAccountError] = React.useState('');
  const [account, setAccount] = React.useState(user);

  React.useEffect(() => {
    try {
      const accounts = JSON.parse(localStorage.getItem('connect4.accounts') || '{}');
      setAccount({ ...user, ...(Object.hasOwn(accounts, user.email) ? accounts[user.email] : {}) });
    } catch {
      setAccountError('Unable to load your account details.');
    }
  }, [user]);

  function saveAccount(event) {
    event.preventDefault();
    if (!displayName.trim()) {
      setAccountError('Please enter a display name.');
      return;
    }
    try {
      const accounts = JSON.parse(localStorage.getItem('connect4.accounts') || '{}');
      const updated = { ...account, email: user.email, displayName: displayName.trim() };
      accounts[user.email] = updated;
      localStorage.setItem('connect4.accounts', JSON.stringify(accounts));
      onUserChange(updated);
      setAccountError('');
      setEditing(false);
    } catch {
      setAccountError('Unable to save your account. Check browser storage.');
    }
  }

  const joinedDate = new Date(account.joined);
  const memberSince = account.joined && !Number.isNaN(joinedDate.getTime())
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
              <p className="mb-1">Username: {account.displayName || user.email.split('@')[0]}</p>
              <p className="mb-1">Email: {user.email}</p>
              <p className="mb-3">Member since: {memberSince}</p>
              {accountError && <p className="text-danger" role="alert">{accountError}</p>}
              {editing ? (
                <form onSubmit={saveAccount}>
                  <label htmlFor="displayName" className="form-label">Username</label>
                  <input id="displayName" className="form-control mb-2" required maxLength={40}
                    value={displayName} onChange={(event) => setDisplayName(event.target.value)} />
                  <button type="submit" className="btn btn-primary btn-sm me-2">Save</button>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => {
                    setEditing(false);
                    setAccountError('');
                  }}>Cancel</button>
                </form>
              ) : (
                <button type="button" className="btn btn-primary btn-sm" onClick={() => {
                  setDisplayName(account.displayName || user.email.split('@')[0]);
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
