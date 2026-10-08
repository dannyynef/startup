import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Play } from './play/play';
import { Profile } from './profile/profile';
import { About } from './about/about';

export default function App() {
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
                <li className="nav-item">
                  <NavLink className="nav-link" to="/play">Play</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/profile">Profile</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/about">About</NavLink>
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
    </BrowserRouter>

  );
}
