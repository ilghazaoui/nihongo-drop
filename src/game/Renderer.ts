import { Grid } from './Grid';
import { Block } from './Block';

export class Renderer {
    container: HTMLElement;
    cellElements: HTMLElement[][];

    constructor(containerId: string, width: number, height: number) {
        this.container = document.getElementById(containerId)!;
        this.cellElements = [];
        this.initGrid(width, height);
    }

    initGrid(width: number, height: number) {
        this.container.innerHTML = '';
        this.cellElements = [];

        for (let y = 0; y < height; y++) {
            const row: HTMLElement[] = [];
            for (let x = 0; x < width; x++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.style.left = `${x * 50}px`;
                cell.style.top = `${y * 50}px`;
                this.container.appendChild(cell);
                row.push(cell);
            }
            this.cellElements.push(row);
        }
    }

    render(grid: Grid, activeBlock: Block | null) {
        // Render grid state
        for (let y = 0; y < grid.height; y++) {
            for (let x = 0; x < grid.width; x++) {
                const char = grid.cells[y][x];
                const cell = this.cellElements[y][x];

                // Reset style ONLY if not animating
                if (!cell.classList.contains('disintegrate') && !cell.classList.contains('fusing')) {
                    cell.textContent = char || '';
                    cell.className = 'cell'; // Reset classes

                    // Highlight active column
                    if (activeBlock && x === activeBlock.x) {
                        cell.classList.add('highlight');
                    }

                    if (char) {
                        cell.classList.add('occupied');
                        if (char.length > 1) {
                            cell.style.fontSize = '1.2rem';
                        } else {
                            cell.style.fontSize = '';
                        }
                    } else {
                        cell.style.fontSize = '';
                    }
                }
            }
        }

        // Render active block
        if (activeBlock) {
            if (grid.isValid(activeBlock.x, activeBlock.y)) {
                const cell = this.cellElements[activeBlock.y][activeBlock.x];
                // Only render active block if cell is not disintegrating (shouldn't happen usually)
                if (!cell.classList.contains('disintegrate') && !cell.classList.contains('fusing')) {
                    cell.textContent = activeBlock.char;
                    cell.classList.add('active');
                    if (activeBlock.char.length > 1) {
                        cell.style.fontSize = '1.2rem';
                    } else {
                        cell.style.fontSize = '';
                    }
                }
            }
        }
    }

    animateFuse(matches: { cells: { x: number, y: number }[], kanji: string }[]) {
        matches.forEach(match => {
            const isHorizontal = match.cells.every(c => c.y === match.cells[0].y);
            const isVertical = match.cells.every(c => c.x === match.cells[0].x);

            let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
            match.cells.forEach(pos => {
                minX = Math.min(minX, pos.x);
                maxX = Math.max(maxX, pos.x);
                minY = Math.min(minY, pos.y);
                maxY = Math.max(maxY, pos.y);
            });

            const cellCount = match.cells.length;
            const anchorLeft = minX * 50;
            const anchorTop = minY * 50;

            let boxWidth: number;
            let boxHeight: number;
            if (isHorizontal) {
                boxWidth = cellCount * 50;
                boxHeight = 50;
            } else if (isVertical) {
                boxWidth = 50;
                boxHeight = cellCount * 50;
            } else {
                boxWidth = (maxX - minX + 1) * 50;
                boxHeight = (maxY - minY + 1) * 50;
            }

            const containerRect = this.container.getBoundingClientRect();
            const overlay = document.createElement('div');
            overlay.classList.add('kanji-overlay');
            overlay.dataset.length = String(cellCount);
            overlay.classList.add(isHorizontal ? 'horizontal' : 'vertical');
            overlay.style.position = 'fixed';
            overlay.style.left = `${containerRect.left + anchorLeft}px`;
            overlay.style.top = `${containerRect.top + anchorTop}px`;
            overlay.style.width = `${boxWidth}px`;
            overlay.style.height = `${boxHeight}px`;

            // Build per-character spans preserving order
            const chars = Array.from(match.kanji);
            chars.forEach(ch => {
                const span = document.createElement('span');
                span.textContent = ch;
                span.className = 'kanji-char';
                overlay.appendChild(span);
            });

            document.body.appendChild(overlay);

            setTimeout(() => {
                overlay.classList.add('disintegrate');
            }, 1000);

            setTimeout(() => {
                overlay.remove();
            }, 3000);
        });
    }
}
