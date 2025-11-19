import { describe, it, expect } from 'vitest';
import { tokenize } from './HiraganaTokenizer';

describe('HiraganaTokenizer', () => {
    describe('Simple words (no small characters)', () => {
        it('should tokenize "あか" (Aka) into ["あ", "か"]', () => {
            expect(tokenize('あか')).toEqual(['あ', 'か']);
        });

        it('should tokenize "あお" (Ao) into ["あ", "お"]', () => {
            expect(tokenize('あお')).toEqual(['あ', 'お']);
        });
    });

    describe('Small ya/yu/yo (combine with preceding character)', () => {
        it('should tokenize "こきゅう" (Kokyuu) into ["こ", "きゅ", "う"]', () => {
            expect(tokenize('こきゅう')).toEqual(['こ', 'きゅ', 'う']);
        });

        it('should tokenize "ぎゅうにゅう" (Gyuunyuu) into ["ぎゅ", "う", "にゅ", "う"]', () => {
            expect(tokenize('ぎゅうにゅう')).toEqual(['ぎゅ', 'う', 'にゅ', 'う']);
        });

        it('should tokenize "しゃ" (Sha) into ["しゃ"]', () => {
            expect(tokenize('しゃ')).toEqual(['しゃ']);
        });
    });

    describe('Small tsu (combine with following character)', () => {
        it('should tokenize "けっか" (Kekka) into ["け", "っか"]', () => {
            expect(tokenize('けっか')).toEqual(['け', 'っか']);
        });

        it('should tokenize "がっこう" (Gakkou) into ["が", "っこ", "う"]', () => {
            expect(tokenize('がっこう')).toEqual(['が', 'っこ', 'う']);
        });
    });

    describe('Combined small characters', () => {
        it('should tokenize "せっしゃ" (Sessha) into ["せ", "っしゃ"]', () => {
            expect(tokenize('せっしゃ')).toEqual(['せ', 'っしゃ']);
        });

        it('should tokenize "きゃっきゃ" (Kyakkya) into ["きゃ", "っきゃ"]', () => {
            expect(tokenize('きゃっきゃ')).toEqual(['きゃ', 'っきゃ']);
        });
    });

    describe('Edge cases', () => {
        it('should handle empty string', () => {
            expect(tokenize('')).toEqual([]);
        });

        it('should handle single character', () => {
            expect(tokenize('あ')).toEqual(['あ']);
        });

        it('should handle word ending with small character', () => {
            expect(tokenize('きゃ')).toEqual(['きゃ']);
        });
    });
});
