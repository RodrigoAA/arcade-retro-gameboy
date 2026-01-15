// Game dimensions
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 24;
const PREVIEW_BLOCK_SIZE = 16;

// Game Boy color palette
const COLORS = {
    background: '#9bbc0f',
    boardBg: '#8bac0f',
    gridLine: '#7a9c0f',
    piece: '#0f380f',
    ghost: '#306230',
    text: '#0f380f',
    border: '#0f380f',
    highlight: '#9bbc0f',
    shadow: '#306230'
};

// Scoring system (based on original Nintendo scoring)
const POINTS = {
    single: 100,
    double: 300,
    triple: 500,
    tetris: 800,
    softDrop: 1,
    hardDrop: 2
};

// Level speeds in milliseconds (faster as level increases)
// 20 levels - speed increases progressively
const LEVEL_SPEEDS = [
    800, 720, 630, 550, 470,  // Levels 0-4
    380, 300, 220, 130, 100,  // Levels 5-9
    80, 80, 80, 70, 70,       // Levels 10-14
    70, 50, 50, 50, 30        // Levels 15-19
];

// Lines required to level up
const LINES_PER_LEVEL = 10;

// Key repeat settings
const KEY_REPEAT_DELAY = 170;
const KEY_REPEAT_INTERVAL = 50;
