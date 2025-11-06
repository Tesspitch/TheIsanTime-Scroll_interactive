document.addEventListener('DOMContentLoaded', function() {
    const button = document.querySelector('.section1 button');
    const sections = document.querySelectorAll('.section1, .section2');

    // Smooth scroll function
    button.addEventListener('click', function() {
        document.getElementById('section2').scrollIntoView({ behavior: 'smooth' });
    });

    // Parallax scroll effect for better section transition
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        
        sections.forEach(section => {
            const speed = section.classList.contains('section1') ? 0.5 : 0.3;
            const yPos = -(scrolled * speed);
            if (section.classList.contains('section1')) {
                section.querySelector('video').style.transform = `translate(-50%, ${yPos}px)`;
            } else {
                section.style.backgroundPosition = `center ${yPos}px`;
            }
        });
    });
});