/**
 * Renderer class - Handles all canvas drawing operations
 */
class Renderer {
    constructor(ctx, previewCtx) {
        this.ctx = ctx;
        this.previewCtx = previewCtx;
    }

    /**
     * Clear the main canvas
     */
    clear() {
        this.ctx.fillStyle = COLORS.boardBg;
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    /**
     * Draw the game board with grid and locked pieces
     * @param {Board} board - Board instance
     */
    drawBoard(board) {
        // Draw grid lines
        this.ctx.strokeStyle = COLORS.gridLine;
        this.ctx.lineWidth = 1;

        // Vertical lines
        for (let x = 0; x <= COLS; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * BLOCK_SIZE + 0.5, 0);
            this.ctx.lineTo(x * BLOCK_SIZE + 0.5, ROWS * BLOCK_SIZE);
            this.ctx.stroke();
        }

        // Horizontal lines
        for (let y = 0; y <= ROWS; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * BLOCK_SIZE + 0.5);
            this.ctx.lineTo(COLS * BLOCK_SIZE, y * BLOCK_SIZE + 0.5);
            this.ctx.stroke();
        }

        // Draw locked pieces
        for (let y = 0; y < board.rows; y++) {
            for (let x = 0; x < board.cols; x++) {
                if (board.grid[y][x]) {
                    this.drawBlock(x, y, false);
                }
            }
        }
    }

    /**
     * Draw a single block with 3D effect
     * @param {number} x - Grid X position
     * @param {number} y - Grid Y position
     * @param {boolean} isGhost - Whether this is a ghost piece block
     */
    drawBlock(x, y, isGhost = false) {
        const px = x * BLOCK_SIZE;
        const py = y * BLOCK_SIZE;
        const size = BLOCK_SIZE;
        const border = 2;

        if (isGhost) {
            // Ghost piece - just an outline
            this.ctx.strokeStyle = COLORS.ghost;
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(px + 2, py + 2, size - 4, size - 4);
            return;
        }

        // Main block fill
        this.ctx.fillStyle = COLORS.piece;
        this.ctx.fillRect(px + 1, py + 1, size - 2, size - 2);

        // Highlight (top and left edges)
        this.ctx.fillStyle = COLORS.shadow;
        this.ctx.fillRect(px + 1, py + 1, size - 2, border);
        this.ctx.fillRect(px + 1, py + 1, border, size - 2);

        // Shadow (bottom and right edges)
        this.ctx.fillStyle = COLORS.highlight;
        this.ctx.fillRect(px + 1, py + size - border - 1, size - 2, border);
        this.ctx.fillRect(px + size - border - 1, py + 1, border, size - 2);

        // Inner highlight
        this.ctx.fillStyle = COLORS.boardBg;
        this.ctx.fillRect(px + border + 2, py + border + 2, size - border * 2 - 4, size - border * 2 - 4);

        // Inner fill
        this.ctx.fillStyle = COLORS.piece;
        this.ctx.fillRect(px + border + 3, py + border + 3, size - border * 2 - 6, size - border * 2 - 6);
    }

    /**
     * Draw the current piece
     * @param {Object} piece - Piece to draw
     */
    drawPiece(piece) {
        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x]) {
                    this.drawBlock(piece.x + x, piece.y + y, false);
                }
            }
        }
    }

    /**
     * Draw the ghost piece (landing preview)
     * @param {Object} piece - Current piece
     * @param {Board} board - Board instance
     */
    drawGhostPiece(piece, board) {
        const ghostY = board.getDropPosition(piece);

        // Only draw if ghost is below current piece
        if (ghostY <= piece.y) {
            return;
        }

        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x]) {
                    this.drawBlock(piece.x + x, ghostY + y, true);
                }
            }
        }
    }

    /**
     * Draw the next piece preview
     * @param {Object} piece - Next piece to draw
     */
    drawNextPiece(piece) {
        // Clear preview canvas
        this.previewCtx.fillStyle = COLORS.boardBg;
        this.previewCtx.fillRect(0, 0, this.previewCtx.canvas.width, this.previewCtx.canvas.height);

        // Calculate centering offset
        const pieceWidth = piece.shape[0].length * PREVIEW_BLOCK_SIZE;
        const pieceHeight = piece.shape.length * PREVIEW_BLOCK_SIZE;
        const offsetX = (this.previewCtx.canvas.width - pieceWidth) / 2;
        const offsetY = (this.previewCtx.canvas.height - pieceHeight) / 2;

        // Draw each block
        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x]) {
                    const px = offsetX + x * PREVIEW_BLOCK_SIZE;
                    const py = offsetY + y * PREVIEW_BLOCK_SIZE;
                    const size = PREVIEW_BLOCK_SIZE;
                    const border = 1;

                    // Main fill
                    this.previewCtx.fillStyle = COLORS.piece;
                    this.previewCtx.fillRect(px + 1, py + 1, size - 2, size - 2);

                    // Simple 3D effect
                    this.previewCtx.fillStyle = COLORS.shadow;
                    this.previewCtx.fillRect(px + 1, py + 1, size - 2, border);
                    this.previewCtx.fillRect(px + 1, py + 1, border, size - 2);

                    this.previewCtx.fillStyle = COLORS.highlight;
                    this.previewCtx.fillRect(px + 1, py + size - border - 1, size - 2, border);
                    this.previewCtx.fillRect(px + size - border - 1, py + 1, border, size - 2);
                }
            }
        }
    }

    /**
     * Draw pause overlay
     */
    drawPaused() {
        // Semi-transparent overlay
        this.ctx.fillStyle = 'rgba(15, 56, 15, 0.8)';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        // Pause text
        this.ctx.fillStyle = COLORS.background;
        this.ctx.font = 'bold 20px "Press Start 2P", monospace';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('PAUSA', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);
    }

    /**
     * Draw game over screen
     * @param {number} finalScore - Final score to display
     */
    drawGameOver(finalScore) {
        // Dark overlay
        this.ctx.fillStyle = 'rgba(15, 56, 15, 0.9)';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        // Game over text
        this.ctx.fillStyle = COLORS.background;
        this.ctx.font = 'bold 16px "Press Start 2P", monospace';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        const centerX = this.ctx.canvas.width / 2;
        const centerY = this.ctx.canvas.height / 2;

        this.ctx.fillText('FIN DEL', centerX, centerY - 50);
        this.ctx.fillText('JUEGO', centerX, centerY - 25);

        this.ctx.font = '10px "Press Start 2P", monospace';
        this.ctx.fillText('Puntos: ' + finalScore, centerX, centerY + 20);

        this.ctx.font = '8px "Press Start 2P", monospace';
        this.ctx.fillText('Presiona ENTER', centerX, centerY + 55);
        this.ctx.fillText('para reiniciar', centerX, centerY + 70);
    }
}
