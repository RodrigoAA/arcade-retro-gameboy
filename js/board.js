/**
 * Board class - Manages the game grid and collision detection
 */
class Board {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.grid = this.createEmptyGrid();
    }

    /**
     * Create an empty grid filled with zeros
     * @returns {Array} - 2D array of zeros
     */
    createEmptyGrid() {
        return Array.from({ length: this.rows }, () =>
            Array(this.cols).fill(0)
        );
    }

    /**
     * Check if a piece position is valid (no collisions)
     * @param {Object} piece - Piece to check
     * @param {number} offsetX - X offset to apply
     * @param {number} offsetY - Y offset to apply
     * @returns {boolean} - True if position is valid
     */
    isValidPosition(piece, offsetX = 0, offsetY = 0) {
        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x]) {
                    const newX = piece.x + x + offsetX;
                    const newY = piece.y + y + offsetY;

                    // Check left and right boundaries
                    if (newX < 0 || newX >= this.cols) {
                        return false;
                    }

                    // Check bottom boundary
                    if (newY >= this.rows) {
                        return false;
                    }

                    // Check collision with locked pieces (only if within grid)
                    if (newY >= 0 && this.grid[newY][newX]) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    /**
     * Lock a piece into the grid
     * @param {Object} piece - Piece to lock
     */
    lockPiece(piece) {
        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x]) {
                    const boardY = piece.y + y;
                    const boardX = piece.x + x;

                    if (boardY >= 0 && boardY < this.rows &&
                        boardX >= 0 && boardX < this.cols) {
                        this.grid[boardY][boardX] = piece.color;
                    }
                }
            }
        }
    }

    /**
     * Clear completed lines and return the count
     * @returns {number} - Number of lines cleared
     */
    clearLines() {
        let linesCleared = 0;

        for (let y = this.rows - 1; y >= 0; y--) {
            // Check if line is complete (no zeros)
            if (this.grid[y].every(cell => cell !== 0)) {
                // Remove the completed line
                this.grid.splice(y, 1);
                // Add empty line at top
                this.grid.unshift(Array(this.cols).fill(0));
                // Increment counter
                linesCleared++;
                // Check same row again (since rows shifted down)
                y++;
            }
        }

        return linesCleared;
    }

    /**
     * Check if game is over (pieces stacked to top)
     * @returns {boolean} - True if game over
     */
    isGameOver() {
        // Game over if any cell in the top two rows is filled
        return this.grid[0].some(cell => cell !== 0) ||
               this.grid[1].some(cell => cell !== 0);
    }

    /**
     * Reset the board to empty state
     */
    reset() {
        this.grid = this.createEmptyGrid();
    }

    /**
     * Get the Y position where a piece would land (for ghost piece)
     * @param {Object} piece - Piece to check
     * @returns {number} - Y position where piece would land
     */
    getDropPosition(piece) {
        let dropY = piece.y;

        while (this.isValidPosition(piece, 0, dropY - piece.y + 1)) {
            dropY++;
        }

        return dropY;
    }
}
