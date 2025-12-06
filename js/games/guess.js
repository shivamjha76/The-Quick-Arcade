export function init(container, game) {
    // Game State
    let currentLevel = 1; // 1: Easy, 2: Medium, 3: Hard
    let maxRange = 10;

    // Config
    const levels = {
        1: { name: 'Easy', range: 10 },
        2: { name: 'Medium', range: 20 },
        3: { name: 'Hard', range: 50 }
    };

    // Initial maxRange based on default level
    maxRange = levels[currentLevel].range;

    let targetNumber = generateNumber();
    let attempts = 0;
    let gameOver = false;

    // DOM Elements (declared top-level in init)
    let input, guessBtn, messageDisplay, attemptsDisplay, actionBtn, historyDisplay, levelDisplay, instructionText;

    const styles = `
        <style>
            .guess-input-area {
                display: flex;
                gap: 10px;
                justify-content: center;
                margin: 20px 0;
            }
            .guess-input {
                padding: 10px;
                font-size: 1.2rem;
                border: 2px solid var(--border-color);
                border-radius: 8px;
                background: var(--bg-color);
                color: var(--text-primary);
                width: 150px;
                text-align: center;
            }
            .guess-input:focus {
                outline: none;
                border-color: var(--accent-color);
            }
            .guess-message {
                font-size: 1.5rem;
                margin: 20px 0;
                min-height: 2rem;
            }
            .guess-attempts {
                color: var(--text-secondary);
                margin-bottom: 5px;
            }
            .level-display {
                color: var(--accent-color);
                font-size: 1.2rem;
                margin-bottom: 20px;
                font-weight: bold;
                text-transform: uppercase;
            }
            .history {
                margin-top: 20px;
                font-size: 0.9rem;
                color: var(--text-secondary);
                max-height: 100px;
                overflow-y: auto;
            }
        </style>
    `;

    function updateTemplate() {
        container.innerHTML = `
            ${styles}
            <div class="game-container">
                <div class="game-header">
                    <h2>${game.title}</h2>
                    <p id="instructionText">I'm thinking of a number between 1 and ${maxRange}.</p>
                </div>
                
                <div class="game-area">
                    <div class="level-display" id="levelDisplay">Level ${currentLevel}: ${levels[currentLevel].name}</div>
                    <div class="guess-attempts">Attempts: <span id="attempts">0</span></div>
                    
                    <div class="guess-message" id="message">Make your first guess!</div>

                    <div class="guess-input-area">
                        <input type="number" id="guessInput" class="guess-input" min="1" max="${maxRange}" placeholder="1-${maxRange}">
                        <button id="guessBtn" class="btn btn-primary">Guess</button>
                    </div>
                    
                    <button id="actionBtn" class="btn btn-outline" style="display: none;">Play Again</button>

                    <div class="history" id="history"></div>
                </div>
            </div>
        `;

        attachListeners();
    }

    // Initial Render
    updateTemplate();

    function attachListeners() {
        input = container.querySelector('#guessInput');
        guessBtn = container.querySelector('#guessBtn');
        messageDisplay = container.querySelector('#message');
        attemptsDisplay = container.querySelector('#attempts');
        actionBtn = container.querySelector('#actionBtn');
        historyDisplay = container.querySelector('#history');
        levelDisplay = container.querySelector('#levelDisplay');
        instructionText = container.querySelector('#instructionText');

        guessBtn.addEventListener('click', handleGuess);
        actionBtn.addEventListener('click', handleAction);

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleGuess();
        });

        // Focus
        input.focus();
    }

    function generateNumber() {
        maxRange = levels[currentLevel].range;
        return Math.floor(Math.random() * maxRange) + 1;
    }

    function handleGuess() {
        if (gameOver) return;

        const guess = parseInt(input.value);
        if (isNaN(guess) || guess < 1 || guess > maxRange) {
            setMessage(`Enter 1-${maxRange}`, 'var(--danger-color)');
            return;
        }

        attempts++;
        attemptsDisplay.innerText = attempts;

        const historyItem = document.createElement('span');
        historyItem.innerText = `${guess} `;
        historyDisplay.appendChild(historyItem);

        if (guess === targetNumber) {
            handleWin();
        } else if (guess < targetNumber) {
            setMessage('Too Low! Try Higher.', 'var(--accent-color)');
            input.value = '';
            input.focus();
        } else {
            setMessage('Too High! Try Lower.', 'var(--danger-color)');
            input.value = '';
            input.focus();
        }
    }

    function setMessage(msg, color) {
        messageDisplay.innerText = msg;
        messageDisplay.style.color = color || 'var(--text-primary)';
    }

    function handleWin() {
        gameOver = true;
        setMessage(`Correct! Number was ${targetNumber}.`, 'var(--success-color)');
        input.disabled = true;
        guessBtn.disabled = true;

        // Decide button text
        actionBtn.style.display = 'inline-block';
        if (currentLevel < 3) {
            actionBtn.innerText = "Next Level >>";
            actionBtn.className = "btn btn-primary"; // Highlight
        } else {
            actionBtn.innerText = "Game Completed! Restart?";
            actionBtn.className = "btn btn-outline";
        }
    }

    function handleAction() {
        if (currentLevel < 3) {
            // Next Level
            currentLevel++;
            startLevel();
        } else {
            // Restart from Level 1
            currentLevel = 1;
            startLevel();
        }
    }

    function startLevel() {
        gameOver = false;
        attempts = 0;
        targetNumber = generateNumber(); // Uses new currentLevel

        // Update UI
        updateTemplate(); // Re-renders to update placeholders and text
    }
}
