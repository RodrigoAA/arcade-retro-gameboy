// Game dimensions
const GRID_SIZE = 20;
const CELL_SIZE = 12;
const CANVAS_SIZE = GRID_SIZE * CELL_SIZE;

// Game Boy color palette
const COLORS = {
    background: '#9bbc0f',
    boardBg: '#8bac0f',
    gridLine: '#7a9c0f',
    snake: '#0f380f',
    snakeHead: '#0f380f',
    food: '#306230',
    text: '#0f380f',
    border: '#0f380f'
};

// Directions
const DIRECTION = {
    UP: { x: 0, y: -1 },
    DOWN: { x: 0, y: 1 },
    LEFT: { x: -1, y: 0 },
    RIGHT: { x: 1, y: 0 }
};

// Game speeds per level (milliseconds between moves)
// 10 levels - speed increases as you progress
const LEVEL_SPEEDS = [
    200,  // Level 1
    180,  // Level 2
    160,  // Level 3
    140,  // Level 4
    120,  // Level 5
    100,  // Level 6
    85,   // Level 7
    70,   // Level 8
    55,   // Level 9
    40    // Level 10
];

// Points per food eaten (multiplied by level)
const POINTS_PER_FOOD = 10;

// Food eaten to level up
const FOOD_PER_LEVEL = 5;

// Local storage key for high score
const HIGHSCORE_KEY = 'snake_highscore';
