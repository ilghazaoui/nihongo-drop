# JLPT word list builder

This project includes a small CLI tool to generate per-level JLPT word lists used by the game.

The tool lives in `tools/build_words.mjs` and reads CSV vocab lists (e.g. `n5.csv`, `n4.csv`) and the master kanji list `kanji.csv`, then produces JSON files (e.g. `n5_words.json`, `n4_words.json`) that the game consumes.

## Input files

Located in `src/data/`:

- `kanji.csv` — master kanji list with at least these columns:
  - `kanji` (2nd column): the kanji character.
  - `jlpt` (12th column): JLPT level as `1`..`5` (1 = N1, 5 = N5).
- `n5.csv`, `n4.csv`, ... — vocabulary CSVs for each JLPT level with this format:
  - `expression`: the word in kanji/kana (e.g. `学校`, `お金`, `意見`).
  - `reading`: the reading in kana (hiragana or katakana) (e.g. `がっこう`, `おかね`, `いけん`).
  - `meaning`: free text, ignored by the tool.
  - `tags`: free text, ignored by the tool.

Only `expression` and `reading` are used to build the JSON.

## Output files

For each level `nx` (e.g. `n5`, `n4`) the tool writes:

- `src/data/nx_words.json`

Each file is **overwritten** on every run and contains an array of objects:

```json
[
  { "hiragana": "がっこう", "kanji": "学校" },
  { "hiragana": "いけん", "kanji": "意見" }
]
```

These JSON files are what the game code imports.

## Filtering rules

When you run `build_words.mjs` for a given JLPT level, it:

1. Loads **allowed kanji** for that level from `kanji.csv`:
   - The script takes the numeric JLPT level for the target (e.g. `N4 -> 4`).
   - It includes all kanji whose `jlpt` value in `kanji.csv` is **greater or equal** to that number and `<= 5`.
     - N5 → kanji with `jlpt = 5` only.
     - N4 → kanji with `jlpt = 4` or `5`.
     - N3 → kanji with `jlpt = 3, 4, 5`.
     - N2 → kanji with `jlpt = 2, 3, 4, 5`.
     - N1 → kanji with `jlpt = 1, 2, 3, 4, 5`.

2. Reads the level CSV (`n5.csv`, `n4.csv`, ...) and, for each row `(expression, reading, ...)`, keeps it **only if**:
   - `reading` is **only hiragana** (no katakana and no other scripts).
   - `expression` contains **at least one kanji**.
   - **All** kanji in `expression` are present in the allowed kanji set for this level (see above).
   - Tokenizing `reading` into hiragana syllables yields **at least 2 tokens** (short one-syllable words are discarded).

3. Builds the JSON array with entries:

   ```json
   { "hiragana": <reading>, "kanji": <expression> }
   ```

4. Sorts the entries by `hiragana` then by `kanji` and overwrites `nx_words.json`.

## Running the tool

From the project root (`hiragana-drop`):

```bash
# Generate the N5 word list from src/data/n5.csv -> src/data/n5_words.json
node tools/build_words.mjs n5

# Generate the N4 word list from src/data/n4.csv -> src/data/n4_words.json
node tools/build_words.mjs n4

# Similarly for higher levels if you add the CSVs
node tools/build_words.mjs n3
node tools/build_words.mjs n2
node tools/build_words.mjs n1
```

If you omit the level argument, the script defaults to `n5`.

```bash
node tools/build_words.mjs       # same as: node tools/build_words.mjs n5
```

## Typical workflow when updating vocab

1. Edit the appropriate CSV file in `src/data/` (e.g. add rows to `n5.csv` or `n4.csv`).
2. Optionally, update `kanji.csv` if you introduce new kanji or correct JLPT levels.
3. Regenerate the JSON list for that level:

   ```bash
   node tools/build_words.mjs n5
   # or
   node tools/build_words.mjs n4
   ```

4. Rebuild and run tests to ensure nothing broke:

   ```bash
   npm run build
   npm test -- --run --silent
   ```

After that, the game will automatically pick up the new words from the regenerated `*_words.json` file(s).

## Notes and caveats

- The script expects `reading` to be pure hiragana. If your source CSV uses katakana readings for some words, you must normalize them to hiragana for those entries to be kept.
- The JLPT level mapping is driven entirely by the `jlpt` column in `kanji.csv`. If a kanji is mis-leveled there, it will affect whether a word is included in a given level list.
- Very short words (effectively one syllable after tokenization) are intentionally excluded to keep the gameplay focused on slightly longer chunks.

