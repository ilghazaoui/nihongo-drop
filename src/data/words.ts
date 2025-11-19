export interface WordEntry {
  hiragana: string;
  kanji: string;
}

import n5Raw from './n5_words.json';
import n4Raw from './n4_words.json';
import n3Raw from './n3_words.json';
import n2Raw from './n2_words.json';
import n1Raw from './n1_words.json';

export type JLPTLevel = 'n5' | 'n4' | 'n3' | 'n2' | 'n1';

export const wordsByLevel: Record<JLPTLevel, WordEntry[]> = {
  n5: n5Raw as WordEntry[],
  n4: n4Raw as WordEntry[],
  n3: n3Raw as WordEntry[],
  n2: n2Raw as WordEntry[],
  n1: n1Raw as WordEntry[],
};
