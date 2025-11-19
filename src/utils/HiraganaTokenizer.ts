export function tokenize(word: string): string[] {
    const tokens: string[] = [];
    // Small chars that appear BEFORE and combine with the following character
    const smallPrecedingChars = new Set(['っ']);
    // Small chars that appear AFTER and combine with the preceding character
    const smallSucceedingChars = new Set(['ゃ', 'ゅ', 'ょ', 'ぁ', 'ぃ', 'ぅ', 'ぇ', 'ぉ']);

    for (let i = 0; i < word.length; i++) {
        const char = word[i];
        const nextChar = word[i + 1];

        // Small preceding chars (e.g., っ) combine with FOLLOWING character
        if (smallPrecedingChars.has(char) && nextChar) {
            // Check if the character after next is a small succeeding char
            const charAfterNext = word[i + 2];
            if (charAfterNext && smallSucceedingChars.has(charAfterNext)) {
                // Combine all three: っ + し + ゃ = っしゃ
                tokens.push(char + nextChar + charAfterNext);
                i += 2; // Skip next two chars
            } else {
                tokens.push(char + nextChar);
                i++; // Skip next char
            }
            continue;
        }

        // Small succeeding chars (e.g., ゃゅょ) combine with PRECEDING character
        if (nextChar && smallSucceedingChars.has(nextChar)) {
            tokens.push(char + nextChar);
            i++; // Skip next char
        } else {
            tokens.push(char);
        }
    }
    return tokens;
}
