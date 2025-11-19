import './style.css'
import { Game } from './game/Game';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Hiragana Drop</h1>
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

startBtn.addEventListener('click', () => {
  console.log('Game Started');
  overlay.style.display = 'none';
  game.start();
});

restartBtn.addEventListener('click', () => {
  console.log('Game Restarted');
  overlay.style.display = 'none';
  startBtn.style.display = 'none';
  restartBtn.style.display = 'block';
  game.reset();
  game.start();
});

// We need to expose a way for the Game to show the restart button.
// For now, let's pass a callback or just expose the button ID to the Game class?
// Or better, let the Game class dispatch an event.
// Simpler: Pass the restart button ID to the Game constructor or a setGameOverCallback.

game.onGameOver = () => {
  startBtn.style.display = 'none';
  restartBtn.style.display = 'block';
  overlay.style.display = 'flex';
};
