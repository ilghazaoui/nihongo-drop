export class Grid {
    width: number;
    height: number;
    cells: (string | null)[][];

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.cells = Array(height).fill(null).map(() => Array(width).fill(null));
    }

    isValid(x: number, y: number): boolean {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }

    isEmpty(x: number, y: number): boolean {
        return this.isValid(x, y) && this.cells[y][x] === null;
    }

    setCell(x: number, y: number, char: string | null) {
        if (this.isValid(x, y)) {
            this.cells[y][x] = char;
        }
    }

    getCell(x: number, y: number): string | null {
        if (this.isValid(x, y)) {
            return this.cells[y][x];
        }
        return null;
    }

    isRowFull(y: number): boolean {
        return this.cells[y].every(cell => cell !== null);
    }
}
