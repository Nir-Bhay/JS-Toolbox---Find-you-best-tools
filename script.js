// Basic logging for debugging (if necessary)
console.log("Landing page loaded.");

// Add any future JavaScript logic here for tool interactivity
document.addEventListener('DOMContentLoaded', function () {
    const sections = document.querySelectorAll('.animated-slide-up');

    // Slide up animations for sections
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('slide-up-visible');
            }
        });
    });

    sections.forEach(section => observer.observe(section));
});


document.addEventListener('DOMContentLoaded', function () {
    const footer = document.querySelector('.footer');

    // Observer for footer visibility
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                footer.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing after it becomes visible
            }
        });
    });

    observer.observe(footer);
});

