export function isPureKanji(input: string): boolean {
  // Returns true if all characters in the string are Kanji (no kana or other scripts)
  const chars = Array.from(input);
  if (chars.length === 0) return false;
  return chars.every(ch => /\p{Script=Han}/u.test(ch));
}

