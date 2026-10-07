import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

export default function App() {
  return (
    <div className="body bg-light text-dark">
      <header className="bg-dark border-bottom border-warning border-4">
        <nav className="navbar navbar-expand navbar-dark bg-dark site-navbar">
          <div className="container-fluid">
            <ul className="navbar-nav flex-row gap-3">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="index.html">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="play.html">Play</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="profile.html">Profile</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="about.html">About</a>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      <main>App components go here</main>

      <footer className="container-fluid d-flex justify-content-between align-items-center bg-dark text-white-50 border-top border-warning">
        <span className="text-reset">Daniel Nef</span>
        <a className="text-reset" href="https://github.com/dannyynef/startup">GitHub</a>
      </footer>
    </div>
  );
}
