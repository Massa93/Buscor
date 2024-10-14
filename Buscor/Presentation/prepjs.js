document.addEventListener('DOMContentLoaded', (event) => {
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    let currentSlide = 0;

    function showSlide(n) {
        slides[currentSlide].style.display = 'none';
        currentSlide = (n + slides.length) % slides.length;
        slides[currentSlide].style.display = 'block';
    }

    prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));
    nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));

    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') showSlide(currentSlide - 1);
        if (e.key === 'ArrowRight') showSlide(currentSlide + 1);
    });

    // Simple animation for bullet points
    const bulletLists = document.querySelectorAll('ul');
    bulletLists.forEach(list => {
        list.querySelectorAll('li').forEach((item, index) => {
            item.style.opacity = 0;
            item.style.transition = 'opacity 0.5s';
            setTimeout(() => {
                item.style.opacity = 1;
            }, index * 500);
        });
    });
});