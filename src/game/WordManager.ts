import { wordsByLevel, type JLPTLevel } from '../data/words';
import { Grid } from './Grid';
import { isPureKanji } from '../utils/kanji';

export type WordMatchMode = 'hiragana' | 'kanji';

export class WordManager {
    wordsHiragana: Map<string, string>; // hiragana -> kanji
    wordsKanji: Map<string, string>;    // kanji -> kanji (only multi-char kanji strings)
    mode: WordMatchMode = 'hiragana';
    level: JLPTLevel;

    constructor(level: JLPTLevel = 'n5') {
        this.level = level;
        this.wordsHiragana = new Map();
        this.wordsKanji = new Map();
        const source = wordsByLevel[this.level];
        source.forEach((entry) => {
            this.wordsHiragana.set(entry.hiragana, entry.kanji);
            // Only include pure-kanji entries with length >= 2 characters for kanji-mode matching
            const chars = Array.from(entry.kanji);
            if (chars.length >= 2 && isPureKanji(entry.kanji)) {
                this.wordsKanji.set(entry.kanji, entry.kanji);
            }
        });
    }

    setLevel(level: JLPTLevel) {
        this.level = level;
        // Rebuild maps from the new level source
        this.wordsHiragana.clear();
        this.wordsKanji.clear();
        const source = wordsByLevel[this.level];
        source.forEach((entry) => {
            this.wordsHiragana.set(entry.hiragana, entry.kanji);
            const chars = Array.from(entry.kanji);
            if (chars.length >= 2 && isPureKanji(entry.kanji)) {
                this.wordsKanji.set(entry.kanji, entry.kanji);
            }
        });
    }

    setMode(mode: WordMatchMode) {
        this.mode = mode;
    }

    private get currentMap(): Map<string, string> {
        return this.mode === 'kanji' ? this.wordsKanji : this.wordsHiragana;
    }

    checkMatches(grid: Grid): { cells: { x: number, y: number }[], kanji: string }[] {
        const matches: { cells: { x: number, y: number }[], kanji: string }[] = [];
        const visited = new Set<string>();
        const dict = this.currentMap;

        // Horizontal (left to right)
        for (let y = 0; y < grid.height; y++) {
            for (let x = 0; x < grid.width; x++) {
                let currentWord = "";
                for (let k = x; k < grid.width; k++) {
                    const char = grid.getCell(k, y);
                    if (!char) break;
                    currentWord += char;
                    if (dict.has(currentWord)) {
                        const kanji = dict.get(currentWord)!;
                        const cells = [];
                        let isNew = false;
                        for (let m = x; m <= k; m++) {
                            const key = `${m},${y}`;
                            if (!visited.has(key)) isNew = true;
                            cells.push({ x: m, y });
                        }
                        if (isNew) {
                            cells.forEach(c => visited.add(`${c.x},${c.y}`));
                            matches.push({ cells, kanji });
                        }
                    }
                }
            }
        }

        // Vertical (top to bottom)
        for (let x = 0; x < grid.width; x++) {
            for (let y = 0; y < grid.height; y++) {
                let currentWord = "";
                for (let k = y; k < grid.height; k++) {
                    const char = grid.getCell(x, k);
                    if (!char) break;
                    currentWord += char;
                    if (dict.has(currentWord)) {
                        const kanji = dict.get(currentWord)!;
                        const cells = [];
                        let isNew = false;
                        for (let m = y; m <= k; m++) {
                            const key = `${x},${m}`;
                            if (!visited.has(key)) isNew = true;
                            cells.push({ x, y: m });
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
