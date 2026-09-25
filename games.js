/* ═══════════════════════════════════════════
   GAMES JAVASCRIPT — 10 mini-games
   For Trung Thu Của Đào Anh Thư
═══════════════════════════════════════════ */

const rndG = (min, max) => Math.random() * (max - min) + min;
const pickG = arr => arr[Math.floor(Math.random() * arr.length)];

// Set up all games when their section becomes visible
const gObserver = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
        const id = target.id;
        if (isIntersecting) {
            if (id === 'sec-catch-stars')   initCatchStars();
            if (id === 'sec-mooncake')      initMooncake();
            if (id === 'sec-cat-jump')      initCatJump();
            if (id === 'sec-drag-lantern')  initDragLantern();
            if (id === 'sec-draw')          initDraw();
            if (id === 'sec-scroll-letter') initScrollLetter();
            if (id === 'sec-garden')        initGarden();
            if (id === 'sec-juggle')        initJuggle();
            if (id === 'sec-drum')          initDrum();
            if (id === 'sec-rainbow')       initRainbow();
        } else {
            if (id === 'sec-catch-stars')   teardownCatchStars();
            if (id === 'sec-cat-jump')      teardownCatJump();
            if (id === 'sec-juggle')        teardownJuggle();
        }
    });
}, { root: document.querySelector('.scroll-container'), threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
    generateGameStars();
    document.querySelectorAll('.section').forEach(s => gObserver.observe(s));
});

function generateGameStars() {
    ['starsCatch','starsDl'].forEach(id => {
        const c = document.getElementById(id);
        if (!c) return;
        for (let i = 0; i < 40; i++) {
            const s = document.createElement('div');
            s.className = 'star';
            s.style.cssText = `width:${rndG(1,3)}px;height:${s.style.width};left:${rndG(0,100)}%;top:${rndG(0,100)}%;animation-duration:${rndG(1.5,4)}s;animation-delay:${rndG(0,3)}s`;
            c.appendChild(s);
        }
    });
}

/* ════════════════════════════════
   G1: BẮT SAO RƠI
════════════════════════════════ */
let catchInterval, catchScore = 0, catchActive = false;
const STAR_EMOJIS = ['⭐','🌟','✨','💫','🌠'];

function initCatchStars() {
    if (catchActive) return;
    catchActive = true;
    catchScore = 0;
    document.getElementById('catchScore').textContent = '0';
    spawnFallingStar();
    catchInterval = setInterval(spawnFallingStar, 1200);
}

function spawnFallingStar() {
    if (!catchActive) return;
    const area = document.getElementById('catchArea');
    const star = document.createElement('div');
    star.className = 'falling-star';
    star.innerText = pickG(STAR_EMOJIS);
    const dur = rndG(2.5, 5);
    star.style.left = `${rndG(5, 85)}%`;
    star.style.animationDuration = `${dur}s`;
    star.style.fontSize = `${rndG(2, 3.5)}rem`;
    star.addEventListener('click', () => {
        if (star.classList.contains('star-caught')) return;
        star.classList.add('star-caught');
        catchScore++;
        document.getElementById('catchScore').textContent = catchScore;
        setTimeout(() => star.remove(), 400);
    });
    area.appendChild(star);
    setTimeout(() => { if (star.parentNode) star.remove(); }, dur * 1000);
}

function teardownCatchStars() {
    catchActive = false;
    clearInterval(catchInterval);
    const area = document.getElementById('catchArea');
    if (area) area.innerHTML = '';
}

/* ════════════════════════════════
   G2: LÀM BÁNH TRUNG THU
════════════════════════════════ */
let mcToppings = [];
const MC_MAX = 5;
let mcInited = false;

function initMooncake() {
    if (mcInited) return;
    mcInited = true;
}

