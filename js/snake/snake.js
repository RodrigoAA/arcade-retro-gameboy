/**
 * Snake class - Manages the snake body and movement
 */
class Snake {
    constructor() {
        this.reset();
    }

    /**
     * Reset snake to initial state
     */
    reset() {
        // Start in the middle of the grid
        const startX = Math.floor(GRID_SIZE / 2);
        const startY = Math.floor(GRID_SIZE / 2);

        // Initial snake body (3 segments, moving right)
        this.body = [
            { x: startX, y: startY },
            { x: startX - 1, y: startY },
            { x: startX - 2, y: startY }
        ];

        this.direction = DIRECTION.RIGHT;
        this.nextDirection = DIRECTION.RIGHT;
        this.growing = false;
    }

    /**
     * Get the head position
     * @returns {Object} - Head position {x, y}
     */
    getHead() {
        return this.body[0];
    }

    /**
     * Set the next direction (validated on next move)
     * @param {Object} newDirection - Direction object
     */
    setDirection(newDirection) {
        // Prevent 180 degree turns
        const opposite = (
            (this.direction.x + newDirection.x === 0) &&
            (this.direction.y + newDirection.y === 0)
        );

        if (!opposite) {
            this.nextDirection = newDirection;
        }
    }

    /**
     * Move the snake one step
     */
    move() {
        // Update direction
        this.direction = this.nextDirection;

        // Calculate new head position
        const head = this.getHead();
        const newHead = {
            x: head.x + this.direction.x,
            y: head.y + this.direction.y
        };

        // Add new head to beginning
        this.body.unshift(newHead);

        // Remove tail if not growing
        if (!this.growing) {
            this.body.pop();
        } else {
            this.growing = false;
        }
    }

    /**
     * Make the snake grow on next move
     */
    grow() {
        this.growing = true;
    }

    /**
     * Check if snake collides with itself
     * @returns {boolean} - True if collision
     */
    checkSelfCollision() {
        const head = this.getHead();

        for (let i = 1; i < this.body.length; i++) {
            if (this.body[i].x === head.x && this.body[i].y === head.y) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check if snake collides with walls
     * @returns {boolean} - True if collision
     */
    checkWallCollision() {
        const head = this.getHead();

        return (
            head.x < 0 ||
            head.x >= GRID_SIZE ||
            head.y < 0 ||
            head.y >= GRID_SIZE
        );
    }

    /**
     * Check if position is occupied by snake
     * @param {number} x - X position
     * @param {number} y - Y position
     * @returns {boolean} - True if occupied
     */
    occupies(x, y) {
        return this.body.some(segment => segment.x === x && segment.y === y);
    }

    /**
     * Get snake length
     * @returns {number} - Length of snake
     */
    getLength() {
        return this.body.length;
    }
}
