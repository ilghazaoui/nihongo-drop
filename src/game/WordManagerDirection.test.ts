
import { describe, it, expect } from 'vitest';
import { WordManager } from './WordManager';
import { Grid } from './Grid';

describe('WordManager Direction', () => {
    it('should match words in reverse order (Right to Left)', () => {
        const manager = new WordManager('n5');
        const grid = new Grid(6, 10);

        // "ame" (rain) is あめ. Reverse is めあ.
        // Place "me" then "a" horizontally
        grid.setCell(0, 0, 'め');
        grid.setCell(1, 0, 'あ');

        const matches = manager.checkMatches(grid);
        expect(matches.length).toBeGreaterThan(0);
        expect(matches[0].kanji).toBe('雨'); // Should match "ame" -> "rain" kanji
    });

    it('should match words in reverse order (Bottom to Top)', () => {
        const manager = new WordManager('n5');
        const grid = new Grid(6, 10);

        // "ame" (rain) is あめ. Reverse is めあ.
        // Place "me" then "a" vertically
        grid.setCell(0, 0, 'め');
        grid.setCell(0, 1, 'あ');

        const matches = manager.checkMatches(grid);
        expect(matches.length).toBeGreaterThan(0);
        expect(matches[0].kanji).toBe('雨');
    });
});
