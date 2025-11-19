import { n5_words } from '../data/n5_words';
import { Grid } from './Grid';

export class WordManager {
    words: Map<string, string>; // Map hiragana -> kanji

    constructor() {
        this.words = new Map();
        n5_words.forEach(entry => {
            this.words.set(entry.hiragana, entry.kanji);
        });
    }

    checkMatches(grid: Grid): { cells: { x: number, y: number }[], kanji: string }[] {
        const matches: { cells: { x: number, y: number }[], kanji: string }[] = [];
        const visited = new Set<string>();

        // Check Horizontal (Left to Right)
        for (let y = 0; y < grid.height; y++) {
            for (let x = 0; x < grid.width; x++) {
                // Try to form words starting at x, y
                let currentWord = "";
                for (let k = x; k < grid.width; k++) {
                    const char = grid.getCell(k, y);
                    if (!char) break;
                    currentWord += char;
                    if (this.words.has(currentWord)) {
                        // Found a word!
                        const kanji = this.words.get(currentWord)!;
                        const cells = [];
                        let isNew = false;

                        for (let m = x; m <= k; m++) {
                            const key = `${m},${y}`;
                            if (!visited.has(key)) {
                                isNew = true;
                            }
                            cells.push({ x: m, y: y });
                        }

                        if (isNew) {
                            cells.forEach(c => visited.add(`${c.x},${c.y}`));
                            matches.push({ cells, kanji });
                        }
                    }
                }
            }
        }

        // Check Vertical (Top to Bottom)
        for (let x = 0; x < grid.width; x++) {
            for (let y = 0; y < grid.height; y++) {
                let currentWord = "";
                for (let k = y; k < grid.height; k++) {
                    const char = grid.getCell(x, k);
                    if (!char) break;
                    currentWord += char;
                    if (this.words.has(currentWord)) {
                        const kanji = this.words.get(currentWord)!;
                        const cells = [];
                        let isNew = false;

                        for (let m = y; m <= k; m++) {
                            const key = `${x},${m}`;
                            if (!visited.has(key)) {
                                isNew = true;
                            }
                            cells.push({ x: x, y: m });
                        }

                        if (isNew) {
                            cells.forEach(c => visited.add(`${c.x},${c.y}`));
                            matches.push({ cells, kanji });
                        }
                    }
                }
            }
        }

        return matches;
    }
}
