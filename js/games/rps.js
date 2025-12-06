export function init(container, game) {
    let scores = { wins: 0, losses: 0, draws: 0 };

    const styles = `
        <style>
            .rps-choices {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                gap: 20px;
                margin-top: 2rem;
            }
            .rps-btn {
                width: 100px;
                height: 100px;
                font-size: 3rem;
                background-color: var(--card-bg);
                border: 2px solid var(--border-color);
                border-radius: 50%;
                cursor: pointer;
                transition: transform 0.2s, background-color 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .rps-btn:hover {
                transform: scale(1.1);
                border-color: var(--accent-color);
                background-color: var(--border-color);
            }
            .rps-result-area {
                margin-top: 2rem;
                min-height: 120px;
            }
            .rps-score-board {
                display: flex;
                justify-content: space-around;
                width: 100%;
                margin-bottom: 2rem;
                padding: 1rem;
                background: rgba(0,0,0,0.2);
                border-radius: 0.5rem;
            }
            .score-item span {
                display: block;
                font-size: 1.5rem;
                font-weight: bold;
            }
            .result-text {
                font-size: 1.25rem;
                margin: 0.5rem 0;
            }
            .choice-display {
                font-size: 2rem;
                margin: 0 10px;
            }
        </style>
    `;

    container.innerHTML = `
        ${styles}
        <div class="game-container">
            <div class="game-header">
                <h2>${game.title}</h2>
                <p>${game.description}</p>
            </div>
            
            <div class="game-area">
                <div class="rps-score-board">
                    <div class="score-item" style="color: var(--success-color)">Wins <span id="wins">0</span></div>
                    <div class="score-item" style="color: var(--text-secondary)">Draws <span id="draws">0</span></div>
                    <div class="score-item" style="color: var(--danger-color)">Losses <span id="losses">0</span></div>
                </div>

                <div class="rps-result-area" id="result-area">
                    <p>Choose your weapon!</p>
                </div>

                <div class="rps-choices">
                    <button class="rps-btn" data-choice="rock">🪨</button>
                    <button class="rps-btn" data-choice="paper">📄</button>
                    <button class="rps-btn" data-choice="scissors">✂️</button>
                </div>
            </div>
        </div>
    `;

    const resultArea = container.querySelector('#result-area');
    const winsDisplay = container.querySelector('#wins');
    const drawsDisplay = container.querySelector('#draws');
    const lossesDisplay = container.querySelector('#losses');
    const buttons = container.querySelectorAll('.rps-btn');

    const choices = ['rock', 'paper', 'scissors'];
    const icons = { rock: '🪨', paper: '📄', scissors: '✂️' };

    function playRound(playerChoice) {
        const computerChoice = choices[Math.floor(Math.random() * choices.length)];
        let result = '';
        let color = '';

        if (playerChoice === computerChoice) {
            result = "It's a Draw!";
            scores.draws++;
            color = 'var(--text-secondary)';
        } else if (
            (playerChoice === 'rock' && computerChoice === 'scissors') ||
            (playerChoice === 'paper' && computerChoice === 'rock') ||
            (playerChoice === 'scissors' && computerChoice === 'paper')
        ) {
            result = "You Win!";
            scores.wins++;
            color = 'var(--success-color)';
        } else {
            result = "Computer Wins!";
            scores.losses++;
            color = 'var(--danger-color)';
        }

        updateUI(playerChoice, computerChoice, result, color);
    }

    function updateUI(player, computer, resultText, color) {
        winsDisplay.innerText = scores.wins;
        drawsDisplay.innerText = scores.draws;
        lossesDisplay.innerText = scores.losses;

        resultArea.innerHTML = `
            <div class="result-text">
                <span class="choice-display">${icons[player]}</span>
                vs
                <span class="choice-display">${icons[computer]}</span>
            </div>
            <h3 style="color: ${color}; font-size: 1.5rem;">${resultText}</h3>
        `;
    }

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            playRound(btn.dataset.choice);
        });
    });
}
