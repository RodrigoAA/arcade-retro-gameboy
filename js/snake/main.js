/**
 * Main entry point for Snake game
 */
document.addEventListener('DOMContentLoaded', () => {
    // Get canvas element
    const canvas = document.getElementById('game-canvas');

    if (!canvas) {
        console.error('Canvas element not found');
        return;
    }

    // Set canvas dimensions
    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;

    // Disable image smoothing for pixel-perfect rendering
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    // Create and start the game
    const game = new Game(canvas);
    game.init();

    // Expose game instance globally for debugging
    window.game = game;
});
