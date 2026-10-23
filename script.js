/* ==========================================================================
   MOAAZ STORE PLATFORM - ADVANCED MASTER JAVASCRIPT LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initSearchLogic();
    initThemeToggle();
    initFilterPills();
    initClickerGame();
    initMemoryGame();
});

// Toast Notification System
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fa-solid fa-circle-check" style="color: var(--accent-blue);"></i>
        <span>${message}</span>
    `;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

// Download Handler
function triggerDownload(appName, fileName) {
    showToast(`جاري تجهيز وبدء تحميل "${appName}" (${fileName})...`, 'success');
    
    // محاكاة تحريك عداد التنزيل الإجمالي
    const downloadCounter = document.getElementById('totalDownloadsCount');
    let current = parseInt(downloadCounter.innerText.replace(',', ''));
    downloadCounter.innerText = (current + 1).toLocaleString();
}

// Favorite Toggle
function toggleFavorite(btn, appName) {
    btn.classList.toggle('active');
    const isFav = btn.classList.contains('active');
    const icon = btn.querySelector('i');
    
    if(isFav) {
        icon.className = 'fa-solid fa-heart';
        showToast(`تمت إضافة "${appName}" إلى قائمة المفضلة ❤️`);
    } else {
        icon.className = 'fa-regular fa-heart';
        showToast(`تمت إزالة "${appName}" من المفضلة`);
    }
}

// Search Functionality
function initSearchLogic() {
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearSearch');
    const cards = document.querySelectorAll('.app-card');
    const cardsCount = document.getElementById('cardsCount');

    searchInput.addEventListener('input', (e) => {
        const val = e.target.value.toLowerCase().trim();
        clearBtn.style.display = val ? 'block' : 'none';
        
        let visibleCount = 0;
        cards.forEach(card => {
            const name = card.getAttribute('data-name').toLowerCase();
            if (name.includes(val)) {
                card.style.display = 'flex';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        cardsCount.innerText = `${visibleCount} تطبيقات`;
    });

    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
    });
}

// Category Filtering
function initFilterPills() {
    const pills = document.querySelectorAll('.pill');
    const cards = document.querySelectorAll('.app-card');

    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            pills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            const filter = pill.getAttribute('data-filter');
            cards.forEach(card => {
                const cat = card.getAttribute('data-category');
                if (filter === 'all' || cat === filter) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Theme Toggle System
function initThemeToggle() {
    const themeBtn = document.getElementById('themeToggle');
    themeBtn.addEventListener('click', () => {
        const isLight = document.body.getAttribute('data-theme') === 'light';
        if (isLight) {
            document.body.removeAttribute('data-theme');
            themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
            showToast('تم التفعيل: الثيم الداكن');
        } else {
            document.body.setAttribute('data-theme', 'light');
            themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
            showToast('تم التفعيل: الثيم الفاتح');
        }
    });
}

// Game Viewport Switcher
function switchGame(gameId) {
    document.querySelectorAll('.game-viewport').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.g-btn').forEach(b => b.classList.remove('active'));
    
    document.getElementById(gameId).classList.add('active');
    event.currentTarget.classList.add('active');
}

// Scroll Helper
function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

/* ==========================================================================
   GAME 1: CLICKER CHALLENGE
   ========================================================================== */
let clickScore = 0;
let clickTimer = 15;
let clickTimerInterval = null;
let clickHighScore = 0;

function initClickerGame() {}

function startClickerGame() {
    resetClickerGame();
    document.getElementById('clickerBtn').disabled = false;
    showToast('بدأت اللعبة! انقر بأسرع ما يمكنك!');

    clickTimerInterval = setInterval(() => {
        clickTimer--;
        document.getElementById('clickTimer').innerText = clickTimer;

        if (clickTimer <= 0) {
            clearInterval(clickTimerInterval);
            document.getElementById('clickerBtn').disabled = true;
            if (clickScore > clickHighScore) {
                clickHighScore = clickScore;
                document.getElementById('clickHighScore').innerText = clickHighScore;
                showToast(`🎉 إنجاز جديد! أعلى سكور: ${clickHighScore}`, 'success');
            } else {
                showToast(`انتهى الوقت! مجموع نقراتك: ${clickScore}`);
            }
        }
    }, 1000);
}

