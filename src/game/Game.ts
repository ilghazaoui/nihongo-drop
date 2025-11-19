import { Grid } from './Grid';
import { Block } from './Block';
import { Renderer } from './Renderer';
import { Input } from './Input';
import { WordManager } from './WordManager';
import type { WordMatchMode } from './WordManager';
import { n5_words } from '../data/words';
import { tokenize } from '../utils/HiraganaTokenizer';
import { isPureKanji } from '../utils/kanji';

export type GameMode = 'hiragana' | 'kanji';

export class Game {
    grid: Grid;
    activeBlock: Block | null = null;
    renderer: Renderer;
    input: Input;
    wordManager: WordManager;
    lastTime: number = 0;
    dropCounter: number = 0;
    dropInterval: number = 1000; // 1 second drop speed initially
    isRunning: boolean = false;
    gameOver: boolean = false;
    onGameOver: (() => void) | null = null;
    lastColumn: number = 2; // Default start column
    mode: GameMode;

    constructor(mode: GameMode = 'hiragana') {
        this.mode = mode;
        this.grid = new Grid(6, 10);
        this.renderer = new Renderer('game-container', 6, 10);
        this.input = new Input('game-container', 6);
        this.wordManager = new WordManager();
        this.wordManager.setMode(this.mode as WordMatchMode);

        this.input.onMove = (col) => {
            if (this.activeBlock && !this.gameOver) {
                // Move active block to col
                // Check if valid
                if (this.grid.isValid(col, this.activeBlock.y) && this.grid.isEmpty(col, this.activeBlock.y)) {
                    this.activeBlock.x = col;
                }
            }
        };

        this.input.onDrop = () => {
            if (this.activeBlock && !this.gameOver) {
                this.hardDrop();
            }
        };

        // Keyboard mappings
        this.input.onLeft = () => {
            if (this.activeBlock && !this.gameOver) {
                const targetX = this.activeBlock.x - 1;
                if (this.grid.isValid(targetX, this.activeBlock.y) && this.grid.isEmpty(targetX, this.activeBlock.y)) {
                    this.activeBlock.x = targetX;
                }
            }
        };

        this.input.onRight = () => {
            if (this.activeBlock && !this.gameOver) {
                const targetX = this.activeBlock.x + 1;
                if (this.grid.isValid(targetX, this.activeBlock.y) && this.grid.isEmpty(targetX, this.activeBlock.y)) {
                    this.activeBlock.x = targetX;
                }
            }
        };

        this.input.onSoftDrop = () => {
            if (this.activeBlock && !this.gameOver) {
                this.drop();
            }
        };

        this.input.onStartOrRestart = () => {
            const anySelf = this as any;
            if (this.gameOver) {
                if (typeof anySelf.restartGameFromUI === 'function') {
                    anySelf.restartGameFromUI();
                } else {
                    this.reset();
                    this.start();
                }
            } else if (!this.isRunning) {
                if (typeof anySelf.startGameFromUI === 'function') {
                    anySelf.startGameFromUI();
                } else {
                    this.start();
                }
            }
        };
    }

    setMode(mode: GameMode) {
        this.mode = mode;
        this.wordManager.setMode(this.mode as WordMatchMode);
        this.reset();
    }

    reset() {
        this.grid = new Grid(6, 10);
        this.activeBlock = null;
        this.gameOver = false;
        this.isRunning = false;
        this.dropCounter = 0;
        this.renderer.initGrid(6, 10); // Re-init DOM
    }

    start() {
        this.isRunning = true;
        this.gameOver = false;
        this.spawnBlock();
        this.lastTime = performance.now();
        requestAnimationFrame((time) => this.loop(time));
    }

    private pickRandomWord() {
        if (this.mode === 'kanji') {
            // Only use entries whose kanji is made of 2+ kanji characters (no kana)
            const candidates = n5_words.filter((entry) => {
                const chars = Array.from(entry.kanji);
                return chars.length >= 2 && isPureKanji(entry.kanji);
            });
            const pool = candidates.length > 0 ? candidates : n5_words;
            return pool[Math.floor(Math.random() * pool.length)];
        }
        return n5_words[Math.floor(Math.random() * n5_words.length)];
    }

    private getHiraganaToken(wordHiragana: string): string {
        const tokens = tokenize(wordHiragana);
        return tokens[Math.floor(Math.random() * tokens.length)];
    }

    private getKanjiToken(entry: { hiragana: string; kanji: string }): string {
        const tokens = tokenize(entry.kanji);
        return tokens[Math.floor(Math.random() * tokens.length)];
    }

    spawnBlock() {
        const entry = this.pickRandomWord();
        let blockChar: string;

        if (this.mode === 'kanji') {
            blockChar = this.getKanjiToken(entry);
        } else {
            blockChar = this.getHiraganaToken(entry.hiragana);
        }

        this.activeBlock = new Block(this.lastColumn, 0, blockChar); // Start in last column

        // Check collision on spawn (Game Over)
        if (!this.grid.isEmpty(this.activeBlock.x, this.activeBlock.y)) {
            this.gameOver = true;
            console.log("Game Over");
            this.isRunning = false;
            if (this.onGameOver) {
                this.onGameOver();
            }
        }
    }

    loop(time: number) {
        if (!this.isRunning) return;

        const dt = time - this.lastTime;
        this.lastTime = time;

        this.dropCounter += dt;
        if (this.dropCounter > this.dropInterval) {
            this.drop();
            this.dropCounter = 0;
        }

        this.renderer.render(this.grid, this.activeBlock);
        requestAnimationFrame((t) => this.loop(t));
    }

    drop() {
        if (!this.activeBlock) return;

        const nextY = this.activeBlock.y + 1;
        if (this.grid.isEmpty(this.activeBlock.x, nextY)) {
            this.activeBlock.y = nextY;
        } else {
            this.lockBlock();
        }
    }

    hardDrop() {
        if (!this.activeBlock) return;
        while (this.grid.isEmpty(this.activeBlock.x, this.activeBlock.y + 1)) {
            this.activeBlock.y++;
        }
        this.lockBlock();
    }

    lockBlock() {
        if (!this.activeBlock) return;

        this.lastColumn = this.activeBlock.x; // Update last column
        this.grid.setCell(this.activeBlock.x, this.activeBlock.y, this.activeBlock.char);
        this.activeBlock = null; // Reset active block immediately

        // Check for words
        const matches = this.wordManager.checkMatches(this.grid);
        if (matches.length > 0) {
            console.log("Matches found:", matches);

            // Trigger Fuse Animation (Independent)
            this.renderer.animateFuse(matches);

            // Immediate Clear
            matches.forEach(match => {
                match.cells.forEach(pos => {
                    this.grid.setCell(pos.x, pos.y, null);
                });
            });
        }

        // Apply Gravity (Cascade) - Run regardless of matches to fill gaps
        this.applyGravity();

        // Spawn new block
        this.spawnBlock();
    }

    applyGravity() {
        for (let x = 0; x < this.grid.width; x++) {
            for (let y = this.grid.height - 1; y >= 0; y--) {
                if (this.grid.isEmpty(x, y)) {
                    // Find the nearest block above
                    for (let k = y - 1; k >= 0; k--) {
                        const char = this.grid.getCell(x, k);
                        if (char) {
                            // Move block down
                            this.grid.setCell(x, y, char);
                            this.grid.setCell(x, k, null);
                            break;
                        }
                    }
                }
            }
        }
    }
}
