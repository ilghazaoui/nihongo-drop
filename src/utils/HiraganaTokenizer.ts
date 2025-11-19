export function tokenize(word: string): string[] {
    const tokens: string[] = [];
    const smallChars = new Set(['ゃ', 'ゅ', 'ょ', 'ぁ', 'ぃ', 'ぅ', 'ぇ', 'ぉ', 'っ']);

    for (let i = 0; i < word.length; i++) {
        const char = word[i];
        const nextChar = word[i + 1];

        if (nextChar && smallChars.has(nextChar)) {
            tokens.push(char + nextChar);
            i++; // Skip next char
        } else {
            tokens.push(char);
        }
    }
    return tokens;
}
