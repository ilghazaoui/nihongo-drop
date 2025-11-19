export class Input {
    isDown: boolean = false;
    onMove: ((x: number) => void) | null = null;
    onDrop: (() => void) | null = null;
    onLeft: (() => void) | null = null;
    onRight: (() => void) | null = null;
    onSoftDrop: (() => void) | null = null;
    onStartOrRestart: (() => void) | null = null;
    container: HTMLElement;
    gridWidth: number;
    private touchActive: boolean = false; // Track active touch to avoid double events

    constructor(containerId: string, gridWidth: number) {
        this.container = document.getElementById(containerId)!;
        this.gridWidth = gridWidth;
        this.setupListeners();
    }

    setupListeners() {
        // Mouse events (ignore synthetic mouse events after touch by checking touchActive)
        this.container.addEventListener('mousemove', (e) => {
            if (this.touchActive) return;
            this.handleMove(e.clientX);
        });
        this.container.addEventListener('mousedown', () => {
            if (this.touchActive) return;
            this.handleDown();
        });
        this.container.addEventListener('mouseup', () => {
            if (this.touchActive) return;
            this.handleUp();
        });

        // Touch events: move the block on touch, drop on release
        this.container.addEventListener('touchstart', (e) => {
            this.touchActive = true;
            if (e.touches.length > 0) {
                // Move to the touched column immediately
                this.handleMove(e.touches[0].clientX);
            }
        }, { passive: true });

        // Support touchmove for live positioning while dragging
        this.container.addEventListener('touchmove', (e) => {
            e.preventDefault(); // Prevent scrolling
            if (e.touches.length > 0) {
                this.handleMove(e.touches[0].clientX);
            }
        }, { passive: false });

        this.container.addEventListener('touchend', () => {
            // Drop the block at the current position when touch is released
            if (this.onDrop) {
                this.onDrop();
            }
            // Small timeout to ensure synthetic mouse events (if any) are ignored
            setTimeout(() => {
                this.touchActive = false;
            }, 0);
        });

        // Keyboard events
        window.addEventListener('keydown', (e) => {
            // Ignore if user is typing in an input/textarea/select
            const target = e.target as HTMLElement | null;
            if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
                return;
            }

            switch (e.code) {
                case 'Enter':
                case 'Space':
                    if (this.onStartOrRestart) {
                        e.preventDefault();
                        this.onStartOrRestart();
                    }
                    break;
                case 'ArrowLeft':
                    if (this.onLeft) {
                        e.preventDefault();
                        this.onLeft();
                    }
                    break;
                case 'ArrowRight':
                    if (this.onRight) {
                        e.preventDefault();
                        this.onRight();
                    }
                    break;
                case 'ArrowDown':
                    if (this.onSoftDrop) {
                        e.preventDefault();
                        this.onSoftDrop();
                    }
                    break;
            }
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
