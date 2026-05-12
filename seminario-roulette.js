const rouletteBtn    = document.getElementById('rouletteBtn');
const rouletteResult = document.getElementById('rouletteResult');
const rouletteTitle  = document.getElementById('rouletteTitle');
const rouletteSpeaker = document.getElementById('rouletteSpeaker');

let lastHighlighted = null;

rouletteBtn.addEventListener('click', () => {
    const allItems = Array.from(document.querySelectorAll('.talk-item'));
    if (allItems.length === 0) return;

    const picked = allItems[Math.floor(Math.random() * allItems.length)];

    // Switch to the correct year tab
    const yearSection = picked.closest('.year-section');
    if (yearSection) {
        const year = yearSection.dataset.year;
        document.querySelectorAll('.year-section').forEach(s => s.classList.remove('active'));
        document.querySelectorAll('.year-btn').forEach(b => b.classList.remove('active'));
        yearSection.classList.add('active');
        const matchingBtn = document.querySelector(`.year-btn[data-year="${year}"]`);
        if (matchingBtn) matchingBtn.classList.add('active');
    }

    // Remove previous highlight
    if (lastHighlighted) {
        lastHighlighted.classList.remove('roulette-highlight');
    }

    // Apply highlight to the parent <li>
    const li = picked.closest('li');
    if (li) {
        // Force re-trigger animation if same element picked again
        void li.offsetWidth;
        li.classList.add('roulette-highlight');
        lastHighlighted = li;

        li.addEventListener('animationend', () => {
            li.classList.remove('roulette-highlight');
        }, { once: true });

        li.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Show result card
    rouletteTitle.textContent   = picked.querySelector('.talk-title')?.textContent ?? '';
    rouletteSpeaker.textContent = picked.querySelector('.talk-speaker')?.textContent ?? '';
    rouletteResult.hidden = false;

    // Re-trigger fade-in animation
    rouletteResult.style.animation = 'none';
    void rouletteResult.offsetWidth;
    rouletteResult.style.animation = '';
});
