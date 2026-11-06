// The backend identifies the player using their authentication cookie.
async function readResponse(response) {
  const data = await response.json();
  if (!response.ok) throw new Error(data.msg || 'Unable to access statistics.');
  return data;
}

export async function getStats(signal) {
  return readResponse(await fetch('/api/stats', { signal }));
}

export async function recordResult(result) {
  if (!['win', 'loss', 'draw'].includes(result)) {
    throw new Error('Unknown game result');
  }
  return readResponse(await fetch('/api/results', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ result }),
  }));
}
