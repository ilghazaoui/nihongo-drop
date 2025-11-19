export class Block {
    x: number;
    y: number;
    char: string;

    constructor(x: number, y: number, char: string) {
        this.x = x;
        this.y = y;
        this.char = char;
    }

    move(dx: number, dy: number) {
        this.x += dx;
        this.y += dy;
    }
}