window.addTopping = function(emoji, name) {
    if (mcToppings.length >= MC_MAX) return;
    mcToppings.push(emoji);
    const layers = document.getElementById('mcLayers');
    const item = document.createElement('div');
    item.className = 'mc-layer-item';
    item.innerText = emoji;
    layers.appendChild(item);

    // Bounce the cake
    const cake = document.getElementById('mcCake');
    cake.style.transform = 'scale(1.2) rotate(5deg)';
    setTimeout(() => cake.style.transform = '', 300);

    // Show result when cake is "complete"
    if (mcToppings.length >= 3) {
        const result = document.getElementById('mcResult');
        const msgs = [
            `🥮 Bánh ${mcToppings.join('')} cực kỳ độc đáo! Chúc Thư ngon miệng!`,
            `✨ Chiếc bánh ${mcToppings.join('')} của Thư đẹp như vũ trụ!`,
            `🌟 Tuyệt vời! Bánh Trung Thu ${mcToppings.join('')} do Thư làm đẹp nhất rồi!`,
        ];
        result.innerText = pickG(msgs);
        result.classList.add('show');
    }
};

/* ════════════════════════════════
   G3: MÈO NHẢY CAO
════════════════════════════════ */
let cjTaps = 0, cjTimerInterval, cjRunning = false, cjTimeLeft = 5, cjInited = false;

function initCatJump() {
    if (cjInited) return;
    cjInited = true;
    const cat = document.getElementById('cjCat');
    cat.addEventListener('click', handleCatJump);
}

function handleCatJump() {
    if (!cjRunning) {
        startCatJumpGame();
        return;
    }
    cjTaps++;
    document.getElementById('cjTaps').textContent = cjTaps;
    // Move cat up
    const cat = document.getElementById('cjCat');
    const pct = Math.min(18 + (cjTaps / 30) * 60, 80);
    cat.style.bottom = `${pct}%`;
    cat.style.fontSize = `${3 + cjTaps * 0.05}rem`;
    // Height bar
    document.getElementById('cjHeightFill').style.height = `${Math.min(cjTaps / 30 * 100, 100)}%`;
}

function startCatJumpGame() {
    cjTaps = 0; cjTimeLeft = 5; cjRunning = true;
    document.getElementById('cjTaps').textContent = '0';
    document.getElementById('cjTimer').textContent = '5s';
    const cat = document.getElementById('cjCat');
    cat.style.bottom = '18%';
    document.getElementById('cjHeightFill').style.height = '0%';
    cjTimerInterval = setInterval(() => {
        cjTimeLeft--;
        document.getElementById('cjTimer').textContent = `${cjTimeLeft}s`;
        if (cjTimeLeft <= 0) {
            clearInterval(cjTimerInterval);
            cjRunning = false;
            const msg = cjTaps >= 30 ? `🏆 ${cjTaps} lần! Mèo chạm trời rồi!` : cjTaps >= 15 ? `⭐ ${cjTaps} lần! Cao lắm rồi!` : `🐱 ${cjTaps} lần! Thử lại nhanh hơn nhé!`;
            document.getElementById('cjTimer').textContent = msg;
        }
    }, 1000);
}

function teardownCatJump() {
    clearInterval(cjTimerInterval);
    cjRunning = false;
}

/* ════════════════════════════════
   G4: KÉO ĐÈN LỒNG
════════════════════════════════ */
let dlInited = false, dlReleased = false;

function initDragLantern() {
    if (dlInited) return;
    dlInited = true;
    const lan = document.getElementById('dlLantern');
    const section = document.getElementById('sec-drag-lantern');
    let startY, startBottom;

    const onStart = (e) => {
        if (dlReleased) return;
        e.preventDefault();
        const touch = e.touches ? e.touches[0] : e;
        startY = touch.clientY;
        startBottom = parseInt(lan.style.bottom) || 25;
        section.addEventListener('touchmove', onMove, { passive: false });
        section.addEventListener('mousemove', onMove);
    };
    const onMove = (e) => {
        if (dlReleased) return;
        e.preventDefault();
        const touch = e.touches ? e.touches[0] : e;
        const dy = startY - touch.clientY;
        const newBottom = Math.min(Math.max(startBottom + (dy / section.clientHeight) * 100, 10), 90);
        lan.style.bottom = `${newBottom}%`;
        // Check if reached finish line (~75% from bottom)
        if (newBottom >= 73) releaseLantern();
    };
    const onEnd = () => {
        section.removeEventListener('touchmove', onMove);
        section.removeEventListener('mousemove', onMove);
    };
    lan.addEventListener('touchstart', onStart, { passive: false });
    lan.addEventListener('mousedown', onStart);
    document.addEventListener('touchend', onEnd);
    document.addEventListener('mouseup', onEnd);
}

