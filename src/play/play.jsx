import React from 'react';
import './play.css';

export function Play() {
  return (
    <main class="container-sm text-center">
        <h1 class="h4 mb-1">Play Connect 4</h1>

        <section class="card w-100 text-center shadow-sm">
            <div class="card-body py-2">
                <p class="mb-1">You vs Mystery Player</p>
                <p class="mb-0">Turn: Your turn</p>
            </div>
		</section>

		<section class="game-board-section text-center">
            <p class="small mb-1">Click the column where you want to place your next piece</p>
            <table class="connect-four-board">
                <caption class="visually-hidden">Connect Four board, six rows by seven columns</caption>
                <tbody>
                    <tr><td><span class="board-slot" aria-hidden="true"></span></td><td><span class="board-slot" aria-hidden="true"></span></td><td><span class="board-slot" aria-hidden="true"></span></td><td><span class="board-slot" aria-hidden="true"></span></td><td><span class="board-slot" aria-hidden="true"></span></td><td><span class="board-slot" aria-hidden="true"></span></td><td><span class="board-slot" aria-hidden="true"></span></td></tr>
                    <tr><td><span class="board-slot" aria-hidden="true"></span></td><td><span class="board-slot" aria-hidden="true"></span></td><td><span class="board-slot" aria-hidden="true"></span></td><td><span class="board-slot" aria-hidden="true"></span></td><td><span class="board-slot" aria-hidden="true"></span></td><td><span class="board-slot" aria-hidden="true"></span></td><td><span class="board-slot" aria-hidden="true"></span></td></tr>
                    <tr><td><span class="board-slot" aria-hidden="true"></span></td><td><span class="board-slot" aria-hidden="true"></span></td><td><span class="board-slot" aria-hidden="true"></span></td><td><span class="board-slot" aria-hidden="true"></span></td><td><span class="board-slot" aria-hidden="true"></span></td><td><span class="board-slot" aria-hidden="true"></span></td><td><span class="board-slot" aria-hidden="true"></span></td></tr>
                    <tr><td><span class="board-slot" aria-hidden="true"></span></td><td><span class="board-slot" aria-hidden="true"></span></td><td><span class="board-slot" aria-hidden="true"></span></td><td><span class="board-slot" aria-hidden="true"></span></td><td><span class="board-slot" aria-hidden="true"></span></td><td><span class="board-slot" aria-hidden="true"></span></td><td><span class="board-slot" aria-hidden="true"></span></td></tr>
                    <tr><td><span class="board-slot" aria-hidden="true"></span></td><td><span class="board-slot" aria-hidden="true"></span></td><td><span class="board-slot" aria-hidden="true"></span></td><td><span class="board-slot" aria-hidden="true"></span></td><td><span class="board-slot" aria-hidden="true"></span></td><td><span class="board-slot" aria-hidden="true"></span></td><td><span class="board-slot" aria-hidden="true"></span></td></tr>
                    <tr><td><span class="board-slot" aria-hidden="true"></span></td><td><span class="board-slot" aria-hidden="true"></span></td><td><span class="board-slot" aria-hidden="true"></span></td><td><span class="board-slot" aria-hidden="true"></span></td><td><span class="board-slot" aria-hidden="true"></span></td><td><span class="board-slot" aria-hidden="true"></span></td><td><span class="board-slot" aria-hidden="true"></span></td></tr>
                </tbody>
            </table>
            <table class="connect-four-board bg-transparent shadow-none my-1" aria-label="Choose a column">
                <caption class="visually-hidden">Buttons for choosing a Connect Four column</caption>
                <tbody>
                    <tr>
                        <td><button type="button" class="btn btn-outline-primary btn-sm w-100 px-0" aria-label="Choose column 1">&#8593;</button></td>
                        <td><button type="button" class="btn btn-outline-primary btn-sm w-100 px-0" aria-label="Choose column 2">&#8593;</button></td>
                        <td><button type="button" class="btn btn-outline-primary btn-sm w-100 px-0" aria-label="Choose column 3">&#8593;</button></td>
                        <td><button type="button" class="btn btn-outline-primary btn-sm w-100 px-0" aria-label="Choose column 4">&#8593;</button></td>
                        <td><button type="button" class="btn btn-outline-primary btn-sm w-100 px-0" aria-label="Choose column 5">&#8593;</button></td>
                        <td><button type="button" class="btn btn-outline-primary btn-sm w-100 px-0" aria-label="Choose column 6">&#8593;</button></td>
                        <td><button type="button" class="btn btn-outline-primary btn-sm w-100 px-0" aria-label="Choose column 7">&#8593;</button></td>
                    </tr>
                </tbody>
            </table>
		</section>
        <section class="text-center py-1">
            <button type="button" class="btn btn-primary">Start Game</button>
            <button type="button" class="btn btn-warning">New Game</button>
		</section>
	</main>
  );
}
