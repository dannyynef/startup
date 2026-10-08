import React from 'react';
import './about.css';

export function About() {
  return (
    <main className="container py-4">
      <div className="row justify-content-center align-items-center g-4">
        <section className="col-12 text-center">
          <img className="about-image img-fluid rounded shadow-sm" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYyp8UF0nqdIXBTivHwFQxHVfQzwlRjGnxt8Dkb9VMFA&s=10" alt="Image of Connect 4" width="300" />
        </section>
        <section className="col-12 col-lg-8 mx-auto">
          <div className="bg-white border rounded shadow-sm p-3 p-md-4">
            <h2 className="h5 mb-3">What is Connect 4?</h2>
            <p>Connect 4 is a two-player strategy game where players take turns dropping colored pieces into a vertical board.</p>
            <p className="mb-0">The goal is to connect four of your pieces in a row horizontally, vertically, or diagonally before your opponent does.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
