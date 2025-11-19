import './style.css'
import { Game } from './game/Game';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1 class="game-title">Nihongo Drop</h1>
    <div id="game-container"></div>
    <div id="game-overlay">
      <div class="overlay-content">
        <button id="start-btn" class="game-button">Start Game</button>
        <button id="restart-btn" class="game-button" style="display: none;">Restart Game</button>
      </div>
    </div>
  </div>
`

const startBtn = document.getElementById('start-btn') as HTMLButtonElement;
const restartBtn = document.getElementById('restart-btn') as HTMLButtonElement;
const overlay = document.getElementById('game-overlay') as HTMLDivElement;
const game = new Game();

function startGame() {
  console.log('Game Started');
  overlay.style.display = 'none';
  startBtn.style.display = 'none';
  restartBtn.style.display = 'none';
  game.start();
}

function restartGame() {
  console.log('Game Restarted');
  overlay.style.display = 'none';
  startBtn.style.display = 'none';
  restartBtn.style.display = 'block';
  game.reset();
  game.start();
}

startBtn.addEventListener('click', () => {
  startGame();
});

restartBtn.addEventListener('click', () => {
  restartGame();
});

// Permettre au Game d'utiliser la même logique quand Enter/Espace sont pressés
// (via Game.input.onStartOrRestart)
(game as any).startGameFromUI = startGame;
(game as any).restartGameFromUI = restartGame;

game.onGameOver = () => {
  startBtn.style.display = 'none';
  restartBtn.style.display = 'block';
  overlay.style.display = 'flex';
};
