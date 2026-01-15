// Tetromino definitions
// Each piece is defined as a 2D matrix where 1 = filled, 0 = empty

const TETROMINOS = {
    I: {
        shape: [
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        color: 'I'
    },
    O: {
        shape: [
            [1, 1],
            [1, 1]
        ],
        color: 'O'
    },
    T: {
        shape: [
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 0]
        ],
        color: 'T'
    },
    S: {
        shape: [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0]
        ],
        color: 'S'
    },
    Z: {
        shape: [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0]
        ],
        color: 'Z'
    },
    J: {
        shape: [
            [1, 0, 0],
            [1, 1, 1],
            [0, 0, 0]
        ],
        color: 'J'
    },
    L: {
        shape: [
            [0, 0, 1],
            [1, 1, 1],
            [0, 0, 0]
        ],
        color: 'L'
    }
};

// Piece types for random selection
const PIECE_TYPES = Object.keys(TETROMINOS);

/**
 * Rotate a matrix 90 degrees clockwise
 * @param {Array} matrix - 2D array to rotate
 * @returns {Array} - Rotated matrix
 */
function rotateMatrix(matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const rotated = [];

    for (let col = 0; col < cols; col++) {
        rotated[col] = [];
        for (let row = rows - 1; row >= 0; row--) {
            rotated[col].push(matrix[row][col]);
        }
    }

    return rotated;
}

/**
 * Rotate a matrix 90 degrees counter-clockwise
 * @param {Array} matrix - 2D array to rotate
 * @returns {Array} - Rotated matrix
 */
function rotateMatrixCCW(matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const rotated = [];

    for (let col = cols - 1; col >= 0; col--) {
        rotated[cols - 1 - col] = [];
        for (let row = 0; row < rows; row++) {
            rotated[cols - 1 - col].push(matrix[row][col]);
        }
    }

    return rotated;
}

/**
 * Get a random piece type
 * @returns {string} - Random piece type (I, O, T, S, Z, J, or L)
 */
function getRandomPieceType() {
    const index = Math.floor(Math.random() * PIECE_TYPES.length);
    return PIECE_TYPES[index];
}

/**
 * Create a new piece object
 * @param {string} type - Piece type
 * @returns {Object} - Piece object with shape, position, and color
 */
function createPiece(type) {
    const tetromino = TETROMINOS[type];
    const shape = tetromino.shape.map(row => [...row]);

    return {
        type: type,
        shape: shape,
        color: tetromino.color,
        x: Math.floor(COLS / 2) - Math.ceil(shape[0].length / 2),
        y: 0
    };
}

/**
 * Get a random new piece
 * @returns {Object} - New piece object
 */
function getRandomPiece() {
    return createPiece(getRandomPieceType());
}

/**
 * Clone a piece (deep copy)
 * @param {Object} piece - Piece to clone
 * @returns {Object} - Cloned piece
 */
function clonePiece(piece) {
    return {
        type: piece.type,
        shape: piece.shape.map(row => [...row]),
        color: piece.color,
        x: piece.x,
        y: piece.y
    };
}
