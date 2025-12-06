export function init(container, game) {
    let currentInput = '0';
    let previousInput = null;
    let operator = null;
    let shouldResetScreen = false;

    const styles = `
        <style>
            .calc-body {
                background: #334155;
                padding: 20px;
                border-radius: 1rem;
                width: 300px;
                margin: 0 auto;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
            }
            .calc-screen {
                background: #0f172a;
                color: #f8fafc;
                font-family: 'Courier New', monospace;
                font-size: 2rem;
                text-align: right;
                padding: 20px;
                border-radius: 0.5rem;
                margin-bottom: 20px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                min-height: 80px;
                display: flex;
                align-items: flex-end;
                justify-content: flex-end;
            }
            .calc-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 10px;
            }
            .calc-btn {
                background: #475569;
                color: white;
                border: none;
                padding: 15px;
                font-size: 1.25rem;
                border-radius: 0.5rem;
                cursor: pointer;
                transition: filter 0.2s;
            }
            .calc-btn:hover {
                filter: brightness(110%);
            }
            .btn-accent {
                background: var(--accent-color);
            }
            .btn-danger {
                background: var(--danger-color);
            }
            .btn-secondary {
                background: #64748b;
            }
            .span-2 {
                grid-column: span 2;
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
                <div class="calc-body">
                    <div class="calc-screen" id="screen">0</div>
                    <div class="calc-grid">
                        <button class="calc-btn btn-danger span-2" data-action="clear">AC</button>
                        <button class="calc-btn btn-secondary" data-action="delete">DEL</button>
                        <button class="calc-btn btn-accent" data-op="/">÷</button>
                        
                        <button class="calc-btn" data-num="7">7</button>
                        <button class="calc-btn" data-num="8">8</button>
                        <button class="calc-btn" data-num="9">9</button>
                        <button class="calc-btn btn-accent" data-op="*">×</button>
                        
                        <button class="calc-btn" data-num="4">4</button>
                        <button class="calc-btn" data-num="5">5</button>
                        <button class="calc-btn" data-num="6">6</button>
                        <button class="calc-btn btn-accent" data-op="-">−</button>
                        
                        <button class="calc-btn" data-num="1">1</button>
                        <button class="calc-btn" data-num="2">2</button>
                        <button class="calc-btn" data-num="3">3</button>
                        <button class="calc-btn btn-accent" data-op="+">+</button>
                        
                        <button class="calc-btn span-2" data-num="0">0</button>
                        <button class="calc-btn" data-num=".">.</button>
                        <button class="calc-btn btn-accent" data-action="equals">=</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    const screen = container.querySelector('#screen');
    const buttons = container.querySelectorAll('.calc-btn');

    function updateScreen() {
        screen.innerText = currentInput;
    }

    function appendNumber(number) {
        if (currentInput === '0' || shouldResetScreen) {
            currentInput = number;
            shouldResetScreen = false;
        } else {
            currentInput += number;
        }
        updateScreen();
    }

    function chooseOperator(op) {
        if (operator !== null) evaluate();
        previousInput = currentInput;
        operator = op;
        shouldResetScreen = true;
    }

    function evaluate() {
        if (operator === null || shouldResetScreen) return;

        let result;
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);

        if (isNaN(prev) || isNaN(current)) return;

        switch (operator) {
            case '+': result = prev + current; break;
            case '-': result = prev - current; break;
            case '*': result = prev * current; break;
            case '/':
                if (current === 0) {
                    alert("Cannot divide by zero!");
                    clear();
                    return;
                }
                result = prev / current;
                break;
            default: return;
        }

        currentInput = result.toString();
        operator = null;
        previousInput = null;
        updateScreen();
    }

    function clear() {
        currentInput = '0';
        previousInput = null;
        operator = null;
        shouldResetScreen = false;
        updateScreen();
    }

    function deleteLast() {
        currentInput = currentInput.slice(0, -1);
        if (currentInput === '') currentInput = '0';
        updateScreen();
    }

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.dataset.num) appendNumber(btn.dataset.num);
            if (btn.dataset.op) chooseOperator(btn.dataset.op);
            if (btn.dataset.action === 'equals') {
                evaluate();
                shouldResetScreen = true; // Ready for next calculation
            }
            if (btn.dataset.action === 'clear') clear();
            if (btn.dataset.action === 'delete') deleteLast();
        });
    });

    // Keyboard support
    window.addEventListener('keydown', handleKeyboard);

    function handleKeyboard(e) {
        if (e.key >= '0' && e.key <= '9') appendNumber(e.key);
        if (e.key === '.') appendNumber('.');
        if (e.key === '=' || e.key === 'Enter') {
            evaluate();
            shouldResetScreen = true;
        }
        if (e.key === 'Backspace') deleteLast();
        if (e.key === 'Escape') clear();
        if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') chooseOperator(e.key);
    }
}
