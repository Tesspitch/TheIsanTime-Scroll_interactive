document.addEventListener('DOMContentLoaded', function() {
    // === SMOOTH SCROLL BEHAVIOR ===
    // Enable smooth scroll and section snapping
    document.documentElement.style.scrollBehavior = 'smooth';

    const button = document.querySelector('.section1 button');
    const sections = document.querySelectorAll('.section1, .section2');
    const section2 = document.getElementById('section2');
    const _section3 = document.getElementById('section3');

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
    // typing sequence sentences
    const typingSentences = [
        'นี่ใช่โลกที่คุณจินตนาการไว้หรือไม่',
        'ความจริงจะเป็นอย่างไร',
        'มาหาคำตอบพร้อมกันกับพวกเรา'
    ];

    function runTypingSequence(onComplete){
        // create typing box if not exist
        let box = section2.querySelector('.typing-box');
        if (!box){
            box = document.createElement('div');
            box.className = 'typing-box';
            box.innerHTML = '<div class="typing-inner"><span class="typing-line" id="typingLine"></span><span class="typing-cursor" id="typingCursor"></span></div>';
            section2.appendChild(box);
        }
        const lineEl = section2.querySelector('#typingLine');
        const cursor = section2.querySelector('#typingCursor');

        let idx = 0;

        function typeSentence(sentence, cb){
            lineEl.textContent = '';
            // add a short pop class to emphasize new line
            lineEl.classList.add('pop');
            let i = 0;
            const speed = 80; // ms per char (slower)
            function step(){
                if (i < sentence.length){
                    lineEl.textContent += sentence.charAt(i);
                    i++;
                    setTimeout(step, speed);
                } else {
                    // remove pop after a short delay, then call the callback
                    setTimeout(() => { lineEl.classList.remove('pop'); cb(); }, 700);
                }
            }
            step();
        }

        function next(){
            if (idx < typingSentences.length){
                typeSentence(typingSentences[idx], () => { idx++; next(); });
            } else {
                // finished
                if (typeof onComplete === 'function') onComplete();
            }
        }
        next();
    }

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            // ignore clicks while typing sequence is running
            if (section2.classList.contains('typing-mode')) return;
            const id = btn.id;
            const src = bgMap[id];
            if (src) {
                // show video
                setSection2Video(src);
                // hide card and run typing
                section2.classList.add('typing-mode');
                // small delay to let video appear
                setTimeout(() => {
                    runTypingSequence(() => {
                        // restore background to gradient (remove video)
                        const vid = section2.querySelector('video.bgvideo');
                        if (vid){
                            vid.classList.remove('visible');
                            setTimeout(() => { try{ vid.remove(); }catch{} }, 420);
                        }
                        // remove typing box and mode
                        const box = section2.querySelector('.typing-box');
                        if (box) box.remove();
                        section2.classList.remove('typing-mode');
                        // scroll to section3
                        const s3 = document.getElementById('section3');
                        if (s3) s3.scrollIntoView({ behavior: 'smooth' });
                    });
                }, 420);
            }
        });
    });

    // === SECTION TRANSITION ANIMATIONS ===
    // Add smooth scroll listener for section-to-section transitions
    let _currentSection = 0;
    const allSections = [
        document.querySelector('.section1'),
        document.querySelector('.section2'),
        document.getElementById('section3'),
        document.querySelector('.section4'),
        document.querySelector('.section5')
    ].filter(s => s !== null);

    window.addEventListener('scroll', function() {
        const scrollY = window.pageYOffset;
        const windowHeight = window.innerHeight;

        // Update current section
        allSections.forEach((section, index) => {
            if (section) {
                const rect = section.getBoundingClientRect();
                const sectionTop = scrollY + rect.top;
                const sectionHeight = rect.height;
                // If section is in viewport, mark it as current
                if (scrollY >= sectionTop - windowHeight / 2 && scrollY < sectionTop + sectionHeight) {
                    _currentSection = index;
                }
            }
        });
    }, { passive: true });

});
