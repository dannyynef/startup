import React from 'react';
import './profile.css';

export function Profile() {
  return (
    <main className="container py-3">
      <div className="row g-3">
        <h1 className="col-12 h3 text-center mb-0">Player Profile</h1>

        <section className="col-12 col-md-6">
          <div className="card h-100 shadow-sm">
            <div className="card-body py-3">
              <h2 className="h5 card-title">Account Information</h2>
              <p className="mb-1">Username: Player1</p>
              <p className="mb-1">Email: player@example.com</p>
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
              <p className="mb-1">Total wins: 0</p>
              <p className="mb-1">Total losses: 0</p>
              <p className="mb-1">Total games: 0</p>
              <p className="mb-1">Win percentage: 0%</p>
              <p className="mb-0">Current win streak: 0</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
