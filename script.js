document.addEventListener('DOMContentLoaded', () => {
    generateStars('starsContainer');
    generateStars('starsContainer2');
    generateStars('starsGallery');
    setupFireworks();
    setupScrollObserver();
    setupCharacterInteractions();
    setupBackgroundMusic();
});

const rnd = (min, max) => Math.random() * (max - min) + min;
const pick = arr => arr[Math.floor(Math.random() * arr.length)];

/* ═══════════════════════════════════════════
   STARS
═══════════════════════════════════════════ */
function generateStars(id) {
    const c = document.getElementById(id);
    if (!c) return;
    for (let i = 0; i < 60; i++) {
        const s = document.createElement('div');
        s.className = 'star';
        s.style.cssText = `width:${rnd(1,4)}px;height:${s.style.width};left:${rnd(0,100)}%;top:${rnd(0,100)}%;animation-duration:${rnd(1.5,4)}s;animation-delay:${rnd(0,3)}s`;
        c.appendChild(s);
    }
}

/* ═══════════════════════════════════════════
   CHARACTER INTERACTIONS (always-on)
═══════════════════════════════════════════ */
function setupCharacterInteractions() {
    // Rabbit dancer in gallery bounces faster when tapped
    const rabbit = document.getElementById('rabbitDancer');
    if (rabbit) rabbit.addEventListener('click', () => {
        rabbit.style.animationDuration = '0.3s';
        spawnEmoji(rabbit, '💖');
        setTimeout(() => rabbit.style.animationDuration = '0.8s', 1500);
    });

    // Grass rabbit hops to random position
    const gRabbit = document.getElementById('grassRabbit');
    if (gRabbit) gRabbit.addEventListener('click', () => {
        gRabbit.style.left = `${rnd(15, 70)}%`;
        spawnEmoji(gRabbit, pick(['🥕','✨','🌟']));
    });

    // Astronaut cat
    const astro = document.querySelector('.astronaut-cat');
    if (astro) astro.addEventListener('click', () => {
        spawnEmoji(astro, pick(['🚀','⭐','💫','🛸']));
        astro.style.transform = 'rotate(360deg) translateY(-60px)';
        setTimeout(() => astro.style.transform = '', 800);
    });

    // Space cats
    document.querySelectorAll('.space-cat').forEach(cat => {
        cat.addEventListener('click', () => {
            spawnEmoji(cat, pick(['💫','🌟','⚡','🎇']));
        });
    });

    // Lan dancer at top
    const lanDancer = document.getElementById('lanDancer');
    if (lanDancer) lanDancer.addEventListener('click', () => {
        const head = lanDancer.querySelector('.lan-head');
        head.style.transform = 'scale(1.5) rotate(20deg)';
        spawnEmoji(lanDancer, pick(['🎊','🎉','✨']));
        setTimeout(() => head.style.transform = '', 500);
    });
}

// Helper: spawn a floating emoji near an element
function spawnEmoji(el, emoji) {
    const span = document.createElement('span');
    span.innerText = emoji;
    span.style.cssText = `
        position:fixed; font-size:2rem; pointer-events:none; z-index:9999;
        animation: spawnUp 1.2s ease-out forwards;
    `;
    const r = el.getBoundingClientRect();
    span.style.left = `${r.left + r.width/2}px`;
    span.style.top  = `${r.top}px`;
    document.body.appendChild(span);
    setTimeout(() => span.remove(), 1300);
}

// Inject keyframe for spawnUp globally
const style = document.createElement('style');
style.innerHTML = `@keyframes spawnUp { from { transform: translateY(0) scale(0.5); opacity: 1; } to { transform: translateY(-80px) scale(1.3); opacity: 0; } }`;
document.head.appendChild(style);

/* ═══════════════════════════════════════════
   SECTION INTERACTIONS
═══════════════════════════════════════════ */

