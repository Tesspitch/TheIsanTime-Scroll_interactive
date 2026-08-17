// Main JavaScript for the Isan Time‑Scroll website
// This script handles scrolling between sections, background video switching,
// diet filtering in Section4 and the interactive modal with scratch
// off, 3D model and timeline.

document.addEventListener('DOMContentLoaded', () => {
  // Enable smooth scrolling between sections
  document.documentElement.style.scrollBehavior = 'smooth';

  const section2 = document.getElementById('section2');
  const startButton = document.querySelector('.btn-primary-glow');

  // Scroll to Section2 when the hero button is clicked
  if (startButton) {
    startButton.addEventListener('click', () => {
      section2.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Initialize GSAP ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // Section 1: Hero Text Reveal
  const heroTl = gsap.timeline({ paused: true });
  heroTl
    .from('.hero-title-th', {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      delay: 0.5
    })
    .from('.hero-title-highlight', {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    }, '-=0.8')
    .from('.hero-subtitle-en', {
      y: 30,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    }, '-=0.8')
    .from('.hero-description p', {
      y: 20,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out'
    }, '-=0.6')
    .fromTo('.btn-primary-glow',
      { y: 20, opacity: 0, visibility: 'hidden' },
      { y: 0, opacity: 1, visibility: 'visible', duration: 0.8, ease: 'back.out(1.7)' },
      '-=0.4'
    );
  // --- Loading Screen Logic ---
  // Preload ALL assets (videos + images) during loading screen
  // so everything displays instantly when the user scrolls or interacts.
  const loaderOverlay = document.getElementById('loader-overlay');
  const loaderBar = document.getElementById('loaderBar');
  const loaderPercent = document.getElementById('loader-percent');
  const heroVideo = document.querySelector('.hero-video');
  const loaderCanvas = document.getElementById('loaderCanvas');

  let loadProgress = 0;
  let loadingComplete = false;

  // --- Universal Asset Preloader ---
  // Collect ALL images on the page and remove lazy loading so they start immediately
  const allImages = document.querySelectorAll('img[loading="lazy"]');
  allImages.forEach((img) => {
    img.removeAttribute('loading'); // Force eager loading
  });

  // Total assets = 4 videos (hero + 3 section2) + all page images
  const allPageImages = document.querySelectorAll('img');
  let totalAssets = 4; // 4 videos
  let loadedAssets = 0;

  // Count images that need to load (exclude already complete ones)
  const imagesToTrack = [];
  allPageImages.forEach((img) => {
    if (img.complete && img.naturalWidth > 0) {
      // Already loaded/cached
      loadedAssets++;
      totalAssets++;
    } else if (img.src && img.src !== '') {
      totalAssets++;
      imagesToTrack.push(img);
    }
  });

  function onAssetLoaded() {
    loadedAssets++;
    updateRealProgress();
    checkAllAssetsReady();
  }

  // Attach load/error handlers to all pending images
  imagesToTrack.forEach((img) => {
    img.addEventListener('load', onAssetLoaded, { once: true });
    img.addEventListener('error', onAssetLoaded, { once: true }); // count errors too so we don't get stuck
  });

  // Video load tracking (keyed to prevent double-counting)
  const videoLoadTracker = { hero: false, dino: false, sea: false, nature: false };

  function markVideoReady(key) {
    if (videoLoadTracker[key]) return;
    videoLoadTracker[key] = true;
    loadedAssets++;
    updateRealProgress();
    checkAllAssetsReady();
  }

  function updateRealProgress() {
    // Map loaded assets to 0–95% range (leave 5% for final transition)
    const realProgress = Math.min(95, Math.round((loadedAssets / totalAssets) * 95));
    if (realProgress > loadProgress) {
      loadProgress = realProgress;
      updateLoader(loadProgress);
    }
  }

  function checkAllAssetsReady() {
    if (loadingComplete) return;
    if (loadedAssets >= totalAssets) {
      loadingComplete = true;
      completeLoading();
    }
  }

  // Simulate gradual progress so the bar doesn't sit idle while loading
  const progressInterval = setInterval(() => {
    const maxSimulated = Math.min(95, Math.round((loadedAssets / totalAssets) * 95));
    if (loadProgress < maxSimulated) {
      loadProgress += Math.floor(Math.random() * 3) + 1;
      if (loadProgress > maxSimulated) loadProgress = maxSimulated;
      updateLoader(loadProgress);
    }
  }, 120);

  function updateLoader(progress) {
    if (loaderBar) loaderBar.style.width = `${progress}%`;
    if (loaderPercent) loaderPercent.textContent = `${progress}%`;
  }

  function markVideoReady(key) {
    if (videoLoadTracker[key]) return; // already marked
    videoLoadTracker[key] = true;
    updateRealProgress();
    checkAllVideosReady();
  }

  function checkAllVideosReady() {
    if (loadingComplete) return;
    if (getLoadedCount() >= totalVideos) {
      loadingComplete = true;
      completeLoading();
    }
  }

  // --- Particle system logic ---
  let animationFrameId = null;
  if (loaderCanvas) {
    const ctx = loaderCanvas.getContext('2d');
    
    // Set internal canvas resolution
    loaderCanvas.width = 200;
    loaderCanvas.height = 200;

    const numParticles = 25;
    const particles = [];
    
    // Core colors: fossil gold, light gold, neon cyan (matching primary and secondary theme colors)
    const colors = ['#fbbf24', '#f59e0b', '#22d3ee', '#38bdf8', '#fbbf24'];

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * loaderCanvas.width,
        y: Math.random() * loaderCanvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedFactor: Math.random() * 0.05 + 0.03, // Easing speed
        friction: Math.random() * 0.05 + 0.9 // Friction/drag
      });
    }

    let mouseX = loaderCanvas.width / 2;
    let mouseY = loaderCanvas.height / 2;
    let isMouseIn = false;
    let circleAngle = 0;
    const circleRadius = 45;

    // Track mouse movement relative to canvas
    if (loaderOverlay) {
      loaderOverlay.addEventListener('mousemove', (e) => {
        const rect = loaderCanvas.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width) * loaderCanvas.width;
        mouseY = ((e.clientY - rect.top) / rect.height) * loaderCanvas.height;
        isMouseIn = true;
      });

      loaderOverlay.addEventListener('mouseenter', () => {
        isMouseIn = true;
      });

      loaderOverlay.addEventListener('mouseleave', () => {
        isMouseIn = false;
      });
    }

    function animateParticles() {
      // Clear canvas with a very slight alpha for trail effect
      ctx.fillStyle = 'rgba(2, 6, 23, 0.2)'; // matching --bg-dark color #020617
      ctx.fillRect(0, 0, loaderCanvas.width, loaderCanvas.height);

      let targetX, targetY;
      if (isMouseIn) {
        targetX = mouseX;
        targetY = mouseY;
      } else {
        // Circular motion path
        circleAngle += 0.03;
        targetX = loaderCanvas.width / 2 + Math.cos(circleAngle) * circleRadius;
        targetY = loaderCanvas.height / 2 + Math.sin(circleAngle) * circleRadius;
      }

      particles.forEach((p) => {
        // Accelerate towards target
        const dx = targetX - p.x;
        const dy = targetY - p.y;
        
        p.vx += dx * p.speedFactor;
        p.vy += dy * p.speedFactor;
        
        // Apply friction
        p.vx *= p.friction;
        p.vy *= p.friction;

        // Move particle
        p.x += p.vx;
        p.y += p.vy;

        // Draw particle with subtle glow
        ctx.save();
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(animateParticles);
    }
    
    // Start animation loop
    animateParticles();
  }

  function completeLoading() {
    clearInterval(progressInterval);
    updateLoader(100);
    setTimeout(() => {
      if (loaderOverlay) {
        loaderOverlay.classList.add('fade-out');
        // Stop animation loop to save resources
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
        // Play Hero text animation once loading finishes
        if (heroTl) {
          heroTl.play();
        }
      }
    }, 500);
  }

  // --- Track hero video loading ---
  if (heroVideo) {
    if (heroVideo.readyState >= 3) {
      markVideoReady('hero');
    } else {
      const onHeroReady = () => markVideoReady('hero');
      heroVideo.addEventListener('canplaythrough', onHeroReady);
      heroVideo.addEventListener('canplay', onHeroReady);
      heroVideo.addEventListener('loadeddata', onHeroReady);
    }
  } else {
    markVideoReady('hero'); // no hero video, mark as ready
  }

  // Fallback timeout: If loading takes too long (10 seconds), proceed anyway
  // so the user isn't stuck on the loading screen
  setTimeout(() => {
    if (!loadingComplete) {
      console.warn('Video preload timeout. Proceeding with available videos...');
      loadingComplete = true;
      completeLoading();
    }
  }, 10000);

  // Section 1: Parallax Video
  gsap.to('.hero-video', {
    yPercent: 30,
    ease: 'none',
    scrollTrigger: {
      trigger: '.section1',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });

  // Section 2: Background Parallax
  gsap.to('.section2', {
    backgroundPosition: 'center 100px',
    ease: 'none',
    scrollTrigger: {
      trigger: '.section2',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  });

  // Introduce Section Animation
  let introTween = gsap.from('.intro-title, .intro-subtitle, .intro-body p', {
    y: 50,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.section-introduce',
      start: 'top 75%',
      toggleActions: 'play none none reverse'
    }
  });

  // Intro Video Glow Animation
  gsap.from('.video-wrapper', {
    scale: 0.9,
    opacity: 0,
    duration: 1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.intro-video-container',
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    }
  });

  // Section 3: Timeline Items Animation
  const timelineItems = document.querySelectorAll('.timeline-item');
  timelineItems.forEach((item, i) => {
    gsap.from(item, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: item,
        start: 'top 90%',
        toggleActions: 'play none none reverse',
        fastScrollEnd: true
      }
    });
  });

  // Khorat Stratigraphy Section: Expand Content to Right on Scroll Animation
  const stratExplorer = document.getElementById('stone-layer-explorer');
  if (stratExplorer) {
    const stratTl = gsap.timeline({
      scrollTrigger: {
        trigger: stratExplorer,
        start: 'top 75%',
        toggleActions: 'play none none none',
        once: true
      }
    });

    stratTl
      .fromTo('.stone-layer-content',
        { scale: 0.94, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: 'power3.out' }
      )
      .fromTo('.stone-image-wrapper',
        { x: -40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
        '-=0.5'
      )
      .fromTo('.stone-text-wrapper',
        { x: 60, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.9, ease: 'power3.out' },
        '-=0.6'
      );
  }

  // Section 4: Headers Animation
  gsap.from('.titans-title, .titans-subtitle, .titans-subtitle-desc, .filter-controls-wrapper', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    stagger: 0.1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.section4',
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    }
  });

  /* ---------------------------------------------
   * Section2 background image and typing sequence
   * --------------------------------------------- */
  const bgMap = {
    dino: 'assests/video/bg_dino.mp4',
    sea: 'assests/video/bg_sea.mp4',
    nature: 'assests/video/bg_nature.mp4',
  };

  // Preload all Section 2 videos and track their loading for the loading screen
  const preloadedVideos = {};
  if (section2) {
    Object.keys(bgMap).forEach((id) => {
      const src = bgMap[id];
      const vid = document.createElement('video');
      vid.className = 'bg-video';
      vid.src = src;
      vid.muted = true;
      vid.loop = true;
      vid.playsInline = true;
      vid.preload = 'auto'; // Request browser to preload
      
      // Append to section2 before content
      section2.insertBefore(vid, section2.firstChild);
      
      preloadedVideos[id] = vid;

      // Track loading progress for loading screen
      if (vid.readyState >= 3) {
        markVideoReady(id); // Already cached
      } else {
        const onReady = () => markVideoReady(id);
        vid.addEventListener('canplaythrough', onReady);
        vid.addEventListener('canplay', onReady);
      }

      vid.load(); // Start loading
    });
  } else {
    // No section2, mark all choice videos as ready
    ['dino', 'sea', 'nature'].forEach((id) => markVideoReady(id));
  }

  /**
   * Set or update the background video in Section2 using preloaded elements.
   * Plays and fades in the selected video instantly.
   * @param {string} id The id of the chosen video ('dino', 'sea', or 'nature')
   */
  function setSection2PreloadedVideo(id) {
    if (!section2) return;
    const targetVid = preloadedVideos[id];
    if (!targetVid) return;

    // Pause and hide all other preloaded videos
    Object.keys(preloadedVideos).forEach((key) => {
      const vid = preloadedVideos[key];
      if (key !== id) {
        vid.classList.remove('visible');
        setTimeout(() => {
          if (!vid.classList.contains('visible')) {
            vid.pause();
          }
        }, 800);
      }
    });

    // Play and fade in the selected video instantly
    targetVid.play().then(() => {
      targetVid.classList.add('visible');
    }).catch((err) => {
      console.warn("Instant play failed, making visible anyway:", err);
      targetVid.classList.add('visible');
    });
  }

  const typingSentences = [
    'นี่ใช่โลกที่คุณจินตนาการไว้หรือไม่',
    'ความจริงจะเป็นอย่างไร',
    'มาหาคำตอบพร้อมกันกับพวกเรา',
  ];

  function runTypingSequence(onComplete) {
    let box = section2.querySelector('.typing-box');
    if (!box) {
      box = document.createElement('div');
      box.className = 'typing-box';
      box.innerHTML =
        '<div class="typing-inner"><span class="typing-line" id="typingLine"></span><span class="typing-cursor" id="typingCursor"></span></div>';
      section2.appendChild(box);
    }
    const lineEl = section2.querySelector('#typingLine');
    let idx = 0;
    function typeSentence(sentence, cb) {
      lineEl.textContent = '';
      lineEl.classList.add('pop');
      let i = 0;
      // Assuming geoJsonLayer, geoJsonData, filterType, createCustomIcon, and L are defined elsewhere
      // This block is inserted as per the user's instruction, assuming it's new functionality.
      // The original instruction implies modifying an existing L.marker, but none exists.
      // The provided code edit introduces this block.
      // The trailing `}, 1000);` from the user's snippet was a syntax error and has been removed.
      // The `step()` function and its related logic are preserved.
      // This insertion point is based on the user's provided `Code Edit` context.
      // If this is not the intended placement, further clarification would be needed.
      // For now, it's placed where the user's snippet indicated, but corrected for syntax.
      // This block is likely part of a larger Leaflet map integration not fully present in the provided context.
      /*
      geoJsonLayer = L.geoJSON(geoJsonData, {
        filter: function(feature) {
          if (filterType === 'all') return true;
          return feature.properties.type === filterType;
        },
        pointToLayer: function(feature, latlng) {
          return L.marker(latlng, {
            icon: createCustomIcon(feature.properties.color, feature.properties.name),
            pane: 'pins' // Render in the high z-index pane
          });
        },
      });
      */
      const speed = 60; // Faster typing
      function step() {
        if (i < sentence.length) {
          lineEl.textContent += sentence.charAt(i);
          i++;
          setTimeout(step, speed);
        } else {
          setTimeout(() => {
            lineEl.classList.remove('pop');
            cb();
          }, 1000); // Wait a bit before next sentence
        }
      }
      step();
    }
    function next() {
      if (idx < typingSentences.length) {
        typeSentence(typingSentences[idx], () => {
          idx++;
          next();
        });
      } else {
        if (typeof onComplete === 'function') onComplete();
      }
    }
    next();
  }

  const btns = document.querySelectorAll('.choice-card');
  btns.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (section2.classList.contains('typing-mode')) return;
      const id = btn.id;
      if (bgMap[id]) {
        setSection2PreloadedVideo(id);
        section2.classList.add('typing-mode');

        // Fade out buttons
        gsap.to('.border-section2', { opacity: 0, scale: 0.9, duration: 0.5 });

        setTimeout(() => {
          runTypingSequence(() => {
            // Fade out the video instead of removing it from the DOM
            const vid = preloadedVideos[id];
            if (vid) {
              vid.classList.remove('visible');
              setTimeout(() => {
                try {
                  if (!vid.classList.contains('visible')) {
                    vid.pause();
                  }
                } catch (err) { }
              }, 800);
            }
            const box = section2.querySelector('.typing-box');
            if (box) box.remove();
            section2.classList.remove('typing-mode');

            // Bring buttons back
            gsap.to('.border-section2', { opacity: 1, scale: 1, duration: 0.5 });

            ScrollTrigger.refresh();

            const nextSection = document.getElementById('introduce');
            if (nextSection) {
              if (introTween) introTween.restart();
              nextSection.scrollIntoView({ behavior: 'smooth' });
            }
          });
        }, 800);
      }
    });
  });

  /* ---------------------------------------------
   * Section: Stratigraphy Explorer Logic
   * --------------------------------------------- */
  const stratigraphyData = {
    'khok-kruat': {
      epoch: 'ยุคครีเทเชียสตอนต้น (~100–115 ล้านปีก่อน)',
      name: 'หมวดหินโคกกรวด (Khok Kruat Formation)',
      env: 'ที่ราบน้ำท่วมถึงและแม่น้ำคดเคี้ยว สภาพอากาศแบบกึ่งแห้งแล้งสลับมรสุม',
      fossils: 'สยามแรปเตอร์ (Siamraptor suwati), สิรินธรนา (Sirindhorna khoratensis), ราชสีมาซอรัส, สยามโมดอน, ซิตตะโกซอรัส, จระเข้โคราชซูคัส, เต่าโบราณ และปลากระดูกแข็ง'
    },
    'sao-khua': {
      epoch: 'ยุคครีเทเชียสตอนต้น (~125–130 ล้านปีก่อน)',
      name: 'หมวดหินเสาขัว (Sao Khua Formation)',
      env: 'ที่ราบลุ่มแม่น้ำคดเคี้ยวและทะเลสาบน้ำจืดอันอุดมสมบูรณ์',
      fossils: 'ภูเวียงโกซอรัส (Phuwiangosaurus), สยามโมไทรันนัส (Siamotyrannus), สยามโมซอรัส (Siamosaurus), กินรีมิมัส (Kinnareemimus), ภูเวียงเวเนเตอร์, วายุแรปเตอร์, เต่าภูเวียงเชลิส และหอยน้ำจืด'
    },
    'phu-kradung': {
      epoch: 'ยุคจูแรสซิกตอนปลาย (~150 ล้านปีก่อน)',
      name: 'หมวดหินภูกระดึง (Phu Kradung Formation)',
      env: 'แม่น้ำสายใหญ่คดเคี้ยวและหนองบึงน้ำจืด สภาพอากาศอบอุ่นชื้นสลับแล้ง',
      fossils: 'มินิโมเคอร์เซอร์ (Minimocursor phunoiensis), จระเข้ชาลาวัน (Chalawan thailandicus), ปลากระดูกแข็งเลปิโดเทสและอีสานอิคธิส, เต่ากาฬสินธุ์เอมิส, สเตโกซอร์ และเทอโรซอร์'
    },
    'nam-phong': {
      epoch: 'ยุคไทรแอสซิกตอนปลาย (~200–210 ล้านปีก่อน)',
      name: 'หมวดหินน้ำพอง / หมวดหินห้วยหินลาด (Nam Phong & Huai Hin Lat Fm.)',
      env: 'ทะเลสาบน้ำจืดขนาดใหญ่และที่ราบตะกอนน้ำพาริมหุบเขาโบราณ',
      fossils: 'อีสานโนซอรัส (Isanosaurus attavipatchi - ซอโรพอดแท้แรกของโลก), ไม้กลายเป็นหิน, ละอองเรณูสปอร์พืชโบราณ, หอยสองฝา และสัตว์เลื้อยคลานโบราณ'
    },
    'all-formations': {
      epoch: 'มหายุคมีโซโซอิก (210 – 66 ล้านปีก่อน)',
      name: '9 หมวดหินแห่งกลุ่มหินโคราช (Khorat Group)',
      env: 'ลำดับชั้นหินจากล่างขึ้นบน: ห้วยหินลาด ➔ น้ำพอง ➔ ภูกระดึง ➔ พระวิหาร ➔ เสาขัว ➔ ภูพาน ➔ โคกกรวด ➔ มหาสารคาม ➔ ภูทอก',
      fossils: 'แหล่งบันทึกวิวัฒนาการบรรพชีวินสัตว์มีกระดูกสันหลังและพืชโบราณที่สมบูรณ์และต่อเนื่องที่สุดแห่งหนึ่งของทวีปเอเชีย'
    }
  };

  const stratChips = document.querySelectorAll('.strat-chip');
  const stoneDescContainer = document.getElementById('stoneDesc');

  stratChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const formKey = chip.dataset.formation;
      const data = stratigraphyData[formKey];
      if (!data || !stoneDescContainer) return;

      stratChips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');

      stoneDescContainer.innerHTML = `
        <div class="formation-card">
          <div class="formation-header">
            <span class="formation-epoch">${data.epoch}</span>
            <h4 class="formation-name">${data.name}</h4>
          </div>
          <p class="formation-environment"><strong>สภาพแวดล้อมโบราณ:</strong> ${data.env}</p>
          <div class="formation-fossils">
            <strong>ฟอสซิลเด่น:</strong> ${data.fossils}
          </div>
        </div>
      `;
    });
  });

  /* ---------------------------------------------
   * Section4: Multi-Filtering Logic (Diet & Epoch)
   * --------------------------------------------- */
  const dietButtons = document.querySelectorAll('.diet-btn');
  const epochButtons = document.querySelectorAll('.epoch-btn');
  const titanCards = document.querySelectorAll('.titan-card');

  let currentDietFilter = 'all';
  let currentEpochFilter = 'all';

  function applyTitanFilters() {
    titanCards.forEach((card) => {
      const matchDiet = currentDietFilter === 'all' || card.dataset.diet === currentDietFilter;
      const matchEpoch = currentEpochFilter === 'all' || card.dataset.epoch === currentEpochFilter;

      if (matchDiet && matchEpoch) {
        card.classList.remove('hidden');
        gsap.fromTo(card, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.35 });
      } else {
        card.classList.add('hidden');
      }
    });
  }

  dietButtons.forEach((button) => {
    button.addEventListener('click', () => {
      dietButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
      currentDietFilter = button.dataset.filter || 'all';
      applyTitanFilters();
    });
  });

  epochButtons.forEach((button) => {
    button.addEventListener('click', () => {
      epochButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
      currentEpochFilter = button.dataset.epoch || 'all';
      applyTitanFilters();
    });
  });

  /* ---------------------------------------------
   * Modal, 3D Model & Scientific Timeline Data
   * --------------------------------------------- */
  const modal = document.getElementById('dinoModal');
  const closeModalBtn = document.querySelector('.close-modal');
  const dinoModel = document.getElementById('dinoModel');
  const timelineContainer = document.getElementById('timelineContainer');

  const dinoData = {
    'Phuwiangosaurus sirindhornae': {
      model: 'assests/model/Phuwiangosaurus_sirindhornae.glb',
      footprint: 'assests/img/dino_section4/Phuwiangosaurus.png',
      timeline: [
        { title: 'ค้นพบกระดูกชิ้นแรก', year: '1982 (พ.ศ. 2525) ณ ประตูตีหมา อุทยานฯ ภูเวียง' },
        { title: 'ขุดค้นโครงกระดูกสมบูรณ์', year: '1989–1993 นำโดย ดร.วราวุธ สุธีธร' },
        { title: 'ประกาศชื่อวิทยาศาสตร์', year: '1994 (Martin, Buffetaut & Suteethorn)' },
        { title: 'จัดแสดงพิพิธภัณฑ์ภูเวียงและสิรินธร', year: 'เปิดจัดแสดงสมบูรณ์แบบระดับโลก' },
      ],
    },
    'Kinnareemimus khonkaennsis': {
      model: 'assests/model/Kinnareemimus khonkaenensis.glb',
      footprint: 'assests/img/dino_section4/Kinnareemimus.png',
      timeline: [
        { title: 'ค้นพบฟอสซิลกระดูกเท้า', year: '1992 (พ.ศ. 2535) แหล่งขุดค้นภูเวียง' },
        { title: 'รายงานการค้นพบเบื้องต้น', year: '1999 ในฐานะ Early Ornithomimosaur' },
        { title: 'ตั้งชื่อวิทยาศาสตร์เป็นทางการ', year: '2009 (Buffetaut, Suteethorn et al.)' },
        { title: 'จัดแสดงในพิพิธภัณฑ์', year: 'ศูนย์ศึกษาวิจัยไดโนเสาร์ภูเวียง' },
      ],
    },
    'Kinnareemimus khonkaenensis': {
      model: 'assests/model/Kinnareemimus khonkaenensis.glb',
      footprint: 'assests/img/dino_section4/Kinnareemimus.png',
      timeline: [
        { title: 'ค้นพบฟอสซิลกระดูกเท้า', year: '1992 (พ.ศ. 2535) แหล่งขุดค้นภูเวียง' },
        { title: 'รายงานการค้นพบเบื้องต้น', year: '1999 ในฐานะ Early Ornithomimosaur' },
        { title: 'ตั้งชื่อวิทยาศาสตร์เป็นทางการ', year: '2009 (Buffetaut, Suteethorn et al.)' },
        { title: 'จัดแสดงในพิพิธภัณฑ์', year: 'ศูนย์ศึกษาวิจัยไดโนเสาร์ภูเวียง' },
      ],
    },
    'Sittakosaurus satyarakki': {
      model: 'assests/model/Psittacosaurus_sattayaraki.glb',
      footprint: 'assests/img/dino_section4/Sittakosaurus.png',
      timeline: [
        { title: 'ค้นพบขากรรไกรล่างมีฟัน', year: '1984 (พ.ศ. 2527) อ.คอนสวรรค์ จ.ชัยภูมิ' },
        { title: 'ศึกษาวิจัยอนุกรมวิธาน', year: '1989 ยืนยันเป็นไดโนเสาร์ปากนกแก้วแรกของไทย' },
        { title: 'ตีพิมพ์ประกาศสายพันธุ์ใหม่', year: '1992 ตั้งชื่อเกียรติแก่ นายนเรศ สัตยารักษ์' },
        { title: 'จัดแสดงตัวอย่างต้นแบบ', year: 'กรมทรัพยากรธรณี กรุงเทพฯ และขอนแก่น' },
      ],
    },
    'Psittacosaurus sattayaraki': {
      model: 'assests/model/Psittacosaurus_sattayaraki.glb',
      footprint: 'assests/img/dino_section4/Sittakosaurus.png',
      timeline: [
        { title: 'ค้นพบขากรรไกรล่างมีฟัน', year: '1984 (พ.ศ. 2527) อ.คอนสวรรค์ จ.ชัยภูมิ' },
        { title: 'ศึกษาวิจัยอนุกรมวิธาน', year: '1989 ยืนยันเป็นไดโนเสาร์ปากนกแก้วแรกของไทย' },
        { title: 'ตีพิมพ์ประกาศสายพันธุ์ใหม่', year: '1992 ตั้งชื่อเกียรติแก่ นายนเรศ สัตยารักษ์' },
        { title: 'จัดแสดงตัวอย่างต้นแบบ', year: 'กรมทรัพยากรธรณี กรุงเทพฯ และขอนแก่น' },
      ],
    },
    'Ratchasimasaurus suranareae': {
      model: 'assests/model/Ratchasimasaurus.glb',
      footprint: 'assests/img/dino_section4/Ratchasimasaurus.png',
      timeline: [
        { title: 'ค้นพบกระดูกขากรรไกรล่าง', year: '2007 (พ.ศ. 2550) ต.สุรนารี อ.เมืองนครราชสีมา' },
        { title: 'ศึกษาร่วมไทย-ญี่ปุ่น', year: '2008–2011 สถาบันวิจัยไม้กลายเป็นหินฯ และมหาวิทยาลัยฟูกุอิ' },
        { title: 'ตีพิมพ์ประกาศชื่อวิทยาศาสตร์', year: '2011 ให้เกียรติแด่ ท้าวสุรนารี (ย่าโม)' },
        { title: 'จัดแสดงในพิพิธภัณฑ์', year: 'พิพิธภัณฑ์ไม้กลายเป็นหินฯ โคราช' },
      ],
    },
    'Siamodon nimngami': {
      model: 'assests/model/Siamodon.glb',
      footprint: 'assests/img/dino_section4/Siamodon.png',
      timeline: [
        { title: 'ค้นพบกระดูกขากรรไกรบนและฟัน', year: '2007–2010 บ้านสะพานหิน จ.นครราชสีมา' },
        { title: 'วิจัยโครงสร้างฟันบดพืช', year: '2010 ยืนยันเป็นอิกัวโนดอนต์ชนิดใหม่' },
        { title: 'ประกาศชื่อวิทยาศาสตร์', year: '2011 ให้เกียรติแก่ นายวิทยา นิ่มงาม ผู้ค้นพบ' },
        { title: 'จัดแสดงในพิพิธภัณฑ์', year: 'Khorat Fossil Museum (Khorat Geopark)' },
      ],
    },
    'Sirindhorna khoratensis': {
      model: 'assests/model/Sirindhorna.glb',
      footprint: 'assests/img/dino_section4/Sirindhorna.png',
      timeline: [
        { title: 'ค้นพบชิ้นส่วนกะโหลกสมบูรณ์', year: '2007–2009 บ้านสะพานหิน โคราช' },
        { title: 'การประกอบโครงสร้างกะโหลก 3 มิติ', year: '2012–2014 โดยคณะวิจัยไทย-ญี่ปุ่น' },
        { title: 'ตีพิมพ์ในวารสารระดับโลก PLOS ONE', year: '2015 ได้รับพระราชทานพระราชานุญาตอัญเชิญพระนาม' },
        { title: 'จัดแสดงไฮไลต์', year: 'สถาบันวิจัยไม้กลายเป็นหินฯ จ.นครราชสีมา' },
      ],
    },
    'Isanosaurus attavipatchi': {
      model: 'assests/model/Isanosaurus.glb',
      footprint: 'assests/img/dino_png/Isanosaurus.png',
      timeline: [
        { title: 'ค้นพบกระดูกท่อนขาและกระดูกสันหลัง', year: '1998 (พ.ศ. 2541) อ.หนองบัวระเหว จ.ชัยภูมิ' },
        { title: 'กำหนดอายุชั้นหิน 210 ล้านปี', year: '1999 ยืนยันเป็น Sauropod ที่เก่าแก่ที่สุดในโลก' },
        { title: 'ตีพิมพ์ในวารสาร Nature', year: '2000 (Buffetaut et al.) สร้างชื่อเสียงระดับโลก' },
        { title: 'จัดแสดงในพิพิธภัณฑ์', year: 'พิพิธภัณฑ์สิรินธร จ.กาฬสินธุ์' },
      ],
    },
    'Minimocursor phunoiensis': {
      model: 'assests/model/Minimocursor.glb',
      footprint: 'assests/img/dino_section4/Minimocursor.png',
      timeline: [
        { title: 'ค้นพบโครงกระดูกฝังในหิน', year: '2012 (พ.ศ. 2555) แหล่งภูน้อย อ.คำม่วง กาฬสินธุ์' },
        { title: 'เตรียมตัวอย่างและกรอกระดูกกว่า 5 ปี', year: '2014–2019 โดยศูนย์วิจัยบรรพชีวินวิทยา มมส. (PRC)' },
        { title: 'ประกาศเป็นไดโนเสาร์ไทยชนิดที่ 13', year: '2023 (Manitkoon, Deesri, Chanthasit et al.)' },
        { title: 'เปิดตัวและจัดแสดงต่อสาธารณชน', year: '2023–ปัจจุบัน ณ พิพิธภัณฑ์สิรินธร' },
      ],
    },
    'Siamotyrannus isanensis': {
      model: 'assests/model/Siamotyrannus.glb',
      footprint: 'assests/img/dino_png/Siamotyrannus.png',
      timeline: [
        { title: 'ค้นพบกระดูกสะโพกและหาง', year: '1993 (พ.ศ. 2536) ภูประตูตีหมา อ.เวียงเก่า ขอนแก่น' },
        { title: 'ศึกษาวิจัยวงศ์เทโรพอด', year: '1994–1995 บรรพบุรุษต้นตระกูลไทรันโนซอร์' },
        { title: 'ตีพิมพ์ประกาศสายพันธุ์ใหม่', year: '1996 (Buffetaut, Suteethorn & Tong)' },
        { title: 'จัดแสดงในพิพิธภัณฑ์', year: 'พิพิธภัณฑ์ไดโนเสาร์ภูเวียง' },
      ],
    },
    'Siamosaurus suteethorni': {
      model: 'assests/model/Siamosaurus.glb',
      footprint: 'assests/img/dino_png/Siamosaurus.png',
      timeline: [
        { title: 'ค้นพบฟันรูปกรวยร่องสันแรก', year: '1983 (พ.ศ. 2526) ภูเวียง จ.ขอนแก่น' },
        { title: 'ประกาศเป็นสไปโนซอริดตัวแรกของเอเชีย', year: '1986 (Buffetaut & Ingavat)' },
        { title: 'ค้นพบตัวอย่างฟันเพิ่มเติมทั่วอีสาน', year: '1990–2000 กาฬสินธุ์, ชัยภูมิ, สกลนคร' },
        { title: 'ทบทวนวิจัยระบบนิเวศการกินปลา', year: '2010–ปัจจุบัน บ่งชี้ความสมบูรณ์ของลุ่มน้ำโบราณ' },
      ],
    },
    'Phuwiangvenator yaemniyomi': {
      model: 'assests/model/Phuwiangvenator.glb',
      footprint: 'assests/img/dino_section4/Phuwiangvenator.png',
      timeline: [
        { title: 'ค้นพบฟอสซิลกรงเล็บมือและกระดูกขา', year: '1993 (พ.ศ. 2536) หลุมขุดค้นที่ 9B ภูเวียง' },
        { title: 'วิจัยเชิงลึกด้านวิวัฒนาการ Megaraptora', year: '2015–2018 โครงการวิจัยร่วมไทย-ญี่ปุ่น' },
        { title: 'ตีพิมพ์ประกาศสายพันธุ์ใหม่', year: '2019 ตั้งชื่อเกียรติแก่ นายสุธรรม แย้มนิยม' },
        { title: 'จัดแสดงในพิพิธภัณฑ์', year: 'ศูนย์ศึกษาวิจัยและพิพิธภัณฑ์ไดโนเสาร์ภูเวียง' },
      ],
    },
    'Vayuraptor nongbualamphuensis': {
      model: 'assests/model/Vayuraptor.glb',
      footprint: 'assests/img/dino_section4/Vayuraptor.png',
      timeline: [
        { title: 'ค้นพบชิ้นส่วนกระดูกข้อเท้าและขา', year: '1988 (พ.ศ. 2531) ภูวัด อ.เมือง จ.หนองบัวลำภู' },
        { title: 'จำแนกโครงสร้างสรีระราปเตอร์นักล่า', year: '2016–2019 โดยคณะผู้วิจัยไทย-ญี่ปุ่น' },
        { title: 'ตีพิมพ์ประกาศชื่อ จ้าวสายลมแห่งหนองบัวลำภู', year: '2019 (Samathi, Chanthasit & Sander)' },
        { title: 'จัดแสดงในพิพิธภัณฑ์', year: 'พิพิธภัณฑ์สิรินธร และพิพิธภัณฑ์หอยหิน 150 ล้านปี' },
      ],
    },
    'Siamraptor suwati': {
      model: 'assests/model/Siamraptor.glb',
      footprint: 'assests/img/dino_section4/Siamraptor.png',
      timeline: [
        { title: 'ค้นพบฟอสซิลกะโหลก ขากรรไกร และฟัน', year: '2007–2009 บ้านสะพานหิน ต.สุรนารี โคราช' },
        { title: 'วิจัยโครงกระดูกคาร์คาโรดอนโตซอร์', year: '2011–2018 สถาบันไม้กลายเป็นหินฯ และ ม.ฟูกุอิ' },
        { title: 'ตีพิมพ์ในวารสารระดับโลก PLOS ONE', year: '2019 ไดโนเสาร์กินเนื้อใหญ่ที่สุดของไทย' },
        { title: 'จัดแสดงในพิพิธภัณฑ์', year: 'พิพิธภัณฑ์ไม้กลายเป็นหินฯ จ.นครราชสีมา' },
      ],
    },
  };

  function buildTimeline(events) {
    timelineContainer.innerHTML = '';
    events.forEach((event) => {
      const el = document.createElement('div');
      el.className = 'tl-item';
      el.innerHTML =
        '<span class="tl-dot"></span>' +
        '<div class="tl-content"><h3>' +
        event.title +
        '</h3><p>' +
        event.year +
        '</p></div>';
      timelineContainer.appendChild(el);
    });
  }

  function openModal() {
    modal.style.display = 'flex';
    requestAnimationFrame(() => {
      modal.classList.add('open');
    });
  }

  function closeModal() {
    modal.classList.remove('open');
    setTimeout(() => {
      modal.style.display = 'none';
    }, 300);
  }

  titanCards.forEach((card) => {
    card.addEventListener('click', () => {
      const nameEnEl = card.querySelector('.titan-name-en');
      const nameThEl = card.querySelector('.titan-name');
      if (!nameEnEl) return;

      const nameEn = nameEnEl.textContent.trim();
      const nameTh = nameThEl ? nameThEl.textContent.trim() : '';
      const data = dinoData[nameEn];

      const modalTitle = document.getElementById('modalDinoName');
      if (modalTitle) {
        modalTitle.textContent = `${nameTh} (${nameEn})`;
      }

      const modelSrc = (data && data.model) ? data.model : 'assests/model/Phuwiangosaurus_sirindhornae.glb';
      const timelineEvents = (data && data.timeline) ? data.timeline : [
        { title: 'ค้นพบฟอสซิล', year: '—' },
        { title: 'ศึกษาวิจัย', year: '—' },
        { title: 'ประกาศชื่อวิทยาศาสตร์', year: '—' },
        { title: 'จัดแสดงพิพิธภัณฑ์', year: '—' },
      ];

      dinoModel.setAttribute('src', modelSrc);
      buildTimeline(timelineEvents);
      openModal();
    });
  });

  closeModalBtn.addEventListener('click', closeModal);
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
    setTimeout(() => ScrollTrigger.refresh(), 500);
  });
});

