document.addEventListener('DOMContentLoaded', () => {
    // Reveal animations on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Simple cursor glow effect
    const blob1 = document.querySelector('.blob-1');
    const blob2 = document.querySelector('.blob-2');

    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        
        // Subtly move blobs with cursor for interaction feel
        blob1.style.transform = `translate(${x * 0.02}px, ${y * 0.02}px)`;
        blob2.style.transform = `translate(${(x - window.innerWidth) * 0.02}px, ${(y - window.innerHeight) * 0.02}px)`;
    });
});
