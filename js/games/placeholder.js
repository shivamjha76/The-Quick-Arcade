export function init(container, game) {
    container.innerHTML = `
        <div class="game-container">
            <div class="game-header">
                <h2>${game.title}</h2>
                <p>${game.description}</p>
            </div>
            <div class="game-area">
                <p>Coming Soon...</p>
            </div>
        </div>
    `;
}
