import React from 'react';
import { getStats } from '../play/statistics';
import './profile.css';

export function Profile({ user }) {
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
              <p className="mb-1">Username: {user.email.split('@')[0]}</p>
              <p className="mb-1">Email: {user.email}</p>
              <p className="mb-3">Member since: September 2026</p>
              <button type="button" className="btn btn-primary btn-sm">
                Edit Account
              </button>
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
