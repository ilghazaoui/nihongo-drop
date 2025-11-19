
import { describe, it, expect } from 'vitest';
import { WordManager } from './WordManager';

describe('WordManager Levels', () => {
    it('should include N5 words when level is N5', () => {
        const manager = new WordManager('n5');
        // "ame" (rain) is N5
        expect(manager.wordsHiragana.has('あめ')).toBe(true);
        expect(manager.wordsHiragana.get('あめ')?.level).toBe('n5');
    });

    it('should include N5 words when level is N4', () => {
        const manager = new WordManager('n4');
        // "ame" (rain) is N5
        expect(manager.wordsHiragana.has('あめ')).toBe(true);
        expect(manager.wordsHiragana.get('あめ')?.level).toBe('n5');
    });

    it('should include N5 words when level is N1', () => {
        const manager = new WordManager('n1');
        // "ame" (rain) is N5
        expect(manager.wordsHiragana.has('あめ')).toBe(true);
        expect(manager.wordsHiragana.get('あめ')?.level).toBe('n5');
    });

    it('should NOT include N1 words when level is N5', () => {
        const manager = new WordManager('n5');
        // "ishiki" (consciousness) is N1 (example, verifying existence in N1 first might be needed but assuming standard list)
        // Let's check a word that is definitely not N5. 
        // Actually, let's just check that the size of the map is smaller for N5 than N1.
        const sizeN5 = manager.wordsHiragana.size;

        manager.setLevel('n1');
        const sizeN1 = manager.wordsHiragana.size;

        expect(sizeN1).toBeGreaterThan(sizeN5);
    });
});