/* ---------------------------------------------
 * Section5 – Thailand Paleontology & Geopark Map (SVG)
 * --------------------------------------------- */
const mapSvg = document.querySelector('.th-map');

const provinceData = {
  'kkn': {
    'data-name': 'ขอนแก่น',
    'data-summary': 'จุดกำเนิดการค้นพบฟอสซิลไดโนเสาร์แห่งแรกของไทยเมื่อปี พ.ศ. 2519 ณ หุบเขาภูเวียง พบไดโนเสาร์สายพันธุ์ใหม่ของโลกถึง 5 ชนิด',
    'data-museum': 'ศูนย์ศึกษาวิจัยและพิพิธภัณฑ์ไดโนเสาร์ภูเวียง, พิพิธภัณฑ์ธรรมชาติวิทยา มข.',
    'data-geopark': 'อุทยานธรณีขอนแก่น (Khon Kaen Geopark - แหล่งภูเวียง)'
  },
  'ksn': {
    'data-name': 'กาฬสินธุ์',
    'data-summary': 'แหล่งฟอสซิลไดโนเสาร์กินพืชที่สมบูรณ์ที่สุด (ภูกุ้มข้าว) และแหล่งขุดค้นภูน้อย "Jurassic Park เมืองไทย" แหล่งกำเนิดมินิโมเคอร์เซอร์และสัตว์ร่วมยุคกว่า 5,000 ชิ้น',
    'data-museum': 'พิพิธภัณฑ์สิรินธร (พิพิธภัณฑ์ไดโนเสาร์ใหญ่ที่สุดในอาเซียน)',
    'data-geopark': 'อุทยานธรณีกาฬสินธุ์ (Kalasin Geopark & แหล่งรอยเท้าภูแฝก)'
  },
  'nma': {
    'data-name': 'นครราชสีมา',
    'data-summary': 'มหานครแห่งบรรพชีวินโลก ดินแดน Triple Crown ของ UNESCO พบไดโนเสาร์ 4 ชนิด ช้างโบราณ 4 สกุล และเอปโคราช บรรพบุรุษอุรังอุตัง',
    'data-museum': 'สถาบันวิจัยไม้กลายเป็นหินและทรัพยากรธรณีฯ, แหล่งขุดค้นบ่อทรายท่าช้าง',
    'data-geopark': 'โคราชจีโอพาร์ก (Khorat UNESCO Global Geopark)'
  },
  'cpm': {
    'data-name': 'ชัยภูมิ',
    'data-summary': 'แหล่งค้นพบอีสานโนซอรัส (Isanosaurus) ซอโรพอดเก่าแก่ที่สุดในโลก ยุคไทรแอสซิก 210 ล้านปี และซิตตะโกซอรัสปากนกแก้ว',
    'data-museum': 'ศูนย์ข้อมูลธรณีวิทยาและฟอสซิลชัยภูมิ',
    'data-geopark': 'อุทยานธรณีชัยภูมิ (Chaiyaphum Geopark & รอยเท้าวัดเขาตาเงาะ)'
  },
  'nbp': {
    'data-name': 'หนองบัวลำภู',
    'data-summary': 'แหล่งค้นพบฟอสซิลหอยหินอายุ 150 ล้านปี และไดโนเสาร์กินเนื้อวายุแรปเตอร์ (Vayuraptor) รวมถึงจระเข้โบราณชาลาวัน',
    'data-museum': 'พิพิธภัณฑ์หอยหิน 150 ล้านปี และไดโนเสาร์โนนทัน',
    'data-geopark': 'อุทยานธรณีหนองบัวลำภู (Nong Bua Lamphu Geopark)'
  },
  'mkm': {
    'data-name': 'มหาสารคาม',
    'data-summary': 'ศูนย์กลางงานวิจัยและการศึกษาบรรพชีวินวิทยาชั้นนำของเอเชียตะวันออกเฉียงใต้ โดยศูนย์วิจัยและการศึกษาบรรพชีวินวิทยา มมส. (PRC)',
    'data-museum': 'ศูนย์วิจัยและการศึกษาบรรพชีวินวิทยา มหาวิทยาลัยมหาสารคาม (PRC Museum)',
    'data-geopark': 'แหล่งเรียนรู้และคลังตัวอย่างฟอสซิลอ้างอิงระดับนานาชาติ'
  },
  'ubn': {
    'data-name': 'อุบลราชธานี',
    'data-summary': 'อุทยานธรณีผาชัน สามพันโบก ประติมากรรมหินทรายและกุมภลักษณ์แม่น้ำโขง พร้อมชั้นหินมหายุคมีโซโซอิกอันงดงาม',
    'data-museum': 'ศูนย์บริการนักท่องเที่ยวอุทยานธรณีผาชัน',
    'data-geopark': 'อุทยานธรณีผาชัน-สามพันโบก (Ubon Ratchathani Geopark)'
  },
  'mdh': {
    'data-name': 'มุกดาหาร',
    'data-summary': 'แหล่งค้นพบรอยทางเดินไดโนเสาร์กินเนื้อขนาดใหญ่กว่า 100 รอย บนลานหินทรายหมวดหินพระวิหาร ณ ภูแฝก-ภูหมู',
    'data-museum': 'แหล่งรอยเท้าไดโนเสาร์ภูหลวง ภูสระดอกบัว',
    'data-geopark': 'อุทยานธรณีมุกดาหาร'
  },
  'snk': {
    'data-name': 'สกลนคร',
    'data-summary': 'แหล่งรอยเท้าไดโนเสาร์ท่าอุเทน-สกลนคร และฟอสซิลพืชโบราณบนเทือกเขาภูพาน',
    'data-museum': 'ศูนย์วัฒนธรรมและพิพิธภัณฑ์ภูพาน',
    'data-geopark': 'พื้นที่ธรณีวิทยาภูพาน'
  },
  'udn': {
    'data-name': 'อุดรธานี',
    'data-summary': 'อุทยานประวัติศาสตร์ภูพระบาท ธรณีสัณฐานเพิงหินทรายมรดกโลก UNESCO และแหล่งโบราณคดีบ้านเชียง',
    'data-museum': 'พิพิธภัณฑสถานแห่งชาติ บ้านเชียง, ศูนย์ข้อมูลภูพระบาท',
    'data-geopark': 'ภูพระบาท มรดกโลกทางวัฒนธรรมและธรณีสัณฐาน'
  },
  'lei': {
    'data-name': 'เลย',
    'data-summary': 'แหล่งฟอสซิลรอยเท้าไดโนเสาร์ภูหลวง และภูเขาหินปูนคาสต์ยุคเพอร์เมียน ภูกระดึง-ภูเรือ',
    'data-museum': 'ศูนย์วิจัยและพัฒนาการท่องเที่ยวทางธรณีวิทยาเลย',
    'data-geopark': 'อุทยานธรณีเลย (Loei Geopark)'
  },
  'bkn': {
    'data-name': 'บึงกาฬ',
    'data-summary': 'หินสามวาฬ ภูสิงห์ ประติมากรรมหินทรายหมวดหินภูทอก 75 ล้านปี และภูทอกแหล่งธรณีสัณฐานมหัศจรรย์',
    'data-museum': 'ศูนย์เรียนรู้ธรรมชาติภูสิงห์',
    'data-geopark': 'พื้นที่ธรณีสัณฐานภูสิงห์-หินสามวาฬ'
  },
  'nki': {
    'data-name': 'หนองคาย',
    'data-summary': 'ลานหินทรายริมแม่น้ำโขงและรอยต่อชั้นหินมหายุคมีโซโซอิก',
    'data-museum': 'พิพิธภัณฑ์สัตว์น้ำจังหวัดหนองคาย',
    'data-geopark': 'พื้นที่ธรณีวิทยาและนิเวศลุ่มน้ำโขง'
  },
  'ret': {
    'data-name': 'ร้อยเอ็ด',
    'data-summary': 'พื้นที่ราบทุ่งกุลาร้องไห้ แหล่งสะสมตะกอนเกลือหินและหมวดหินมหาสารคามโบราณ',
    'data-museum': 'พิพิธภัณฑสถานแห่งชาติ ร้อยเอ็ด',
    'data-geopark': 'แหล่งเรียนรู้ธรณีวิทยาทุ่งกุลาร้องไห้'
  },
  'yst': {
    'data-name': 'ยโสธร',
    'data-summary': 'พื้นที่ราบลุ่มแม่น้ำชีและแนวชั้นหินทรายแป้งหมวดหินโคกกรวด',
    'data-museum': 'ศูนย์เรียนรู้วัฒนธรรมและประวัติศาสตร์ยโสธร',
    'data-geopark': 'พื้นที่ธรณีวิทยาลุ่มน้ำชี'
  },
  'acr': {
    'data-name': 'อำนาจเจริญ',
    'data-summary': 'วนอุทยานภูสิงห์-ภูผาผึ้ง ธรณีสัณฐานหินทรายและกุมภลักษณ์ลอยฟ้า',
    'data-museum': 'ศูนย์บริการนักท่องเที่ยวภูสิงห์-ภูผาผึ้ง',
    'data-geopark': 'พื้นที่ธรณีวิทยาภูสิงห์-ภูผาผึ้ง'
  },
  'brm': {
    'data-name': 'บุรีรัมย์',
    'data-summary': 'ดินแดนภูเขาไฟโบราณ 6 ลูก (เขากระโดง พนมรุ้ง ฯลฯ) ปรากฏการณ์ลาวาบะซอลต์ยุคควอเทอร์นารี',
    'data-museum': 'ศูนย์เรียนรู้ภูเขาไฟกระโดง',
    'data-geopark': 'อุทยานธรณีภูเขาไฟบุรีรัมย์ (Buriram Volcano Geopark)'
  },
  'srn': {
    'data-name': 'สุรินทร์',
    'data-summary': 'แหล่งค้นพบฟอสซิลและรอยต่อหมวดหินโคราช-หินตะกอนลานช้างโบราณ',
    'data-museum': 'พิพิธภัณฑสถานแห่งชาติ สุรินทร์',
    'data-geopark': 'แหล่งเรียนรู้ธรณีวิทยาและช้างโบราณ'
  },
  'ssk': {
    'data-name': 'ศรีสะเกษ',
    'data-summary': 'ผามออีแดง อุทยานแห่งชาติเขาพระวิหาร หน้าผาหินทรายหมวดหินพระวิหารยุคจูแรสซิก',
    'data-museum': 'ศูนย์บริการข้อมูลนักท่องเที่ยวผามออีแดง',
    'data-geopark': 'พื้นที่ธรณีวิทยาผามออีแดง เขาพระวิหาร'
  },
  'stn': {
    'data-name': 'สตูล',
    'data-summary': 'อุทยานธรณีโลกแห่งแรกของไทย โดดเด่นด้วยฟอสซิลมหายุคพาลีโอโซอิก (ไตรโลไบต์ แกรปโตไลต์ และนอติลอยด์)',
    'data-museum': 'พิพิธภัณฑ์ธรรมชาติวิทยาเกาะเภตรา / พิพิธภัณฑ์ธรณีวิทยาทุ่งหว้า',
    'data-geopark': 'อุทยานธรณีโลกสตูล (Satun UNESCO Global Geopark)'
  },
  'tak': {
    'data-name': 'ตาก',
    'data-summary': 'แหล่งไม้กลายเป็นหินที่ยาวที่สุดในโลก บันทึกสถิติ Guinness World Records ความยาวกว่า 69.7 เมตร',
    'data-museum': 'พิพิธภัณฑ์ไม้กลายเป็นหินดอยบาทาก',
    'data-geopark': 'อุทยานธรณีไม้กลายเป็นหินตาก (Tak Geopark)'
  },
  'lpg': {
    'data-name': 'ลำปาง',
    'data-summary': 'แอ่งตะกอนภูเขาไฟและฟอสซิลหอยกาบคู่ ดอกไม้ทะเลโบราณยุคเพอร์เมียน-ไทรแอสซิก',
    'data-museum': 'พิพิธภัณฑ์ธรณีวิทยาเหมืองแม่เมาะ',
    'data-geopark': 'อุทยานธรณีลำปาง (Lampang Geopark)'
  },
  'cri': {
    'data-name': 'เชียงราย',
    'data-summary': 'ภูมิประเทศเขาหินปูน คาสต์ ถ้ำหลวง-ขุนน้ำนางนอน และแหล่งแร่โบราณ',
    'data-museum': 'ศูนย์เรียนรู้ธรณีวิทยาเชียงราย',
    'data-geopark': 'อุทยานธรณีเชียงราย (Chiang Rai Geopark)'
  },
  'spb': {
    'data-name': 'สุพรรณบุรี',
    'data-summary': 'แหล่งเรียนรู้พุหางนาค ป่าหินโบราณอายุกว่าพันล้านปีและพืชพรรณดึกดำบรรพ์',
    'data-museum': 'ศูนย์เรียนรู้พุหางนาค อ.อู่ทอง',
    'data-geopark': 'อุทยานธรณีพุหางนาค'
  },
  'pnb': {
    'data-name': 'เพชรบูรณ์',
    'data-summary': 'อุทยานธรณีเพชรบูรณ์ มหัศจรรย์ผารอยเลื่อน แหล่งซากฟอสซิลปลาโบราณน้ำหนาวและรอยเท้าไดโนเสาร์',
    'data-museum': 'ศูนย์เรียนรู้ซากดึกดำบรรพ์เพชรบูรณ์',
    'data-geopark': 'อุทยานธรณีเพชรบูรณ์ (Phetchabun Geopark)'
  },
  'skn': {
    'data-name': 'สมุทรสาคร',
    'data-summary': 'แหล่งค้นพบโครงกระดูกวาฬโบราณอำนวยศิลป์ (Balaenoptera edeni) อายุกว่า 3,000–5,000 ปี ในชั้นตะกอนทะเลโบราณ',
    'data-museum': 'ศูนย์เรียนรู้วาฬโบราณสมุทรสาคร',
    'data-geopark': 'พื้นที่ธรณีสัณฐานชายฝั่งทะเลโบราณ'
  }
};

