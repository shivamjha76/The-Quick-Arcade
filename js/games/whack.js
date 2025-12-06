export function init(container, game) {
    let score = 0;
    let timeLeft = 30;
    let hitPosition = null;
    let timerId = null;
    let moleTimerId = null;
    let isGameRunning = false;

    const styles = `
        <style>
            .wam-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 10px;
                width: 300px;
                margin: 20px auto;
            }
            .wam-hole {
                height: 100px;
                background-color: #3f2e18; /* Dirt color */
                border-radius: 50%;
                position: relative;
                overflow: hidden;
                cursor: crosshair;
                border: 4px solid #654321;
            }
            .wam-mole {
                width: 80%;
                height: 80%;
                background-color: #fca5a5; /* Mole color */
                border-radius: 50%;
                position: absolute;
                top: 100%; /* Hidden initially */
                left: 10%;
                transition: top 0.1s;
                pointer-events: none; /* Click the hole, not the div for simplicity, or handle both */
            }
            /* When mole is up */
            .wam-hole.up .wam-mole {
                top: 10%;
            }
            /* Mole Face */
            .wam-mole::before, .wam-mole::after {
                content: '';
                position: absolute;
                background: black;
                border-radius: 50%;
            }
            .wam-mole::before { width: 10px; height: 10px; top: 20px; left: 15px; box-shadow: 30px 0 0 black; }
            .wam-mole::after { width: 30px; height: 20px; top: 40px; left: 25px; background: white; border-radius: 10px; }
            
            .wam-header {
                display: flex;
                justify-content: space-around;
                font-size: 1.5rem;
                margin-bottom: 20px;
            }
        </style>
    `;

    container.innerHTML = `
        ${styles}
        <div class="game-container">
            <div class="game-header">
                <h2>${game.title}</h2>
                <p>Whack 'em before time runs out!</p>
            </div>
            
            <div class="game-area">
                <div class="wam-header">
                    <span style="color: var(--success-color)">Score: <span id="score">0</span></span>
                    <span style="color: var(--danger-color)">Time: <span id="time-left">30</span></span>
                </div>
                
                <button id="startBtn" class="btn btn-primary">Start Game</button>

                <div class="wam-grid" id="grid">
                    <!-- 9 holes -->
                    ${Array(9).fill(0).map((_, i) => `<div class="wam-hole" id="${i}"><div class="wam-mole"></div></div>`).join('')}
                </div>
            </div>
        </div>
    `;

    const holes = container.querySelectorAll('.wam-hole');
    const scoreDisplay = container.querySelector('#score');
    const timeLeftDisplay = container.querySelector('#time-left');
    const startBtn = container.querySelector('#startBtn');

    function randomSquare() {
        // Clear previous
        holes.forEach(hole => hole.classList.remove('up'));

        // Pick new random
        let randomHole = holes[Math.floor(Math.random() * 9)];

        // Ensure it changes position sometimes? Or just allow same.
        // Random is fine.

        randomHole.classList.add('up');
        hitPosition = randomHole.id;
    }

    function moveMole() {
        moleTimerId = setInterval(randomSquare, 800);
    }

    function countDown() {
        timeLeft--;
        timeLeftDisplay.innerText = timeLeft;

        if (timeLeft === 0) {
            clearInterval(timerId);
            clearInterval(moleTimerId);
            isGameRunning = false;
            holes.forEach(hole => hole.classList.remove('up'));
            alert(`GAME OVER! Your final score is ${score}`);
            startBtn.disabled = false;
        }
    }

    function startGame() {
        if (isGameRunning) return;
        score = 0;
        timeLeft = 30;
        scoreDisplay.innerText = 0;
        timeLeftDisplay.innerText = 30;
        isGameRunning = true;
        startBtn.disabled = true;

        moveMole();
        timerId = setInterval(countDown, 1000);
    }

    holes.forEach(hole => {
        hole.addEventListener('mousedown', () => {
            if (hole.id === hitPosition && isGameRunning) {
                score++;
                scoreDisplay.innerText = score;
                hitPosition = null;
                hole.classList.remove('up'); // Visual feedback
            }
        });
    });

    startBtn.addEventListener('click', startGame);
}
