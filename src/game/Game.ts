import { Grid } from './Grid';
import { Block } from './Block';
import { Renderer } from './Renderer';
import { Input } from './Input';
import { WordManager } from './WordManager';
import { n5_words } from '../data/n5_words';
import { tokenize } from '../utils/HiraganaTokenizer';

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

    constructor() {
        this.grid = new Grid(6, 10);
        this.renderer = new Renderer('game-container', 6, 10);
        this.input = new Input('game-container', 6);
        this.wordManager = new WordManager();

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

    spawnBlock() {
        const randomWordEntry = n5_words[Math.floor(Math.random() * n5_words.length)];
        const randomWord = randomWordEntry.hiragana;
        const tokens = tokenize(randomWord);
        const randomToken = tokens[Math.floor(Math.random() * tokens.length)];

        this.activeBlock = new Block(this.lastColumn, 0, randomToken); // Start in last column

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
