// Replace these localStorage operations with backend requests in a later deliverable.
export function getStats(email) {
  const saved = JSON.parse(localStorage.getItem(`connect4.stats.${email}`) || 'null');
  return saved || { wins: 0, losses: 0, draws: 0, currentWinStreak: 0 };
}

export function recordResult(email, result) {
  if (!['win', 'loss', 'draw'].includes(result)) {
    throw new Error('Unknown game result');
  }

  const stats = getStats(email);
  if (result === 'win') {
    stats.wins++;
    stats.currentWinStreak++;
  } else {
    if (result === 'loss') stats.losses++;
    if (result === 'draw') stats.draws++;
    stats.currentWinStreak = 0;
  }
  localStorage.setItem(`connect4.stats.${email}`, JSON.stringify(stats));
  return stats;
}