function releaseLantern() {
    if (dlReleased) return;
    dlReleased = true;
    const lan = document.getElementById('dlLantern');
    lan.classList.add('released');
    const msg = document.getElementById('dlMsg');
    msg.innerText = '🌕 Ước nguyện của Thư đã bay lên trăng rồi! Chúc điều ước thành sự thật! ✨🏮';
    msg.classList.add('show');
    // Spawn mini lanterns
    setTimeout(() => {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const h = document.createElement('div');
                h.className = 'hoadang';
                h.style.left = `${rndG(10, 90)}%`;
                h.innerHTML = '<div class="hoadang-emoji">🏮</div>';
                document.getElementById('sec-drag-lantern').appendChild(h);
                setTimeout(() => h.remove(), 8000);
            }, i * 300);
        }
    }, 500);
}

/* ════════════════════════════════
   G5: VẼ TỰ DO
════════════════════════════════ */
let drawCanvas, drawCtx, drawActive = false, drawColor = '#ffeb3b', drawInited = false;
const DRAW_COLORS = ['#ffeb3b','#ff6b9d','#00eeff','#ff4b2b','#00ff88'];
let drawColorIdx = 0;

function initDraw() {
    if (drawInited) return;
    drawInited = true;
    drawCanvas = document.getElementById('drawCanvas');
    drawCtx = drawCanvas.getContext('2d');
    const resize = () => {
        const p = drawCanvas.parentElement;
        drawCanvas.width  = p.clientWidth;
        drawCanvas.height = p.clientHeight;
    };
    resize();

    const getPos = (e) => {
        const r = drawCanvas.getBoundingClientRect();
        const t = e.touches ? e.touches[0] : e;
        return { x: t.clientX - r.left, y: t.clientY - r.top };
    };

    drawCanvas.addEventListener('touchstart', e => { e.preventDefault(); drawActive = true; const p = getPos(e); drawCtx.beginPath(); drawCtx.moveTo(p.x, p.y); }, { passive: false });
    drawCanvas.addEventListener('touchmove',  e => { e.preventDefault(); if (!drawActive) return; const p = getPos(e); drawCtx.lineTo(p.x, p.y); drawCtx.strokeStyle = drawColor; drawCtx.lineWidth = 8; drawCtx.lineCap = 'round'; drawCtx.stroke(); }, { passive: false });
    drawCanvas.addEventListener('touchend',   () => { drawActive = false; });
    drawCanvas.addEventListener('mousedown',  e => { drawActive = true; const p = getPos(e); drawCtx.beginPath(); drawCtx.moveTo(p.x, p.y); });
    drawCanvas.addEventListener('mousemove',  e => { if (!drawActive) return; const p = getPos(e); drawCtx.lineTo(p.x, p.y); drawCtx.strokeStyle = drawColor; drawCtx.lineWidth = 8; drawCtx.lineCap = 'round'; drawCtx.stroke(); });
    drawCanvas.addEventListener('mouseup',    () => { drawActive = false; });

    // Mark first color active
    document.querySelector('.dc-1')?.classList.add('active-color');
}

window.setColor = function(c) {
    drawColor = c;
    document.querySelectorAll('.draw-color').forEach(el => el.classList.remove('active-color'));
    // find matching color button
    document.querySelectorAll('.draw-color').forEach(el => {
        if (el.style.background === c) el.classList.add('active-color');
    });
};
window.clearDraw = function() {
    if (drawCtx) drawCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
};

