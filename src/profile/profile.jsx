import React from 'react';
import './profile.css';

export function Profile() {
  return (
	<main class="container py-3">
		<div class="row g-3">
			<h1 class="col-12 h3 text-center mb-0">Player Profile</h1>

			<section class="col-12 col-md-6">
				<div class="card h-100 shadow-sm">
					<div class="card-body py-3">
						<h2 class="h5 card-title">Account Information</h2>
						<p class="mb-1">Username: Player1</p>
						<p class="mb-1">Email: player@example.com</p>
						<p class="mb-3">Member since: September 2026</p>
						<button type="button" class="btn btn-primary btn-sm">Edit Account</button>
					</div>
				</div>
			</section>

			<section class="col-12 col-md-6">
				<div class="card h-100 shadow-sm">
					<div class="card-body py-3">
						<h2 class="h5 card-title">Statistics</h2>
						<p class="mb-1">Total wins: 0</p>
						<p class="mb-1">Total losses: 0</p>
						<p class="mb-1">Total games: 0</p>
						<p class="mb-1">Win percentage: 0%</p>
						<p class="mb-0">Current win streak: 0</p>
					</div>
				</div>
			</section>
		</div>
	</main>
  );
}