// Initialize map data
function initializeMapData() {
  for (const [id, data] of Object.entries(provinceData)) {
    const path = document.getElementById(id);
    if (path) {
      path.classList.add('province');
      for (const [key, value] of Object.entries(data)) {
        path.setAttribute(key, value);
      }
    }
  }
}

// Run initialization
initializeMapData();

/* Create map pins for provinces: museum (yellow) and geopark (blue).
   Pins are SVG circles appended into the same SVG using each province bbox.
*/
function createMapPins() {
  if (!mapSvg || !(mapSvg instanceof SVGElement)) return;

  // Ensure there's a group for pins
  let pinsGroup = mapSvg.querySelector('#mapPins');
  if (!pinsGroup) {
    pinsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    pinsGroup.setAttribute('id', 'mapPins');
    mapSvg.appendChild(pinsGroup);
  }
  pinsGroup.innerHTML = '';

  const allProvinces = document.querySelectorAll('.th-map .province');
  allProvinces.forEach((prov) => {
    const id = prov.id;
    if (!id) return;

    const hasMuseum = prov.dataset && prov.dataset.museum && prov.dataset.museum.trim() !== '-' && prov.dataset.museum.trim() !== '';
    const hasGeopark = prov.dataset && prov.dataset.geopark && prov.dataset.geopark.trim() !== '-' && prov.dataset.geopark.trim() !== '';

    // compute a simple anchor point using bbox center
    let bbox;
    try {
      bbox = prov.getBBox();
    } catch (err) {
      return;
    }
    const cx = bbox.x + bbox.width / 2;
    const cy = bbox.y + bbox.height / 2;

    // If both features exist, render two small pins slightly offset
    if (hasMuseum) {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.classList.add('map-pin', 'museum-pin');
      g.dataset.province = id;
      g.dataset.type = 'museum';

      // head (circle)
      const head = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      head.classList.add('pin-head');
      head.setAttribute('cx', String(cx - (hasGeopark ? 6 : 0)));
      head.setAttribute('cy', String(cy - bbox.height * 0.12));
      head.setAttribute('r', '6');

      // tail (teardrop path)
      const tail = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      tail.classList.add('pin-tail');
      const tx = cx - (hasGeopark ? 6 : 0);
      const ty = cy - bbox.height * 0.12;
      const tailD = `M ${tx - 4} ${ty + 2} C ${tx - 4} ${ty + 10} ${tx} ${ty + 16} ${tx} ${ty + 20} C ${tx} ${ty + 16} ${tx + 4} ${ty + 10} ${tx + 4} ${ty + 2} Z`;
      tail.setAttribute('d', tailD);

      g.appendChild(tail);
      g.appendChild(head);
      pinsGroup.appendChild(g);

      g.addEventListener('click', () => {
        prov.dispatchEvent(new Event('click'));
      });
      g.addEventListener('mouseenter', () => {
        prov.dispatchEvent(new Event('mouseenter'));
      });
    }

    if (hasGeopark) {
      const g2 = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g2.classList.add('map-pin', 'geopark-pin');
      g2.dataset.province = id;
      g2.dataset.type = 'geopark';

      const head2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      head2.classList.add('pin-head');
      head2.setAttribute('cx', String(cx + (hasMuseum ? 6 : 0)));
      head2.setAttribute('cy', String(cy - bbox.height * 0.12));
      head2.setAttribute('r', '6');

      const tail2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      tail2.classList.add('pin-tail');
      const tx2 = cx + (hasMuseum ? 6 : 0);
      const ty2 = cy - bbox.height * 0.12;
      const tailD2 = `M ${tx2 - 4} ${ty2 + 2} C ${tx2 - 4} ${ty2 + 10} ${tx2} ${ty2 + 16} ${tx2} ${ty2 + 20} C ${tx2} ${ty2 + 16} ${tx2 + 4} ${ty2 + 10} ${tx2 + 4} ${ty2 + 2} Z`;
      tail2.setAttribute('d', tailD2);

      g2.appendChild(tail2);
      g2.appendChild(head2);
      pinsGroup.appendChild(g2);

      g2.addEventListener('click', () => {
        prov.dispatchEvent(new Event('click'));
      });
      g2.addEventListener('mouseenter', () => {
        prov.dispatchEvent(new Event('mouseenter'));
      });
    }
  });
}