/* ════════════════════════════════
   G6: CUỘN THƯ BÍ MẬT
════════════════════════════════ */
let scrollLetterInited = false;

function initScrollLetter() {
    if (scrollLetterInited) return;
    scrollLetterInited = true;
    const section = document.getElementById('sec-scroll-letter');
    const body = document.getElementById('letterBody');
    let startY;

    section.addEventListener('touchstart', (e) => { startY = e.touches[0].clientY; });
    section.addEventListener('touchend', (e) => {
        const dy = startY - e.changedTouches[0].clientY;
        if (dy > 30) body.classList.add('open');
    });
    section.addEventListener('wheel', (e) => {
        if (e.deltaY > 0) body.classList.add('open');
    });
    // Also open on click
    section.addEventListener('click', () => body.classList.add('open'));
}

/* ════════════════════════════════
   G7: VƯỜN HOA
════════════════════════════════ */
let gardenCount = 0;
const FLOWERS = ['🌸','🌺','🌼','🌻','🌹','💐','🌷','🏵️'];

window.plantFlower = function(e) {
    const area = document.getElementById('gardenArea');
    const rect = area.getBoundingClientRect();
    const flower = document.createElement('div');
    flower.className = 'flower-plant';
    flower.innerText = pickG(FLOWERS);
    flower.style.left = `${e.clientX - rect.left - 20}px`;
    flower.style.top  = `${e.clientY - rect.top - 20}px`;
    area.appendChild(flower);
    gardenCount++;
    document.getElementById('gardenCount').textContent = gardenCount;

    // Occasional butterflies
    if (gardenCount % 5 === 0) {
        const b = document.createElement('div');
        b.innerText = '🦋';
        b.style.cssText = `position:absolute;font-size:2rem;left:${e.clientX - rect.left}px;top:${e.clientY - rect.top}px;animation:flowerGrow 0.6s forwards;pointer-events:none`;
        area.appendChild(b);
        setTimeout(() => b.remove(), 3000);
    }
};

/* ════════════════════════════════
   G8: TUNG HỨNG
════════════════════════════════ */
let juggleScore = 0, juggleBallY = 30, juggleBallVY = 1.5, juggleRaf, juggleInited = false;
const JUGGLE_MSGS = ['Nice! 🎾','Great! ⭐','Combo! 🔥','Amazing! 💫','Perfect! 🏆'];

function initJuggle() {
    if (juggleInited) return;
    juggleInited = true;
    juggleScore = 0;
    animateJuggle();
}

function animateJuggle() {
    juggleRaf = requestAnimationFrame(animateJuggle);
    const ball = document.getElementById('juggleBall');
    if (!ball) return;
    juggleBallY += juggleBallVY;
    juggleBallVY += 0.05; // gravity
    if (juggleBallY >= 70) { juggleBallY = 70; juggleBallVY = -1.5; } // floor bounce auto
    if (juggleBallY <= 25) juggleBallVY = Math.abs(juggleBallVY);
    ball.style.top = `${juggleBallY}%`;
    const x = 40 + Math.sin(Date.now() / 800) * 25;
    ball.style.left = `${x}%`;
}

window.catchBall = function() {
    // Reward if ball is low (below 50%)
    if (juggleBallY >= 45) {
        juggleBallVY = -rndG(2.5, 4); // fling up!
        juggleScore++;
        document.getElementById('juggleScore').textContent = juggleScore;
        const msg = document.getElementById('juggleMsg');
        msg.innerText = pickG(JUGGLE_MSGS);
        msg.classList.add('flash');
        setTimeout(() => msg.classList.remove('flash'), 500);
    }
};

function teardownJuggle() {
    cancelAnimationFrame(juggleRaf);
    juggleInited = false;
}

/* ════════════════════════════════
   G9: TRỐNG HỘI
════════════════════════════════ */
let drumInited = false;

function initDrum() {
    if (drumInited) return;
    drumInited = true;
}

