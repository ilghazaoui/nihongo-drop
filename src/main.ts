import './style.css'
import { Game } from './game/Game';
import type { GameMode } from './game/Game';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <div id="game-container"></div>
    <div id="game-overlay">
      <div class="overlay-content">
        <h1 class="game-title">Nihongo Drop</h1>
        <div class="mode-toggle" aria-label="Select game mode">
          <button id="mode-hiragana" class="mode-button mode-button-active" data-mode="hiragana">Hiragana Mode</button>
          <button id="mode-kanji" class="mode-button" data-mode="kanji">Kanji Mode</button>
        </div>
        <button id="start-btn" class="game-button">Start Game</button>
        <button id="restart-btn" class="game-button" style="display: none;">Restart Game</button>
      </div>
    </div>
  </div>
`

const startBtn = document.getElementById('start-btn') as HTMLButtonElement;
const restartBtn = document.getElementById('restart-btn') as HTMLButtonElement;
const overlay = document.getElementById('game-overlay') as HTMLDivElement;
const modeHiraganaBtn = document.getElementById('mode-hiragana') as HTMLButtonElement;
const modeKanjiBtn = document.getElementById('mode-kanji') as HTMLButtonElement;

let currentMode: GameMode = 'hiragana';
const game = new Game(currentMode);

function applyModeSelection(mode: GameMode) {
  currentMode = mode;
  // Visual state
  if (mode === 'hiragana') {
    modeHiraganaBtn.classList.add('mode-button-active');
    modeKanjiBtn.classList.remove('mode-button-active');
  } else {
    modeKanjiBtn.classList.add('mode-button-active');
    modeHiraganaBtn.classList.remove('mode-button-active');
  }

  // Reset and prepare a new game with the selected mode
  game.setMode(mode);
}

modeHiraganaBtn.addEventListener('click', () => {
  applyModeSelection('hiragana');
});

modeKanjiBtn.addEventListener('click', () => {
  applyModeSelection('kanji');
});

function startGame() {
  console.log('Game Started');
  // Hide overlay and buttons, keep title visible
  overlay.style.display = 'none';
  startBtn.style.display = 'none';
  restartBtn.style.display = 'none';
  game.start();
}

function restartGame() {
  console.log('Game Restarted');
  // Hide overlay, only show restart button logic via game.onGameOver
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

// Allow Game to use the same logic when Enter/Space are pressed
(game as any).startGameFromUI = startGame;
(game as any).restartGameFromUI = restartGame;

game.onGameOver = () => {
  // Show overlay with restart button, title stays visible above
  startBtn.style.display = 'none';
  restartBtn.style.display = 'block';
  overlay.style.display = 'flex';
};