// Create pins after initialization
setTimeout(() => {
  createMapPins();
}, 100);

// Select provinces after initialization
const provinces = document.querySelectorAll('.th-map .province');
const mapNameEl = document.getElementById('mapProvinceName');
const mapSummaryEl = document.getElementById('mapProvinceSummary');
const mapMuseumEl = document.getElementById('mapProvinceMuseum');
const mapGeoparkEl = document.getElementById('mapProvinceGeopark');

/* ---------------------------------------------
 * Region coloring: full province->region mapping
 * --------------------------------------------- */
// Map of SVG path id -> region key
const regionMapping = {
  /* Central */
  bkk: 'central', nbi: 'central', pte: 'central', aya: 'central', atg: 'central', lri: 'central', sbr: 'central', cnt: 'central', sri: 'central',
  rbr: 'central', kri: 'central', spb: 'central', npt: 'central', skn: 'central', skm: 'central', pbi: 'central', nsn: 'north', uti: 'central',

  /* East */
  cbi: 'east', ryg: 'east', cti: 'east', trt: 'east', cco: 'east', pri: 'east', nyk: 'east', skw: 'east',

  /* Northeast (อีสาน) */
  nma: 'northeast', brm: 'northeast', srn: 'northeast', ssk: 'northeast', ubn: 'northeast', yst: 'northeast', cpm: 'northeast', acr: 'northeast',
  bkn: 'northeast', nbp: 'northeast', kkn: 'northeast', udn: 'northeast', lei: 'northeast', nki: 'northeast', mkm: 'northeast', ret: 'northeast',
  ksn: 'northeast', snk: 'northeast', npm: 'northeast', mdh: 'northeast',

  /* North */
  cmi: 'north', lpn: 'north', lpg: 'north', utd: 'north', pre: 'north', nan: 'north', pyo: 'north', cri: 'north', msn: 'north', kpt: 'north', tak: 'north',
  sti: 'north', plk: 'north', pct: 'north', pnb: 'north', nsn: 'north',

  /* South */
  nrt: 'south', kbi: 'south', pna: 'south', pkt: 'south', sni: 'south', rng: 'south', cpn: 'south', ska: 'south', stn: 'south', trg: 'south', plg: 'south', ptn: 'south', yla: 'south', nwt: 'south',

  /* Others / special */
  lksg: 'other'
};