// S1: Click canvas → shoot fireworks at tap position
document.getElementById('sec-fireworks').addEventListener('click', (e) => {
    if (!fwActive) return;
    const rect = canvas.getBoundingClientRect();
    for (let i = 0; i < 3; i++) {
        const color = pick(fwColors);
        rockets.push({
            x: (e.clientX - rect.left) + rnd(-15, 15),
            y: canvas.height,
            targetY: (e.clientY - rect.top) + rnd(-20, 20),
            color, vy: rnd(-18, -12)
        });
    }
});

// S2: Moon tap
window.pokeMoon = function () {
    const msg = document.getElementById('moonMsg');
    msg.classList.add('show-popup');
    setTimeout(() => msg.classList.remove('show-popup'), 3000);
};

// S2: Cat wave
window.catWave = function (el) {
    el.style.transform = 'scale(1.6) rotate(20deg)';
    el.innerText = pick(['😻','🙀','😸','😹']);
    spawnEmoji(el, pick(['❤️','✨','🎶','💛']));
    setTimeout(() => { el.style.transform = ''; el.innerText = pick(['🐱','😺','🐈']); }, 800);
};

// S3: Like Photo (orbit version - parent may be orbit-photo)
window.likePhoto = function (el) {
    const overlay = document.createElement('div');
    overlay.className = 'like-overlay';
    overlay.innerText = pick(['❤️ Thả tim!', '✨ Xinh quá!', '🌟 Đáng yêu!', '🥰 Cute!']);
    el.appendChild(overlay);
    setTimeout(() => overlay.remove(), 1600);
};

// S4: Burst names on tap
const WISHES = [
    'Đào Anh Thư ✨', 'Thư Xinh Đẹp 🌟', 'Trung Thu Vui 🥮',
    'Luôn Hạnh Phúc 🎉', 'Thư Đáng Yêu 🐇', 'Bình An Hạnh Phúc 🏮',
    'Vạn Sự Như Ý 🎇', 'Thư Thông Minh 💡', 'May Mắn Cả Năm 🍀'
];
window.burstNames = function (e) {
    const container = document.getElementById('wishesContainer');
    for (let i = 0; i < 6; i++) {
        const w = document.createElement('div');
        w.className = 'wish-item burst-item';
        w.innerText = pick(WISHES);
        const pct = ((e.clientX) / window.innerWidth) * 100;
        w.style.left = `${pct + rnd(-20, 20)}%`;
        w.style.top  = `${e.clientY - 20}px`;
        container.appendChild(w);
        setTimeout(() => w.remove(), 1900);
    }
};

// S5: Spawn big lantern
window.spawnBigLantern = function (e) {
    const container = document.getElementById('riverContainer');
    const h = document.createElement('div');
    h.className = 'hoadang giant-hoadang';
    h.style.left = `${(e.clientX / window.innerWidth) * 100 - 5}%`;
    h.innerHTML = '<div class="hoadang-emoji">🏮</div>';
    container.appendChild(h);
    setTimeout(() => h.remove(), 8500);
};

// S6: Lantern message
window.openLanternMsg = function () {
    const msg = document.getElementById('lanternMsg');
    msg.classList.add('show-msg');
    setTimeout(() => msg.classList.remove('show-msg'), 5000);
};

// S7: Burst stars at tap
window.burstStars = function (e) {
    const container = document.getElementById('heartsContainer');
    const emojis = ['🌟','⭐','✨','💫','🌠','⚡'];
    for (let i = 0; i < 10; i++) {
        const h = document.createElement('div');
        h.className = 'heart';
        h.innerText = pick(emojis);
        h.style.left    = `${rnd(0, 100)}%`;
        h.style.bottom  = `${rnd(0, 30)}%`;
        h.style.fontSize = `${rnd(1.5, 4)}rem`;
        container.appendChild(h);
        setTimeout(() => h.remove(), 6100);
    }
};

