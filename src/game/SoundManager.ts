export class SoundManager {
    private audioContext: AudioContext | null = null;
    private isMuted: boolean = false;

    constructor() {
        // Initialize AudioContext lazily or on user interaction
        try {
            const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
            this.audioContext = new AudioContextClass();
        } catch (e) {
            console.warn('Web Audio API not supported');
        }
    }

    resume() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
    }

    private playTone(freq: number, type: OscillatorType, duration: number, startTime: number = 0, vol: number = 0.1) {
        if (!this.audioContext || this.isMuted) return;

        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.audioContext.currentTime + startTime);

        gain.gain.setValueAtTime(vol, this.audioContext.currentTime + startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + startTime + duration);

        osc.connect(gain);
        gain.connect(this.audioContext.destination);

        osc.start(this.audioContext.currentTime + startTime);
        osc.stop(this.audioContext.currentTime + startTime + duration);
    }

    playMove() {
        // Short, high click
        this.playTone(800, 'sine', 0.05, 0, 0.05);
    }

    playDrop() {
        // Low thud
        this.playTone(150, 'triangle', 0.1, 0, 0.2);
    }

    playMatch() {
        // Ascending arpeggio
        const now = 0;
        this.playTone(440, 'sine', 0.1, now, 0.1);       // A4
        this.playTone(554.37, 'sine', 0.1, now + 0.1, 0.1); // C#5
        this.playTone(659.25, 'sine', 0.2, now + 0.2, 0.1); // E5
    }

    playGameOver() {
        // Descending dissonant
        const now = 0;
        this.playTone(300, 'sawtooth', 0.3, now, 0.2);
        this.playTone(280, 'sawtooth', 0.3, now + 0.2, 0.2);
        this.playTone(200, 'sawtooth', 0.8, now + 0.4, 0.2);
    }
}