const regionToggleBtn = document.getElementById('mapRegionToggle');

function applyRegionColoring(enabled) {
  provinces.forEach((prov) => {
    const id = prov.id;
    // remove any previous region classes
    prov.classList.remove('region-northeast', 'region-north', 'region-central', 'region-east', 'region-south');
    const region = regionMapping[id] || 'other';
    if (!enabled) return; // leave without region classes
    if (region === 'northeast') prov.classList.add('region-northeast');
    else if (region === 'north') prov.classList.add('region-north');
    else if (region === 'central') prov.classList.add('region-central');
    else if (region === 'east') prov.classList.add('region-east');
    else if (region === 'south') prov.classList.add('region-south');
    // unknown/other -> no class
  });

  // show/hide the small region legend inside map-legend
  const regionLegend = document.querySelector('.map-region-legend');
  if (regionLegend) regionLegend.style.display = enabled ? 'flex' : 'none';
}

// initialize region legend hidden by default
if (document.querySelector('.map-region-legend')) document.querySelector('.map-region-legend').style.display = 'none';

if (regionToggleBtn) {
  regionToggleBtn.addEventListener('click', () => {
    const pressed = regionToggleBtn.getAttribute('aria-pressed') === 'true';
    const newState = !pressed;
    regionToggleBtn.setAttribute('aria-pressed', String(newState));
    if (newState) regionToggleBtn.classList.add('active'); else regionToggleBtn.classList.remove('active');
    applyRegionColoring(newState);
  });
}

// Enable region coloring by default (standard full mapping)
if (regionToggleBtn) {
  regionToggleBtn.setAttribute('aria-pressed', 'true');
  regionToggleBtn.classList.add('active');
}
applyRegionColoring(true);

if (mapSvg && provinces.length && mapNameEl && mapSummaryEl && mapMuseumEl && mapGeoparkEl) {
  const defaultState = {
    name: 'เลือกจังหวัดบนแผนที่',
    summary:
      'เลื่อนเมาส์หรือแตะที่จังหวัดในแผนที่ เพื่อดูข้อมูลฟอสซิล พิพิธภัณฑ์ และ Geopark ของพื้นที่นั้น ๆ',
    museum: '-',
    geopark: '-',
  };

  function setPanelFromProvince(provEl) {
    const name = provEl.dataset.name || 'จังหวัดไม่ระบุ';
    const summary = provEl.dataset.summary || defaultState.summary;
    const museum = provEl.dataset.museum || '-';
    const geopark = provEl.dataset.geopark || '-';

    mapNameEl.textContent = name;
    mapSummaryEl.textContent = summary;
    mapMuseumEl.textContent = museum;
    mapGeoparkEl.textContent = geopark;
  }

  function resetPanel() {
    mapNameEl.textContent = defaultState.name;
    mapSummaryEl.textContent = defaultState.summary;
    mapMuseumEl.textContent = defaultState.museum;
    mapGeoparkEl.textContent = defaultState.geopark;
  }

  provinces.forEach((prov) => {
    prov.addEventListener('mouseenter', () => {
      provinces.forEach((p) => p.classList.remove('active'));
      prov.classList.add('active');
      setPanelFromProvince(prov);
    });

    // รองรับ mobile: tap = select จังหวัด
    prov.addEventListener('click', () => {
      provinces.forEach((p) => p.classList.remove('active'));
      prov.classList.add('active');
      setPanelFromProvince(prov);
    });
  });

  // ถ้าออกจาก SVG ทั้งหมดให้รีเซ็ตข้อความ
  mapSvg.addEventListener('mouseleave', () => {
    provinces.forEach((p) => p.classList.remove('active'));
    resetPanel();
  });

  // Support touch drag to highlight provinces (Mobile "Hover" effect)
  mapSvg.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1) {
      // Prevent scrolling to allow dragging across the map
      if (e.cancelable) e.preventDefault();

      const touch = e.touches[0];
      const target = document.elementFromPoint(touch.clientX, touch.clientY);

      if (target && target.classList.contains('province')) {
        // Only update if different to avoid thrashing
        if (!target.classList.contains('active')) {
          provinces.forEach((p) => p.classList.remove('active'));
          target.classList.add('active');
          setPanelFromProvince(target);
        }
      }
    }
  }, { passive: false });

  /* ---------------------------------------------
   * Section5: Filter UI wiring (Museum / Geopark)
   * --------------------------------------------- */
  const mapFilterBtns = document.querySelectorAll('.map-filter-btn');
  if (mapFilterBtns && mapFilterBtns.length) {
    function applyMapFilter(filter) {
      provinces.forEach((prov) => {
        // clear any previous state
        prov.classList.remove('highlight-museum', 'highlight-geopark', 'dim');

        const hasMuseum = prov.dataset && prov.dataset.museum && prov.dataset.museum.trim() !== '-' && prov.dataset.museum.trim() !== '';
        const hasGeopark = prov.dataset && prov.dataset.geopark && prov.dataset.geopark.trim() !== '-' && prov.dataset.geopark.trim() !== '';

        if (filter === 'all') {
          // show all
          return;
        }

        if (filter === 'museum') {
          if (hasMuseum) prov.classList.add('highlight-museum');
          else prov.classList.add('dim');
        }

        if (filter === 'geopark') {
          if (hasGeopark) prov.classList.add('highlight-geopark');
          else prov.classList.add('dim');
        }
      });

      // If filter is 'all' show pins; otherwise hide all pins entirely per user request
      const pinsGroup = mapSvg ? mapSvg.querySelector('#mapPins') : null;
      if (pinsGroup) {
        if (filter === 'all') {
          pinsGroup.classList.remove('hidden');
          pinsGroup.querySelectorAll('.map-pin').forEach((p) => p.classList.remove('hidden'));
        } else {
          pinsGroup.classList.add('hidden');
        }
      }
    }

    mapFilterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter || 'all';

        // toggle behavior: if clicked button is active, reset to all
        const isActive = btn.classList.contains('active');
        mapFilterBtns.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });

        if (isActive || filter === 'all') {
          // reset
          const allBtn = document.querySelector('.map-filter-btn[data-filter="all"]');
          if (allBtn) {
            allBtn.classList.add('active');
            allBtn.setAttribute('aria-pressed', 'true');
          }
          applyMapFilter('all');
          return;
        }

        // set active
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        applyMapFilter(filter);
      });
    });

    // Ensure default state is 'all'
    const defaultBtn = document.querySelector('.map-filter-btn[data-filter="all"]');
    if (defaultBtn) {
      defaultBtn.classList.add('active');
      defaultBtn.setAttribute('aria-pressed', 'true');
    }
  }
}

