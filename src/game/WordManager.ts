import { wordsByLevel, type JLPTLevel } from '../data/words';
import { Grid } from './Grid';
import { isPureKanji } from '../utils/kanji';

export type WordMatchMode = 'hiragana' | 'kanji';

const LEVEL_ORDER: JLPTLevel[] = ['n5', 'n4', 'n3', 'n2', 'n1'];

interface WordData {
    kanji: string;
    level: JLPTLevel;
}

export class WordManager {
    wordsHiragana: Map<string, WordData>; // hiragana -> { kanji, level }
    wordsKanji: Map<string, WordData>;    // kanji -> { kanji, level }
    mode: WordMatchMode = 'hiragana';
    level: JLPTLevel;

    constructor(level: JLPTLevel = 'n5') {
        this.level = level;
        this.wordsHiragana = new Map();
        this.wordsKanji = new Map();
        this.loadWordsForLevel(this.level);
    }

    setLevel(level: JLPTLevel) {
        this.level = level;
        this.wordsHiragana.clear();
        this.wordsKanji.clear();
        this.loadWordsForLevel(this.level);
    }

    private loadWordsForLevel(targetLevel: JLPTLevel) {
        const targetIndex = LEVEL_ORDER.indexOf(targetLevel);

        for (let i = 0; i <= targetIndex; i++) {
            const currentLevel = LEVEL_ORDER[i];
            const source = wordsByLevel[currentLevel];

            source.forEach((entry) => {
                this.wordsHiragana.set(entry.hiragana, { kanji: entry.kanji, level: currentLevel });

                const chars = Array.from(entry.kanji);
                if (chars.length >= 2 && isPureKanji(entry.kanji)) {
                    this.wordsKanji.set(entry.kanji, { kanji: entry.kanji, level: currentLevel });
                }
            });
        }
    }

    setMode(mode: WordMatchMode) {
        this.mode = mode;
    }

    private get currentMap(): Map<string, WordData> {
        return this.mode === 'kanji' ? this.wordsKanji : this.wordsHiragana;
    }

    checkMatches(grid: Grid): { cells: { x: number, y: number }[], kanji: string, level: JLPTLevel }[] {
        const matches: { cells: { x: number, y: number }[], kanji: string, level: JLPTLevel }[] = [];
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

                    // Check normal
                    if (dict.has(currentWord)) {
                        const data = dict.get(currentWord)!;
                        this.addMatch(matches, visited, x, k, y, y, data);
                    }

                    // Check reverse
                    const reversedWord = Array.from(currentWord).reverse().join('');
                    if (dict.has(reversedWord)) {
                        const data = dict.get(reversedWord)!;
                        this.addMatch(matches, visited, x, k, y, y, data);
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

                    // Check normal
                    if (dict.has(currentWord)) {
                        const data = dict.get(currentWord)!;
                        this.addMatch(matches, visited, x, x, y, k, data);
                    }

                    // Check reverse
                    const reversedWord = Array.from(currentWord).reverse().join('');
                    if (dict.has(reversedWord)) {
                        const data = dict.get(reversedWord)!;
                        this.addMatch(matches, visited, x, x, y, k, data);
                    }
                }
            }
        }

        return matches;
    }

    private addMatch(
        matches: { cells: { x: number, y: number }[], kanji: string, level: JLPTLevel }[],
        visited: Set<string>,
        startX: number, endX: number,
        startY: number, endY: number,
        data: WordData
    ) {
        const cells: { x: number, y: number }[] = [];
        let isNew = false;

        // Collect cells based on direction (Horizontal or Vertical)
        if (startY === endY) { // Horizontal
            for (let m = startX; m <= endX; m++) {
                const key = `${m},${startY}`;
                if (!visited.has(key)) isNew = true;
                cells.push({ x: m, y: startY });
            }
        } else { // Vertical
            for (let m = startY; m <= endY; m++) {
                const key = `${startX},${m}`;
                if (!visited.has(key)) isNew = true;
                cells.push({ x: startX, y: m });
            }
        }

        if (isNew) {
            cells.forEach(c => visited.add(`${c.x},${c.y}`));
            matches.push({ cells, kanji: data.kanji, level: data.level });
        }
    }
}