window.hitDrum = function(el, color) {
    el.classList.add('hit');
    setTimeout(() => el.classList.remove('hit'), 150);

    // Create ripple
    const container = document.getElementById('drumRipples');
    const r = el.getBoundingClientRect();
    const cr = container.getBoundingClientRect();
    const ripple = document.createElement('div');
    ripple.className = 'drum-ripple';
    ripple.style.borderColor = color;
    ripple.style.left = `${r.left - cr.left + r.width/2}px`;
    ripple.style.top  = `${r.top  - cr.top  + r.height/2}px`;
    container.appendChild(ripple);
    setTimeout(() => ripple.remove(), 850);

    // Make both lans bounce harder
    document.querySelectorAll('.drum-lan').forEach(lan => {
        lan.style.transform = 'translateY(-25px) scale(1.2)';
        setTimeout(() => lan.style.transform = '', 300);
    });
};

/* ════════════════════════════════
   G10: VẼ CẦU VỒNG
════════════════════════════════ */
let rbCanvas, rbCtx, rbActive = false, rbColor = 0, rbStrokeCount = 0, rbInited = false;
const RB_COLORS = ['#ff0000','#ff7700','#ffff00','#00ff00','#00ccff','#0000ff','#ff00ff'];
const RB_MSGS = [
    '🌈 Cầu vồng của Thư đẹp tuyệt vời!',
    '✨ Bầu trời của Thư lấp lánh rồi!',
    '🎨 Một tác phẩm nghệ thuật! Chúc Thư luôn rực rỡ!',
];

function initRainbow() {
    if (rbInited) return;
    rbInited = true;
    rbCanvas = document.getElementById('rainbowCanvas');
    rbCtx = rbCanvas.getContext('2d');
    const resize = () => {
        rbCanvas.width  = rbCanvas.parentElement.clientWidth;
        rbCanvas.height = rbCanvas.parentElement.clientHeight;
    };
    resize();

    const getPos = (e) => {
        const r = rbCanvas.getBoundingClientRect();
        const t = e.touches ? e.touches[0] : e;
        return { x: t.clientX - r.left, y: t.clientY - r.top };
    };

    rbCanvas.addEventListener('touchstart', (e) => { e.preventDefault(); rbActive = true; const p = getPos(e); rbCtx.beginPath(); rbCtx.moveTo(p.x, p.y); }, { passive: false });
    rbCanvas.addEventListener('touchmove',  (e) => {
        e.preventDefault();
        if (!rbActive) return;
        const p = getPos(e);
        rbCtx.lineTo(p.x, p.y);
        rbCtx.strokeStyle = RB_COLORS[rbColor % RB_COLORS.length];
        rbCtx.lineWidth = 12; rbCtx.lineCap = 'round'; rbCtx.lineJoin = 'round';
        rbCtx.globalAlpha = 0.85;
        rbCtx.stroke();
    }, { passive: false });
    rbCanvas.addEventListener('touchend', (e) => {
        rbActive = false; rbColor++; rbStrokeCount++;
        rbCtx.beginPath();
        if (rbStrokeCount >= 4) {
            const msg = document.getElementById('rbCompleteMsg');
            msg.innerText = pickG(RB_MSGS);
            msg.classList.add('show');
        }
    });

    // Mouse support
    rbCanvas.addEventListener('mousedown', (e) => { rbActive = true; const p = getPos(e); rbCtx.beginPath(); rbCtx.moveTo(p.x, p.y); });
    rbCanvas.addEventListener('mousemove', (e) => {
        if (!rbActive) return;
        const p = getPos(e);
        rbCtx.lineTo(p.x, p.y);
        rbCtx.strokeStyle = RB_COLORS[rbColor % RB_COLORS.length];
        rbCtx.lineWidth = 12; rbCtx.lineCap = 'round';
        rbCtx.globalAlpha = 0.85; rbCtx.stroke();
    });
    rbCanvas.addEventListener('mouseup', () => { rbActive = false; rbColor++; rbStrokeCount++; rbCtx.beginPath(); });
}
