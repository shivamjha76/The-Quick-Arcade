export function init(container, game) {
    let score = 0;

    const styles = `
        <style>
            .ftb-area {
                position: relative;
                width: 100%;
                height: 400px;
                background-color: #1e293b;
                border: 2px solid var(--border-color);
                border-radius: 8px;
                overflow: hidden;
            }
            .the-button {
                position: absolute;
                padding: 10px 20px;
                background-color: var(--accent-color);
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                transition: transform 0.1s;
                font-weight: bold;
            }
            .the-button:active {
                transform: scale(0.95);
            }
        </style>
    `;

    container.innerHTML = `
        ${styles}
        <div class="game-container">
            <div class="game-header">
                <h2>${game.title}</h2>
                <p>Can you catch it?</p>
            </div>
            
            <div class="game-area">
                <div style="margin-bottom: 20px; font-size: 1.5rem;">
                    Score: <span id="score" style="color: var(--success-color)">0</span>
                </div>
                
                <div class="ftb-area" id="playArea">
                    <button id="theButton" class="the-button" style="top: 45%; left: 45%;">Click Me!</button>
                </div>
            </div>
        </div>
    `;

    const btn = container.querySelector('#theButton');
    const playArea = container.querySelector('#playArea');
    const scoreDisplay = container.querySelector('#score');

    function moveButton() {
        // Get container dimensions
        const containerRect = playArea.getBoundingClientRect();
        const btnRect = btn.getBoundingClientRect();

        // Calculate max positions (subtract button size)
        // Note: btnRect width/height might be 0 if not rendered yet, so fallback or assume standard
        const btnWidth = btn.offsetWidth || 100;
        const btnHeight = btn.offsetHeight || 40;

        const maxX = containerRect.width - btnWidth;
        const maxY = containerRect.height - btnHeight;

        const newX = Math.floor(Math.random() * maxX);
        const newY = Math.floor(Math.random() * maxY);

        btn.style.left = `${newX}px`;
        btn.style.top = `${newY}px`;
    }

    btn.addEventListener('click', () => {
        score++;
        scoreDisplay.innerText = score;
        moveButton();
    });
}
