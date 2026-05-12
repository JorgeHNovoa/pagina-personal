const rouletteBtn     = document.getElementById('rouletteBtn');
const rouletteResult  = document.getElementById('rouletteResult');
const rouletteTitle   = document.getElementById('rouletteTitle');
const rouletteSpeaker = document.getElementById('rouletteSpeaker');
const rouletteVideo   = document.getElementById('rouletteVideo');

const STEPS    = 20;
const START_MS = 55;
const END_MS   = 380;

let spinning = false;
let lastHighlighted = null;

function showTick(item) {
    rouletteTitle.textContent   = item.querySelector('.talk-title')?.textContent  ?? '';
    rouletteSpeaker.textContent = item.querySelector('.talk-speaker')?.textContent ?? '';

    rouletteTitle.classList.remove('roulette-tick');
    void rouletteTitle.offsetWidth;
    rouletteTitle.classList.add('roulette-tick');
}

function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function applyWinner(item) {
    if (lastHighlighted) lastHighlighted.classList.remove('roulette-selected');

    const li = item.closest('li');
    if (li) {
        li.classList.add('roulette-selected');
        lastHighlighted = li;
    }

    const videoLink = item.closest('.session-group')?.querySelector('.tag-video');
    if (videoLink) {
        const a = document.createElement('a');
        a.href      = videoLink.href;
        a.target    = '_blank';
        a.rel       = 'noopener';
        a.className = 'tag-video';
        a.textContent = 'Video';
        rouletteVideo.innerHTML = '';
        rouletteVideo.appendChild(a);
        rouletteVideo.hidden = false;
    } else {
        rouletteVideo.hidden = true;
        rouletteVideo.innerHTML = '';
    }
}

rouletteBtn.addEventListener('click', () => {
    if (spinning) return;

    const allItems = Array.from(document.querySelectorAll('.talk-item'));
    if (allItems.length === 0) return;

    const winner = pickRandom(allItems);
    spinning = true;
    rouletteBtn.disabled = true;
    rouletteResult.hidden = false;
    rouletteVideo.hidden = true;

    let step = 0;

    function tick() {
        const isLast = step === STEPS;
        showTick(isLast ? winner : pickRandom(allItems));

        if (isLast) {
            rouletteTitle.classList.remove('roulette-tick');
            rouletteResult.classList.add('roulette-settled');
            setTimeout(() => rouletteResult.classList.remove('roulette-settled'), 600);
            applyWinner(winner);
            spinning = false;
            rouletteBtn.disabled = false;
            return;
        }

        step++;
        const t = step / STEPS;
        setTimeout(tick, START_MS + (END_MS - START_MS) * (t * t));
    }

    tick();
});
