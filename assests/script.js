document.addEventListener('DOMContentLoaded', function() {
    const button = document.querySelector('.section1 button');
    const sections = document.querySelectorAll('.section1, .section2');
    const section2 = document.getElementById('section2');

    // Smooth scroll to section2 when the hero button is clicked
    if (button) {
        button.addEventListener('click', function() {
            section2.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Parallax scroll effect for better section transition
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;

        sections.forEach(section => {
            const speed = section.classList.contains('section1') ? 0.5 : 0.15;
            const yPos = -(scrolled * speed);
            if (section.classList.contains('section1')) {
                const vid = section.querySelector('video');
                if (vid) vid.style.transform = `translateY(${yPos}px)`;
            } else {
                section.style.backgroundPosition = `center ${yPos}px`;
            }
        });
    });

    // --- Section2 background video switcher ---
    // Map button ids to video paths (as requested)
    const bgMap = {
        dino: '/assests/video/bg_dino.mp4',
        sea:  '/assests/video/bg_sea.mp4',
        neature: '/assests/video/bg_neature.mp4'
    };

    function setSection2Video(src) {
        if (!section2) return;

        let vid = section2.querySelector('video.bgvideo');

        if (vid) {
            // fade out, switch source, fade in
            vid.classList.remove('visible');
            // wait for fade-out before changing source
            setTimeout(() => {
                const source = vid.querySelector('source');
                if (source && source.src !== src) {
                    source.src = src;
                    vid.load();
                    vid.play().catch(() => {});
                }
                vid.classList.add('visible');
            }, 360);
            return;
        }

        // create video element
        vid = document.createElement('video');
        vid.className = 'bgvideo';
        vid.autoplay = true;
        vid.muted = true;
        vid.loop = true;
        vid.playsInline = true;
        vid.setAttribute('webkit-playsinline', '');

        const source = document.createElement('source');
        source.src = src;
        source.type = 'video/mp4';
        vid.appendChild(source);

        // insert as first child so it sits behind .bg-section2 (we control z-index in CSS)
        section2.insertBefore(vid, section2.firstChild);

        // small delay to let element attach before playing/fading in
        requestAnimationFrame(() => {
            vid.play().catch(() => {});
            // show
            setTimeout(() => vid.classList.add('visible'), 50);
        });
    }

    // wire up buttons inside section2 (.btn-section2)
    const btns = document.querySelectorAll('#section2 .btn-section2 button');
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.id;
            const src = bgMap[id];
            if (src) setSection2Video(src);
        });
    });

});