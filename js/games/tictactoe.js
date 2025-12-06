export function init(container, game) {
    // Game State
    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let gameActive = false; // Wait for name
    let playerName = 'Player';

    // Winning Conditions
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    // Styles
    const styles = `
        <style>
            .ttt-board {
                display: grid;
                grid-template-columns: repeat(3, 100px);
                grid-template-rows: repeat(3, 100px);
                gap: 10px;
                margin: 20px auto;
            }
            .ttt-cell {
                width: 100px;
                height: 100px;
                background-color: var(--card-bg); /* Use global variable */
                border: 2px solid var(--border-color);
                border-radius: 8px;
                font-size: 3rem;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                color: var(--text-primary);
                transition: background-color 0.2s, color 0.2s;
            }
            .ttt-cell:hover {
                background-color: var(--border-color);
            }
            .ttt-cell.x {
                color: var(--accent-color);
            }
            .ttt-cell.o {
                color: var(--success-color);
            }
            .status-display {
                font-size: 1.5rem;
                margin-bottom: 20px;
                font-weight: bold;
            }
            /* Modal Styles */
            .modal-overlay {
                position: absolute;
                top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(15, 23, 42, 0.95);
                display: flex; justify-content: center; align-items: center;
                z-index: 10;
                border-radius: 1rem;
            }
            .modal-content {
                background: var(--card-bg);
                padding: 2rem;
                border-radius: 1rem;
                text-align: center;
                border: 1px solid var(--border-color);
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5);
                min-width: 300px;
            }
            .modal-content h3 {
                margin-bottom: 1rem;
                color: var(--text-primary);
            }
            .modal-content input {
                padding: 0.75rem;
                margin: 1rem 0;
                border-radius: 0.5rem;
                border: 1px solid var(--border-color);
                background: var(--bg-color);
                color: white;
                font-size: 1rem;
                width: 100%;
            }
        </style>
    `;

    // Render Initial HTML
    container.innerHTML = `
        ${styles}
        <div class="game-container" style="position: relative;">
            <div id="nameModal" class="modal-overlay">
                <div class="modal-content">
                    <h3>Enter Your Name</h3>
                    <input type="text" id="playerNameInput" placeholder="Your Name" maxlength="12" autocomplete="off">
                    <br>
                    <button id="startGameBtn" class="btn btn-primary" style="width: 100%">Start Game</button>
                    <p style="margin-top: 10px; font-size: 0.8rem; color: var(--text-secondary);">First turn is random!</p>
                </div>
            </div>

            <div class="game-header">
                <h2>${game.title}</h2>
                <p>Hard Mode: Unbeatable AI</p>
            </div>
            
            <div class="game-area">
                <div class="status-display" id="status">Waiting for player...</div>
                <div class="ttt-board" id="board">
                    ${board.map((cell, index) => `
                        <div class="ttt-cell" data-index="${index}"></div>
                    `).join('')}
                </div>
                <br>
                <button id="resetBtn" class="btn btn-outline">Reset Game</button>
            </div>
        </div>
    `;

    // Elements
    const statusDisplay = container.querySelector('#status');
    const cells = container.querySelectorAll('.ttt-cell');
    const resetBtn = container.querySelector('#resetBtn');

    // Modal Elements
    const modal = container.querySelector('#nameModal');
    const nameInput = container.querySelector('#playerNameInput');
    const startBtn = container.querySelector('#startGameBtn');

    // Start Game logic
    startBtn.addEventListener('click', () => {
        const inputName = nameInput.value.trim();
        if (inputName) {
            playerName = inputName;
        }
        modal.style.display = 'none';
        startGameSession();
    });

    nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') startBtn.click();
    });

    function startGameSession() {
        gameActive = true;
        // Randomly decide who starts
        currentPlayer = Math.random() < 0.5 ? 'X' : 'O';

        // Reset Visuals
        cells.forEach(cell => {
            cell.innerText = '';
            cell.classList.remove('x', 'o');
        });
        board = ['', '', '', '', '', '', '', '', ''];

        updateStatus();

        if (currentPlayer === 'O') {
            computerMove();
        }
    }

    // Helper to get current display name
    const getCurrentName = () => currentPlayer === 'X' ? playerName : 'Computer';

    function updateStatus() {
        if (!gameActive) return;

        if (currentPlayer === 'O') {
            statusDisplay.innerText = "Computer is thinking...";
            statusDisplay.style.color = 'var(--text-primary)';
        } else {
            statusDisplay.innerText = `${getCurrentName()}'s Turn`;
            statusDisplay.style.color = 'var(--text-primary)';
        }
    }

    // Handle Cell Click
    function handleCellClick(clickedCellEvent) {
        const clickedCell = clickedCellEvent.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

        if (board[clickedCellIndex] !== '' || !gameActive || currentPlayer === 'O') {
            return;
        }

        handleCellPlayed(clickedCell, clickedCellIndex);
        handleResultValidation();
    }

    function handleCellPlayed(clickedCell, clickedCellIndex) {
        board[clickedCellIndex] = currentPlayer;
        clickedCell.innerText = currentPlayer;
        clickedCell.classList.add(currentPlayer.toLowerCase()); // for color styling
    }

    function handleResultValidation() {
        let roundWon = false;
        for (let i = 0; i <= 7; i++) {
            const winCondition = winningConditions[i];
            const a = board[winCondition[0]];
            const b = board[winCondition[1]];
            const c = board[winCondition[2]];

            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            statusDisplay.innerText = `${getCurrentName()} Wins!`;
            statusDisplay.style.color = currentPlayer === 'X' ? 'var(--accent-color)' : 'var(--success-color)';
            gameActive = false;
            return;
        }

        const roundDraw = !board.includes('');
        if (roundDraw) {
            statusDisplay.innerText = `It's a Draw!`;
            statusDisplay.style.color = 'var(--text-secondary)';
            gameActive = false;
            return;
        }

        handlePlayerChange();
    }

    function handlePlayerChange() {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateStatus();

        if (currentPlayer === 'O') {
            computerMove();
        }
    }

    function handleRestartGame() {
        startGameSession();
    }

    // Event Listeners
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    resetBtn.addEventListener('click', handleRestartGame);

    // --- Minimax AI Logic ---
    function computerMove() {
        if (!gameActive) return;

        setTimeout(() => {
            if (!gameActive) return;

            let bestScore = -Infinity;
            let move;

            // Optimization: If board is empty, pick center or corner random to save calc
            const emptyCells = board.filter(c => c === '').length;
            if (emptyCells === 9) {
                const starters = [0, 2, 4, 6, 8];
                move = starters[Math.floor(Math.random() * starters.length)];
            } else {
                for (let i = 0; i < 9; i++) {
                    if (board[i] === '') {
                        board[i] = 'O';
                        let score = minimax(board, 0, false);
                        board[i] = '';
                        if (score > bestScore) {
                            bestScore = score;
                            move = i;
                        }
                    }
                }
            }

            const cell = container.querySelector(`.ttt-cell[data-index="${move}"]`);
            handleCellPlayed(cell, move);
            handleResultValidation();
        }, 600);
    }

    const scores = {
        'O': 10,
        'X': -10,
        'tie': 0
    };

    function minimax(board, depth, isMaximizing) {
        let result = checkWinner();
        if (result !== null) {
            return scores[result];
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'O';
                    let score = minimax(board, depth + 1, false);
                    board[i] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'X';
                    let score = minimax(board, depth + 1, true);
                    board[i] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }

    function checkWinner() {
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        if (!board.includes('')) {
            return 'tie';
        }
        return null;
    }

    // Focus input on load
    nameInput.focus();
}