// S8: Fortune Card flip
const FORTUNES = [
    '🌟 Thư sẽ gặp nhiều may mắn và điều tốt đẹp trong năm tới!',
    '🥮 Trung thu này Thư sẽ nhận được nhiều quà và niềm vui bất ngờ!',
    '🌙 Ánh trăng mang đến cho Thư bình an và sức khỏe dồi dào!',
    '🎉 Mọi ước mơ của Thư sẽ sớm thành hiện thực!',
    '🐰 Thỏ Ngọc tiên tri: Thư sẽ có một năm cực kỳ rực rỡ!',
    '✨ Vũ trụ gửi đến Thư vô vàn ngôi sao may mắn!',
];
let flippedCards = 0;
window.flipCard = function(idx) {
    const card = document.getElementById(`fc${idx}`);
    if (card.classList.contains('flipped')) return;
    card.classList.add('flipped');
    flippedCards++;
    // Fill back content
    const fortune = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
    document.getElementById(`fcb${idx}`).innerText = fortune;
    // After all 3 flipped OR first flip, show result
    const result = document.getElementById('fortuneResult');
    result.innerText = `🔮 Lời tiên tri của Thư:
${fortune}`;
    result.classList.add('show');
};

// Removed: spinMoon (section redesigned)

// S9: Summon meteors
window.summonMeteors = function () {
    const container = document.getElementById('meteorShower');
    for (let i = 0; i < 12; i++) {
        setTimeout(() => {
            const m = document.createElement('div');
            m.className = 'meteor fast-meteor';
            m.style.top  = `${rnd(-20, 30)}%`;
            m.style.left = `${rnd(60, 160)}%`;
            container.appendChild(m);
            setTimeout(() => m.remove(), 600);
        }, i * 80);
    }
};

// S10: Open gift
window.openGift = function () {
    const box = document.getElementById('giftBox');
    box.classList.add('opened');
    box.innerText = '🎊';
    document.getElementById('giftMsg').classList.add('show-msg');
    // Extra confetti burst
    const colors = ['#ff4b2b','#ffda00','#00eeff','#ff00aa','#00ff88'];
    const container = document.getElementById('confettiContainer');
    for (let i = 0; i < 40; i++) {
        const c = document.createElement('div');
        c.className = 'confetti';
        c.style.left = `${rnd(0,100)}%`;
        c.style.background = pick(colors);
        c.style.animationDuration = `${rnd(1.5,3)}s`;
        c.style.animationDelay    = `${rnd(0,1)}s`;
        container.appendChild(c);
        setTimeout(() => c.remove(), 3100);
    }
};

/* ═══════════════════════════════════════════
   AUTO ANIMATIONS PER SECTION
═══════════════════════════════════════════ */
let activeIntervals = {};

function setupScrollObserver() {
    const root = document.querySelector('.scroll-container');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(({ target, isIntersecting }) => {
            const id = target.id;
            if (isIntersecting) {
                if (id === 'sec-fireworks')  startFireworks();
                if (id === 'sec-wishes')     startAutoWishes();
                if (id === 'sec-hoadang')    startHoaDang();
                if (id === 'sec-stars')      startFloatingStars();
                if (id === 'sec-meteor')     startMeteors();
                if (id === 'sec-gift')       startConfetti();
            } else {
                if (id === 'sec-fireworks')  stopFireworks();
                if (id === 'sec-wishes')     killInterval('wishes');
                if (id === 'sec-hoadang')    killInterval('hoadang');
                if (id === 'sec-stars')      killInterval('stars');
                if (id === 'sec-meteor')     killInterval('meteors');
                if (id === 'sec-gift')       killInterval('confetti');
            }
        });

    }, { root, threshold: 0.5 });

    document.querySelectorAll('.section').forEach(s => observer.observe(s));
}

function killInterval(key) {
    if (activeIntervals[key]) { clearInterval(activeIntervals[key]); activeIntervals[key] = null; }
}

// Auto wishes rain
function startAutoWishes() {
    if (activeIntervals['wishes']) return;
    const c = document.getElementById('wishesContainer');
    activeIntervals['wishes'] = setInterval(() => {
        const w = document.createElement('div');
        w.className = 'wish-item';
        w.innerText = pick(WISHES);
        w.style.left = `${rnd(8, 72)}%`;
        w.style.transform = `rotate(${rnd(-15,15)}deg)`;
        c.appendChild(w);
        setTimeout(() => w.remove(), 5100);
    }, 650);
}

