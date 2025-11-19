import './style.css'
import { Game } from './game/Game';
import type { GameMode } from './game/Game';
import type { JLPTLevel } from './data/words';

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
        <div class="level-toggle" aria-label="Select JLPT level">
          <button id="level-n5" class="level-button level-button-active" data-level="n5">JLPT N5</button>
          <button id="level-n4" class="level-button" data-level="n4">N4</button>
          <button id="level-n3" class="level-button" data-level="n3">N3</button>
          <button id="level-n2" class="level-button" data-level="n2">N2</button>
          <button id="level-n1" class="level-button" data-level="n1">N1</button>
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
const levelN5Btn = document.getElementById('level-n5') as HTMLButtonElement;
const levelN4Btn = document.getElementById('level-n4') as HTMLButtonElement;
const levelN3Btn = document.getElementById('level-n3') as HTMLButtonElement;
const levelN2Btn = document.getElementById('level-n2') as HTMLButtonElement;
const levelN1Btn = document.getElementById('level-n1') as HTMLButtonElement;

let currentMode: GameMode = 'hiragana';
let currentLevel: JLPTLevel = 'n5';
const game = new Game(currentMode, currentLevel);

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

function applyLevelSelection(level: JLPTLevel) {
  currentLevel = level;
  // reset all
  [levelN5Btn, levelN4Btn, levelN3Btn, levelN2Btn, levelN1Btn].forEach(btn => {
    btn.classList.remove('level-button-active');
  });
  switch (level) {
    case 'n5': levelN5Btn.classList.add('level-button-active'); break;
    case 'n4': levelN4Btn.classList.add('level-button-active'); break;
    case 'n3': levelN3Btn.classList.add('level-button-active'); break;
    case 'n2': levelN2Btn.classList.add('level-button-active'); break;
    case 'n1': levelN1Btn.classList.add('level-button-active'); break;
  }
  game.setLevel(level);
}

modeHiraganaBtn.addEventListener('click', () => {
  applyModeSelection('hiragana');
});

modeKanjiBtn.addEventListener('click', () => {
  applyModeSelection('kanji');
});

levelN5Btn.addEventListener('click', () => applyLevelSelection('n5'));
levelN4Btn.addEventListener('click', () => applyLevelSelection('n4'));
levelN3Btn.addEventListener('click', () => applyLevelSelection('n3'));
levelN2Btn.addEventListener('click', () => applyLevelSelection('n2'));
levelN1Btn.addEventListener('click', () => applyLevelSelection('n1'));

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
