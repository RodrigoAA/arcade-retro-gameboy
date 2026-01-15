/**
 * Game class - Main game logic and loop for Snake
 */
class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        // Initialize components
        this.snake = new Snake();
        this.food = new Food();
        this.renderer = new Renderer(this.ctx);
        this.input = new InputHandler();

        // Game state
        this.score = 0;
        this.level = 1;
        this.foodEaten = 0;
        this.gameOver = false;
        this.paused = false;
        this.highscore = this.loadHighscore();

        // Timing
        this.lastMoveTime = 0;
        this.moveInterval = LEVEL_SPEEDS[0];

        // Animation frame ID
        this.animationId = null;
    }

    /**
     * Initialize and start the game
     */
    init() {
        this.food.spawn(this.snake);
        this.input.bindEvents(this);
        this.lastMoveTime = performance.now();
        this.updateUI();
        this.gameLoop();
    }

    /**
     * Main game loop
     * @param {number} timestamp - Current timestamp
     */
    gameLoop(timestamp = 0) {
        // Render current state
        this.render();

        // Check game over
        if (this.gameOver) {
            this.renderer.drawGameOver(this.score, this.highscore);
            return;
        }

        // Check pause
        if (this.paused) {
            this.renderer.drawPaused();
            this.animationId = requestAnimationFrame((t) => this.gameLoop(t));
            return;
        }

        // Move snake based on current speed
        if (timestamp - this.lastMoveTime > this.moveInterval) {
            this.update();
            this.lastMoveTime = timestamp;
        }

        // Continue loop
        this.animationId = requestAnimationFrame((t) => this.gameLoop(t));
    }

    /**
     * Update game state
     */
    update() {
        // Move snake
        this.snake.move();

        // Check collisions
        if (this.snake.checkWallCollision() || this.snake.checkSelfCollision()) {
            this.endGame();
            return;
        }

        // Check food collision
        if (this.food.isEatenBy(this.snake)) {
            this.eatFood();
        }

        this.updateUI();
    }

    /**
     * Render the game
     */
    render() {
        this.renderer.clear();
        this.renderer.drawGrid();
        this.renderer.drawFood(this.food);
        this.renderer.drawSnake(this.snake);
    }

    /**
     * Handle eating food
     */
    eatFood() {
        this.snake.grow();
        this.score += POINTS_PER_FOOD * this.level;
        this.foodEaten++;

        if (window.AudioManager) AudioManager.play('eat');

        // Check level up
        if (this.foodEaten >= FOOD_PER_LEVEL && this.level < LEVEL_SPEEDS.length) {
            this.levelUp();
        }

        // Spawn new food
        this.food.spawn(this.snake);
    }

    /**
     * Level up
     */
    levelUp() {
        this.level++;
        this.foodEaten = 0;
        this.moveInterval = LEVEL_SPEEDS[this.level - 1] || LEVEL_SPEEDS[LEVEL_SPEEDS.length - 1];
        if (window.AudioManager) AudioManager.play('levelUp');
    }

    /**
     * End the game
     */
    endGame() {
        this.gameOver = true;
        this.saveHighscore();
        if (window.AudioManager) AudioManager.play('gameOver');
    }

    /**
     * Update UI elements
     */
    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
        document.getElementById('highscore').textContent = this.highscore;
    }

    /**
     * Toggle pause state
     */
    togglePause() {
        this.paused = !this.paused;
        if (window.AudioManager) AudioManager.play('pause');

        if (!this.paused) {
            this.lastMoveTime = performance.now();
        }
    }

    /**
     * Restart the game
     */
    restart() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }

        // Reset state
        this.snake.reset();
        this.score = 0;
        this.level = 1;
        this.foodEaten = 0;
        this.gameOver = false;
        this.paused = false;
        this.moveInterval = LEVEL_SPEEDS[0];

        // Spawn food
        this.food.spawn(this.snake);

        // Update UI
        this.updateUI();

        // Start loop
        this.lastMoveTime = performance.now();
        this.gameLoop();
    }

    /**
     * Load high score from local storage
     * @returns {number} - High score
     */
    loadHighscore() {
        const saved = localStorage.getItem(HIGHSCORE_KEY);
        return saved ? parseInt(saved, 10) : 0;
    }

    /**
     * Save high score to local storage
     */
    saveHighscore() {
        if (this.score > this.highscore) {
            this.highscore = this.score;
            localStorage.setItem(HIGHSCORE_KEY, this.highscore.toString());
            document.getElementById('highscore').textContent = this.highscore;
        }
    }
}