// เล็ก ๆ น้อย ๆ: แอนิเมชันตอน section-map โผล่
gsap.from('.section-map .map-layout', {
  opacity: 0,
  y: 40,
  duration: 0.8,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: '.section-map',
    start: 'top 80%',
    toggleActions: 'play none none reverse',
  },
});




/* ---------------------------------------------
 * Stone Layer / Stratigraphy Image Interaction
 * --------------------------------------------- */
const stoneImgWrapper = document.querySelector('.stone-image-wrapper');
if (stoneImgWrapper) {
  stoneImgWrapper.addEventListener('click', () => {
    // Cycle to next formation chip on image click
    const chips = Array.from(document.querySelectorAll('.strat-chip'));
    const activeIdx = chips.findIndex((c) => c.classList.contains('active'));
    const nextIdx = (activeIdx + 1) % chips.length;
    chips[nextIdx].click();
  });
}

/* ---------------------------------------------
 * Video Facade Logic
 * --------------------------------------------- */
const videoFacade = document.getElementById('videoFacade');
const videoWrapper = document.getElementById('videoWrapper');

if (videoFacade && videoWrapper) {
  videoFacade.addEventListener('click', () => {
    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube.com/embed/AaxmsSIS6OU?autoplay=1';
    iframe.title = 'YouTube video player';
    iframe.frameBorder = '0';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;

    // Replace facade
    videoWrapper.innerHTML = '';
    videoWrapper.appendChild(iframe);
  });
}

/* ---------------------------------------------
 * Interactive Glowing Particle Canvas Engine (Follows Mouse)
 * --------------------------------------------- */
