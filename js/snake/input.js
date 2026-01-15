/**
 * InputHandler class - Manages keyboard input for Snake
 */
class InputHandler {
    constructor() {
        this.lastDirection = null;
    }

    /**
     * Bind keyboard events to game actions
     * @param {Game} game - Game instance
     */
    bindEvents(game) {
        document.addEventListener('keydown', (e) => {
            // Prevent default for game keys
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
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

            // Direction changes
            switch (e.code) {
                case 'ArrowUp':
                case 'KeyW':
                    game.snake.setDirection(DIRECTION.UP);
                    break;

                case 'ArrowDown':
                case 'KeyS':
                    game.snake.setDirection(DIRECTION.DOWN);
                    break;

                case 'ArrowLeft':
                case 'KeyA':
                    game.snake.setDirection(DIRECTION.LEFT);
                    break;

                case 'ArrowRight':
                case 'KeyD':
                    game.snake.setDirection(DIRECTION.RIGHT);
                    break;
            }
        });
    }
}
