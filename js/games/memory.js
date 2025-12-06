export function init(container, game) {
    const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
    let cards = [];
    let flippedCards = [];
    let moves = 0;
    let matchedPairs = 0;
    let lockBoard = false;

    const styles = `
        <style>
            .memory-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 10px;
                width: 100%;
                max-width: 500px;
                margin: 20px auto;
                perspective: 1000px; /* For 3D effect */
            }
            .memory-card {
                aspect-ratio: 1;
                background-color: var(--card-bg);
                border: 2px solid var(--border-color);
                border-radius: 8px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2.5rem;
                transition: transform 0.6s;
                transform-style: preserve-3d;
                position: relative;
                min-height: 80px; /* Fallback */
            }
            .memory-card.flipped, .memory-card.matched {
                transform: rotateY(180deg);
                /* background-color change moved to faces or handled by flip */
            }
            .card-front, .card-back {
                position: absolute;
                width: 100%;
                height: 100%;
                backface-visibility: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 6px;
                top: 0;
                left: 0;
            }
            .card-front {
                background-color: var(--border-color); /* Reveal color */
                transform: rotateY(180deg);
            }
            .card-back {
                background-color: var(--card-bg);
                border: 2px solid var(--border-color); /* Match card border */
            }
            .card-back::after {
                content: "?";
                color: var(--text-secondary);
                font-size: 2rem;
                font-weight: bold;
            }
            /* Stats Bar */
            .stats-bar {
                display: flex;
                justify-content: space-between;
                width: 100%;
                max-width: 500px;
                margin: 0 auto 20px;
                font-size: 1.2rem;
                color: var(--text-secondary);
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
                <div class="stats-bar">
                    <span>Moves: <strong id="moves" style="color: var(--text-primary)">0</strong></span>
                    <button id="resetBtn" class="btn btn-outline btn-sm">Restart</button>
                </div>
                <div class="memory-grid" id="grid">
                    <!-- Cards will be generated here -->
                </div>
            </div>
        </div>
    `;

    const grid = container.querySelector('#grid');
    const movesDisplay = container.querySelector('#moves');
    const resetBtn = container.querySelector('#resetBtn');

    function createBoard() {
        // Create pairs
        const gameEmojis = [...emojis, ...emojis]; // Duplicate for pairs
        // Shuffle
        gameEmojis.sort(() => 0.5 - Math.random());

        cards = gameEmojis.map((emoji, index) => ({
            id: index,
            emoji: emoji,
            flipped: false,
            matched: false
        }));

        renderBoard();
    }

    function renderBoard() {
        grid.innerHTML = cards.map(card => `
            <div class="memory-card ${card.flipped || card.matched ? 'flipped' : ''} ${card.matched ? 'matched' : ''}" data-id="${card.id}">
                <div class="card-back"></div>
                <div class="card-front">${card.emoji}</div>
            </div>
        `).join('');

        // Re-attach listeners (simple approach for vanilla)
        grid.querySelectorAll('.memory-card').forEach(cardEl => {
            cardEl.addEventListener('click', () => flipCard(parseInt(cardEl.dataset.id)));
        });
    }

    function flipCard(id) {
        if (lockBoard) return;
        const card = cards.find(c => c.id === id);

        if (card.flipped || card.matched) return;

        // Flip logic
        card.flipped = true;
        flippedCards.push(card);

        // Update specific card in DOM to avoid full re-render flickering
        const cardEl = grid.querySelector(`[data-id="${id}"]`);
        cardEl.classList.add('flipped');

        if (flippedCards.length === 2) {
            moves++;
            movesDisplay.innerText = moves;
            checkForMatch();
        }
    }

    function checkForMatch() {
        lockBoard = true;
        const [card1, card2] = flippedCards;

        if (card1.emoji === card2.emoji) {
            card1.matched = true;
            card2.matched = true;
            matchedPairs++;

            // Visual feedback for match? 
            // Already handled by .matched class in render/logic (kept flipped)

            resetTurn();
            if (matchedPairs === emojis.length) {
                setTimeout(() => alert(`You won in ${moves} moves!`), 500);
            }
        } else {
            setTimeout(() => {
                card1.flipped = false;
                card2.flipped = false;

                // Update DOM
                const el1 = grid.querySelector(`[data-id="${card1.id}"]`);
                const el2 = grid.querySelector(`[data-id="${card2.id}"]`);
                el1.classList.remove('flipped');
                el2.classList.remove('flipped');

                resetTurn();
            }, 1000);
        }
    }

    function resetTurn() {
        flippedCards = [];
        lockBoard = false;
    }

    function resetGame() {
        moves = 0;
        matchedPairs = 0;
        movesDisplay.innerText = 0;
        createBoard();
    }

    resetBtn.addEventListener('click', resetGame);
    createBoard();
}