function registerClick() {
    clickScore++;
    document.getElementById('clickScore').innerText = clickScore;
}

function resetClickerGame() {
    clearInterval(clickTimerInterval);
    clickScore = 0;
    clickTimer = 15;
    document.getElementById('clickScore').innerText = '0';
    document.getElementById('clickTimer').innerText = '15';
    document.getElementById('clickerBtn').disabled = true;
}

/* ==========================================================================
   GAME 2: MEMORY MATCH
   ========================================================================== */
const memoryIcons = ['🎮', '🚀', '🤖', '⚡', '🔥', '💎'];
let memoryCards = [];
let flippedCards = [];
let matchedPairs = 0;
let memoryMoves = 0;

function initMemoryGame() {
    const grid = document.getElementById('memoryGrid');
    grid.innerHTML = '';
    flippedCards = [];
    matchedPairs = 0;
    memoryMoves = 0;
    document.getElementById('memoryMoves').innerText = '0';
    document.getElementById('memoryPairs').innerText = '0 / 6';

    const deck = [...memoryIcons, ...memoryIcons].sort(() => Math.random() - 0.5);

    deck.forEach((icon, idx) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.icon = icon;
        card.dataset.index = idx;
        card.addEventListener('click', () => handleMemoryFlip(card));
        grid.appendChild(card);
    });
}

function handleMemoryFlip(card) {
    if (flippedCards.length >= 2 || card.classList.contains('flipped') || card.classList.contains('matched')) return;

    card.classList.add('flipped');
    card.innerText = card.dataset.icon;
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        memoryMoves++;
        document.getElementById('memoryMoves').innerText = memoryMoves;

        const [card1, card2] = flippedCards;
        if (card1.dataset.icon === card2.dataset.icon) {
            card1.classList.add('matched');
            card2.classList.add('matched');
            matchedPairs++;
            document.getElementById('memoryPairs').innerText = `${matchedPairs} / 6`;
            flippedCards = [];

            if (matchedPairs === 6) {
                showToast(`🏆 مبروك! أنهيت اللعبة في ${memoryMoves} حركات!`, 'success');
            }
        } else {
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                card1.innerText = '';
                card2.innerText = '';
                flippedCards = [];
            }, 800);
        }
    }
}

/* ==========================================================================
   SIMULATOR 3: ARDUINO L293D
   ========================================================================== */
function sendCarCommand(cmd) {
    const statusText = document.getElementById('carStateStatus');
    const wheels = document.querySelectorAll('.wheel');
    const log = document.getElementById('serialLog');

    let timeString = new Date().toLocaleTimeString();

    if (cmd === 'FORWARD') {
        statusText.innerText = 'للأمام FORWARD';
        statusText.style.color = '#22c55e';
        wheels.forEach(w => w.classList.add('spinning'));
        log.innerHTML += `<br>[${timeString}] RX: 'F' -> Motors Forward (PWM: 255)`;
    } else if (cmd === 'BACKWARD') {
        statusText.innerText = ' للخلف BACKWARD';
        statusText.style.color = '#ef4444';
        wheels.forEach(w => w.classList.add('spinning'));
        log.innerHTML += `<br>[${timeString}] RX: 'B' -> Motors Reverse (PWM: 255)`;
    } else if (cmd === 'LEFT') {
        statusText.innerText = 'يسار LEFT';
        statusText.style.color = '#38bdf8';
        wheels.forEach(w => w.classList.add('spinning'));
        log.innerHTML += `<br>[${timeString}] RX: 'L' -> Turn Left`;
    } else if (cmd === 'RIGHT') {
        statusText.innerText = 'يمين RIGHT';
        statusText.style.color = '#38bdf8';
        wheels.forEach(w => w.classList.add('spinning'));
        log.innerHTML += `<br>[${timeString}] RX: 'R' -> Turn Right`;
    } else {
        statusText.innerText = 'متوقف STOP';
        statusText.style.color = '#94a3b8';
        wheels.forEach(w => w.classList.remove('spinning'));
        log.innerHTML += `<br>[${timeString}] RX: 'S' -> All Motors STOP`;
    }

    log.scrollTop = log.scrollHeight;
}
