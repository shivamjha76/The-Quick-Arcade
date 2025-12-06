export function init(container, game) {
    let painting = false;
    let strokeColor = '#000000';
    let lineWidth = 5;
    let currentTool = 'freehand'; // freehand, rectangle, circle, line
    let startX, startY;
    let snapshot;

    const styles = `
        <style>
            .draw-canvas {
                background-color: #fff;
                border: 2px solid var(--border-color);
                touch-action: none;
                /* Custom cursor: Black circle with white border */
                cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="6" fill="%23000000" stroke="%23ffffff" stroke-width="2"/></svg>') 12 12, crosshair;
                display: block;
                margin: 0 auto;
                border-radius: 4px;
            }
            .draw-controls {
                display: flex;
                gap: 15px;
                justify-content: center;
                align-items: center;
                margin-bottom: 20px;
                flex-wrap: wrap;
            }
            .draw-controls label {
                display: flex;
                align-items: center;
                gap: 5px;
            }
            .draw-controls select, .draw-controls input {
                padding: 5px;
                border-radius: 4px;
                border: 1px solid var(--border-color);
                background: var(--bg-color);
                color: var(--text-primary);
            }
        </style>
    `;

    container.innerHTML = `
        ${styles}
        <div class="game-container">
            <div class="game-header">
                <h2>${game.title}</h2>
                <p>Express yourself!</p>
            </div>
            
            <div class="game-area">
                <div class="draw-controls">
                    <label>
                        Tool:
                        <select id="toolSelect">
                            <option value="freehand">Pencil</option>
                            <option value="line">Line</option>
                            <option value="rectangle">Rectangle</option>
                            <option value="circle">Circle</option>
                        </select>
                    </label>
                    <label>
                        Color:
                        <input type="color" id="startColor" value="#000000">
                    </label>
                    <label>
                        Size:
                        <input type="range" id="lineWidth" min="1" max="20" value="5">
                    </label>
                    <button id="eraserBtn" class="btn btn-outline">Eraser</button>
                    <button id="clearBtn" class="btn btn-primary">Clear</button>
                </div>
                
                <canvas id="drawCanvas" width="600" height="400" class="draw-canvas"></canvas>
            </div>
        </div>
    `;

    const canvas = container.querySelector('#drawCanvas');
    const ctx = canvas.getContext('2d');
    const toolSelect = container.querySelector('#toolSelect');
    const colorPicker = container.querySelector('#startColor');
    const sizeSlider = container.querySelector('#lineWidth');
    const eraserBtn = container.querySelector('#eraserBtn');
    const clearBtn = container.querySelector('#clearBtn');

    // Default settings
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;

    function getPos(e) {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.clientX || (e.touches ? e.touches[0].clientX : 0);
        const clientY = e.clientY || (e.touches ? e.touches[0].clientY : 0);
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    }

    function startPosition(e) {
        painting = true;
        const pos = getPos(e);
        startX = pos.x;
        startY = pos.y;

        ctx.beginPath();
        ctx.moveTo(startX, startY);

        // Save current canvas state for shape preview
        snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);

        if (currentTool === 'freehand') {
            draw(e);
        }
    }

    function endPosition() {
        painting = false;
        if (currentTool === 'freehand') {
            ctx.beginPath(); // Reset path
        }
    }

    function draw(e) {
        if (!painting) return;

        const pos = getPos(e);

        if (currentTool === 'freehand') {
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
        } else {
            // Restore snapshot to clear previous frame of shape preview
            ctx.putImageData(snapshot, 0, 0);

            ctx.beginPath();
            if (currentTool === 'line') {
                ctx.moveTo(startX, startY);
                ctx.lineTo(pos.x, pos.y);
            } else if (currentTool === 'rectangle') {
                ctx.rect(startX, startY, pos.x - startX, pos.y - startY);
            } else if (currentTool === 'circle') {
                const radius = Math.sqrt(Math.pow(pos.x - startX, 2) + Math.pow(pos.y - startY, 2));
                ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
            }
            ctx.stroke();
        }
    }

    // Event Listeners
    canvas.addEventListener('mousedown', startPosition);
    canvas.addEventListener('mouseup', endPosition);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseleave', endPosition);

    // Touch support
    canvas.addEventListener('touchstart', (e) => { e.preventDefault(); startPosition(e); });
    canvas.addEventListener('touchend', endPosition);
    canvas.addEventListener('touchmove', (e) => { e.preventDefault(); draw(e); });

    toolSelect.addEventListener('change', (e) => {
        currentTool = e.target.value;
        // Reset eraser if switching tools
        if (ctx.strokeStyle === '#ffffff') {
            ctx.strokeStyle = colorPicker.value;
            strokeColor = colorPicker.value;
        }
    });

    colorPicker.addEventListener('change', (e) => {
        strokeColor = e.target.value;
        ctx.strokeStyle = strokeColor;
    });

    sizeSlider.addEventListener('input', (e) => {
        lineWidth = e.target.value;
        ctx.lineWidth = lineWidth;
    });

    eraserBtn.addEventListener('click', () => {
        currentTool = 'freehand'; // Eraser is strictly freehand
        toolSelect.value = 'freehand';
        strokeColor = '#ffffff';
        ctx.strokeStyle = strokeColor;
    });

    clearBtn.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
}
