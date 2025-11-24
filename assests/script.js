// Main JavaScript for the Isan Time‑Scroll website
// This script handles scrolling between sections, background video switching,
// diet filtering in Section4 and the interactive modal with scratch
// off, 3D model and timeline.

document.addEventListener('DOMContentLoaded', () => {
  // Enable smooth scrolling between sections
  document.documentElement.style.scrollBehavior = 'smooth';

  const section2 = document.getElementById('section2');
  const startButton = document.querySelector('.section1 button');

  // Scroll to Section2 when the hero button is clicked
  if (startButton) {
    startButton.addEventListener('click', () => {
      section2.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Initialize GSAP ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // Section 1: Parallax Video & Text
  gsap.to('.section1 video', {
    yPercent: 30,
    ease: 'none',
    scrollTrigger: {
      trigger: '.section1',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });
  
  // Section 1: Parallax Video
  gsap.to('.section1 video', {
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

  // Section 3: Timeline Items Animation
  const timelineItems = document.querySelectorAll('.timeline-item');
  timelineItems.forEach((item, i) => {
    gsap.from(item, {
      opacity: 0,
      y: 50,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: item,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    });
  });

  // Section 4: Headers Animation
  gsap.from('.titans-title, .titans-subtitle, .titans-subtitle-desc, .diet-filter', {
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
   * Section2 background video and typing sequence
   * --------------------------------------------- */
  const bgMap = {
    dino: 'assests/video/bg_dino.mp4',
    sea: 'assests/video/bg_sea.mp4',
    neature: 'assests/video/bg_neature.mp4',
  };

  /**
   * Set or update the background video in Section2.
   * Creates the video element if it doesn't exist and fades it in/out.
   * @param {string} src Path to the video file
   */
  function setSection2Video(src) {
    if (!section2) return;
    let vid = section2.querySelector('video.bgvideo');
    // If a video already exists, fade it out and swap source
    if (vid) {
      vid.classList.remove('visible');
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
    // Otherwise create a new video element
    vid = document.createElement('video');
    vid.className = 'bgvideo';
    vid.autoplay = true;
    vid.muted = true;
    vid.loop = true;
    vid.playsInline = true;
    const source = document.createElement('source');
    source.src = src;
    source.type = 'video/mp4';
    vid.appendChild(source);
    section2.insertBefore(vid, section2.firstChild);
    requestAnimationFrame(() => {
      vid.play().catch(() => {});
      setTimeout(() => vid.classList.add('visible'), 50);
    });
  }

  // Sentences for the typing sequence in Section2
  const typingSentences = [
    'นี่ใช่โลกที่คุณจินตนาการไว้หรือไม่',
    'ความจริงจะเป็นอย่างไร',
    'มาหาคำตอบพร้อมกันกับพวกเรา',
  ];

  /**
   * Runs a simple typing animation, looping through an array of sentences.
   * It creates a typing box if one does not already exist.
   * @param {Function} onComplete Called when all sentences have been typed
   */
  function runTypingSequence(onComplete) {
    // Create a typing box overlay if it doesn't exist
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
      const speed = 80;
      function step() {
        if (i < sentence.length) {
          lineEl.textContent += sentence.charAt(i);
          i++;
          setTimeout(step, speed);
        } else {
          setTimeout(() => {
            lineEl.classList.remove('pop');
            cb();
          }, 700);
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

  // Hook up the Section2 buttons to switch backgrounds and run the typing sequence
  const btns = document.querySelectorAll('#section2 .btn-section2 button');
  btns.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Prevent triggering multiple times while the typing sequence runs
      if (section2.classList.contains('typing-mode')) return;
      const id = btn.id;
      const src = bgMap[id];
      if (src) {
        setSection2Video(src);
        section2.classList.add('typing-mode');
        setTimeout(() => {
          runTypingSequence(() => {
            // Remove the video once the typing sequence completes
            const vid = section2.querySelector('video.bgvideo');
            if (vid) {
              vid.classList.remove('visible');
              setTimeout(() => {
                try {
                  vid.remove();
                } catch (err) {}
              }, 420);
            }
            const box = section2.querySelector('.typing-box');
            if (box) box.remove();
            section2.classList.remove('typing-mode');
            
            // Refresh ScrollTrigger to account for layout changes
            ScrollTrigger.refresh();
            
            // Scroll to the next section (Introduce) after the sequence
            const nextSection = document.getElementById('introduce');
            if (nextSection) {
              // Force the animation to play immediately
              if (introTween) introTween.play();
              nextSection.scrollIntoView({ behavior: 'smooth' });
            }
          });
        }, 420);
      }
    });
  });

  /* ---------------------------------------------
   * Section4 diet filter logic
   * --------------------------------------------- */
  const dietButtons = document.querySelectorAll('.diet-btn');
  const titanCards = document.querySelectorAll('.titan-card');
  // Hide all cards initially
  titanCards.forEach((card) => card.classList.add('hidden'));
  function hideAllCards() {
    titanCards.forEach((card) => card.classList.add('hidden'));
  }
  dietButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      // If the current button is active, deactivate and hide all cards
      if (button.classList.contains('active')) {
        button.classList.remove('active');
        hideAllCards();
        return;
      }
      // Remove active state from all buttons
      dietButtons.forEach((btn) => btn.classList.remove('active'));
      // Activate the clicked button
      button.classList.add('active');
      hideAllCards();
      // Show cards that match the filter
      titanCards.forEach((card) => {
        if (card.dataset.diet === filter) {
          card.classList.remove('hidden');
        }
      });
    });
  });

  /* ---------------------------------------------
   * Modal, scratch interaction and 3D model logic
   * --------------------------------------------- */
  const modal = document.getElementById('dinoModal');
  const closeModalBtn = document.querySelector('.close-modal');
  const dinoModel = document.getElementById('dinoModel');
  const underlayImage = document.getElementById('underlayImage');
  const scratchCanvas = document.getElementById('scratchCanvas');
  const timelineContainer = document.getElementById('timelineContainer');
  const ctx = scratchCanvas.getContext('2d');

  // Data for each dinosaur card: placeholder 3D models, footprint images and timeline events
  const dinoData = {
    'Phuwiangosaurus sirindhornae': {
      model: '../assests/model/Phuwiangosaurus_sirindhornae.glb',
      footprint: 'https://via.placeholder.com/600x300?text=Footprint+Phuwiangosaurus',
      timeline: [
        { title: 'ค้นพบรอยเท้า', year: '1976' },
        { title: 'ขุดค้นฟอสซิล', year: '1977' },
        { title: 'ประกาศชื่อวิทยาศาสตร์', year: '1994' },
        { title: 'จัดแสดงในพิพิธภัณฑ์', year: '1997' },
      ],
    },
    'Kinnareemimus khonkaennsis': {
      model: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
      footprint: 'https://via.placeholder.com/600x300?text=Footprint+Kinnareemimus',
      timeline: [
        { title: 'ค้นพบรอยเท้า', year: '1994' },
        { title: 'ขุดค้นฟอสซิล', year: '1995' },
        { title: 'รายงานการค้นพบ', year: '2001' },
        { title: 'จัดแสดงพิพิธภัณฑ์', year: '2002' },
      ],
    },
    'Sittakosaurus satyarakki': {
      model: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
      footprint: 'https://via.placeholder.com/600x300?text=Footprint+Sittakosaurus',
      timeline: [
        { title: 'ค้นพบรอยเท้า', year: '1992' },
        { title: 'ขุดค้นฟอสซิล', year: '1993' },
        { title: 'ประกาศสายพันธุ์', year: '1996' },
        { title: 'เข้าสู่พิพิธภัณฑ์', year: '1998' },
      ],
    },
    'Ratchasimasaurus suranareae': {
      model: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
      footprint: 'https://via.placeholder.com/600x300?text=Footprint+Ratchasimasaurus',
      timeline: [
        { title: 'ค้นพบรอยเท้า', year: '2007' },
        { title: 'ขุดค้นฟอสซิล', year: '2008' },
        { title: 'ตีพิมพ์ชื่อวิทยาศาสตร์', year: '2011' },
        { title: 'จัดแสดงพิพิธภัณฑ์', year: '2012' },
      ],
    },
    'Siamodon nimngami': {
      model: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
      footprint: 'https://via.placeholder.com/600x300?text=Footprint+Siamodon',
      timeline: [
        { title: 'ค้นพบรอยเท้า', year: '2010' },
        { title: 'ขุดค้นฟอสซิล', year: '2011' },
        { title: 'ประกาศชื่อวิทยาศาสตร์', year: '2011' },
        { title: 'จัดแสดงพิพิธภัณฑ์', year: '2013' },
      ],
    },
    'Sirindhorna khoratensis': {
      model: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
      footprint: 'https://via.placeholder.com/600x300?text=Footprint+Sirindhorna',
      timeline: [
        { title: 'ค้นพบรอยเท้า', year: '2007' },
        { title: 'ขุดค้นฟอสซิล', year: '2008' },
        { title: 'ตีพิมพ์ทางวิทยาศาสตร์', year: '2015' },
        { title: 'ประกาศชื่อ', year: '2016' },
      ],
    },
    'Isanosaurus attavipatchi': {
      model: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
      footprint: 'https://via.placeholder.com/600x300?text=Footprint+Isanosaurus',
      timeline: [
        { title: 'ค้นพบรอยเท้า', year: '1988' },
        { title: 'ขุดค้นฟอสซิล', year: '1989' },
        { title: 'รายงานทางวิทยาศาสตร์', year: '2000' },
        { title: 'จัดแสดงพิพิธภัณฑ์', year: '2001' },
      ],
    },
    'Minimocursor phunoiensis': {
      model: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
      footprint: 'https://via.placeholder.com/600x300?text=Footprint+Minimocursor',
      timeline: [
        { title: 'ค้นพบรอยเท้า', year: '2023' },
        { title: 'ขุดค้นฟอสซิล', year: '2023' },
        { title: 'ประกาศสายพันธุ์ใหม่', year: '2023' },
        { title: 'เข้าสู่พิพิธภัณฑ์', year: '2024' },
      ],
    },
    'Siamotyrannus isanensis': {
      model: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
      footprint: 'https://via.placeholder.com/600x300?text=Footprint+Siamotyrannus',
      timeline: [
        { title: 'ค้นพบรอยเท้า', year: '1993' },
        { title: 'ขุดค้นฟอสซิล', year: '1994' },
        { title: 'ประกาศชื่อวิทยาศาสตร์', year: '1996' },
        { title: 'จัดแสดงพิพิธภัณฑ์', year: '1997' },
      ],
    },
    'Siamosaurus suteethorni': {
      model: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
      footprint: 'https://via.placeholder.com/600x300?text=Footprint+Siamosaurus',
      timeline: [
        { title: 'ค้นพบรอยเท้า', year: '1983' },
        { title: 'ขุดค้นฟอสซิล', year: '1984' },
        { title: 'ประกาศชื่อวิทยาศาสตร์', year: '1986' },
        { title: 'การทบทวนชื่อ', year: '1997' },
      ],
    },
    'Phuwiangvenator yaemniyomi': {
      model: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
      footprint: 'https://via.placeholder.com/600x300?text=Footprint+Phuwiangvenator',
      timeline: [
        { title: 'ค้นพบรอยเท้า', year: '2019' },
        { title: 'ขุดค้นฟอสซิล', year: '2019' },
        { title: 'รายงานการค้นพบ', year: '2020' },
        { title: 'จัดแสดงพิพิธภัณฑ์', year: '2021' },
      ],
    },
    'Vayuraptor nongbualamphuensis': {
      model: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
      footprint: 'https://via.placeholder.com/600x300?text=Footprint+Vayuraptor',
      timeline: [
        { title: 'ค้นพบรอยเท้า', year: '2019' },
        { title: 'ขุดค้นฟอสซิล', year: '2019' },
        { title: 'ประกาศชื่อวิทยาศาสตร์', year: '2020' },
        { title: 'จัดแสดงพิพิธภัณฑ์', year: '2021' },
      ],
    },
    'Siamraptor suwati': {
      model: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
      footprint: 'https://via.placeholder.com/600x300?text=Footprint+Siamraptor',
      timeline: [
        { title: 'ค้นพบรอยเท้า', year: '2019' },
        { title: 'ขุดค้นฟอสซิล', year: '2019' },
        { title: 'ประกาศชื่อวิทยาศาสตร์', year: '2019' },
        { title: 'จัดแสดงพิพิธภัณฑ์', year: '2020' },
      ],
    },
  };

  /**
   * Populate the horizontal timeline in the modal.
   * @param {Array<{title: string, year: string}>} events An array of events to display
   */
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

  /**
   * Initialize the scratch off effect on the canvas. A sand‑colored layer is drawn on the canvas,
   * and removing parts of it via the destination-out composite operation reveals the footprint underneath.
   */
  function initDusting() {
    const container = scratchCanvas.parentElement;
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    scratchCanvas.width = width;
    scratchCanvas.height = height;
    // Fill with dust color
    ctx.fillStyle = '#C2B280';
    ctx.fillRect(0, 0, width, height);
    // Add some random speckles to simulate sand
    for (let i = 0; i < 500; i++) {
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.5})`;
      ctx.fillRect(Math.random() * width, Math.random() * height, 2, 2);
    }
    let isDrawing = false;
    function getPos(e) {
      const rect = scratchCanvas.getBoundingClientRect();
      let x, y;
      if (e.touches) {
        x = e.touches[0].clientX - rect.left;
        y = e.touches[0].clientY - rect.top;
      } else {
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
      }
      return { x, y };
    }
    function scratch(e) {
      if (!isDrawing) return;
      e.preventDefault();
      const { x, y } = getPos(e);
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.fill();
    }
    scratchCanvas.onmousedown = (e) => {
      isDrawing = true;
      scratch(e);
    };
    scratchCanvas.onmousemove = scratch;
    scratchCanvas.onmouseup = () => {
      isDrawing = false;
    };
    scratchCanvas.onmouseleave = () => {
      isDrawing = false;
    };
    scratchCanvas.ontouchstart = (e) => {
      isDrawing = true;
      scratch(e);
    };
    scratchCanvas.ontouchmove = scratch;
    scratchCanvas.ontouchend = () => {
      isDrawing = false;
    };
  }

  // Add click listeners to each titan card to open the modal
  titanCards.forEach((card) => {
    card.addEventListener('click', () => {
      const nameEnEl = card.querySelector('.titan-name-en');
      const nameThEl = card.querySelector('.titan-name');
      if (!nameEnEl) return;
      
      const nameEn = nameEnEl.textContent.trim();
      const nameTh = nameThEl ? nameThEl.textContent.trim() : '';
      const data = dinoData[nameEn];
      
      // Update modal header
      const modalTitle = document.getElementById('modalDinoName');
      if (modalTitle) {
        modalTitle.textContent = `${nameTh} (${nameEn})`;
      }

      // Fallback values if no data is defined
      const modelSrc = data ? data.model : 'https://modelviewer.dev/shared-assets/models/Astronaut.glb';
      const footprintSrc = data ? data.footprint : 'https://via.placeholder.com/600x300?text=Footprint';
      const timelineEvents = data ? data.timeline : [
        { title: 'ค้นพบรอยเท้า', year: '—' },
        { title: 'ขุดค้นฟอสซิล', year: '—' },
        { title: 'ประกาศชื่อ', year: '—' },
        { title: 'จัดแสดงพิพิธภัณฑ์', year: '—' },
      ];
      // Set the 3D model source and footprint image
      dinoModel.src = modelSrc;
      underlayImage.src = footprintSrc;
      // Build timeline and initialize scratch
      buildTimeline(timelineEvents);
      initDusting();
      // Show the modal
      modal.style.display = 'flex';
    });
  });

  // Close the modal when the close button or backdrop is clicked
  closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
});