
import { describe, it, expect } from 'vitest';
import { getCharacterColor } from './ColorUtils';

describe('ColorUtils', () => {
    it('should return consistent colors for the same character', () => {
        const char = 'あ';
        const color1 = getCharacterColor(char);
        const color2 = getCharacterColor(char);
        expect(color1).toEqual(color2);
    });

    it('should return different colors for different characters', () => {
        const color1 = getCharacterColor('あ');
        const color2 = getCharacterColor('い');
        expect(color1).not.toEqual(color2);
    });

    it('should return valid CSS strings', () => {
        const color = getCharacterColor('あ');
        expect(color.background).toMatch(/linear-gradient\(135deg, hsl\(\d+, \d+%, \d+%\), hsl\(\d+, \d+%, \d+%\)\)/);
        expect(color.borderColor).toMatch(/hsl\(\d+, \d+%, \d+%\)/);
    });
});
