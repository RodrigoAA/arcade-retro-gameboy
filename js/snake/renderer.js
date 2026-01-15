/**
 * Renderer class - Handles all canvas drawing for Snake
 */
class Renderer {
    constructor(ctx) {
        this.ctx = ctx;
    }

    /**
     * Clear the canvas
     */
    clear() {
        this.ctx.fillStyle = COLORS.boardBg;
        this.ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    }

    /**
     * Draw the grid
     */
    drawGrid() {
        this.ctx.strokeStyle = COLORS.gridLine;
        this.ctx.lineWidth = 0.5;

        // Vertical lines
        for (let x = 0; x <= GRID_SIZE; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * CELL_SIZE + 0.5, 0);
            this.ctx.lineTo(x * CELL_SIZE + 0.5, CANVAS_SIZE);
            this.ctx.stroke();
        }

        // Horizontal lines
        for (let y = 0; y <= GRID_SIZE; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * CELL_SIZE + 0.5);
            this.ctx.lineTo(CANVAS_SIZE, y * CELL_SIZE + 0.5);
            this.ctx.stroke();
        }
    }

    /**
     * Draw a single cell with 3D effect
     * @param {number} x - Grid X position
     * @param {number} y - Grid Y position
     * @param {boolean} isHead - Whether this is the snake head
     */
    drawCell(x, y, isHead = false) {
        const px = x * CELL_SIZE;
        const py = y * CELL_SIZE;
        const size = CELL_SIZE;
        const padding = 1;

        // Main fill
        this.ctx.fillStyle = isHead ? COLORS.snakeHead : COLORS.snake;
        this.ctx.fillRect(px + padding, py + padding, size - padding * 2, size - padding * 2);

        // 3D effect - highlight
        this.ctx.fillStyle = COLORS.boardBg;
        this.ctx.fillRect(px + padding, py + padding, size - padding * 2, 1);
        this.ctx.fillRect(px + padding, py + padding, 1, size - padding * 2);

        // Inner fill
        if (size > 6) {
            this.ctx.fillStyle = isHead ? COLORS.snakeHead : COLORS.snake;
            this.ctx.fillRect(px + 3, py + 3, size - 6, size - 6);
        }
    }

    /**
     * Draw the snake
     * @param {Snake} snake - Snake instance
     */
    drawSnake(snake) {
        snake.body.forEach((segment, index) => {
            this.drawCell(segment.x, segment.y, index === 0);
        });
    }

    /**
     * Draw the food
     * @param {Food} food - Food instance
     */
    drawFood(food) {
        const pos = food.getPosition();
        const px = pos.x * CELL_SIZE;
        const py = pos.y * CELL_SIZE;
        const size = CELL_SIZE;
        const padding = 2;

        // Draw food as a filled square with different style
        this.ctx.fillStyle = COLORS.food;
        this.ctx.fillRect(px + padding, py + padding, size - padding * 2, size - padding * 2);

        // Inner detail
        this.ctx.fillStyle = COLORS.boardBg;
        this.ctx.fillRect(px + 4, py + 4, size - 8, size - 8);

        this.ctx.fillStyle = COLORS.food;
        this.ctx.fillRect(px + 5, py + 5, size - 10, size - 10);
    }

    /**
     * Draw pause overlay
     */
    drawPaused() {
        this.ctx.fillStyle = 'rgba(15, 56, 15, 0.8)';
        this.ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        this.ctx.fillStyle = COLORS.background;
        this.ctx.font = 'bold 16px "Press Start 2P", monospace';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('PAUSA', CANVAS_SIZE / 2, CANVAS_SIZE / 2);
    }

    /**
     * Draw game over screen
     * @param {number} score - Final score
     * @param {number} highscore - High score
     */
    drawGameOver(score, highscore) {
        this.ctx.fillStyle = 'rgba(15, 56, 15, 0.9)';
        this.ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        this.ctx.fillStyle = COLORS.background;
        this.ctx.font = 'bold 12px "Press Start 2P", monospace';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        const centerX = CANVAS_SIZE / 2;
        const centerY = CANVAS_SIZE / 2;

        this.ctx.fillText('FIN DEL', centerX, centerY - 40);
        this.ctx.fillText('JUEGO', centerX, centerY - 20);

        this.ctx.font = '8px "Press Start 2P", monospace';
        this.ctx.fillText('Puntos: ' + score, centerX, centerY + 15);

        if (score >= highscore && score > 0) {
            this.ctx.fillText('NUEVO RECORD!', centerX, centerY + 35);
        }

        this.ctx.font = '6px "Press Start 2P", monospace';
        this.ctx.fillText('ENTER: Reiniciar', centerX, centerY + 55);
    }
}
