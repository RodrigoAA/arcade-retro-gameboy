/**
 * InputHandler class - Manages keyboard input for the game
 */
class InputHandler {
    constructor() {
        this.keys = {};
        this.keyRepeatTimers = {};
    }

    /**
     * Bind keyboard events to game actions
     * @param {Game} game - Game instance to control
     */
    bindEvents(game) {
        // Key down handler
        document.addEventListener('keydown', (e) => {
            // Prevent default for game keys
            if (['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', 'Space'].includes(e.code)) {
                e.preventDefault();
            }

            // Handle game over state
            if (game.gameOver) {
                if (e.code === 'Enter' || e.code === 'Space' || e.code === 'KeyR') {
                    game.restart();
                }
                return;
            }

            // Handle menu navigation
            if (e.code === 'Escape') {
                window.location.href = 'index.html';
                return;
            }

            // Handle pause toggle
            if (e.code === 'KeyP') {
                game.togglePause();
                return;
            }

            // Handle restart
            if (e.code === 'KeyR') {
                game.restart();
                return;
            }

            // Don't process movement if paused
            if (game.paused) {
                return;
            }

            // Avoid key repeat for rotation and hard drop
            if (this.keys[e.code]) {
                return;
            }

            this.keys[e.code] = true;

            // Handle immediate actions
            switch (e.code) {
                case 'ArrowLeft':
                    game.moveLeft();
                    if (window.AudioManager) AudioManager.play('move');
                    this.startKeyRepeat(e.code, () => {
                        game.moveLeft();
                        if (window.AudioManager) AudioManager.play('move');
                    });
                    break;

                case 'ArrowRight':
                    game.moveRight();
                    if (window.AudioManager) AudioManager.play('move');
                    this.startKeyRepeat(e.code, () => {
                        game.moveRight();
                        if (window.AudioManager) AudioManager.play('move');
                    });
                    break;

                case 'ArrowDown':
                    game.moveDown();
                    game.score += POINTS.softDrop;
                    if (window.AudioManager) AudioManager.play('drop');
                    this.startKeyRepeat(e.code, () => {
                        if (game.moveDown()) {
                            game.score += POINTS.softDrop;
                            if (window.AudioManager) AudioManager.play('drop');
                        }
                    });
                    break;

                case 'ArrowUp':
                    game.rotate(1);
                    if (window.AudioManager) AudioManager.play('rotate');
                    break;

                case 'KeyZ':
                    game.rotate(-1);
                    if (window.AudioManager) AudioManager.play('rotate');
                    break;

                case 'Space':
                    game.hardDrop();
                    if (window.AudioManager) AudioManager.play('hardDrop');
                    break;
            }
        });

        // Key up handler
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
            this.stopKeyRepeat(e.code);
        });

        // Handle window blur (stop all key repeats)
        window.addEventListener('blur', () => {
            this.keys = {};
            this.stopAllKeyRepeats();
        });
    }

    /**
     * Start key repeat for held keys
     * @param {string} code - Key code
     * @param {Function} action - Action to repeat
     */
    startKeyRepeat(code, action) {
        this.stopKeyRepeat(code);

        this.keyRepeatTimers[code] = {
            delay: setTimeout(() => {
                this.keyRepeatTimers[code].interval = setInterval(() => {
                    if (this.keys[code]) {
                        action();
                    }
                }, KEY_REPEAT_INTERVAL);
            }, KEY_REPEAT_DELAY)
        };
    }

    /**
     * Stop key repeat for a specific key
     * @param {string} code - Key code
     */
    stopKeyRepeat(code) {
        if (this.keyRepeatTimers[code]) {
            clearTimeout(this.keyRepeatTimers[code].delay);
            clearInterval(this.keyRepeatTimers[code].interval);
            delete this.keyRepeatTimers[code];
        }
    }

    /**
     * Stop all key repeats
     */
    stopAllKeyRepeats() {
        for (const code in this.keyRepeatTimers) {
            this.stopKeyRepeat(code);
        }
    }
}
