(function () {
    var slides = document.querySelectorAll('.carousel-img');
    var idx = 0;
    if (slides.length > 1) {
        setInterval(function () {
            slides[idx].classList.remove('active');
            idx = (idx + 1) % slides.length;
            slides[idx].classList.add('active');
        }, 4000);
    }
})();

(function () {
    var buttons = document.querySelectorAll('.year-btn');
    var sections = document.querySelectorAll('.year-section');

    buttons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var year = btn.dataset.year;

            buttons.forEach(function (b) { b.classList.remove('active'); });
            sections.forEach(function (s) { s.classList.remove('active'); });

            btn.classList.add('active');
            var target = document.querySelector('.year-section[data-year="' + year + '"]');
            if (target) target.classList.add('active');
        });
    });
})();
