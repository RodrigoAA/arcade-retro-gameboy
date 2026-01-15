/**
 * Retro Audio Manager - 8-bit sound effects using Web Audio API
 */

const AudioManager = (() => {
    let audioContext = null;
    let masterGain = null;
    let initialized = false;
    let muted = false;

    // Initialize audio context on first user interaction
    function init() {
        if (initialized) return;

        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            masterGain = audioContext.createGain();
            masterGain.gain.value = 0.3; // Master volume
            masterGain.connect(audioContext.destination);
            initialized = true;
        } catch (e) {
            console.warn('Web Audio API not supported');
        }
    }

    // Play a tone with specific parameters
    function playTone(frequency, duration, type = 'square', volume = 0.5) {
        if (!initialized || muted) return;

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

        gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(masterGain);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
    }

    // Play a sequence of tones
    function playSequence(notes, baseTime = 0) {
        if (!initialized || muted) return;

        notes.forEach(note => {
            setTimeout(() => {
                playTone(note.freq, note.duration, note.type || 'square', note.volume || 0.5);
            }, note.delay + baseTime);
        });
    }

    // Sound definitions
    const sounds = {
        // Menu sounds
        hover: () => playTone(440, 0.05, 'square', 0.2),
        select: () => playSequence([
            { freq: 523, duration: 0.08, delay: 0 },
            { freq: 659, duration: 0.08, delay: 60 },
            { freq: 784, duration: 0.12, delay: 120 }
        ]),

        // Tetris sounds
        move: () => playTone(200, 0.05, 'square', 0.15),
        rotate: () => playTone(300, 0.08, 'square', 0.2),
        drop: () => playTone(150, 0.1, 'triangle', 0.3),
        hardDrop: () => playSequence([
            { freq: 150, duration: 0.05, delay: 0, type: 'triangle' },
            { freq: 100, duration: 0.1, delay: 50, type: 'triangle' }
        ]),
        clearLine: () => playSequence([
            { freq: 523, duration: 0.1, delay: 0 },
            { freq: 659, duration: 0.1, delay: 80 },
            { freq: 784, duration: 0.15, delay: 160 }
        ]),
        tetris: () => playSequence([
            { freq: 523, duration: 0.1, delay: 0 },
            { freq: 659, duration: 0.1, delay: 80 },
            { freq: 784, duration: 0.1, delay: 160 },
            { freq: 1047, duration: 0.2, delay: 240 }
        ]),
        levelUp: () => playSequence([
            { freq: 392, duration: 0.1, delay: 0 },
            { freq: 523, duration: 0.1, delay: 100 },
            { freq: 659, duration: 0.1, delay: 200 },
            { freq: 784, duration: 0.2, delay: 300 }
        ]),

        // Snake sounds
        eat: () => playSequence([
            { freq: 440, duration: 0.05, delay: 0 },
            { freq: 660, duration: 0.08, delay: 40 }
        ]),
        snakeMove: () => playTone(100, 0.02, 'square', 0.05),

        // Simon sounds
        simonGreen: () => playTone(329.63, 0.3, 'sine', 0.4),  // E4
        simonRed: () => playTone(261.63, 0.3, 'sine', 0.4),    // C4
        simonYellow: () => playTone(392.00, 0.3, 'sine', 0.4), // G4
        simonBlue: () => playTone(523.25, 0.3, 'sine', 0.4),   // C5
        simonError: () => playSequence([
            { freq: 150, duration: 0.15, delay: 0, type: 'sawtooth' },
            { freq: 120, duration: 0.15, delay: 150, type: 'sawtooth' },
            { freq: 90, duration: 0.2, delay: 300, type: 'sawtooth' }
        ]),
        simonSuccess: () => playSequence([
            { freq: 523, duration: 0.1, delay: 0, type: 'sine' },
            { freq: 659, duration: 0.1, delay: 100, type: 'sine' },
            { freq: 784, duration: 0.15, delay: 200, type: 'sine' }
        ]),

        // Minesweeper sounds
        reveal: () => playTone(300, 0.03, 'square', 0.15),
        flag: () => playSequence([
            { freq: 440, duration: 0.05, delay: 0 },
            { freq: 550, duration: 0.05, delay: 50 }
        ]),
        explosion: () => playSequence([
            { freq: 200, duration: 0.1, delay: 0, type: 'sawtooth', volume: 0.5 },
            { freq: 150, duration: 0.15, delay: 80, type: 'sawtooth', volume: 0.4 },
            { freq: 100, duration: 0.2, delay: 180, type: 'sawtooth', volume: 0.3 },
            { freq: 60, duration: 0.3, delay: 300, type: 'sawtooth', volume: 0.2 }
        ]),

        // Connect 4 sounds
        dropChip: () => playSequence([
            { freq: 400, duration: 0.03, delay: 0, type: 'triangle' },
            { freq: 350, duration: 0.03, delay: 30, type: 'triangle' },
            { freq: 300, duration: 0.03, delay: 60, type: 'triangle' },
            { freq: 250, duration: 0.05, delay: 90, type: 'triangle' }
        ]),

        // Common sounds
        gameOver: () => playSequence([
            { freq: 392, duration: 0.15, delay: 0, type: 'square' },
            { freq: 330, duration: 0.15, delay: 150, type: 'square' },
            { freq: 262, duration: 0.15, delay: 300, type: 'square' },
            { freq: 196, duration: 0.4, delay: 450, type: 'square' }
        ]),
        win: () => playSequence([
            { freq: 523, duration: 0.12, delay: 0 },
            { freq: 659, duration: 0.12, delay: 120 },
            { freq: 784, duration: 0.12, delay: 240 },
            { freq: 1047, duration: 0.12, delay: 360 },
            { freq: 784, duration: 0.12, delay: 480 },
            { freq: 1047, duration: 0.25, delay: 600 }
        ]),
        pause: () => playTone(220, 0.15, 'square', 0.3),
        start: () => playSequence([
            { freq: 262, duration: 0.1, delay: 0 },
            { freq: 330, duration: 0.1, delay: 100 },
            { freq: 392, duration: 0.15, delay: 200 }
        ])
    };

    // Public API
    return {
        init,
        play: (soundName) => {
            init(); // Auto-init on first play
            if (sounds[soundName]) {
                sounds[soundName]();
            }
        },
        mute: () => { muted = true; },
        unmute: () => { muted = false; },
        toggleMute: () => { muted = !muted; return muted; },
        isMuted: () => muted
    };
})();

// Auto-init on any user interaction
['click', 'keydown', 'touchstart'].forEach(event => {
    document.addEventListener(event, () => AudioManager.init(), { once: true });
});
