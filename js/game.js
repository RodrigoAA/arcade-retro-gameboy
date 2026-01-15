/**
 * Game class - Main game logic and loop
 */
class Game {
    constructor(canvas, previewCanvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.previewCanvas = previewCanvas;
        this.previewCtx = previewCanvas.getContext('2d');

        // Initialize components
        this.board = new Board(ROWS, COLS);
        this.renderer = new Renderer(this.ctx, this.previewCtx);
        this.input = new InputHandler();

        // Game state
        this.currentPiece = null;
        this.nextPiece = null;
        this.score = 0;
        this.level = 0;
        this.lines = 0;
        this.gameOver = false;
        this.paused = false;

        // Timing
        this.lastDropTime = 0;
        this.dropInterval = LEVEL_SPEEDS[0];

        // Animation frame ID
        this.animationId = null;
    }

    /**
     * Initialize and start the game
     */
    init() {
        this.spawnPiece();
        this.input.bindEvents(this);
        this.lastDropTime = performance.now();
        this.gameLoop();
    }

    /**
     * Spawn a new piece
     */
    spawnPiece() {
        this.currentPiece = this.nextPiece || getRandomPiece();
        this.nextPiece = getRandomPiece();

        // Check if new piece immediately collides (game over)
        if (!this.board.isValidPosition(this.currentPiece)) {
            this.gameOver = true;
        }
    }

    /**
     * Main game loop
     * @param {number} timestamp - Current timestamp from requestAnimationFrame
     */
    gameLoop(timestamp = 0) {
        // Render current state
        this.render();

        // Check game over
        if (this.gameOver) {
            if (!this.gameOverSoundPlayed) {
                if (window.AudioManager) AudioManager.play('gameOver');
                this.gameOverSoundPlayed = true;
            }
            this.renderer.drawGameOver(this.score);
            return;
        }

        // Check pause
        if (this.paused) {
            this.renderer.drawPaused();
            this.animationId = requestAnimationFrame((t) => this.gameLoop(t));
            return;
        }

        // Auto drop based on level speed
        if (timestamp - this.lastDropTime > this.dropInterval) {
            this.moveDown();
            this.lastDropTime = timestamp;
        }

        // Continue loop
        this.animationId = requestAnimationFrame((t) => this.gameLoop(t));
    }

    /**
     * Render the current game state
     */
    render() {
        this.renderer.clear();
        this.renderer.drawBoard(this.board);

        if (this.currentPiece && !this.gameOver) {
            this.renderer.drawGhostPiece(this.currentPiece, this.board);
            this.renderer.drawPiece(this.currentPiece);
        }

        if (this.nextPiece) {
            this.renderer.drawNextPiece(this.nextPiece);
        }

        // Update UI
        this.updateUI();
    }

    /**
     * Update UI elements
     */
    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
        document.getElementById('lines').textContent = this.lines;
    }

    /**
     * Move piece left
     */
    moveLeft() {
        if (this.currentPiece && this.board.isValidPosition(this.currentPiece, -1, 0)) {
            this.currentPiece.x--;
        }
    }

    /**
     * Move piece right
     */
    moveRight() {
        if (this.currentPiece && this.board.isValidPosition(this.currentPiece, 1, 0)) {
            this.currentPiece.x++;
        }
    }

    /**
     * Move piece down
     * @returns {boolean} - True if piece moved, false if locked
     */
    moveDown() {
        if (!this.currentPiece) return false;

        if (this.board.isValidPosition(this.currentPiece, 0, 1)) {
            this.currentPiece.y++;
            return true;
        } else {
            this.lockPiece();
            return false;
        }
    }

    /**
     * Hard drop - instantly drop piece to bottom
     */
    hardDrop() {
        if (!this.currentPiece) return;

        let dropDistance = 0;

        while (this.board.isValidPosition(this.currentPiece, 0, 1)) {
            this.currentPiece.y++;
            dropDistance++;
        }

        this.score += dropDistance * POINTS.hardDrop;
        this.lockPiece();
    }

    /**
     * Rotate piece
     * @param {number} direction - 1 for clockwise, -1 for counter-clockwise
     */
    rotate(direction = 1) {
        if (!this.currentPiece) return;

        // O piece doesn't rotate
        if (this.currentPiece.type === 'O') return;

        // Store original shape
        const originalShape = this.currentPiece.shape;

        // Rotate
        if (direction === 1) {
            this.currentPiece.shape = rotateMatrix(this.currentPiece.shape);
        } else {
            this.currentPiece.shape = rotateMatrixCCW(this.currentPiece.shape);
        }

        // Wall kick tests
        const kicks = [0, -1, 1, -2, 2];

        for (const kick of kicks) {
            if (this.board.isValidPosition(this.currentPiece, kick, 0)) {
                this.currentPiece.x += kick;
                return;
            }
        }

        // If no valid position found, revert rotation
        this.currentPiece.shape = originalShape;
    }

    /**
     * Lock piece into the board and handle line clears
     */
    lockPiece() {
        this.board.lockPiece(this.currentPiece);

        // Check for completed lines
        const clearedLines = this.board.clearLines();
        this.updateScore(clearedLines);

        // Check for game over
        if (this.board.isGameOver()) {
            this.gameOver = true;
            return;
        }

        // Spawn next piece
        this.spawnPiece();
    }

    /**
     * Update score based on lines cleared
     * @param {number} clearedLines - Number of lines cleared
     */
    updateScore(clearedLines) {
        if (clearedLines === 0) return;

        this.lines += clearedLines;

        // Play sound based on lines cleared
        if (window.AudioManager) {
            if (clearedLines === 4) {
                AudioManager.play('tetris');
            } else {
                AudioManager.play('clearLine');
            }
        }

        // Calculate score (multiplied by level + 1)
        const multiplier = this.level + 1;
        switch (clearedLines) {
            case 1:
                this.score += POINTS.single * multiplier;
                break;
            case 2:
                this.score += POINTS.double * multiplier;
                break;
            case 3:
                this.score += POINTS.triple * multiplier;
                break;
            case 4:
                this.score += POINTS.tetris * multiplier;
                break;
        }

        // Level up check
        const newLevel = Math.floor(this.lines / LINES_PER_LEVEL);
        if (newLevel > this.level && newLevel < LEVEL_SPEEDS.length) {
            this.level = newLevel;
            this.dropInterval = LEVEL_SPEEDS[this.level];
            if (window.AudioManager) AudioManager.play('levelUp');
        }
    }

    /**
     * Toggle pause state
     */
    togglePause() {
        this.paused = !this.paused;
        if (window.AudioManager) AudioManager.play('pause');

        if (!this.paused) {
            // Reset drop timer when unpausing
            this.lastDropTime = performance.now();
        }
    }

    /**
     * Restart the game
     */
    restart() {
        // Cancel current animation
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }

        // Reset state
        this.board.reset();
        this.score = 0;
        this.level = 0;
        this.lines = 0;
        this.gameOver = false;
        this.gameOverSoundPlayed = false;
        this.paused = false;
        this.dropInterval = LEVEL_SPEEDS[0];
        this.nextPiece = null;

        // Clear input state
        this.input.keys = {};
        this.input.stopAllKeyRepeats();

        // Start fresh
        this.spawnPiece();
        this.lastDropTime = performance.now();
        this.gameLoop();
    }
}
