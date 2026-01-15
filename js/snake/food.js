/**
 * Food class - Manages food spawning and position
 */
class Food {
    constructor() {
        this.position = { x: 0, y: 0 };
    }

    /**
     * Spawn food at a random position not occupied by snake
     * @param {Snake} snake - Snake instance to avoid
     */
    spawn(snake) {
        let newPosition;
        let attempts = 0;
        const maxAttempts = GRID_SIZE * GRID_SIZE;

        do {
            newPosition = {
                x: Math.floor(Math.random() * GRID_SIZE),
                y: Math.floor(Math.random() * GRID_SIZE)
            };
            attempts++;

            // Safety check to prevent infinite loop
            if (attempts > maxAttempts) {
                // Find any empty cell
                for (let y = 0; y < GRID_SIZE; y++) {
                    for (let x = 0; x < GRID_SIZE; x++) {
                        if (!snake.occupies(x, y)) {
                            this.position = { x, y };
                            return;
                        }
                    }
                }
                // Grid is full (win condition)
                return;
            }
        } while (snake.occupies(newPosition.x, newPosition.y));

        this.position = newPosition;
    }

    /**
     * Check if snake head is at food position
     * @param {Snake} snake - Snake instance
     * @returns {boolean} - True if eaten
     */
    isEatenBy(snake) {
        const head = snake.getHead();
        return head.x === this.position.x && head.y === this.position.y;
    }

    /**
     * Get food position
     * @returns {Object} - Position {x, y}
     */
    getPosition() {
        return this.position;
    }
}
