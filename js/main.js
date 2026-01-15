/**
 * Main entry point - Initialize the game when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    // Get canvas elements
    const canvas = document.getElementById('game-canvas');
    const previewCanvas = document.getElementById('preview-canvas');

    if (!canvas || !previewCanvas) {
        console.error('Canvas elements not found');
        return;
    }

    // Set canvas dimensions
    canvas.width = COLS * BLOCK_SIZE;
    canvas.height = ROWS * BLOCK_SIZE;
    previewCanvas.width = 80;
    previewCanvas.height = 80;

    // Disable image smoothing for pixel-perfect rendering
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    const previewCtx = previewCanvas.getContext('2d');
    previewCtx.imageSmoothingEnabled = false;

    // Create and start the game
    const game = new Game(canvas, previewCanvas);
    game.init();

    // Expose game instance globally for debugging (optional)
    window.game = game;
});
