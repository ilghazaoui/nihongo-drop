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

        // Touch events: tap to move to the tapped column then drop once
        this.container.addEventListener('touchstart', (e) => {
            this.touchActive = true;
            this.handleTouchTap(e);
        }, { passive: true });

        // Still support touchmove for live positioning if the user drags
        this.container.addEventListener('touchmove', (e) => {
            e.preventDefault(); // Prevent scrolling
            if (e.touches.length > 0) {
                this.handleMove(e.touches[0].clientX);
            }
        }, { passive: false });

        this.container.addEventListener('touchend', () => {
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

    handleTouchTap(e: TouchEvent) {
        if (e.touches.length === 0) return;
        const touch = e.touches[0];
        const rect = this.container.getBoundingClientRect();
        const relativeX = touch.clientX - rect.left;
        const colWidth = rect.width / this.gridWidth;
        const col = Math.floor(relativeX / colWidth);
        const clampedCol = Math.max(0, Math.min(this.gridWidth - 1, col));

        // First move active block to this column, then drop once
        if (this.onMove) {
            this.onMove(clampedCol);
        }
        if (this.onDrop) {
            this.onDrop();
        }

        // Prevent a synthetic mouse event from also triggering a drop
        this.handleDown();
        this.handleUp();
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