// Hoa đăng auto
function startHoaDang() {
    if (activeIntervals['hoadang']) return;
    const c = document.getElementById('riverContainer');
    activeIntervals['hoadang'] = setInterval(() => {
        const h = document.createElement('div');
        h.className = 'hoadang';
        h.style.left = `${rnd(8,88)}%`;
        h.innerHTML  = '<div class="hoadang-emoji">🏮</div>';
        c.appendChild(h);
        setTimeout(() => h.remove(), 8500);
    }, 900);
}

// Floating stars auto
function startFloatingStars() {
    if (activeIntervals['stars']) return;
    const c = document.getElementById('heartsContainer');
    const emojis = ['🌟','⭐','✨','💫'];
    activeIntervals['stars'] = setInterval(() => {
        const h = document.createElement('div');
        h.className  = 'heart';
        h.innerText  = pick(emojis);
        h.style.left = `${rnd(5,90)}%`;
        h.style.fontSize = `${rnd(1.5,3.5)}rem`;
        c.appendChild(h);
        setTimeout(() => h.remove(), 6100);
    }, 450);
}

// Meteors auto
function startMeteors() {
    if (activeIntervals['meteors']) return;
    const c = document.getElementById('meteorShower');
    activeIntervals['meteors'] = setInterval(() => {
        const m = document.createElement('div');
        m.className  = 'meteor';
        m.style.top  = `${rnd(-40,20)}%`;
        m.style.left = `${rnd(50,150)}%`;
        c.appendChild(m);
        setTimeout(() => m.remove(), 1600);
    }, 350);
}

// Confetti auto
function startConfetti() {
    if (activeIntervals['confetti']) return;
    const c = document.getElementById('confettiContainer');
    const colors = ['#ff4b2b','#ffda00','#00eeff','#ff00aa','#00ff88','#ff6600'];
    activeIntervals['confetti'] = setInterval(() => {
        const el = document.createElement('div');
        el.className = 'confetti';
        el.style.left = `${rnd(0,100)}%`;
        el.style.background = pick(colors);
        el.style.animationDuration = `${rnd(2,4)}s`;
        el.style.animationDelay    = `${rnd(0,0.5)}s`;
        c.appendChild(el);
        setTimeout(() => el.remove(), 4100);
    }, 180);
}

/* ═══════════════════════════════════════════
   FIREWORKS CANVAS
═══════════════════════════════════════════ */
let canvas, ctx, particles = [], rockets = [], fwActive = false, fwAnimId;
const fwColors = ['#ff0044','#00ff88','#4400ff','#ffdd00','#00eeff','#ff00cc','#ff6600'];

function setupFireworks() {
    canvas = document.getElementById('fireworksCanvas');
    ctx    = canvas.getContext('2d');
    const resize = () => {
        canvas.width  = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', resize);
    resize();
}

function shootFirework(tx, ty) {
    if (!fwActive) return;
    const x = tx ?? rnd(canvas.width * .1, canvas.width * .9);
    const targetY = ty ?? rnd(canvas.height * .08, canvas.height * .45);
    rockets.push({ x, y: canvas.height, targetY, color: pick(fwColors), vy: rnd(-14, -9) });
}

function startFireworks() {
    if (fwActive) return;
    fwActive = true;
    animateFW();
    shootFirework(); setTimeout(shootFirework, 200); setTimeout(shootFirework, 400);
    activeIntervals['fireworks'] = setInterval(shootFirework, 900);
}

function stopFireworks() {
    fwActive = false;
    cancelAnimationFrame(fwAnimId);
    killInterval('fireworks');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = []; rockets = [];
}

function animateFW() {
    if (!fwActive) return;
    fwAnimId = requestAnimationFrame(animateFW);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0,0,0,0.28)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'lighter';

    for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.y += r.vy; r.vy += 0.12;
        ctx.fillStyle = r.color;
        ctx.beginPath(); ctx.arc(r.x, r.y, 3, 0, Math.PI * 2); ctx.fill();
        if (r.vy >= -1 || r.y <= r.targetY) {
            for (let p = 0; p < 50; p++) {
                const angle = rnd(0, Math.PI * 2), speed = rnd(2, 7);
                particles.push({
                    x: r.x, y: r.y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
                    color: r.color, alpha: 1, decay: rnd(0.012, 0.028)
                });
            }
            rockets.splice(i, 1);
        }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy; p.vy += 0.07;
        p.alpha -= p.decay;
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle   = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2); ctx.fill();
        if (p.alpha <= 0) particles.splice(i, 1);
    }
    ctx.globalAlpha = 1;
}

