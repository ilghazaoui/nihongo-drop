import './style.css'
import { Game } from './game/Game';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Hiragana Drop</h1>
    <div id="game-container"></div>
    <button id="start-btn">Start Game</button>
    <button id="restart-btn" style="display: none;">Restart Game</button>
  </div>
`

const startBtn = document.getElementById('start-btn') as HTMLButtonElement;
const restartBtn = document.getElementById('restart-btn') as HTMLButtonElement;
const game = new Game();

startBtn.addEventListener('click', () => {
  console.log('Game Started');
  startBtn.style.display = 'none';
  game.start();
});

restartBtn.addEventListener('click', () => {
  console.log('Game Restarted');
  restartBtn.style.display = 'none';
  game.reset();
  game.start();
});

// We need to expose a way for the Game to show the restart button.
// For now, let's pass a callback or just expose the button ID to the Game class?
// Or better, let the Game class dispatch an event.
// Simpler: Pass the restart button ID to the Game constructor or a setGameOverCallback.

game.onGameOver = () => {
  restartBtn.style.display = 'inline-block';
};
