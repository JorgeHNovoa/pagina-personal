const rouletteBtn     = document.getElementById('rouletteBtn');
const rouletteResult  = document.getElementById('rouletteResult');
const rouletteTitle   = document.getElementById('rouletteTitle');
const rouletteSpeaker = document.getElementById('rouletteSpeaker');

const STEPS    = 20;   // number of ticks before landing
const START_MS = 55;   // delay at first tick (fast)
const END_MS   = 380;  // delay at last tick (slow)

let spinning = false;

function showTick(item) {
    rouletteTitle.textContent   = item.querySelector('.talk-title')?.textContent  ?? '';
    rouletteSpeaker.textContent = item.querySelector('.talk-speaker')?.textContent ?? '';

    // Brief flash so each tick is visually distinct
    rouletteTitle.classList.remove('roulette-tick');
    void rouletteTitle.offsetWidth;
    rouletteTitle.classList.add('roulette-tick');
}

function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

rouletteBtn.addEventListener('click', () => {
    if (spinning) return;

    const allItems = Array.from(document.querySelectorAll('.talk-item'));
    if (allItems.length === 0) return;

    const winner = pickRandom(allItems);
    spinning = true;
    rouletteBtn.disabled = true;

    // Show the card immediately so ticks are visible
    rouletteResult.hidden = false;

    let step = 0;

    function tick() {
        const isLast = step === STEPS;
        const current = isLast ? winner : pickRandom(allItems);

        showTick(current);

        if (isLast) {
            // Landing: mark as settled and re-enable button
            rouletteTitle.classList.remove('roulette-tick');
            rouletteResult.classList.add('roulette-settled');
            setTimeout(() => rouletteResult.classList.remove('roulette-settled'), 600);
            spinning = false;
            rouletteBtn.disabled = false;
            return;
        }

        step++;
        // Ease delay from START_MS to END_MS using a quadratic curve
        const t = step / STEPS;
        const delay = START_MS + (END_MS - START_MS) * (t * t);
        setTimeout(tick, delay);
    }

    tick();
});
