
const cells = [...document.querySelectorAll('.cell')];
const status = document.querySelector('#status');
const statusDot = document.querySelector('.status-dot');
const resetButton = document.querySelector('#reset-button');
const scores = {
	X: document.querySelector('#score-x'),
	O: document.querySelector('#score-o'),
	draws: document.querySelector('#score-draws')
};

const winningLines = [
	[0, 1, 2], [3, 4, 5], [6, 7, 8],
	[0, 3, 6], [1, 4, 7], [2, 5, 8],
	[0, 4, 8], [2, 4, 6]
];

let board = Array(9).fill('');
let currentPlayer = 'X';
let gameOver = false;
let score = { X: 0, O: 0, draws: 0 };

function updateStatus(message, player = currentPlayer) {
	status.textContent = message;
	statusDot.style.backgroundColor = player === 'X' ? 'var(--coral)' : 'var(--teal)';
}

function findWinner() {
	return winningLines.find(([first, second, third]) => (
		board[first] && board[first] === board[second] && board[first] === board[third]
	));
}

function render() {
	cells.forEach((cell, index) => {
		const value = board[index];
		cell.textContent = value;
		cell.disabled = Boolean(value) || gameOver;
		cell.classList.toggle('x', value === 'X');
		cell.classList.toggle('o', value === 'O');
		cell.setAttribute('aria-label', value ? `Casilla ${index + 1}: ${value}` : `Casilla ${index + 1} vacía`);
	});
	scores.X.textContent = score.X;
	scores.O.textContent = score.O;
	scores.draws.textContent = score.draws;
}

function finishGame(winningLine) {
	gameOver = true;
	if (winningLine) {
		winningLine.forEach(index => cells[index].classList.add('winner'));
		score[currentPlayer] += 1;
		updateStatus(`¡Gana el jugador ${currentPlayer}!`, currentPlayer);
	} else {
		score.draws += 1;
		updateStatus('Empate. El tablero está completo.');
	}
	render();
}

function play(index) {
	if (board[index] || gameOver) return;
	board[index] = currentPlayer;
	const winningLine = findWinner();
	if (winningLine || board.every(Boolean)) {
		finishGame(winningLine);
		return;
	}
	currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
	updateStatus(`Turno del jugador ${currentPlayer}`, currentPlayer);
	render();
}

function resetGame() {
	board = Array(9).fill('');
	currentPlayer = 'X';
	gameOver = false;
	cells.forEach(cell => cell.classList.remove('winner'));
	updateStatus('Turno del jugador X', 'X');
	render();
}

cells.forEach(cell => cell.addEventListener('click', () => play(Number(cell.dataset.index))));
resetButton.addEventListener('click', resetGame);
render();
