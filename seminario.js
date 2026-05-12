const images = [
    "030724-1.jpeg", "030724-2.jpeg", "030724-3.jpeg", "030724-4.jpeg", "030724-5.jpeg",
    "04122024-1.jpeg",
    "05062024-1.jpg", "05062024-2.jpg", "05062024-3.jpg",
    "06102024-1.jpeg", "06102024-2.jpeg",
    "06112024-1.jpeg", "06112024-2.jpeg",
    "0612-2.jpg", "0612-3.jpg",
    "13102024.jpeg",
    "13112024-1.jpeg", "13112024-2.jpeg",
    "15052024-1.jpg", "15052024-2.jpg",
    "1511-1.jpg", "1511-2.jpg",
    "190624-1.jpeg", "190624-2.jpeg",
    "20112024-1.jpeg", "20112024-3.jpeg",
    "220524-2.jpg", "220524-3.jpg",
    "2211-2.jpg", "2211-3-.jpg",
    "2510.jpg",
    "260624-1.jpg", "260624-2.jpg", "260624-3.jpg",
    "290524-1.jpg", "290524-2.jpg", "290524-3.jpg",
    "30102024-1.jpeg",
    "811-2.jpg", "811-3.jpg", "811-4.jpg",
];

const carousel = document.querySelector('.carousel');

images.forEach((filename, i) => {
    const img = document.createElement('img');
    img.className = 'carousel-img' + (i === 0 ? ' active' : '');
    img.src = `./images/seminario/${filename}`;
    img.alt = '';
    carousel.appendChild(img);
});

const slides = carousel.querySelectorAll('.carousel-img');

if (slides.length > 1) {
    let currentIndex = 0;

    setInterval(() => {
        slides[currentIndex].classList.remove('active');

        let nextIndex;
        do {
            nextIndex = Math.floor(Math.random() * slides.length);
        } while (nextIndex === currentIndex);

        currentIndex = nextIndex;
        slides[currentIndex].classList.add('active');
    }, 4000);
}

// Year filter

const buttons = document.querySelectorAll('.year-btn');
const sections = document.querySelectorAll('.year-section');

buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));

        btn.classList.add('active');

        const target = document.querySelector(`.year-section[data-year="${btn.dataset.year}"]`);
        if (target) target.classList.add('active');
    });
});

// Footer year
document.getElementById('footerYear').textContent = new Date().getFullYear();
