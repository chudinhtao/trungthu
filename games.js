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
            if (id === 'sec-wheel')         initWheel();
            if (id === 'sec-scroll-letter') initScrollLetter();
            if (id === 'sec-garden')        initGarden();
            if (id === 'sec-juggle')        initJuggle();
            if (id === 'sec-drum')          initDrum();
            if (id === 'sec-lantern-river') initRiverLanterns();
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
    ['starsCatch','starsDl','starsWheel'].forEach(id => {
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
    lan.addEventListener('click', () => {
        if (!dlReleased) releaseLantern();
    });
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
   G5: VÒNG QUAY MAY MẮN 🎡
════════════════════════════════ */
let wheelInited = false;
let wheelSpinning = false;
let currentWheelRotation = 0;

const WHEEL_SECTORS = [
    { label: 'Bánh Phúc',  icon: '🥮', color: '#ffb300', textColor: '#331500', title: '🥮 Bánh Phúc Lành!', desc: 'Nhận 1 chiếc bánh Trung Thu đầy ắp may mắn, bình an & tài lộc!' },
    { label: 'Thỏ Quà',    icon: '🐰', color: '#ec407a', textColor: '#ffffff', title: '🐰 Thỏ Ngọc Trao Quà!', desc: 'Thỏ Ngọc gửi ngàn lời chúc bình an và nụ cười rạng rỡ đến Thư!' },
    { label: 'Như Ý',      icon: '🌟', color: '#7e57c2', textColor: '#ffffff', title: '🌟 Vạn Sự Như Ý!', desc: 'Mọi ước mơ và dự định của Thư trong mùa trăng này đều thành hiện thực!' },
    { label: 'Xinh Đẹp',   icon: '💖', color: '#ff5252', textColor: '#ffffff', title: '💖 Xinh Đẹp Rạng Ngời!', desc: 'Chúc Đào Anh Thư luôn luôn xinh xắn, đáng yêu và tự tin tỏa sáng!' },
    { label: 'May Mắn',    icon: '🍀', color: '#26a69a', textColor: '#ffffff', title: '🍀 May Mắn Cả Năm!', desc: 'Vận may nhân đôi, học tập và mọi việc trong năm đều hanh thông rực rỡ!' },
    { label: 'Trăng Vàng', icon: '🌕', color: '#ffd54f', textColor: '#331500', title: '🌕 Trăng Vàng Tỏa Sáng!', desc: 'Tỏa sáng như vầng trăng rằm tháng Tám, rạng ngời và ấm áp nhất!' },
    { label: 'Bình An',    icon: '🏮', color: '#ab47bc', textColor: '#ffffff', title: '🏮 Bình An Hạnh Phúc!', desc: 'Gia đình an khang, Thư luôn vui vẻ, mạnh khỏe và yêu đời mỗi ngày!' },
    { label: 'Anh Thư VIP',icon: '👑', color: '#ff7043', textColor: '#ffffff', title: '👑 Đào Anh Thư VIP!', desc: 'Thư là cô gái tuyệt vời và đáng yêu nhất mùa lễ hội Trung Thu!' }
];

function initWheel() {
    if (wheelInited) return;
    wheelInited = true;
    drawWheelCanvas();
}

function drawWheelCanvas() {
    const canvas = document.getElementById('wheelCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const numSectors = WHEEL_SECTORS.length;
    const arc = (2 * Math.PI) / numSectors;
    const radius = canvas.width / 2;
    const cx = radius;
    const cy = radius;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < numSectors; i++) {
        const startAngle = i * arc;
        const endAngle = startAngle + arc;

        // Vẽ từng cánh quạt
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius - 4, startAngle, endAngle);
        ctx.fillStyle = WHEEL_SECTORS[i].color;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Vẽ biểu tượng và chữ
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(startAngle + arc / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = WHEEL_SECTORS[i].textColor;
        ctx.font = 'bold 15px Quicksand, sans-serif';
        ctx.fillText(WHEEL_SECTORS[i].icon + ' ' + WHEEL_SECTORS[i].label, radius - 16, 5);
        ctx.restore();
    }

    // Vòng tròn trang trí tâm
    ctx.beginPath();
    ctx.arc(cx, cy, 38, 0, 2 * Math.PI);
    ctx.fillStyle = '#1c0836';
    ctx.fill();
    ctx.strokeStyle = '#ffda00';
    ctx.lineWidth = 3;
    ctx.stroke();
}

window.spinWheel = function() {
    if (wheelSpinning) return;
    wheelSpinning = true;
    const disc = document.getElementById('wheelDisc');
    const spinBtn = document.getElementById('wheelSpinBtn');
    if (spinBtn) spinBtn.classList.add('spinning');

    // Chọn ngẫu nhiên 1 ô may mắn
    const targetIdx = Math.floor(Math.random() * WHEEL_SECTORS.length);
    const numSectors = WHEEL_SECTORS.length;
    const sectorAngle = 360 / numSectors;

    const targetSectorCenter = (targetIdx + 0.5) * sectorAngle;
    const extraSpins = 360 * (5 + Math.floor(Math.random() * 3));
    
    const currentMod = currentWheelRotation % 360;
    const desiredFinalMod = (270 - targetSectorCenter + 360) % 360;
    let delta = desiredFinalMod - currentMod;
    if (delta <= 0) delta += 360;
    
    currentWheelRotation += extraSpins + delta;

    const discWrap = document.querySelector('.wheel-disc-wrap');
    if (discWrap) {
        discWrap.style.transform = `rotate(${currentWheelRotation}deg)`;
    }

    setTimeout(() => {
        wheelSpinning = false;
        if (spinBtn) spinBtn.classList.remove('spinning');
        showWheelResult(WHEEL_SECTORS[targetIdx]);
    }, 4100);
};

function showWheelResult(prize) {
    const modal = document.getElementById('wheelModal');
    const icon = document.getElementById('wmIcon');
    const title = document.getElementById('wmTitle');
    const desc = document.getElementById('wmDesc');
    if (!modal) return;

    if (icon) icon.innerText = prize.icon;
    if (title) title.innerText = prize.title;
    if (desc) desc.innerText = prize.desc;

    modal.classList.add('show');
}

window.closeWheelModal = function() {
    const modal = document.getElementById('wheelModal');
    if (modal) modal.classList.remove('show');
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
   G10: THẢ HOA ĐĂNG CẦU NGUYỆN 🪷
════════════════════════════════ */
let riverInited = false;
let riverCount = 0;
const RIVER_FLOWERS = ['🪷', '🌸', '🌼', '🌺', '🪻'];
const RIVER_WISHES = [
    'Thư Bình An 🕊️', 'Thư Hạnh Phúc 💖', 'Vạn Sự Như Ý ✨',
    'Luôn Tỏa Sáng 🌟', 'May Mắn Cả Năm 🍀', 'Xinh Đẹp Rạng Ngời 🌸',
    'Ước Gì Được Nấy 🌕', 'Bình Yên Thanh Thản 🏮', 'Nụ Cười Luôn Nở 😊'
];

function initRiverLanterns() {
    if (riverInited) return;
    riverInited = true;

    // Tự thả sẵn 2 hoa đăng ban đầu bập bềnh
    setTimeout(() => createFloatingLantern(25, 60, pickG(RIVER_WISHES)), 400);
    setTimeout(() => createFloatingLantern(65, 75, pickG(RIVER_WISHES)), 1200);
}

function createFloatingLantern(xPercent, yPercent, wishText) {
    const container = document.getElementById('riverLanternsContainer');
    if (!container) return;

    const item = document.createElement('div');
    item.className = 'river-lantern-item';
    item.style.left = `${Math.max(10, Math.min(xPercent, 82))}%`;
    item.style.top = `${Math.max(20, Math.min(yPercent, 80))}%`;

    const flowerEmoji = pickG(RIVER_FLOWERS);

    item.innerHTML = `
        <div class="rl-wish-tag">${wishText}</div>
        <div class="rl-flower">
            <span class="rl-flame">🕯️</span>
            ${flowerEmoji}
        </div>
        <div class="rl-ripple"></div>
    `;

    container.appendChild(item);

    // Tự biến mất sau 12.5s
    setTimeout(() => {
        if (item.parentElement) item.remove();
    }, 12500);
}

window.spawnRiverLantern = function(e) {
    const section = document.getElementById('sec-lantern-river');
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const touch = e.touches ? e.touches[0] : e;
    const clientX = touch.clientX !== undefined ? touch.clientX : e.clientX;
    const clientY = touch.clientY !== undefined ? touch.clientY : e.clientY;

    const xPercent = ((clientX - rect.left) / rect.width) * 100;
    let yPercent = ((clientY - rect.top) / rect.height) * 100;
    if (yPercent < 35) yPercent = rndG(42, 75);

    riverCount++;
    const countEl = document.getElementById('riverCount');
    if (countEl) countEl.innerText = riverCount;

    const wish = pickG(RIVER_WISHES);
    createFloatingLantern(xPercent, yPercent, wish);
};
