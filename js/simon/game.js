/**
 * Simon Game - Memory sequence game
 */

// Constants
const COLORS = {
    green: { normal: '#306230', bright: '#9bbc0f', dark: '#0f380f' },
    red: { normal: '#5a3030', bright: '#8b5050', dark: '#2a1515' },
    yellow: { normal: '#5a5a30', bright: '#8b8b50', dark: '#2a2a15' },
    blue: { normal: '#303050', bright: '#505080', dark: '#151525' }
};

const QUADRANTS = ['green', 'red', 'yellow', 'blue'];
const FLASH_DURATION = 400;
const PAUSE_BETWEEN = 200;
const HIGHSCORE_KEY = 'simon_highscore';

class SimonGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.size = 240;
        this.canvas.width = this.size;
        this.canvas.height = this.size;

        this.sequence = [];
        this.playerSequence = [];
        this.round = 0;
        this.isPlaying = false;
        this.isShowingSequence = false;
        this.gameOver = false;
        this.activeQuadrant = null;
        this.highscore = this.loadHighscore();

        this.init();
    }

    init() {
        this.bindEvents();
        this.updateUI();
        this.draw();
    }

    bindEvents() {
        // Mouse click
        this.canvas.addEventListener('click', (e) => this.handleClick(e));

        // Keyboard
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Enter' && !this.isPlaying && !this.isShowingSequence) {
                this.startGame();
            } else if (e.code === 'KeyR') {
                this.reset();
            } else if (e.code === 'Escape') {
                window.location.href = 'index.html';
            }
        });
    }

    handleClick(e) {
        if (this.isShowingSequence || this.gameOver) return;
        if (!this.isPlaying) {
            this.startGame();
            return;
        }

        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const quadrant = this.getQuadrant(x, y);
        if (quadrant) {
            this.playerInput(quadrant);
        }
    }

    getQuadrant(x, y) {
        const half = this.size / 2;
        const margin = 10;

        // Check if click is in the gap
        if (Math.abs(x - half) < margin || Math.abs(y - half) < margin) {
            return null;
        }

        if (x < half && y < half) return 'green';
        if (x >= half && y < half) return 'red';
        if (x < half && y >= half) return 'yellow';
        if (x >= half && y >= half) return 'blue';
        return null;
    }

    startGame() {
        this.sequence = [];
        this.round = 0;
        this.gameOver = false;
        this.isPlaying = true;
        this.updateStatus('JUGANDO');
        if (window.AudioManager) AudioManager.play('start');
        this.nextRound();
    }

    nextRound() {
        this.round++;
        this.playerSequence = [];

        // Add random color to sequence
        const randomColor = QUADRANTS[Math.floor(Math.random() * 4)];
        this.sequence.push(randomColor);

        this.updateUI();
        this.showSequence();
    }

    async showSequence() {
        this.isShowingSequence = true;
        this.updateStatus('MIRA...');

        await this.sleep(500);

        for (let i = 0; i < this.sequence.length; i++) {
            await this.flashQuadrant(this.sequence[i]);
            await this.sleep(PAUSE_BETWEEN);
        }

        this.isShowingSequence = false;
        this.updateStatus('TU TURNO');
    }

    async flashQuadrant(color) {
        this.activeQuadrant = color;
        this.draw();
        // Play color-specific sound
        if (window.AudioManager) {
            const soundMap = {
                'green': 'simonGreen',
                'red': 'simonRed',
                'yellow': 'simonYellow',
                'blue': 'simonBlue'
            };
            AudioManager.play(soundMap[color]);
        }
        await this.sleep(FLASH_DURATION);
        this.activeQuadrant = null;
        this.draw();
    }

    playerInput(color) {
        this.flashQuadrant(color);
        this.playerSequence.push(color);

        const currentIndex = this.playerSequence.length - 1;

        // Check if correct
        if (this.playerSequence[currentIndex] !== this.sequence[currentIndex]) {
            this.endGame();
            return;
        }

        // Check if sequence complete
        if (this.playerSequence.length === this.sequence.length) {
            this.updateStatus('CORRECTO!');
            if (window.AudioManager) AudioManager.play('simonSuccess');
            setTimeout(() => this.nextRound(), 1000);
        }
    }

    endGame() {
        this.gameOver = true;
        this.isPlaying = false;
        this.updateStatus('GAME OVER');
        if (window.AudioManager) AudioManager.play('simonError');
        this.saveHighscore();
        this.draw();
    }

    reset() {
        this.sequence = [];
        this.playerSequence = [];
        this.round = 0;
        this.isPlaying = false;
        this.isShowingSequence = false;
        this.gameOver = false;
        this.activeQuadrant = null;
        this.updateStatus('LISTO');
        this.updateUI();
        this.draw();
    }

    draw() {
        const ctx = this.ctx;
        const half = this.size / 2;
        const gap = 6;
        const radius = 20;

        // Background
        ctx.fillStyle = '#8bac0f';
        ctx.fillRect(0, 0, this.size, this.size);

        // Draw quadrants
        this.drawQuadrant(0, 0, half - gap, half - gap, 'green', radius);
        this.drawQuadrant(half + gap, 0, half - gap, half - gap, 'red', radius);
        this.drawQuadrant(0, half + gap, half - gap, half - gap, 'yellow', radius);
        this.drawQuadrant(half + gap, half + gap, half - gap, half - gap, 'blue', radius);

        // Game over overlay
        if (this.gameOver) {
            ctx.fillStyle = 'rgba(15, 56, 15, 0.8)';
            ctx.fillRect(0, 0, this.size, this.size);

            ctx.fillStyle = '#9bbc0f';
            ctx.font = 'bold 14px "Press Start 2P", monospace';
            ctx.textAlign = 'center';
            ctx.fillText('GAME OVER', this.size / 2, this.size / 2 - 20);
            ctx.font = '10px "Press Start 2P", monospace';
            ctx.fillText('Ronda: ' + this.round, this.size / 2, this.size / 2 + 10);
            ctx.font = '8px "Press Start 2P", monospace';
            ctx.fillText('ENTER: Reiniciar', this.size / 2, this.size / 2 + 40);
        }
    }

    drawQuadrant(x, y, w, h, color, radius) {
        const ctx = this.ctx;
        const isActive = this.activeQuadrant === color;
        const colorSet = COLORS[color];

        ctx.fillStyle = isActive ? colorSet.bright : colorSet.normal;

        // Rounded rectangle
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + w - radius, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
        ctx.lineTo(x + w, y + h - radius);
        ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
        ctx.lineTo(x + radius, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();

        // Inner shadow/highlight
        ctx.strokeStyle = isActive ? colorSet.normal : colorSet.dark;
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    updateUI() {
        document.getElementById('round').textContent = this.round;
        document.getElementById('highscore').textContent = this.highscore;
    }

    updateStatus(text) {
        document.getElementById('status').textContent = text;
    }

    loadHighscore() {
        const saved = localStorage.getItem(HIGHSCORE_KEY);
        return saved ? parseInt(saved, 10) : 0;
    }

    saveHighscore() {
        if (this.round > this.highscore) {
            this.highscore = this.round;
            localStorage.setItem(HIGHSCORE_KEY, this.highscore.toString());
            document.getElementById('highscore').textContent = this.highscore;
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game-canvas');
    new SimonGame(canvas);
});
