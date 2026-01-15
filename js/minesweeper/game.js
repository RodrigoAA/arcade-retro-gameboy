/**
 * Minesweeper Game
 */

// Constants
const GRID_COLS = 10;
const GRID_ROWS = 10;
const CELL_SIZE = 24;
const MINE_COUNT = 10;

const COLORS = {
    background: '#9bbc0f',
    hidden: '#306230',
    hiddenLight: '#4a8a4a',
    revealed: '#8bac0f',
    border: '#0f380f',
    text: '#0f380f',
    mine: '#0f380f',
    flag: '#5a3030',
    numbers: ['#0f380f', '#306230', '#5a3030', '#303050', '#5a5a30', '#503030', '#305030', '#0f380f']
};

class MinesweeperGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.canvas.width = GRID_COLS * CELL_SIZE;
        this.canvas.height = GRID_ROWS * CELL_SIZE;

        this.grid = [];
        this.revealed = [];
        this.flagged = [];
        this.gameOver = false;
        this.gameWon = false;
        this.firstClick = true;
        this.minesRemaining = MINE_COUNT;
        this.startTime = null;
        this.timerInterval = null;

        this.init();
    }

    init() {
        this.createGrid();
        this.bindEvents();
        this.draw();
        this.updateUI();
    }

    createGrid() {
        this.grid = [];
        this.revealed = [];
        this.flagged = [];

        for (let y = 0; y < GRID_ROWS; y++) {
            this.grid[y] = [];
            this.revealed[y] = [];
            this.flagged[y] = [];
            for (let x = 0; x < GRID_COLS; x++) {
                this.grid[y][x] = 0;
                this.revealed[y][x] = false;
                this.flagged[y][x] = false;
            }
        }
    }

    placeMines(excludeX, excludeY) {
        let placed = 0;
        while (placed < MINE_COUNT) {
            const x = Math.floor(Math.random() * GRID_COLS);
            const y = Math.floor(Math.random() * GRID_ROWS);

            // Don't place on first click or adjacent
            if (Math.abs(x - excludeX) <= 1 && Math.abs(y - excludeY) <= 1) continue;
            if (this.grid[y][x] === -1) continue;

            this.grid[y][x] = -1;
            placed++;
        }

        // Calculate numbers
        for (let y = 0; y < GRID_ROWS; y++) {
            for (let x = 0; x < GRID_COLS; x++) {
                if (this.grid[y][x] === -1) continue;
                this.grid[y][x] = this.countAdjacentMines(x, y);
            }
        }
    }

    countAdjacentMines(x, y) {
        let count = 0;
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                const nx = x + dx;
                const ny = y + dy;
                if (nx >= 0 && nx < GRID_COLS && ny >= 0 && ny < GRID_ROWS) {
                    if (this.grid[ny][nx] === -1) count++;
                }
            }
        }
        return count;
    }

    bindEvents() {
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.handleRightClick(e);
        });

        document.addEventListener('keydown', (e) => {
            if (e.code === 'KeyR') {
                this.reset();
            } else if (e.code === 'Escape') {
                window.location.href = 'index.html';
            }
        });
    }

    getCell(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / CELL_SIZE);
        const y = Math.floor((e.clientY - rect.top) / CELL_SIZE);
        if (x >= 0 && x < GRID_COLS && y >= 0 && y < GRID_ROWS) {
            return { x, y };
        }
        return null;
    }

    handleClick(e) {
        if (this.gameOver || this.gameWon) return;

        const cell = this.getCell(e);
        if (!cell) return;

        if (this.flagged[cell.y][cell.x]) return;

        if (this.firstClick) {
            this.firstClick = false;
            this.placeMines(cell.x, cell.y);
            this.startTimer();
            this.updateStatus('JUGANDO');
        }

        this.reveal(cell.x, cell.y);
        this.draw();
        this.checkWin();
    }

    handleRightClick(e) {
        if (this.gameOver || this.gameWon || this.firstClick) return;

        const cell = this.getCell(e);
        if (!cell) return;

        if (this.revealed[cell.y][cell.x]) return;

        this.flagged[cell.y][cell.x] = !this.flagged[cell.y][cell.x];
        this.minesRemaining += this.flagged[cell.y][cell.x] ? -1 : 1;
        if (window.AudioManager) AudioManager.play('flag');
        this.updateUI();
        this.draw();
    }

    reveal(x, y) {
        if (x < 0 || x >= GRID_COLS || y < 0 || y >= GRID_ROWS) return;
        if (this.revealed[y][x] || this.flagged[y][x]) return;

        this.revealed[y][x] = true;
        if (window.AudioManager) AudioManager.play('reveal');

        if (this.grid[y][x] === -1) {
            this.gameOver = true;
            this.revealAll();
            this.stopTimer();
            this.updateStatus('BOOM!');
            if (window.AudioManager) AudioManager.play('explosion');
            return;
        }

        // Auto-reveal adjacent if 0
        if (this.grid[y][x] === 0) {
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    this.reveal(x + dx, y + dy);
                }
            }
        }
    }

    revealAll() {
        for (let y = 0; y < GRID_ROWS; y++) {
            for (let x = 0; x < GRID_COLS; x++) {
                this.revealed[y][x] = true;
            }
        }
    }

    checkWin() {
        if (this.gameOver) return;

        let hiddenCount = 0;
        for (let y = 0; y < GRID_ROWS; y++) {
            for (let x = 0; x < GRID_COLS; x++) {
                if (!this.revealed[y][x]) hiddenCount++;
            }
        }

        if (hiddenCount === MINE_COUNT) {
            this.gameWon = true;
            this.stopTimer();
            this.updateStatus('GANASTE!');
            if (window.AudioManager) AudioManager.play('win');
            this.draw();
        }
    }

    reset() {
        this.stopTimer();
        this.createGrid();
        this.gameOver = false;
        this.gameWon = false;
        this.firstClick = true;
        this.minesRemaining = MINE_COUNT;
        document.getElementById('time').textContent = '0';
        this.updateStatus('LISTO');
        this.updateUI();
        this.draw();
    }

    startTimer() {
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            document.getElementById('time').textContent = elapsed;
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    draw() {
        const ctx = this.ctx;

        // Background
        ctx.fillStyle = COLORS.background;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw cells
        for (let y = 0; y < GRID_ROWS; y++) {
            for (let x = 0; x < GRID_COLS; x++) {
                this.drawCell(x, y);
            }
        }

        // Win/Lose overlay
        if (this.gameOver || this.gameWon) {
            ctx.fillStyle = 'rgba(15, 56, 15, 0.7)';
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            ctx.fillStyle = '#9bbc0f';
            ctx.font = 'bold 12px "Press Start 2P", monospace';
            ctx.textAlign = 'center';
            ctx.fillText(this.gameWon ? 'GANASTE!' : 'BOOM!', this.canvas.width / 2, this.canvas.height / 2 - 10);
            ctx.font = '8px "Press Start 2P", monospace';
            ctx.fillText('R: Reiniciar', this.canvas.width / 2, this.canvas.height / 2 + 20);
        }
    }

    drawCell(x, y) {
        const ctx = this.ctx;
        const px = x * CELL_SIZE;
        const py = y * CELL_SIZE;
        const padding = 1;

        if (this.revealed[y][x]) {
            // Revealed cell
            ctx.fillStyle = COLORS.revealed;
            ctx.fillRect(px + padding, py + padding, CELL_SIZE - padding * 2, CELL_SIZE - padding * 2);

            const value = this.grid[y][x];
            if (value === -1) {
                // Mine
                ctx.fillStyle = COLORS.mine;
                ctx.beginPath();
                ctx.arc(px + CELL_SIZE / 2, py + CELL_SIZE / 2, 6, 0, Math.PI * 2);
                ctx.fill();
                // Spikes
                ctx.strokeStyle = COLORS.mine;
                ctx.lineWidth = 2;
                for (let i = 0; i < 4; i++) {
                    const angle = (i * Math.PI) / 2;
                    ctx.beginPath();
                    ctx.moveTo(px + CELL_SIZE / 2, py + CELL_SIZE / 2);
                    ctx.lineTo(
                        px + CELL_SIZE / 2 + Math.cos(angle) * 9,
                        py + CELL_SIZE / 2 + Math.sin(angle) * 9
                    );
                    ctx.stroke();
                }
            } else if (value > 0) {
                // Number
                ctx.fillStyle = COLORS.numbers[value - 1];
                ctx.font = 'bold 14px "Press Start 2P", monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(value.toString(), px + CELL_SIZE / 2, py + CELL_SIZE / 2 + 1);
            }
        } else {
            // Hidden cell
            ctx.fillStyle = COLORS.hidden;
            ctx.fillRect(px + padding, py + padding, CELL_SIZE - padding * 2, CELL_SIZE - padding * 2);

            // 3D effect
            ctx.fillStyle = COLORS.hiddenLight;
            ctx.fillRect(px + padding, py + padding, CELL_SIZE - padding * 2, 2);
            ctx.fillRect(px + padding, py + padding, 2, CELL_SIZE - padding * 2);

            // Flag
            if (this.flagged[y][x]) {
                ctx.fillStyle = COLORS.flag;
                // Flag pole
                ctx.fillRect(px + CELL_SIZE / 2 - 1, py + 5, 2, CELL_SIZE - 10);
                // Flag
                ctx.beginPath();
                ctx.moveTo(px + CELL_SIZE / 2 + 1, py + 5);
                ctx.lineTo(px + CELL_SIZE / 2 + 8, py + 9);
                ctx.lineTo(px + CELL_SIZE / 2 + 1, py + 13);
                ctx.closePath();
                ctx.fill();
            }
        }

        // Border
        ctx.strokeStyle = COLORS.border;
        ctx.lineWidth = 1;
        ctx.strokeRect(px + 0.5, py + 0.5, CELL_SIZE - 1, CELL_SIZE - 1);
    }

    updateUI() {
        document.getElementById('mines').textContent = this.minesRemaining;
    }

    updateStatus(text) {
        document.getElementById('status').textContent = text;
    }
}

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game-canvas');
    new MinesweeperGame(canvas);
});
