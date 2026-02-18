window.addEventListener('load', function () {
    const canvas = document.getElementById('shapes-canvas');
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const W = rect.width;
    const H = rect.height;

    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    const palettes = [
        { top: '#b8cce4', left: '#4a6fa5', right: '#1e3a5f' },
        { top: '#c9d4e8', left: '#5c7ab0', right: '#2c4a7a' },
        { top: '#d4c5a9', left: '#8c6a3a', right: '#5c4a2a' },
        { top: '#b0bac8', left: '#4a5568', right: '#2d3748' },
        { top: '#c4d4c0', left: '#4a7a5c', right: '#2a4a38' },
        { top: '#d4c4d4', left: '#7a4a8c', right: '#4a2a5c' },
    ];

    // --- shape drawers ---

    function drawCube(x, y, w, h, pal) {
        const hw = w / 2, hd = w * 0.27, d = hd * 2;
        ctx.strokeStyle = 'rgba(0,0,0,0.10)';
        ctx.lineWidth = 0.7;

        ctx.beginPath();
        ctx.moveTo(x, y); ctx.lineTo(x+hw, y+hd); ctx.lineTo(x, y+d); ctx.lineTo(x-hw, y+hd);
        ctx.closePath(); ctx.fillStyle = pal.top; ctx.fill(); ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x-hw, y+hd); ctx.lineTo(x, y+d); ctx.lineTo(x, y+d+h); ctx.lineTo(x-hw, y+hd+h);
        ctx.closePath(); ctx.fillStyle = pal.left; ctx.fill(); ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x, y+d); ctx.lineTo(x+hw, y+hd); ctx.lineTo(x+hw, y+hd+h); ctx.lineTo(x, y+d+h);
        ctx.closePath(); ctx.fillStyle = pal.right; ctx.fill(); ctx.stroke();
    }

    function drawPyramid(x, y, w, h, pal) {
        // (x, y) = apex, base is below
        const hw = w / 2, hd = w * 0.27, d = hd * 2;
        ctx.strokeStyle = 'rgba(0,0,0,0.10)';
        ctx.lineWidth = 0.7;

        // back faces first
        ctx.beginPath();
        ctx.moveTo(x, y); ctx.lineTo(x, y+h); ctx.lineTo(x-hw, y+h+hd);
        ctx.closePath(); ctx.fillStyle = pal.top; ctx.fill(); ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x, y); ctx.lineTo(x, y+h); ctx.lineTo(x+hw, y+h+hd);
        ctx.closePath(); ctx.fillStyle = pal.top; ctx.fill(); ctx.stroke();

        // front faces
        ctx.beginPath();
        ctx.moveTo(x, y); ctx.lineTo(x-hw, y+h+hd); ctx.lineTo(x, y+h+d);
        ctx.closePath(); ctx.fillStyle = pal.left; ctx.fill(); ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x, y); ctx.lineTo(x+hw, y+h+hd); ctx.lineTo(x, y+h+d);
        ctx.closePath(); ctx.fillStyle = pal.right; ctx.fill(); ctx.stroke();
    }

    function drawGem(x, y, w, pal) {
        // octahedron: pyramid up + pyramid down sharing a rhombus base
        const hw = w / 2, hd = w * 0.27, d = hd * 2;
        const ht = w * 0.55; // upper pyramid height
        const hb = w * 0.38; // lower pyramid height

        // equatorial rhombus
        const eqT = [x,      y + ht];
        const eqR = [x + hw, y + ht + hd];
        const eqB = [x,      y + ht + d];
        const eqL = [x - hw, y + ht + hd];
        const aTop = [x, y];
        const aBot = [x, y + ht + d + hb];

        ctx.strokeStyle = 'rgba(0,0,0,0.10)';
        ctx.lineWidth = 0.7;

        // upper back faces (lightest)
        ctx.beginPath();
        ctx.moveTo(...aTop); ctx.lineTo(...eqT); ctx.lineTo(...eqL);
        ctx.closePath(); ctx.fillStyle = pal.top; ctx.fill(); ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(...aTop); ctx.lineTo(...eqT); ctx.lineTo(...eqR);
        ctx.closePath(); ctx.fillStyle = pal.top; ctx.fill(); ctx.stroke();

        // upper front faces
        ctx.beginPath();
        ctx.moveTo(...aTop); ctx.lineTo(...eqL); ctx.lineTo(...eqB);
        ctx.closePath(); ctx.fillStyle = pal.left; ctx.fill(); ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(...aTop); ctx.lineTo(...eqR); ctx.lineTo(...eqB);
        ctx.closePath(); ctx.fillStyle = pal.right; ctx.fill(); ctx.stroke();

        // lower front faces
        ctx.beginPath();
        ctx.moveTo(...aBot); ctx.lineTo(...eqL); ctx.lineTo(...eqB);
        ctx.closePath(); ctx.fillStyle = pal.left; ctx.fill(); ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(...aBot); ctx.lineTo(...eqR); ctx.lineTo(...eqB);
        ctx.closePath(); ctx.fillStyle = pal.right; ctx.fill(); ctx.stroke();
    }

    // full height helpers
    function fullHeight(type, w, h) {
        const hd = w * 0.27, d = hd * 2;
        if (type === 'cube')    return d + h;
        if (type === 'pyramid') return h + d;
        if (type === 'gem')     return w * 0.55 + d + w * 0.38;
    }

    // --- placement with minimum distance ---

    const types  = ['cube', 'cube', 'pyramid', 'pyramid', 'gem', 'gem'];
    const count  = 6 + Math.floor(Math.random() * 4);
    const minDist = Math.max(70, W / (count + 1));
    const shapes = [];

    for (let i = 0; i < count; i++) {
        for (let attempt = 0; attempt < 80; attempt++) {
            const type = types[Math.floor(Math.random() * types.length)];
            const w    = 40 + Math.random() * 50;
            const hd   = w * 0.27;
            const h    = type === 'gem' ? 0 : 28 + Math.random() * 60;
            const fh   = fullHeight(type, w, h);

            const x    = w / 2 + 10 + Math.random() * Math.max(10, W - w - 20);
            const maxY = H - fh - 6;
            if (maxY < 6) continue;
            const y    = 6 + Math.random() * maxY;
            const cy   = y + fh / 2;

            const tooClose = shapes.some(s => {
                const dx = s.x - x, dy = s.cy - cy;
                return Math.sqrt(dx * dx + dy * dy) < minDist;
            });
            if (tooClose) continue;

            const pal = palettes[Math.floor(Math.random() * palettes.length)];
            shapes.push({
                type, x, y, w, h, pal, hd, cy,
                floatAmp:   4 + Math.random() * 7,
                floatSpeed: 0.5 + Math.random() * 0.9,
                floatPhase: Math.random() * Math.PI * 2,
                driftAmp:   2 + Math.random() * 5,
                driftSpeed: 0.3 + Math.random() * 0.5,
                driftPhase: Math.random() * Math.PI * 2,
            });
            break;
        }
    }

    // --- animation loop ---

    function frame(ts) {
        const t = ts / 1000;
        ctx.clearRect(0, 0, W, H);

        const animated = shapes.map(s => ({
            ...s,
            rx: s.x + s.driftAmp * Math.sin(s.driftSpeed * t + s.driftPhase),
            ry: s.y + s.floatAmp * Math.sin(s.floatSpeed * t + s.floatPhase),
            sortY: s.y + s.floatAmp * Math.sin(s.floatSpeed * t + s.floatPhase) + s.hd,
        }));
        animated.sort((a, b) => a.sortY - b.sortY);

        for (const s of animated) {
            if (s.type === 'cube')    drawCube(s.rx, s.ry, s.w, s.h, s.pal);
            if (s.type === 'pyramid') drawPyramid(s.rx, s.ry, s.w, s.h, s.pal);
            if (s.type === 'gem')     drawGem(s.rx, s.ry, s.w, s.pal);
        }

        requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
});
