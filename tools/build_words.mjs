import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function tokenizeHiragana(str) {
    const chars = Array.from(str);
    const tokens = [];
    for (let i = 0; i < chars.length; i++) {
        const ch = chars[i];
        const next = chars[i + 1];

        // small ya/yu/yo
        if (/^[ゃゅょャュョ]$/.test(next)) {
            tokens.push(ch + next);
            i++;
            continue;
        }
        // small tsu: combine with next if exists
        if (ch === 'っ' && next) {
            tokens.push(ch + next);
            i++;
            continue;
        }
        tokens.push(ch);
    }
    return tokens;
}

function isHiraganaOnly(s) {
    const chars = Array.from(s);
    if (chars.length === 0) return false;
    return chars.every(ch => /\p{sc=Hiragana}/u.test(ch));
}

function hasKatakana(s) {
    return Array.from(s).some(ch => /\p{sc=Katakana}/u.test(ch));
}

function loadKanjisForLevel(level) {
    const kanjiCsvPath = path.join(__dirname, '..', 'src', 'data', 'kanji.csv');
    const text = fs.readFileSync(kanjiCsvPath, 'utf8');
    const lines = text.split(/\r?\n/).filter(l => l.trim());
    lines.shift(); // header

    const levelSet = new Set();

    // Map JLPT level string (N1..N5) to numeric value in CSV (1..5)
    const numeric = level.toUpperCase().replace('N', '');
    const maxLevel = parseInt(numeric, 10);

    for (const line of lines) {
        const cols = line.split(',');
        if (cols.length < 12) continue;
        const kanji = cols[1];
        const jlptLevel = cols[11];
        if (!kanji) continue;
        if (!jlptLevel) continue;
        const jlptNum = parseInt(jlptLevel, 10);
        // Keep kanji whose JLPT level is <= requested level (e.g. for N4: 4 or 5)
        if (!Number.isNaN(jlptNum) && jlptNum >= maxLevel && jlptNum <= 5) {
            for (const ch of Array.from(kanji)) {
                levelSet.add(ch);
            }
        }
    }
    return levelSet;
}

function allKanjisAreFromSet(expr, allowedSet) {
    const chars = Array.from(expr);
    let hasKanjiChar = false;
    for (const ch of chars) {
        if (/\p{sc=Han}/u.test(ch)) {
            hasKanjiChar = true;
            if (!allowedSet.has(ch)) {
                return false;
            }
        }
    }
    return hasKanjiChar;
}

function main() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Accept level as first CLI arg: n5, n4, n3, n2, n1. Default: n5
    const argLevel = (process.argv[2] || 'n5').toLowerCase();
    if (!['n5', 'n4', 'n3', 'n2', 'n1'].includes(argLevel)) {
        console.error(`Unknown level '${argLevel}'. Use one of: n5, n4, n3, n2, n1.`);
        process.exit(1);
    }

    const level = argLevel; // e.g. 'n4'
    const levelUpper = level.toUpperCase();

    const csvPath = path.join(__dirname, '..', 'src', 'data', `${level}.csv`);
    const jsonPath = path.join(__dirname, '..', 'src', 'data', `${level}_words.json`);

    const kanjiSetForLevel = loadKanjisForLevel(levelUpper);

    const csvText = fs.readFileSync(csvPath, 'utf8');
    const lines = csvText.split(/\r?\n/).filter(l => l.trim());
    const entries = [];

    for (const line of lines) {
        const [expression, reading] = line.split(',', 3);
        if (!expression || !reading) continue;

        if (!isHiraganaOnly(reading)) continue;
        if (hasKatakana(reading)) continue;

        if (!allKanjisAreFromSet(expression, kanjiSetForLevel)) continue;

        const tokens = tokenizeHiragana(reading);
        if (tokens.length < 2) continue;

        entries.push({ hiragana: reading, kanji: expression });
    }

    const merged = entries.slice();

    merged.sort((a, b) => {
        if (a.hiragana === b.hiragana) {
            return a.kanji.localeCompare(b.kanji, 'ja');
        }
        return a.hiragana.localeCompare(b.hiragana, 'ja');
    });

    fs.writeFileSync(jsonPath, JSON.stringify(merged, null, 2), 'utf8');
    console.log(`Level ${levelUpper}: wrote ${merged.length} entries to ${path.basename(jsonPath)} (overwrite mode)`);
}

main();