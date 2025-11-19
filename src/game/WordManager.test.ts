import { describe, it, expect } from 'vitest';
import { WordManager } from './WordManager';
import { Grid } from './Grid';

function fillHorizontal(grid: Grid, y: number, chars: string[]) {
  chars.forEach((ch, i) => grid.setCell(i, y, ch));
}

function fillVertical(grid: Grid, x: number, chars: string[]) {
  chars.forEach((ch, i) => grid.setCell(x, i, ch));
}

describe('WordManager kanji mode matching', () => {
  it('matches multi-character kanji horizontally (学校)', () => {
    const wm = new WordManager();
    wm.setMode('kanji');
    const grid = new Grid(6, 10);
    fillHorizontal(grid, 0, ['学', '校']);
    const matches = wm.checkMatches(grid);
    expect(matches.some(m => m.kanji === '学校')).toBe(true);
  });

  it('does NOT match single-kanji word (今)', () => {
    const wm = new WordManager();
    wm.setMode('kanji');
    const grid = new Grid(6, 10);
    fillHorizontal(grid, 0, ['今']);
    const matches = wm.checkMatches(grid);
    expect(matches.length).toBe(0);
  });

  it('matches vertically (子供)', () => {
    const wm = new WordManager();
    wm.setMode('kanji');
    const grid = new Grid(6, 10);
    fillVertical(grid, 0, ['子', '供']);
    const matches = wm.checkMatches(grid);
    expect(matches.some(m => m.kanji === '子供')).toBe(true);
  });
});