/* ═══════════════════════════════════════════
   🎵 BACKGROUND MUSIC (nhac.mp3) - Full Loop & Repeat
═══════════════════════════════════════════ */
function setupBackgroundMusic() {
    const audio = document.getElementById('bgMusic');
    const toggleBtn = document.getElementById('musicToggleBtn');
    if (!audio) return;

    const musicLabel = toggleBtn ? toggleBtn.querySelector('.music-label') : null;

    // Thiết lập lặp vô tận (full repeat)
    audio.loop = true;
    audio.volume = 0.85;

    // Đảm bảo bài hát lặp lại vô tận ngay cả khi browser có bug loop
    audio.addEventListener('ended', () => {
        audio.currentTime = 0;
        audio.play().catch(() => {});
    });

    const updateBtnUI = (playing) => {
        if (!toggleBtn) return;
        if (playing) {
            toggleBtn.classList.add('is-playing');
            toggleBtn.classList.remove('is-paused');
            if (musicLabel) musicLabel.textContent = 'Nhạc Trung Thu';
        } else {
            toggleBtn.classList.remove('is-playing');
            toggleBtn.classList.add('is-paused');
            if (musicLabel) musicLabel.textContent = 'Bật Nhạc 🎶';
        }
    };

    let userStarted = false;

    const playMusic = () => {
        const promise = audio.play();
        if (promise !== undefined) {
            promise.then(() => {
                userStarted = true;
                updateBtnUI(true);
            }).catch(() => {
                updateBtnUI(false);
            });
        }
    };

    // Thử tự động phát ngay khi vào trang
    playMusic();

    // Mở khóa âm thanh ở tương tác đầu tiên nếu trình duyệt chặn autoplay
    const unlockAudio = () => {
        if (!userStarted || audio.paused) {
            playMusic();
        }
        removeUnlockEvents();
    };

    const scrollContainer = document.querySelector('.scroll-container');
    const unlockEvents = ['click', 'touchstart', 'touchend', 'pointerdown', 'keydown'];

    function removeUnlockEvents() {
        unlockEvents.forEach(evt => {
            window.removeEventListener(evt, unlockAudio);
            document.removeEventListener(evt, unlockAudio);
            if (scrollContainer) scrollContainer.removeEventListener(evt, unlockAudio);
        });
        if (scrollContainer) scrollContainer.removeEventListener('scroll', unlockAudio);
        window.removeEventListener('scroll', unlockAudio);
    }

    unlockEvents.forEach(evt => {
        window.addEventListener(evt, unlockAudio, { once: true, passive: true });
        document.addEventListener(evt, unlockAudio, { once: true, passive: true });
        if (scrollContainer) scrollContainer.addEventListener(evt, unlockAudio, { once: true, passive: true });
    });
    if (scrollContainer) scrollContainer.addEventListener('scroll', unlockAudio, { once: true, passive: true });
    window.addEventListener('scroll', unlockAudio, { once: true, passive: true });

    // Nút Bật/Tắt nhạc nổi cố định trên màn hình
    if (toggleBtn) {
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (audio.paused) {
                audio.play().then(() => {
                    userStarted = true;
                    updateBtnUI(true);
                }).catch(err => console.log('Audio play error:', err));
            } else {
                audio.pause();
                updateBtnUI(false);
            }
        });
    }

    // Lắng nghe sự kiện audio
    audio.addEventListener('play', () => updateBtnUI(true));
    audio.addEventListener('pause', () => updateBtnUI(false));
}

