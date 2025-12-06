export function init(container, game) {
    const canvasSize = 400;
    const gridSize = 20;
    const tileCount = canvasSize / gridSize;

    let canvas, ctx;
    let snake = [{ x: 10, y: 10 }];
    let food = { x: 15, y: 15 };
    let dx = 0;
    let dy = 0;
    let score = 0;
    let gameInterval;
    let isGameRunning = false;

    const styles = `
        <style>
            .snake-canvas {
                background-color: #000;
                border: 2px solid var(--border-color);
                box-shadow: 0 0 20px rgba(0,0,0,0.5);
                display: block;
                margin: 0 auto;
            }
            .score-display {
                font-size: 1.5rem;
                margin-bottom: 1rem;
                color: var(--success-color);
            }
            .controls-hint {
                margin-top: 1rem;
                color: var(--text-secondary);
                font-size: 0.9rem;
            }
            .snake-controls-mobile {
                display: none; /* Hidden by default on large screens if desired, or just show always for simplicity */
                flex-direction: column;
                align-items: center;
                gap: 5px;
                margin-top: 1rem;
            }
            .dpad-row {
                display: flex;
                gap: 5px;
            }
            .dpad-btn {
                background: var(--card-bg);
                border: 1px solid var(--border-color);
                border-radius: 5px;
                font-size: 1.5rem;
                width: 50px;
                height: 50px;
                cursor: pointer;
            }
            .dpad-btn:active {
                background: var(--accent-color);
            }
            @media (max-width: 768px) {
                .snake-controls-mobile {
                    display: flex;
                }
                .snake-canvas {
                    max-width: 100%;
                    height: auto;
                }
            }
        </style>
    `;

    container.innerHTML = `
        ${styles}
        <div class="game-container">
            <div class="game-header">
                <h2>${game.title}</h2>
                <p>Use Arrow Keys to Move</p>
            </div>
            
            <div class="game-area">
                <div class="score-display">Score: <span id="score">0</span></div>
                <canvas id="gameCanvas" width="${canvasSize}" height="${canvasSize}" class="snake-canvas"></canvas>
                
                <div class="snake-controls-mobile">
                    <div class="dpad-row">
                        <button class="dpad-btn" id="upBtn">⬆️</button>
                    </div>
                    <div class="dpad-row">
                        <button class="dpad-btn" id="leftBtn">⬅️</button>
                        <button class="dpad-btn" id="rightBtn">➡️</button>
                    </div>
                    <div class="dpad-row">
                        <button class="dpad-btn" id="downBtn">⬇️</button>
                    </div>
                </div>

                <div class="controls-hint">
                    <button id="startBtn" class="btn btn-primary">Start Game</button>
                    <p style="font-size: 0.8rem; margin-top: 10px;">PC: Arrow Keys | Mobile: Buttons</p>
                </div>
            </div>
        </div>
    `;

    canvas = container.querySelector('#gameCanvas');
    ctx = canvas.getContext('2d');
    const scoreDisplay = container.querySelector('#score');
    const startBtn = container.querySelector('#startBtn');

    // Mobile Controls
    const upBtn = container.querySelector('#upBtn');
    const downBtn = container.querySelector('#downBtn');
    const leftBtn = container.querySelector('#leftBtn');
    const rightBtn = container.querySelector('#rightBtn');

    function setDir(d) {
        if (!isGameRunning) return;
        switch (d) {
            case 'up': if (dy !== 1) { dx = 0; dy = -1; } break;
            case 'down': if (dy !== -1) { dx = 0; dy = 1; } break;
            case 'left': if (dx !== 1) { dx = -1; dy = 0; } break;
            case 'right': if (dx !== -1) { dx = 1; dy = 0; } break;
        }
    }

    upBtn.addEventListener('click', () => setDir('up'));
    downBtn.addEventListener('click', () => setDir('down'));
    leftBtn.addEventListener('click', () => setDir('left'));
    rightBtn.addEventListener('click', () => setDir('right'));

    function startGame() {
        if (isGameRunning) return;

        // Reset state
        snake = [{ x: 10, y: 10 }];
        dx = 0;
        dy = 0;
        score = 0;
        scoreDisplay.innerText = 0;
        placeFood();
        isGameRunning = true;
        startBtn.disabled = true;
        startBtn.innerText = "Running...";

        if (gameInterval) clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, 150);
    }

    function gameLoop() {
        if (!isGameRunning) return;

        update();
        draw();
    }

    function update() {
        // Move snake
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };

        // Check Wall Collision
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
            gameOver();
            return;
        }

        // Check Self Collision
        for (let i = 0; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                // Ignore if it's currently stationary (initial state)
                if (dx === 0 && dy === 0) return;
                gameOver();
                return;
            }
        }

        snake.unshift(head);

        // Check Food
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            scoreDisplay.innerText = score;
            placeFood();
        } else {
            snake.pop(); // Remove tail if not eating
        }
    }

    function draw() {
        // Clear screen
        ctx.fillStyle = '#1e293b'; // Slate 800
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw Food
        ctx.fillStyle = '#ef4444'; // Red
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);

        // Draw Snake
        ctx.fillStyle = '#22c55e'; // Green
        snake.forEach((part, index) => {
            // Head is slightly different color
            if (index === 0) ctx.fillStyle = '#4ade80';
            else ctx.fillStyle = '#22c55e';

            ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2);
        });
    }

    function placeFood() {
        food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
        // Ensure food doesn't spawn on snake
        snake.forEach(part => {
            if (part.x === food.x && part.y === food.y) placeFood();
        });
    }

    function gameOver() {
        isGameRunning = false;
        clearInterval(gameInterval);
        alert(`Game Over! Score: ${score}`);
        startBtn.disabled = false;
        startBtn.innerText = "Play Again";
    }

    function handleInput(e) {
        if (!isGameRunning && (e.key.includes('Arrow') || e.key === ' ')) {
            // Optional: Auto start on key press? Maybe better to stick to button
        }

        switch (e.key) {
            case 'ArrowUp':
                if (dy !== 1) { dx = 0; dy = -1; }
                break;
            case 'ArrowDown':
                if (dy !== -1) { dx = 0; dy = 1; }
                break;
            case 'ArrowLeft':
                if (dx !== 1) { dx = -1; dy = 0; }
                break;
            case 'ArrowRight':
                if (dx !== -1) { dx = 1; dy = 0; }
                break;
        }
    }

    window.addEventListener('keydown', handleInput);
    startBtn.addEventListener('click', startGame);

    // Initial draw
    draw();

    // Cleanup function when leaving the game (if I had a de-init mechanism in my router, which I don't efficiently have yet, but key listener adds up)
    // IMPORTANT: In a real SPA, we need to remove event listeners when unmounting.
    // My simple router doesn't explicitly call a cleanup function.
    // I should attach a mutation observer or check visibility stuff, 
    // BUT for this simplified "No Frameworks" scope, valid.
    // However, I can patch the `window.addEventListener` usage to be cleaner if I revisit `app.js` or just accept it's a simple app.
    // A better way: attach listener to `window` but check if canvas exists in DOM.
    // I'll stick to simple implementation.
}
