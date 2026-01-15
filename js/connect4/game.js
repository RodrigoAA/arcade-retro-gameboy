/**
 * Connect 4 Game - 4 in a row against CPU
 */

// Constants
const COLS = 7;
const ROWS = 6;
const CELL_SIZE = 32;
const EMPTY = 0;
const PLAYER = 1;
const CPU = 2;

const COLORS = {
    background: '#9bbc0f',
    board: '#306230',
    boardDark: '#0f380f',
    empty: '#8bac0f',
    player: '#0f380f',
    cpu: '#5a5a30',
    highlight: '#9bbc0f',
    text: '#0f380f'
};

class Connect4Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.canvas.width = COLS * CELL_SIZE;
        this.canvas.height = ROWS * CELL_SIZE;

        this.board = [];
        this.currentPlayer = PLAYER;
        this.gameOver = false;
        this.winner = null;
        this.winningCells = [];
        this.hoverColumn = -1;
        this.playerWins = 0;
        this.cpuWins = 0;
        this.isThinking = false;

        this.init();
    }

    init() {
        this.createBoard();
        this.bindEvents();
        this.draw();
        this.updateUI();
    }

    createBoard() {
        this.board = [];
        for (let y = 0; y < ROWS; y++) {
            this.board[y] = [];
            for (let x = 0; x < COLS; x++) {
                this.board[y][x] = EMPTY;
            }
        }
    }

    bindEvents() {
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleHover(e));
        this.canvas.addEventListener('mouseleave', () => {
            this.hoverColumn = -1;
            this.draw();
        });

        document.addEventListener('keydown', (e) => {
            if (e.code === 'KeyR') {
                this.reset();
            } else if (e.code === 'Escape') {
                window.location.href = 'index.html';
            }
        });
    }

    getColumn(e) {
        const rect = this.canvas.getBoundingClientRect();
        return Math.floor((e.clientX - rect.left) / CELL_SIZE);
    }

    handleHover(e) {
        if (this.gameOver || this.currentPlayer !== PLAYER || this.isThinking) return;
        const col = this.getColumn(e);
        if (col !== this.hoverColumn) {
            this.hoverColumn = col;
            this.draw();
        }
    }

    handleClick(e) {
        if (this.gameOver) {
            this.reset();
            return;
        }
        if (this.currentPlayer !== PLAYER || this.isThinking) return;

        const col = this.getColumn(e);
        if (this.dropPiece(col, PLAYER)) {
            if (window.AudioManager) AudioManager.play('dropChip');
            this.draw();
            if (!this.gameOver) {
                this.currentPlayer = CPU;
                this.updateUI();
                this.cpuTurn();
            }
        }
    }

    dropPiece(col, player) {
        if (col < 0 || col >= COLS) return false;

        // Find lowest empty row
        for (let row = ROWS - 1; row >= 0; row--) {
            if (this.board[row][col] === EMPTY) {
                this.board[row][col] = player;
                this.checkWin(col, row, player);
                return true;
            }
        }
        return false; // Column full
    }

    checkWin(col, row, player) {
        const directions = [
            [{ x: 1, y: 0 }, { x: -1, y: 0 }],   // Horizontal
            [{ x: 0, y: 1 }, { x: 0, y: -1 }],   // Vertical
            [{ x: 1, y: 1 }, { x: -1, y: -1 }],  // Diagonal \
            [{ x: 1, y: -1 }, { x: -1, y: 1 }]   // Diagonal /
        ];

        for (const [dir1, dir2] of directions) {
            const cells = [{ x: col, y: row }];

            // Count in both directions
            for (const dir of [dir1, dir2]) {
                let x = col + dir.x;
                let y = row + dir.y;
                while (x >= 0 && x < COLS && y >= 0 && y < ROWS && this.board[y][x] === player) {
                    cells.push({ x, y });
                    x += dir.x;
                    y += dir.y;
                }
            }

            if (cells.length >= 4) {
                this.gameOver = true;
                this.winner = player;
                this.winningCells = cells;
                if (player === PLAYER) {
                    this.playerWins++;
                    this.updateStatus('GANASTE!');
                    if (window.AudioManager) AudioManager.play('win');
                } else {
                    this.cpuWins++;
                    this.updateStatus('CPU GANA');
                    if (window.AudioManager) AudioManager.play('gameOver');
                }
                this.updateUI();
                return;
            }
        }

        // Check draw
        let full = true;
        for (let x = 0; x < COLS; x++) {
            if (this.board[0][x] === EMPTY) {
                full = false;
                break;
            }
        }
        if (full) {
            this.gameOver = true;
            this.updateStatus('EMPATE');
        }
    }

    cpuTurn() {
        this.isThinking = true;
        this.updateStatus('PENSANDO');

        setTimeout(() => {
            const col = this.getBestMove();
            this.dropPiece(col, CPU);
            if (window.AudioManager) AudioManager.play('dropChip');
            this.draw();

            if (!this.gameOver) {
                this.currentPlayer = PLAYER;
                this.updateStatus('TU TURNO');
            }
            this.isThinking = false;
            this.updateUI();
        }, 500);
    }

    getBestMove() {
        // Check for winning move
        for (let col = 0; col < COLS; col++) {
            const row = this.getNextRow(col);
            if (row !== -1) {
                this.board[row][col] = CPU;
                if (this.wouldWin(col, row, CPU)) {
                    this.board[row][col] = EMPTY;
                    return col;
                }
                this.board[row][col] = EMPTY;
            }
        }

        // Block player winning move
        for (let col = 0; col < COLS; col++) {
            const row = this.getNextRow(col);
            if (row !== -1) {
                this.board[row][col] = PLAYER;
                if (this.wouldWin(col, row, PLAYER)) {
                    this.board[row][col] = EMPTY;
                    return col;
                }
                this.board[row][col] = EMPTY;
            }
        }

        // Prefer center columns
        const preference = [3, 2, 4, 1, 5, 0, 6];
        for (const col of preference) {
            if (this.getNextRow(col) !== -1) {
                return col;
            }
        }

        return 0;
    }

    getNextRow(col) {
        for (let row = ROWS - 1; row >= 0; row--) {
            if (this.board[row][col] === EMPTY) return row;
        }
        return -1;
    }

    wouldWin(col, row, player) {
        const directions = [
            [{ x: 1, y: 0 }, { x: -1, y: 0 }],
            [{ x: 0, y: 1 }, { x: 0, y: -1 }],
            [{ x: 1, y: 1 }, { x: -1, y: -1 }],
            [{ x: 1, y: -1 }, { x: -1, y: 1 }]
        ];

        for (const [dir1, dir2] of directions) {
            let count = 1;
            for (const dir of [dir1, dir2]) {
                let x = col + dir.x;
                let y = row + dir.y;
                while (x >= 0 && x < COLS && y >= 0 && y < ROWS && this.board[y][x] === player) {
                    count++;
                    x += dir.x;
                    y += dir.y;
                }
            }
            if (count >= 4) return true;
        }
        return false;
    }

    reset() {
        this.createBoard();
        this.currentPlayer = PLAYER;
        this.gameOver = false;
        this.winner = null;
        this.winningCells = [];
        this.hoverColumn = -1;
        this.isThinking = false;
        this.updateStatus('TU TURNO');
        this.updateUI();
        this.draw();
    }

    draw() {
        const ctx = this.ctx;

        // Background
        ctx.fillStyle = COLORS.board;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw hover indicator
        if (this.hoverColumn >= 0 && !this.gameOver) {
            ctx.fillStyle = COLORS.highlight;
            ctx.globalAlpha = 0.3;
            ctx.fillRect(this.hoverColumn * CELL_SIZE, 0, CELL_SIZE, this.canvas.height);
            ctx.globalAlpha = 1;
        }

        // Draw cells
        for (let y = 0; y < ROWS; y++) {
            for (let x = 0; x < COLS; x++) {
                this.drawCell(x, y);
            }
        }

        // Highlight winning cells
        if (this.winningCells.length > 0) {
            ctx.strokeStyle = COLORS.highlight;
            ctx.lineWidth = 3;
            for (const cell of this.winningCells) {
                const px = cell.x * CELL_SIZE + CELL_SIZE / 2;
                const py = cell.y * CELL_SIZE + CELL_SIZE / 2;
                ctx.beginPath();
                ctx.arc(px, py, CELL_SIZE / 2 - 4, 0, Math.PI * 2);
                ctx.stroke();
            }
        }

        // Game over overlay
        if (this.gameOver) {
            ctx.fillStyle = 'rgba(15, 56, 15, 0.7)';
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            ctx.fillStyle = '#9bbc0f';
            ctx.font = 'bold 11px "Press Start 2P", monospace';
            ctx.textAlign = 'center';
            const msg = this.winner === PLAYER ? 'GANASTE!' : (this.winner === CPU ? 'CPU GANA' : 'EMPATE');
            ctx.fillText(msg, this.canvas.width / 2, this.canvas.height / 2 - 10);
            ctx.font = '8px "Press Start 2P", monospace';
            ctx.fillText('Click: Nueva', this.canvas.width / 2, this.canvas.height / 2 + 15);
        }
    }

    drawCell(x, y) {
        const ctx = this.ctx;
        const px = x * CELL_SIZE + CELL_SIZE / 2;
        const py = y * CELL_SIZE + CELL_SIZE / 2;
        const radius = CELL_SIZE / 2 - 4;

        // Cell background (hole)
        ctx.fillStyle = this.board[y][x] === EMPTY ? COLORS.empty :
            (this.board[y][x] === PLAYER ? COLORS.player : COLORS.cpu);

        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fill();

        // Border
        ctx.strokeStyle = COLORS.boardDark;
        ctx.lineWidth = 2;
        ctx.stroke();

        // 3D effect for pieces
        if (this.board[y][x] !== EMPTY) {
            ctx.fillStyle = this.board[y][x] === PLAYER ? COLORS.boardDark : '#8a8a50';
            ctx.beginPath();
            ctx.arc(px, py, radius - 4, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    updateUI() {
        document.getElementById('turn').textContent = this.currentPlayer === PLAYER ? 'TU' : 'CPU';
        document.getElementById('player-wins').textContent = this.playerWins;
        document.getElementById('cpu-wins').textContent = this.cpuWins;
    }

    updateStatus(text) {
        document.getElementById('status').textContent = text;
    }
}

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game-canvas');
    new Connect4Game(canvas);
});
