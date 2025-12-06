// Main Application Logic

// Game Registry
const games = [
    { id: 'tictactoe', title: 'Tic-Tac-Toe', icon: '⭕', description: 'Classic 2-player game' },
    { id: 'rps', title: 'Rock Paper Scissors', icon: '✂️', description: 'Beat the computer' },
    { id: 'guess', title: 'Guess the Number', icon: '❓', description: 'High or Low?' },
    { id: 'calculator', title: 'Calculator', icon: '🧮', description: 'Simple math utility' },
    { id: 'memory', title: 'Memory Match', icon: '🎴', description: 'Find the pairs' },
    { id: 'snake', title: 'Snake', icon: '🐍', description: 'Eat and grow' },
    { id: 'whack', title: 'Whack-A-Mole', icon: '🔨', description: 'Smash them fast' },
    { id: 'draw', title: 'Drawing Pad', icon: '🎨', description: 'Be creative' },
    { id: 'find', title: 'Find the Button', icon: '🔘', description: 'Click chase' }
];

const app = document.getElementById('app');

// Router
async function router() {
    const hash = window.location.hash.slice(1); // Remove '#'

    if (!hash || hash === 'home') {
        renderHome();
        return;
    }

    // Check if it's a game route
    const gameId = hash;
    const game = games.find(g => g.id === gameId);

    if (game) {
        await renderGame(game);
    } else {
        render404();
    }
}

// Render Home Page (3x3 Grid)
function renderHome() {
    app.innerHTML = `
        <div class="games-grid">
            ${games.map(game => `
                <a href="#${game.id}" class="game-card">
                    <div class="game-icon">${game.icon}</div>
                    <div class="game-title">${game.title}</div>
                    <div class="game-desc">${game.description}</div>
                </a>
            `).join('')}
        </div>
    `;
}

// Render Game Container and Load Module
async function renderGame(game) {
    // Basic Layout
    app.innerHTML = `
        <div class="game-wrapper">
            <a href="#" class="back-link">← Back to Arcade</a>
            <div id="game-container">
                <div class="loading">Loading ${game.title}...</div>
            </div>
        </div>
    `;

    const container = document.getElementById('game-container');

    try {
        // Dynamic Import of Game Module
        const module = await import(`./games/${game.id}.js`);
        if (module.init) {
            module.init(container, game); // Pass container and metadata
        } else {
            container.innerHTML = `<p>Error: Game module missing init function.</p>`;
        }
    } catch (err) {
        console.error(err);
        container.innerHTML = `
            <div class="error">
                <h3>Error Loading Game</h3>
                <p>Could not load ${game.title}. Check console for details.</p>
            </div>
        `;
    }
}

function render404() {
    app.innerHTML = `
        <div style="text-align: center; padding: 4rem;">
            <h2>404 - Game Not Found</h2>
            <p>The cartridge seems to be missing.</p>
            <br>
            <a href="#" class="btn btn-primary">Return Home</a>
        </div>
    `;
}

// Initialize
// Initialize
window.addEventListener('hashchange', router);
window.addEventListener('load', () => {
    router();
    makeFaviconRound();
});

// Dynamic Favicon Rounder
function makeFaviconRound() {
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';

    // Original Image
    const img = new Image();
    img.src = 'Gemini_Generated_Image_mu0vuamu0vuamu0v.png'; // User's file
    img.crossOrigin = "Anonymous"; // Handle standard CORS if needed

    img.onload = () => {
        const canvas = document.createElement('canvas');
        const size = 64; // Standard favicon size
        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext('2d');

        // Circle Clip
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        // Draw Image
        ctx.drawImage(img, 0, 0, size, size);

        // Update Link
        link.href = canvas.toDataURL();
        document.getElementsByTagName('head')[0].appendChild(link);
    };
}
