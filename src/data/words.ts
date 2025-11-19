export interface WordEntry {
  hiragana: string;
  kanji: string;
}

import n5Raw from './n5_words.json';

export const n5_words: WordEntry[] = n5Raw as WordEntry[];

// Future: import n4Raw from './n4_words.json';
// export const n4_words: WordEntry[] = n4Raw as WordEntry[];

