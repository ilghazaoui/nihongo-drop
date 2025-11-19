export class Input {
    mouseX: number = 0;
    isDown: boolean = false;
    onMove: ((x: number) => void) | null = null;
    onDrop: (() => void) | null = null;
    container: HTMLElement;
    gridWidth: number;

    constructor(containerId: string, gridWidth: number) {
        this.container = document.getElementById(containerId)!;
        this.gridWidth = gridWidth;
        this.setupListeners();
    }

    setupListeners() {
        // Mouse events
        this.container.addEventListener('mousemove', (e) => this.handleMove(e.clientX));
        this.container.addEventListener('mousedown', () => this.handleDown());
        this.container.addEventListener('mouseup', () => this.handleUp());

        // Touch events
        this.container.addEventListener('touchmove', (e) => {
            e.preventDefault(); // Prevent scrolling
            this.handleMove(e.touches[0].clientX);
        }, { passive: false });
        this.container.addEventListener('touchstart', () => {
            this.handleDown();
        });
        this.container.addEventListener('touchend', () => {
            this.handleUp();
        });
    }

    handleMove(clientX: number) {
        const rect = this.container.getBoundingClientRect();
        const relativeX = clientX - rect.left;
        const colWidth = rect.width / this.gridWidth;
        const col = Math.floor(relativeX / colWidth);

        // Clamp column
        const clampedCol = Math.max(0, Math.min(this.gridWidth - 1, col));

        if (this.onMove) {
            this.onMove(clampedCol);
        }
    }

    handleDown() {
        this.isDown = true;
    }

    handleUp() {
        if (this.isDown) {
            this.isDown = false;
            if (this.onDrop) {
                this.onDrop();
            }
        }
    }
}
