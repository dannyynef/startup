import React from 'react';

export function Login() {
  return (
    <main>
      <div className="container-sm py-4 text-center">
        <h1 className="mb-4">Connect4</h1>
        <form className="login-form mx-auto" method="get" action="play.html">
          <div className="mb-3">
            <label for="email" className="form-label">Email</label>
            <input id="email" type="text" className="form-control" placeholder="your@email.com" />
          </div>
          <div className="mb-3">
            <label for="password" className="form-label">Password</label>
            <input id="password" type="password" className="form-control" placeholder="password" />
          </div>
          <div className="d-flex justify-content-center gap-2">
            <button type="submit" className="btn btn-primary">Login</button>
            <button type="submit" className="btn btn-warning">Create</button>
          </div>
        </form>
      </div>
    </main>
  );
}
