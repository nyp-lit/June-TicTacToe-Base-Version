// ==============================
// 1. Initialize Socket.IO client
// ==============================


// ==============================
// 2. Get DOM elements from the page
// ==============================
const player1Input = document.getElementById('player1'); // Input field for Player 1 name
const player2Input = document.getElementById('player2'); // Input field for Player 2 name
const xColorPicker = document.getElementById('xColor'); // Color picker for 'X' symbol
const oColorPicker = document.getElementById('oColor'); // Color picker for 'O' symbol
const boardColorPicker = document.getElementById('boardColor'); // Color picker for board background
const gameBoard = document.getElementById('board'); // Container for the 3x3 game grid
const scoreXElement = document.getElementById('scoreX'); // Score display for Player X
const scoreOElement = document.getElementById('scoreO'); // Score display for Player O

// ==============================
// 3. Game State Variables
// ==============================
let currentPlayerLocal = "X"; // Local variable to track current player (updated by server)
let players = { X: "Player 1", O: "Player 2" }; // Object to store player names
let currentScores = { X: 0, O: 0 }; // Scoreboard for both players (updated from server)

// ==============================
// 4. Emit Events to Server
// ==============================
/**
 * Start the game by sending player names to the server.
 */
function startGame() {
    const p1Name = player1Input.value || "Player 1 (X)"; // get player 1's name
    const p2Name = player2Input.value || "Player 2 (O)"; // get player 2's name
    socket.emit('startGame', { player1: p1Name, player2: p2Name }); // emit the startGame event to the server
    alert(`Game has started!\n${p1Name} (X) vs ${p2Name} (O)`); // show popup message
}

/**
 * Sends a move to the server when a cell is clicked.
 * @param {number} index - Cell index (0 to 8).
 */
function playMove(index) {
    // Emit the playMove event to the server with the cell index and current player
    socket.emit('playMove', { index: index, player: currentPlayerLocal });
}

/**
 * (Continue from here!)
 */


// =================================
// 5. Handle Game Updates from Server
// =================================
/**
 * Receives updates from server and updates the UI accordingly.
 * @param {object} data - Contains board, players, scores, game status, etc.
 */
socket.on('gameUpdate', (data) => {
    const { board, currentPlayer, gameActive, winner, draw, players: updatedPlayers, scores: serverScores } = data;

    // Sync game state variables with server data
    currentPlayerLocal = currentPlayer;
    players = updatedPlayers;
    currentScores = serverScores; // Update scores from the server

    // Update input placeholders and score displays (continue from here)


    // ==============================
    // 6. Display Game Status
    // ==============================
    let statusMessage = '';
    if (winner) {
        statusMessage = `${players[winner]} (${winner}) wins!`;
        setTimeout(() => alert(statusMessage), 100); // Delay helps UI feel smoother
    } else if (draw) {
        statusMessage = "It's a draw!";
        setTimeout(() => alert(statusMessage), 100);
    } else if (gameActive) {
        statusMessage = `Current Turn: ${players[currentPlayer]} (${currentPlayer})`;
        console.log(statusMessage); // For debugging
    } else {
        statusMessage = "Game not active. Click 'Start Game' to begin!";
        console.log(statusMessage);
    }

    // Disable board interaction if game is over
    if (!gameActive || winner || draw) {
        gameBoard.classList.add('disabled');
    } else {
        gameBoard.classList.remove('disabled');
    }

});

// ==============================
// 7. Initial Setup on Page Load
// ==============================
document.addEventListener('DOMContentLoaded', () => {
    // Set initial board and symbol colors from pickers
    document.documentElement.style.setProperty('--x-color', xColorPicker.value);
    document.documentElement.style.setProperty('--o-color', oColorPicker.value);
    document.documentElement.style.setProperty('--board-bg', boardColorPicker.value);

    // Live update colors as user changes them
    xColorPicker.addEventListener('input', (event) => {
        document.documentElement.style.setProperty('--x-color', event.target.value);
    });
    oColorPicker.addEventListener('input', (event) => {
        document.documentElement.style.setProperty('--o-color', event.target.value);
    });
    boardColorPicker.addEventListener('input', (event) => {
        document.documentElement.style.setProperty('--board-bg', event.target.value);
    });

    // No need to manually request game state — server sends it on connection
});

// =========================================
// 8. Floating X and O Background Symbols (optional)
// =========================================
const container = document.getElementById('floating-container'); // Background animation container
const symbols = ['X', 'O']; // Symbols to float
const total = 20; // Number of floating elements

for (let i = 0; i < total; i++) {
    const span = document.createElement('div'); // Create floating div
    const symbol = symbols[Math.floor(Math.random() * symbols.length)]; // Randomly pick X or O
    span.textContent = symbol;

    // Add classes for styling and animation
    span.classList.add('floating');
    span.classList.add(symbol === 'X' ? 'floating-x' : 'floating-o');

    // Set random position
    const top = Math.random() * 90;
    const left = Math.random() * 95;
    span.style.top = `${top}%`;
    span.style.left = `${left}%`;

    // Set random animation speed and delay
    span.style.animationDuration = `${3 + Math.random() * 3}s`;
    span.style.animationDelay = `${Math.random() * 2}s`;

    container.appendChild(span); // Add to container
}