(function initBackgroundParticles() {
  const canvas = document.getElementById('bgParticles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = 85;

  let mouse = {
    x: -1000,
    y: -1000,
    targetX: -1000,
    targetY: -1000,
    radius: 180,
    isActive: false
  };

  const colors = [
    'rgba(251, 191, 36, ',   // Gold
    'rgba(34, 211, 238, ',   // Cyan
    'rgba(248, 250, 252, ',  // Soft White
    'rgba(244, 114, 182, '   // Pink
  ];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
    mouse.isActive = true;
  });

  window.addEventListener('mouseleave', () => {
    mouse.isActive = false;
  });

  // Touch support for mobile
  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      mouse.targetX = e.touches[0].clientX;
      mouse.targetY = e.touches[0].clientY;
      mouse.isActive = true;
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    mouse.isActive = false;
  });

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : (Math.random() < 0.5 ? -10 : height + 10);
      this.baseRadius = Math.random() * 2 + 1;
      this.radius = this.baseRadius;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.alpha = Math.random() * 0.5 + 0.3;
      this.baseAlpha = this.alpha;
      this.pulseSpeed = Math.random() * 0.02 + 0.008;
      this.pulsePhase = Math.random() * Math.PI * 2;
    }

    update() {
      // Natural drifting
      this.x += this.vx;
      this.y += this.vy;

      // Pulse alpha
      this.pulsePhase += this.pulseSpeed;
      this.alpha = this.baseAlpha + Math.sin(this.pulsePhase) * 0.2;

      // Smooth interaction with mouse
      if (mouse.isActive) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius && dist > 0) {
          const force = (1 - dist / mouse.radius) * 1.5;
          const angle = Math.atan2(dy, dx);
          this.x += Math.cos(angle) * force * 1.8 + Math.sin(angle) * 0.5;
          this.y += Math.sin(angle) * force * 1.8 - Math.cos(angle) * 0.5;
          this.radius = this.baseRadius * (1 + (1 - dist / mouse.radius) * 0.8);
        } else {
          this.radius = this.baseRadius;
        }
      } else {
        this.radius = this.baseRadius;
      }

      // Wrap edges smoothly
      if (this.x < -20) this.x = width + 20;
      if (this.x > width + 20) this.x = -20;
      if (this.y < -20) this.y = height + 20;
      if (this.y > height + 20) this.y = -20;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color + Math.max(0.1, this.alpha) + ')';
      ctx.shadowColor = this.color + '0.8)';
      ctx.shadowBlur = 8;
      ctx.fill();
    }
  }

  // Spark burst on click
  window.addEventListener('click', (e) => {
    // Only spawn if not clicking interactive UI buttons
    if (e.target.closest('button, a, input, select, textarea')) return;
    for (let i = 0; i < 6; i++) {
      const p = new Particle();
      p.x = e.clientX;
      p.y = e.clientY;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3 + 1;
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed;
      p.alpha = 0.9;
      particles.push(p);
      if (particles.length > particleCount + 18) {
        particles.shift();
      }
    }
  });

  // Populate particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function render() {
    mouse.x += (mouse.targetX - mouse.x) * 0.1;
    mouse.y += (mouse.targetY - mouse.y) * 0.1;

    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines between close particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 90) {
          const alpha = (1 - dist / 90) * 0.18;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(34, 211, 238, ${alpha})`;
          ctx.lineWidth = 0.75;
          ctx.shadowBlur = 0;
          ctx.stroke();
        }
      }
    }

    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(render);
  }

  render();
})();

/* ---------------------------------------------
 * 3D Card Tilt & Micro-Interactions
 * --------------------------------------------- */
(function initCardTiltInteractions() {
  const cards = document.querySelectorAll('.titan-card, .beyond-card, .choice-card, .game-card');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = -(y / (rect.height / 2)) * 3;
      const rotateY = (x / (rect.width / 2)) * 3;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ---------------------------------------------
 * Section 4.8 – Interactive Fossil Quest Game Engine
 * --------------------------------------------- */
(function initFossilQuestGame() {
  const gameSection = document.getElementById('section-fossil-game');
  if (!gameSection) return;

  const gameLocation = document.getElementById('gameLocation');
  const gameScoreEl = document.getElementById('gameScore');
  const gameEpoch = document.getElementById('gameEpoch');
  const gameQuestion = document.getElementById('gameQuestion');
  const gameChoices = document.getElementById('gameChoices');
  const gameFeedback = document.getElementById('gameFeedback');
  const feedbackTitle = document.getElementById('feedbackTitle');
  const feedbackText = document.getElementById('feedbackText');
  const feedbackIcon = document.getElementById('feedbackIcon');
  const btnNextStage = document.getElementById('btnNextStage');
  const victoryScreen = document.getElementById('victoryScreen');
  const gameArena = document.getElementById('gameArena');
  const finalScoreEl = document.getElementById('finalScore');
  const btnRestartGame = document.getElementById('btnRestartGame');
  const stageSteps = document.querySelectorAll('.stage-step');
  const stageConnectors = document.querySelectorAll('.stage-connector');

  let currentStage = 0;
  let score = 0;
  let correctCount = 0;
  let answered = false;

  // Sound Synth via Web Audio API
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playSound(type) {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === 'correct') {
        // Joyful ascending chime
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.1); // E5
        osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.2); // G5
        osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.3); // C6
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
      } else if (type === 'wrong') {
        // Gentle buzz
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.25);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'fanfare') {
        // Victory fanfare
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
        notes.forEach((note, idx) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.connect(g);
          g.connect(ctx.destination);
          o.type = 'triangle';
          o.frequency.setValueAtTime(note, now + idx * 0.1);
          g.gain.setValueAtTime(0.2, now + idx * 0.1);
          g.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.1 + 0.4);
          o.start(now + idx * 0.1);
          o.stop(now + idx * 0.1 + 0.4);
        });
      }
    } catch (e) {
      // Audio not permitted without gesture or unsupported
    }
  }

  const stages = [
    {
      location: '📍 แหล่งขุดค้น: อ.หนองบัวระเหว จ.ชัยภูมิ',
      epoch: 'ยุคไทรแอสซิกตอนปลาย (~210 ล้านปีก่อน)',
      question: 'ไดโนเสาร์ซอโรพอด (กินพืชคอยาว) ชนิดแรกของไทยและเก่าแก่ที่สุดในโลกที่พบในหมวดหินน้ำพองคือสายพันธุ์ใด?',
      choices: [
        'อีสานโนซอรัส อรรถวิภัชน์ชี (Isanosaurus)',
        'ภูเวียงโกซอรัส สิรินธรเน (Phuwiangosaurus)',
        'สยามโมไทรันนัส อีสานเอนซิส (Siamotyrannus)',
        'ซิตตะโกซอรัส สัตยารักษ์กิ (Psittacosaurus)'
      ],
      correct: 0,
      feedbackTitle: 'ถูกต้องยอดเยี่ยม! (Stage 1 Cleared)',
      feedbackText: 'อีสานโนซอรัส อรรถวิภัชน์ชี (Isanosaurus) คือไดโนเสาร์ซอโรพอดแท้ชนิดแรกของโลก ซึ่งทำให้โลกรู้ว่าไดโนเสาร์คอยาวเริ่มวิวัฒนาการมาตั้งแต่ยุคไทรแอสซิก 210 ล้านปีก่อน ณ ชัยภูมิ'
    },
    {
      location: '📍 แหล่งขุดค้นภูน้อย อ.คำม่วง จ.กาฬสินธุ์',
      epoch: 'ยุคจูแรสซิกตอนปลาย (~150 ล้านปีก่อน)',
      question: 'ไดโนเสาร์นักวิ่งตัวจิ๋วชนิดที่ 13 ของไทย ซึ่งค้นพบโครงกระดูกสมบูรณ์ที่สุดแห่งหนึ่งในเอเชีย ณ แหล่งภูน้อย "Jurassic Park เมืองไทย" คือใคร?',
      choices: [
        'กินรีมิมัส ขอนแก่นเอนซิส (Kinnareemimus)',
        'มินิโมเคอร์เซอร์ ภูน้อยเอนซิส (Minimocursor)',
        'วายุแรปเตอร์ หนองบัวลำภูเอนซิส (Vayuraptor)',
        'สยามโมดอน นิ่มงามมิ (Siamodon)'
      ],
      correct: 1,
      feedbackTitle: 'แม่นยำมาก! (Stage 2 Cleared)',
      feedbackText: 'มินิโมเคอร์เซอร์ ภูน้อยเอนซิส (Minimocursor) เป็นไดโนเสาร์กินพืชขนาดเล็ก เดิน 2 ขา ปราดเปรียว ได้รับการวิจัยโดยศูนย์วิจัยและการศึกษาบรรพชีวินวิทยา มมส. (PRC) และตีพิมพ์ในปี 2023'
    },
    {
      location: '📍 หุบเขาภูเวียง อ.เวียงเก่า จ.ขอนแก่น',
      epoch: 'ยุคครีเทเชียสตอนต้น (~130 ล้านปีก่อน)',
      question: 'ไดโนเสาร์สไปโนซอริดตัวแรกของเอเชียที่มีฟันรูปกรวยร่องสันคล้ายจระเข้ ใช้จับปลากินในลุ่มน้ำโบราณแห่งภูเวียงคือสายพันธุ์ใด?',
      choices: [
        'ภูเวียงเวเนเตอร์ แย้มนิยมอิ (Phuwiangvenator)',
        'สยามแรปเตอร์ สุวัจน์ติ (Siamraptor)',
        'สยามโมซอรัส สุธีธรนี (Siamosaurus)',
        'ราชสีมาซอรัส สุรนารีเอ (Ratchasimasaurus)'
      ],
      correct: 2,
      feedbackTitle: 'เก่งมาก! (Stage 3 Cleared)',
      feedbackText: 'สยามโมซอรัส สุธีธรนี (Siamosaurus) เป็นไดโนเสาร์กินปลาตัวแรกของเอเชีย มีฟันทรงกรวยร่องสันคล้ายจระเข้ที่เหมาะแก่การจับปลาโบราณและฉลามน้ำจืดในหนองน้ำยุคครีเทเชียส'
    },
    {
      location: '📍 บ้านสะพานหิน อ.เมือง จ.นครราชสีมา',
      epoch: 'หมวดหินโคกกรวด ยุคครีเทเชียส (~115 ล้านปีก่อน)',
      question: 'ไดโนเสาร์กินเนื้อขนาดใหญ่ที่สุดของไทย (ยอดนักล่าแห่งโคราช) ในกลุ่มคาร์คาโรดอนโตซอร์คือสายพันธุ์ใด?',
      choices: [
        'สยามแรปเตอร์ สุวัจน์ติ (Siamraptor)',
        'สยามโมไทรันนัส อีสานเอนซิส (Siamotyrannus)',
        'สิรินธรนา โคราชเอนซิส (Sirindhorna)',
        'วายุแรปเตอร์ หนองบัวลำภูเอนซิส (Vayuraptor)'
      ],
      correct: 0,
      feedbackTitle: 'สุดยอดนักสืบฟอสซิล! (Stage 4 Cleared)',
      feedbackText: 'สยามแรปเตอร์ สุวัจน์ติ (Siamraptor) ยาวเกือบ 8 เมตร มีฟันคมกริบแบบฉลาม ถือเป็นนักล่าชั้นบนสุดของระบบนิเวศโบราณแห่งโคราช'
    },
    {
      location: '📍 แหล่งบ่อทรายท่าช้าง โคราช UNESCO Global Geopark',
      epoch: 'ยุคซีโนโซอิก ไมโอซีนตอนปลาย (~7–9 ล้านปีก่อน)',
      question: 'ฟอสซิลเอปโบราณขนาดใหญ่ที่พบในบ่อทรายท่าช้าง ซึ่งเป็นหลักฐานสำคัญของบรรพบุรุษลิงอุรังอุตังในปัจจุบันคือสายพันธุ์ใด?',
      choices: [
        'สเตโกดอน (Stegodon)',
        'ไฮยีนาลายจุดโบราณ (Crocuta crocuta ultima)',
        'โคราชพิเธคัส พิริยะอิ (Khoratpithecus piriyai)',
        'แรดโบราณไร้นอ (Aceratherium porpani)'
      ],
      correct: 2,
      feedbackTitle: 'ยอดเยี่ยม! คุณพิชิตภารกิจครบ 5 ด่านแล้ว',
      feedbackText: 'โคราชพิเธคัส พิริยะอิ (Khoratpithecus) เป็นเอปโบราณบรรพบุรุษอุรังอุตังที่สมบูรณ์ที่สุดชิ้นหนึ่งของโลก ทำให้โคราชได้รับการยกย่องเป็นมรดกบรรพชีวินวิทยาโลก'
    }
  ];

  const letters = ['A', 'B', 'C', 'D'];

  const inGameProgressFill = document.getElementById('inGameProgressFill');
  const inGameDinoRunner = document.getElementById('inGameDinoRunner');
  const inGameProgressText = document.getElementById('inGameProgressText');
  const inGameDinoEmoji = document.getElementById('inGameDinoEmoji');
  const inGameDinoBubble = document.getElementById('inGameDinoBubble');

  const stageDinoStatuses = [
    { percent: 0, emoji: '🦖', bubble: 'จุดเริ่มต้น: มุ่งสู่ไทรแอสซิก (~210 Ma)', label: 'ด่านที่ 1 / 5 (เริ่มต้น 0%)' },
    { percent: 25, emoji: '🦕', bubble: 'บุกจูแรสซิกภูน้อย (~150 Ma)', label: 'ด่านที่ 2 / 5 (25%)' },
    { percent: 50, emoji: '🦖', bubble: 'ลุยหุบเขาภูเวียง (~130 Ma)', label: 'ด่านที่ 3 / 5 (50%)' },
    { percent: 75, emoji: '🦕', bubble: 'เผชิญหน้านักล่าโคกกรวด (~115 Ma)', label: 'ด่านที่ 4 / 5 (75%)' },
    { percent: 100, emoji: '👑', bubble: 'พิชิตบ่อทรายท่าช้าง (~7-9 Ma)', label: 'ด่านที่ 5 / 5 (100%)' }
  ];

  function updateInGameProgress(stageIdx) {
    const status = stageDinoStatuses[Math.min(stageIdx, stageDinoStatuses.length - 1)];
    if (!status) return;

    if (inGameProgressFill) inGameProgressFill.style.width = `${status.percent}%`;
    if (inGameDinoRunner) inGameDinoRunner.style.left = `${status.percent}%`;
    if (inGameProgressText) inGameProgressText.textContent = status.label;
    if (inGameDinoEmoji) inGameDinoEmoji.textContent = status.emoji;
    if (inGameDinoBubble) inGameDinoBubble.textContent = status.bubble;
  }

  function updateTrack() {
    stageSteps.forEach((step, idx) => {
      step.classList.remove('active', 'cleared');
      if (idx < currentStage) {
        step.classList.add('cleared');
      } else if (idx === currentStage) {
        step.classList.add('active');
      }
    });

    stageConnectors.forEach((conn, idx) => {
      conn.classList.remove('cleared');
      if (idx < currentStage) {
        conn.classList.add('cleared');
      }
    });

    updateInGameProgress(currentStage);
  }

  function loadStage(idx) {
    if (idx >= stages.length) {
      showVictoryScreen();
      return;
    }

    answered = false;
    const stage = stages[idx];

    gameLocation.textContent = stage.location;
    gameEpoch.textContent = stage.epoch;
    gameQuestion.textContent = stage.question;
    gameScoreEl.textContent = score;

    gameFeedback.classList.add('hidden');
    gameChoices.innerHTML = '';

    stage.choices.forEach((choice, cIdx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'choice-btn';
      btn.innerHTML = `<span class="choice-letter">${letters[cIdx]}</span> <span class="choice-text">${choice}</span>`;
      btn.addEventListener('click', () => handleChoice(cIdx, btn));
      gameChoices.appendChild(btn);
    });

    updateTrack();

    gsap.fromTo(gameArena, { opacity: 0.8, y: 15 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
  }

  function handleChoice(cIdx, btnEl) {
    if (answered) return;
    answered = true;

    const stage = stages[currentStage];
    const allBtns = gameChoices.querySelectorAll('.choice-btn');

    if (cIdx === stage.correct) {
      // Correct!
      playSound('correct');
      btnEl.classList.add('correct');
      score += 100;
      correctCount++;
      gameScoreEl.textContent = score;

      feedbackIcon.textContent = '🎉';
      feedbackTitle.textContent = stage.feedbackTitle;
      feedbackText.textContent = stage.feedbackText;
      gameFeedback.classList.remove('hidden');

      if (currentStage === stages.length - 1) {
        btnNextStage.textContent = '🏆 ดูผลประกาศนียบัตร ➔';
      } else {
        btnNextStage.textContent = 'ลุยด่านถัดไป ➔';
      }
    } else {
      // Wrong
      playSound('wrong');
      btnEl.classList.add('wrong');
      // Highlight correct
      allBtns[stage.correct].classList.add('correct');

      feedbackIcon.textContent = '💡';
      feedbackTitle.textContent = 'ยังไม่ถูกต้อง แต่ได้เรียนรู้!';
      feedbackText.textContent = stage.feedbackText;
      gameFeedback.classList.remove('hidden');
      btnNextStage.textContent = (currentStage === stages.length - 1) ? '🏆 ดูผลการทดสอบ ➔' : 'ด่านถัดไป ➔';
    }

    allBtns.forEach((b) => b.disabled = true);
  }

  btnNextStage.addEventListener('click', () => {
    currentStage++;
    if (currentStage >= stages.length) {
      showVictoryScreen();
    } else {
      loadStage(currentStage);
    }
  });

  function showVictoryScreen() {
    playSound('fanfare');
    gameArena.classList.add('hidden');
    victoryScreen.classList.remove('hidden');

    const totalStages = stages.length;
    const clearedStagesEl = document.getElementById('clearedStages');
    const accuracyRankEl = document.getElementById('accuracyRank');
    const victoryBadgeIcon = document.getElementById('victoryBadgeIcon');
    const victoryTitle = document.getElementById('victoryTitle');
    const victoryDesc = document.getElementById('victoryDesc');

    finalScoreEl.textContent = score;
    if (clearedStagesEl) clearedStagesEl.textContent = `${correctCount} / ${totalStages}`;
    const accuracy = Math.round((correctCount / totalStages) * 100);
    if (accuracyRankEl) accuracyRankEl.textContent = `${accuracy}%`;

    if (correctCount === 5) {
      if (victoryBadgeIcon) victoryBadgeIcon.textContent = '🎖️';
      if (victoryTitle) victoryTitle.textContent = 'ยอดเยี่ยมไร้ที่ติ! คุณผ่านภารกิจข้ามกาลเวลาสมบูรณ์แบบ';
      if (victoryDesc) victoryDesc.innerHTML = 'คุณได้รับตราเกียรติยศ <strong>"สุดยอดนักบรรพชีวินวิทยาแห่งแผ่นดินอีสาน (Master Paleontologist)"</strong> ตอบถูกครบทั้ง 5 แหล่งสำคัญ!';
    } else if (correctCount >= 3) {
      if (victoryBadgeIcon) victoryBadgeIcon.textContent = '🥈';
      if (victoryTitle) victoryTitle.textContent = 'เก่งมาก! คุณผ่านภารกิจระดับนักสำรวจเชี่ยวชาญ';
      if (victoryDesc) victoryDesc.innerHTML = `คุณได้รับตราเกียรติยศ <strong>"นักสำรวจฟอสซิลระดับเชี่ยวชาญ (Expert Explorer)"</strong> ตอบถูกต้อง ${correctCount} จาก ${totalStages} แหล่งสำคัญ`;
    } else if (correctCount >= 1) {
      if (victoryBadgeIcon) victoryBadgeIcon.textContent = '🥉';
      if (victoryTitle) victoryTitle.textContent = 'ยินดีด้วย! คุณผ่านการทดสอบขั้นพื้นฐาน';
      if (victoryDesc) victoryDesc.innerHTML = `คุณได้รับตราเกียรติยศ <strong>"นักล่าฟอสซิลรุ่นเยาว์ (Apprentice Fossil Hunter)"</strong> ตอบถูกต้อง ${correctCount} จาก ${totalStages} แหล่งสำคัญ`;
    } else {
      if (victoryBadgeIcon) victoryBadgeIcon.textContent = '🧭';
      if (victoryTitle) victoryTitle.textContent = 'เสร็จสิ้นการสำรวจข้ามกาลเวลา';
      if (victoryDesc) victoryDesc.innerHTML = 'ลองเล่นใหม่อีกครั้งเพื่อสะสมความรู้และพิชิตคะแนนเต็ม 500 XP ให้ได้นะ!';
    }

    stageSteps.forEach((s) => s.classList.add('cleared'));
    stageConnectors.forEach((c) => c.classList.add('cleared'));
    updateInGameProgress(stages.length - 1);

    gsap.fromTo(victoryScreen, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.5)' });
  }

  btnRestartGame.addEventListener('click', () => {
    currentStage = 0;
    score = 0;
    correctCount = 0;
    gameArena.classList.remove('hidden');
    victoryScreen.classList.add('hidden');
    loadStage(0);
  });

  // Initial load
  loadStage(0);
})();

/* ============================================================
 * PREHISTORIC PALEONTOLOGICAL ECOSYSTEM SOUNDSCAPE (SURROUNDED BY DINOSAURS)
 * ============================================================ */
class PrehistoricEcosystemEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.masterGain = null;
    this.reverbBus = null;
    this.volume = 0.75;
    this.nodes = [];
    this.eventIntervals = [];
  }

  makeDistortionCurve(amount = 20) {
    const k = amount;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }

  init() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    this.ctx = new AudioCtx();

    // Master Output Gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // Cavernous Valley Echo / Primeval Space Reverb Bus
    this.reverbBus = this.ctx.createGain();
    this.reverbBus.gain.setValueAtTime(0.5, this.ctx.currentTime);

    const delay1 = this.ctx.createDelay();
    delay1.delayTime.setValueAtTime(0.24, this.ctx.currentTime);
    const delay2 = this.ctx.createDelay();
    delay2.delayTime.setValueAtTime(0.48, this.ctx.currentTime);

    const feedback = this.ctx.createGain();
    feedback.gain.setValueAtTime(0.48, this.ctx.currentTime);

    const dampFilter = this.ctx.createBiquadFilter();
    dampFilter.type = 'lowpass';
    dampFilter.frequency.setValueAtTime(1600, this.ctx.currentTime);

    this.reverbBus.connect(delay1);
    delay1.connect(dampFilter);
    dampFilter.connect(delay2);
    delay2.connect(feedback);
    feedback.connect(delay1);

    delay1.connect(this.masterGain);
    delay2.connect(this.masterGain);
  }

  start() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.stopImmediate();
    this.isPlaying = true;

    // Smooth master gain ramp up
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(0.001, now);
    this.masterGain.gain.exponentialRampToValueAtTime(this.volume, now + 0.5);

    // 1. Start continuous living primeval jungle (wind, ancient insects, earth hum)
    this.createLivingJungleEcosystem();

    // 2. Play welcoming opening dinosaur calls (distant sauropod bellow + predatory response)
    this.playDistantSauropodChorus(0.4);
    setTimeout(() => {
      if (this.isPlaying) this.playPredatorEchoRoar(0.42);
    }, 900);

    // 3. Start active surround dinosaur communication schedules
    this.startSurroundDinosaurChorus();
  }

  stop() {
    if (!this.ctx || !this.isPlaying) return;
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(Math.max(0.001, this.masterGain.gain.value), now);
    this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

    setTimeout(() => {
      this.stopImmediate();
    }, 400);
  }

  stopImmediate() {
    this.nodes.forEach(node => {
      try { node.stop(); } catch (e) { }
      try { node.disconnect(); } catch (e) { }
    });
    this.nodes = [];
    this.eventIntervals.forEach(id => clearTimeout(id));
    this.eventIntervals = [];
    this.isPlaying = false;
  }

  // ==========================================
  // 1. LIVING PRIMEVAL JUNGLE ECOSYSTEM BACKDROP
  // ==========================================
  createLivingJungleEcosystem() {
    const ctx = this.ctx;
    const dest = this.masterGain;

    // --- Ancient Forest Canopy Breeze ---
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 2.5;
    }

    const windNoise = ctx.createBufferSource();
    windNoise.buffer = noiseBuffer;
    windNoise.loop = true;

    const windFilter = ctx.createBiquadFilter();
    windFilter.type = 'bandpass';
    windFilter.frequency.setValueAtTime(320, ctx.currentTime);
    windFilter.Q.setValueAtTime(1.4, ctx.currentTime);

    const windLFO = ctx.createOscillator();
    const windLFOGain = ctx.createGain();
    windLFO.frequency.setValueAtTime(0.08, ctx.currentTime);
    windLFOGain.gain.setValueAtTime(160, ctx.currentTime);
    windLFO.connect(windLFOGain);
    windLFOGain.connect(windFilter.frequency);

    const windGain = ctx.createGain();
    windGain.gain.setValueAtTime(0.1, ctx.currentTime);

    windNoise.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(dest);

    windNoise.start();
    windLFO.start();
    this.nodes.push(windNoise, windLFO);

    // --- Deep Primordial Earth Resonance (Tectonic Low Drone) ---
    const earthOsc = ctx.createOscillator();
    const earthGain = ctx.createGain();
    const earthFilter = ctx.createBiquadFilter();

    earthOsc.type = 'sine';
    earthOsc.frequency.setValueAtTime(48, ctx.currentTime);

    earthFilter.type = 'lowpass';
    earthFilter.frequency.setValueAtTime(100, ctx.currentTime);

    earthGain.gain.setValueAtTime(0.08, ctx.currentTime);

    earthOsc.connect(earthFilter);
    earthFilter.connect(earthGain);
    earthGain.connect(dest);

    earthOsc.start();
    this.nodes.push(earthOsc);

    // --- Ancient Primeval Insect / Cicada Ambient Texture ---
    const insectNoise = ctx.createBufferSource();
    insectNoise.buffer = noiseBuffer;
    insectNoise.loop = true;

    const insectFilter = ctx.createBiquadFilter();
    insectFilter.type = 'bandpass';
    insectFilter.frequency.setValueAtTime(3800, ctx.currentTime);
    insectFilter.Q.setValueAtTime(6.0, ctx.currentTime);

    const insectLFO = ctx.createOscillator();
    const insectLFOGain = ctx.createGain();
    insectLFO.frequency.setValueAtTime(4.5, ctx.currentTime);
    insectLFOGain.gain.setValueAtTime(0.015, ctx.currentTime);

    const insectGain = ctx.createGain();
    insectGain.gain.setValueAtTime(0.018, ctx.currentTime);

    insectLFO.connect(insectLFOGain);
    insectLFOGain.connect(insectGain.gain);

    insectNoise.connect(insectFilter);
    insectFilter.connect(insectGain);
    insectGain.connect(dest);

    insectNoise.start();
    insectLFO.start();
    this.nodes.push(insectNoise, insectLFO);
  }

  // ==========================================
  // 2. DYNAMIC SURROUND DINOSAUR CALLS SCHEDULE
  // ==========================================
  startSurroundDinosaurChorus() {
    const triggerRandomDinoEvent = () => {
      if (!this.isPlaying) return;
      const roll = Math.random();
      if (roll < 0.28) {
        this.playDistantSauropodChorus(0.38 + Math.random() * 0.1); // เสียงกู่ร้องก้องหุบเขาของฝูงคอยาว
      } else if (roll < 0.52) {
        this.playPredatorEchoRoar(0.40 + Math.random() * 0.12); // เสียงคำรามกึกก้องของนักล่า
      } else if (roll < 0.72) {
        this.playNearbyHerbivoreBreathAndGrunt(0.35 + Math.random() * 0.1); // เสียงลมหายใจและขู่ต่ำของไดโนเสาร์ใกล้ๆ
      } else if (roll < 0.88) {
        this.playPterosaurCanopyCall(0.28 + Math.random() * 0.08); // เสียงสัตว์ปีกดึกดำบรรพ์บินผ่าน
      } else {
        this.playDistantHeavyFootsteps(0.32 + Math.random() * 0.1); // เสียงก้าวย่างสะเทือนพื้นดิน
      }
    };

    const scheduleNext = () => {
      if (!this.isPlaying) return;
      const delay = 1800 + Math.random() * 2200; // Trigger every 1.8 - 4.0s
      const timer = setTimeout(() => {
        triggerRandomDinoEvent();
        scheduleNext();
      }, delay);
      this.eventIntervals.push(timer);
    };

    scheduleNext();
  }

  // --- 1. Distant Sauropod Chorus (เสียงฝูงไดโนเสาร์คอยาวก้องข้ามหุบเขา) ---
  playDistantSauropodChorus(intensity = 0.4) {
    if (!this.ctx || !this.isPlaying) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(64, now);
    osc1.frequency.linearRampToValueAtTime(105, now + 0.7);
    osc1.frequency.exponentialRampToValueAtTime(42, now + 2.6);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(128, now);
    osc2.frequency.linearRampToValueAtTime(210, now + 0.7);
    osc2.frequency.exponentialRampToValueAtTime(84, now + 2.4);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(280, now);
    filter.frequency.linearRampToValueAtTime(480, now + 0.7);
    filter.frequency.exponentialRampToValueAtTime(140, now + 2.5);
    filter.Q.setValueAtTime(2.8, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(intensity, now + 0.5);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);

    gain.connect(this.masterGain);
    if (this.reverbBus) gain.connect(this.reverbBus);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 2.9);
    osc2.stop(now + 2.9);
  }

  // --- 2. Predator Echo Roar (เสียงคำรามกึกก้องของไดโนเสาร์นักล่า สยามโมไทรันนัส) ---
  playPredatorEchoRoar(intensity = 0.45) {
    if (!this.ctx || !this.isPlaying) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const sub = ctx.createOscillator();
    const fm = ctx.createOscillator();
    const fmGain = ctx.createGain();
    const dist = ctx.createWaveShaper();
    dist.curve = this.makeDistortionCurve(25);

    fm.frequency.setValueAtTime(38, now);
    fm.frequency.exponentialRampToValueAtTime(16, now + 1.6);
    fmGain.gain.setValueAtTime(70, now);
    fm.connect(fmGain);
    fmGain.connect(osc.frequency);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.4);
    osc.frequency.exponentialRampToValueAtTime(32, now + 1.8);

    sub.type = 'triangle';
    sub.frequency.setValueAtTime(75, now);
    sub.frequency.exponentialRampToValueAtTime(28, now + 1.6);

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(420, now);
    filter.frequency.exponentialRampToValueAtTime(780, now + 0.3);
    filter.frequency.exponentialRampToValueAtTime(160, now + 1.7);
    filter.Q.setValueAtTime(3.8, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(intensity, now + 0.18);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);

    osc.connect(dist);
    dist.connect(filter);
    sub.connect(filter);
    filter.connect(gain);

    gain.connect(this.masterGain);
    if (this.reverbBus) gain.connect(this.reverbBus);

    osc.start(now);
    sub.start(now);
    fm.start(now);

    osc.stop(now + 2.1);
    sub.stop(now + 2.1);
    fm.stop(now + 2.1);
  }

  // --- 3. Nearby Herbivore Breath & Grunt (เสียงพ่นลมหายใจและเสียงคำรามในลำคอของยักษ์ใหญ่ใกล้ๆ) ---
  playNearbyHerbivoreBreathAndGrunt(intensity = 0.35) {
    if (!this.ctx || !this.isPlaying) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const fm = ctx.createOscillator();
    const fmGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    fm.frequency.setValueAtTime(24, now);
    fmGain.gain.setValueAtTime(45, now);
    fm.connect(fmGain);
    fmGain.connect(osc.frequency);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(85, now);
    osc.frequency.linearRampToValueAtTime(60, now + 0.5);
    osc.frequency.exponentialRampToValueAtTime(35, now + 1.4);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, now);
    filter.frequency.exponentialRampToValueAtTime(120, now + 1.3);
    filter.Q.setValueAtTime(4.0, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(intensity, now + 0.25);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);

    osc.connect(filter);
    filter.connect(gain);

    gain.connect(this.masterGain);
    if (this.reverbBus) gain.connect(this.reverbBus);

    osc.start(now);
    fm.start(now);
    osc.stop(now + 1.6);
    fm.stop(now + 1.6);
  }

  // --- 4. Pterosaur & Raptor Canopy Screech (เสียงสัตว์ปีกโบราณและแรปเตอร์บนยอดไม้) ---
  playPterosaurCanopyCall(intensity = 0.3) {
    if (!this.ctx || !this.isPlaying) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const fm = ctx.createOscillator();
    const fmGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    fm.frequency.setValueAtTime(60, now);
    fmGain.gain.setValueAtTime(90, now);
    fm.connect(fmGain);
    fmGain.connect(osc.frequency);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(540, now);
    osc.frequency.exponentialRampToValueAtTime(820, now + 0.2);
    osc.frequency.exponentialRampToValueAtTime(260, now + 0.9);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(680, now);
    filter.frequency.exponentialRampToValueAtTime(1100, now + 0.22);
    filter.frequency.exponentialRampToValueAtTime(340, now + 0.9);
    filter.Q.setValueAtTime(3.5, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(intensity, now + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.05);

    osc.connect(filter);
    filter.connect(gain);

    gain.connect(this.masterGain);
    if (this.reverbBus) gain.connect(this.reverbBus);

    osc.start(now);
    fm.start(now);
    osc.stop(now + 1.1);
    fm.stop(now + 1.1);
  }

  // --- 5. Distant Heavy Footsteps (เสียงก้าวย่างสั่นสะเทือนพื้นดินของฝูงสัตว์ยักษ์) ---
  playDistantHeavyFootsteps(intensity = 0.35) {
    if (!this.ctx || !this.isPlaying) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(60, now);
    osc.frequency.exponentialRampToValueAtTime(28, now + 0.35);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(110, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(intensity, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

    osc.connect(filter);
    filter.connect(gain);

    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.65);
  }

  // SFX: UI Feedback Chime
  playClickChime(success = true) {
    if (!this.ctx) this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const freq = success ? 587.33 : 329.63;
    osc.frequency.setValueAtTime(freq, now);
    if (success) {
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
    }

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.4);
  }
}

// Global Prehistoric Ecosystem Sound Instance
const dinosaurAudio = new PrehistoricEcosystemEngine();

// Compact UI Bindings for Dinosaur Sound Toggle Button
(function initDinosaurAudioUI() {
  const widget = document.getElementById('ambientAudioWidget');
  const toggleBtn = document.getElementById('audioToggleBtn');
  const audioIcon = document.getElementById('audioIcon');
  const audioLabel = document.getElementById('audioLabel');

  if (!toggleBtn) return;

  function updateAudioUI(playing) {
    if (playing) {
      widget.classList.add('playing');
      if (audioIcon) audioIcon.textContent = '🔊';
      // if (audioLabel) audioLabel.textContent = '';
    } else {
      widget.classList.remove('playing');
      if (audioIcon) audioIcon.textContent = '🦖';
      // if (audioLabel) audioLabel.textContent = '';
    }
  }

  toggleBtn.addEventListener('click', () => {
    if (dinosaurAudio.isPlaying) {
      dinosaurAudio.stop();
      updateAudioUI(false);
    } else {
      dinosaurAudio.start();
      updateAudioUI(true);
    }
  });

  // Sound effects on dinosaur titan cards & buttons
  document.querySelectorAll('.titan-card, .btn-titan').forEach((card) => {
    card.addEventListener('click', () => {
      dinosaurAudio.playPredatorEchoRoar(0.55);
    });
  });

  document.querySelectorAll('.quiz-option-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      dinosaurAudio.playClickChime(true);
    });
  });
})();
