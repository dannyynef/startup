import React from 'react';
import './play.css';

export function Play({ user }) {
  const [board, setBoard] = React.useState(() =>
    Array.from({ length: 6 }, () => Array(7).fill(null))
  );
  const [currentPlayer, setCurrentPlayer] = React.useState('red');
  const [result, setResult] = React.useState(null);

  function resetGame() {
    setBoard(Array.from({ length: 6 }, () => Array(7).fill(null)));
    setCurrentPlayer('red');
    setResult(null);
  }

  function dropPiece(column) {
    if (result) return;
    // Search from the bottom so pieces stack upward.
    let row = board.length - 1;
    while (row >= 0 && board[row][column] !== null) {
      row--;
    }
    if (row < 0) return;

    const nextBoard = board.map((cells) => [...cells]);
    nextBoard[row][column] = currentPlayer;
    setBoard(nextBoard);
    if (hasWon(nextBoard, row, column, currentPlayer)) {
      setResult(currentPlayer);
    } else if (nextBoard[0].every((piece) => piece !== null)) {
      setResult('draw');
    } else {
      setCurrentPlayer(currentPlayer === 'red' ? 'yellow' : 'red');
    }
  }

  return (
    <main className="container-sm text-center">
        <h1 className="h4 mb-1">Play Connect 4</h1>

        <section className="card w-100 text-center shadow-sm">
            <div className="card-body py-2">
                <p className="mb-1">{user.email} (Red) vs Yellow</p>
                <p className="mb-0" aria-live="polite">{result === 'draw'
                    ? 'Draw! The board is full.'
                    : result
                      ? `${result === 'red' ? 'Red' : 'Yellow'} wins! ${result === 'red' ? 'Yellow' : 'Red'} loses.`
                      : `Turn: ${currentPlayer === 'red' ? 'Red' : 'Yellow'}`}</p>
            </div>
		</section>

		<section className="game-board-section text-center">
            <p className="small mb-1">Click the column where you want to place your next piece</p>
            <table className="connect-four-board">
                <caption className="visually-hidden">Connect Four board, six rows by seven columns</caption>
                <tbody>
                    {board.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((piece, columnIndex) => (
                                <td key={columnIndex}>
                                    <span
                                        className={`board-slot${piece ? ` board-slot-${piece}` : ''}`}
                                        role="img"
                                        aria-label={`Row ${rowIndex + 1}, column ${columnIndex + 1}: ${piece || 'empty'}`}
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <table className="connect-four-board bg-transparent shadow-none my-1" aria-label="Choose a column">
                <caption className="visually-hidden">Buttons for choosing a Connect Four column</caption>
                <tbody>
                    <tr>
                        {board[0].map((piece, column) => (
                            <td key={column}>
                                <button
                                    type="button"
                                    className="btn btn-outline-primary btn-sm w-100 px-0"
                                    aria-label={`Choose column ${column + 1}`}
                                    onClick={() => dropPiece(column)}
                                    disabled={result !== null || piece !== null}
                                >
                                    &#8593;
                                </button>
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>
		</section>
        <section className="text-center py-1">
            <button type="button" className="btn btn-warning" onClick={resetGame}>New Game</button>
		</section>
	</main>
  );
}

// Count matching pieces on both sides of the last move in each direction.
function hasWon(board, row, column, player) {
  return [[0, 1], [1, 0], [1, 1], [1, -1]].some(([rowStep, columnStep]) => {
    let count = 1;
    for (const direction of [-1, 1]) {
      let nextRow = row + rowStep * direction;
      let nextColumn = column + columnStep * direction;
      while (
        nextRow >= 0 && nextRow < board.length &&
        nextColumn >= 0 && nextColumn < board[0].length &&
        board[nextRow][nextColumn] === player
      ) {
        count++;
        nextRow += rowStep * direction;
        nextColumn += columnStep * direction;
      }
    }
    return count >= 4;
  });
}
