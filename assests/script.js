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
  const heroTl = gsap.timeline();
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
      x: -50,
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
   * Section2 background image and typing sequence
   * --------------------------------------------- */
  const bgMap = {
    dino: 'assests/video/bg_dino.mp4',
    sea: 'assests/video/bg_sea.mp4',
    nature: 'assests/video/bg_nature.mp4',
  };

  /**
   * Set or update the background video in Section2.
   * Creates the video element if it doesn't exist and fades it in/out.
   * @param {string} src Path to the video file
   */
  function setSection2Image(src) {
    if (!section2) return;
    let vid = section2.querySelector('.bg-video');

    // If a video already exists, fade it out and swap source
    if (vid) {
      vid.classList.remove('visible');
      setTimeout(() => {
        if (vid.src !== src) {
          vid.src = src;
          vid.load();
          vid.play().catch(() => { });
        }
        // Force reflow to restart animation
        void vid.offsetWidth;
        vid.classList.add('visible');
      }, 800);
      return;
    }

    // Otherwise create a new video element
    vid = document.createElement('video');
    vid.className = 'bg-video';
    vid.src = src;
    vid.autoplay = true;
    vid.muted = true;
    vid.loop = true;
    vid.playsInline = true;

    // Insert before content
    section2.insertBefore(vid, section2.firstChild);

    // Wait for data to load to fade in
    vid.onloadeddata = () => {
      requestAnimationFrame(() => {
        vid.classList.add('visible');
        vid.play().catch(() => { });
      });
    };
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
      const src = bgMap[id];
      if (src) {
        setSection2Image(src);
        section2.classList.add('typing-mode');

        // Fade out buttons
        gsap.to('.border-section2', { opacity: 0, scale: 0.9, duration: 0.5 });

        setTimeout(() => {
          runTypingSequence(() => {
            // Remove the video once the typing sequence completes
            const vid = section2.querySelector('.bg-video');
            if (vid) {
              vid.classList.remove('visible');
              setTimeout(() => {
                try {
                  vid.remove();
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
   * Section4 diet filter logic
   * --------------------------------------------- */
  const dietButtons = document.querySelectorAll('.diet-btn');
  const titanCards = document.querySelectorAll('.titan-card');

  // Show all cards initially or hide? The original code hid them.
  // Let's show all by default or keep the "click to filter" behavior.
  // The original code had them hidden. Let's keep it consistent but maybe show all if no filter is active?
  // Actually, let's make it so clicking a filter toggles it. If none active, show all? 
  // Or stick to the original behavior: buttons act as toggles for categories.

  // Let's modify: Show ALL by default, filter when clicked.
  titanCards.forEach((card) => card.classList.remove('hidden'));

  dietButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;

      // If clicking already active button, deactivate it and show all
      if (button.classList.contains('active')) {
        button.classList.remove('active');
        titanCards.forEach((card) => {
          card.classList.remove('hidden');
          // Animate back in
          gsap.fromTo(card, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 });
        });
        return;
      }

      // Remove active from others
      dietButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');

      // Filter
      titanCards.forEach((card) => {
        if (card.dataset.diet === filter) {
          card.classList.remove('hidden');
          gsap.fromTo(card, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.4 });
        } else {
          card.classList.add('hidden');
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
  const timelineContainer = document.getElementById('timelineContainer');

  const dinoData = {
    'Phuwiangosaurus sirindhornae': {
      model: '../assests/model/Phuwiangosaurus_sirindhornae.glb',
      footprint: 'assests/img/dino_section4/Phuwiangosaurus.png',
      timeline: [
        { title: 'ค้นพบรอยเท้า', year: '1976' },
        { title: 'ขุดค้นฟอสซิล', year: '1977' },
        { title: 'ประกาศชื่อวิทยาศาสตร์', year: '1994' },
        { title: 'จัดแสดงในพิพิธภัณฑ์', year: '1997' },
      ],
    },
    'Kinnareemimus khonkaennsis': {
      model: '../assests/model/Kinnareemimus khonkaenensis.glb',
      footprint: './assests/img/dino_section4/Kinnareemimus.png',
      timeline: [
        { title: 'ค้นพบรอยเท้า', year: '1994' },
        { title: 'ขุดค้นฟอสซิล', year: '1995' },
        { title: 'รายงานการค้นพบ', year: '2001' },
        { title: 'จัดแสดงพิพิธภัณฑ์', year: '2002' },
      ],
    },
    'Sittakosaurus satyarakki': {
      model: '../assests/model/Psittacosaurus_sattayaraki.glb',
      footprint: '../assests/img/dino_section4/Sittakosaurus.png',
      timeline: [
        { title: 'ค้นพบรอยเท้า', year: '1992' },
        { title: 'ขุดค้นฟอสซิล', year: '1993' },
        { title: 'ประกาศสายพันธุ์', year: '1996' },
        { title: 'เข้าสู่พิพิธภัณฑ์', year: '1998' },
      ],
    },
    'Ratchasimasaurus suranareae': {
      model: '../assests/model/Ratchasimasaurus.glb',
      footprint: '../assests/img/dino_section4/Ratchasimasaurus.png',
      timeline: [
        { title: 'ค้นพบรอยเท้า', year: '2007' },
        { title: 'ขุดค้นฟอสซิล', year: '2008' },
        { title: 'ตีพิมพ์ชื่อวิทยาศาสตร์', year: '2011' },
        { title: 'จัดแสดงพิพิธภัณฑ์', year: '2012' },
      ],
    },
    'Siamodon nimngami': {
      model: '../assests/model/Siamodon.glb',
      footprint: '../assests/img/dino_section4/Siamodon.png',
      timeline: [
        { title: 'ค้นพบรอยเท้า', year: '2010' },
        { title: 'ขุดค้นฟอสซิล', year: '2011' },
        { title: 'ประกาศชื่อวิทยาศาสตร์', year: '2011' },
        { title: 'จัดแสดงพิพิธภัณฑ์', year: '2013' },
      ],
    },
    'Sirindhorna khoratensis': {
      model: '../assests/model/Sirindhorna.glb',
      footprint: '../assests/img/dino_section4/Sirindhorna.png',
      timeline: [
        { title: 'ค้นพบรอยเท้า', year: '2007' },
        { title: 'ขุดค้นฟอสซิล', year: '2008' },
        { title: 'ตีพิมพ์ทางวิทยาศาสตร์', year: '2015' },
        { title: 'ประกาศชื่อ', year: '2016' },
      ],
    },
    'Isanosaurus attavipatchi': {
      model: '../assests/model/Isanosaurus.glb',
      footprint: 'https://via.placeholder.com/600x300?text=Footprint+Isanosaurus',
      timeline: [
        { title: 'ค้นพบรอยเท้า', year: '1988' },
        { title: 'ขุดค้นฟอสซิล', year: '1989' },
        { title: 'รายงานทางวิทยาศาสตร์', year: '2000' },
        { title: 'จัดแสดงพิพิธภัณฑ์', year: '2001' },
      ],
    },
    'Minimocursor phunoiensis': {
      model: '../assests/model/Minimocursor.glb',
      footprint: 'https://via.placeholder.com/600x300?text=Footprint+Minimocursor',
      timeline: [
        { title: 'ค้นพบรอยเท้า', year: '2023' },
        { title: 'ขุดค้นฟอสซิล', year: '2023' },
        { title: 'ประกาศสายพันธุ์ใหม่', year: '2023' },
        { title: 'เข้าสู่พิพิธภัณฑ์', year: '2024' },
      ],
    },
    'Siamotyrannus isanensis': {
      model: '../assests/model/Siamotyrannus.glb',
      footprint: 'https://via.placeholder.com/600x300?text=Footprint+Siamotyrannus',
      timeline: [
        { title: 'ค้นพบรอยเท้า', year: '1993' },
        { title: 'ขุดค้นฟอสซิล', year: '1994' },
        { title: 'ประกาศชื่อวิทยาศาสตร์', year: '1996' },
        { title: 'จัดแสดงพิพิธภัณฑ์', year: '1997' },
      ],
    },
    'Siamosaurus suteethorni': {
      model: '../assests/model/Siamosaurus.glb',
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
      model: '../assests/model/Vayuraptor.glb',
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
    // Small delay to allow display:flex to apply before adding opacity class
    requestAnimationFrame(() => {
      modal.classList.add('open');
    });
  }

  function closeModal() {
    modal.classList.remove('open');
    setTimeout(() => {
      modal.style.display = 'none';
    }, 300); // Match transition duration
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

      // Fallback values if no data is defined
      const modelSrc = data ? data.model : 'https://modelviewer.dev/shared-assets/models/Astronaut.glb';
      const timelineEvents = data ? data.timeline : [
        { title: 'ค้นพบรอยเท้า', year: '—' },
        { title: 'ขุดค้นฟอสซิล', year: '—' },
        { title: 'ประกาศชื่อ', year: '—' },
        { title: 'จัดแสดงพิพิธภัณฑ์', year: '—' },
      ];

      dinoModel.src = modelSrc;

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
});




/* ---------------------------------------------
 * Section5 – Thailand map (SVG)
 * --------------------------------------------- */
const mapSvg = document.querySelector('.th-map');

// Data for map provinces (Ported from update_map.py)
const provinceData = {
  'kkn': {
    'data-name': 'ขอนแก่น',
    'data-summary': 'ศูนย์กลางฟอสซิลไดโนเสาร์อีสาน',
    'data-museum': 'พิพิธภัณฑ์สิรินธร, พิพิธภัณฑ์ไดโนเสาร์ภูเวียง',
    'data-geopark': 'อุทยานธรณีขอนแก่น (Khon Kaen Geopark)'
  },
  'ksn': {
    'data-name': 'กาฬสินธุ์',
    'data-summary': 'ดินแดนภูน้อยและไดโนเสาร์หลายชนิด',
    'data-museum': 'พิพิธภัณฑ์สิรินธร',
    'data-geopark': 'อุทยานธรณีกาฬสินธุ์ (Kalasin Geopark)'
  },
  'nma': {
    'data-name': 'นครราชสีมา',
    'data-summary': 'บ้านของสยามแรปเตอร์ ราชสีมาซอรัส และ Sirindhorna',
    'data-museum': 'พิพิธภัณฑ์ไม้กลายเป็นหินเฉลิมพระเกียรติฯ',
    'data-geopark': 'อุทยานธรณีโลกโคราช (Khorat Geopark)'
  },
  'stn': {
    'data-name': 'สตูล',
    'data-summary': 'อุทยานธรณีโลกสตูลได้ประกาศเป็นอุทยานธรณีท้องถิ่น เมื่อวันที่ 14 สิงหาคม พ.ศ. 2557 ครอบคลุมพื้นที่ 4 อำเภอ ได้แก่ อำเภอทุ่งหว้า อำเภอมะนัง อำเภอละงู และอำเภอเมืองสตูล (อุทยานแห่งชาติตะรุเตา) รวมพื้นที่ 2,597 ตารางกิโลเมตร',
    'data-museum': '-',
    'data-geopark': 'อุทยานธรณีโลกสตูล (Satun Geopark)'
  },
  'ubn' : {
    'data-name': 'อุบลราชธานี',
    'data-summary': 'อุทยานธรณีผาชัน สามพันโบก จังหวัดอุบลราชธานี ได้จัดตั้งและประกาศเป็นอุทยานธรณีท้องถิ่นเมื่อวันที่ 9 พฤษภาคม 2554 ครอบคลุม 4 อำเภอ ได้แก่ อำเภอสิรินธร อำเภอโขงเจียม อำเภอศรีเมืองใหม่ และอำเภอโพธิ์ไทร มีพื้นที่ 1,994 ตารางกิโลเมตร',
    'data-museum': '-',
    'data-geopark': 'อุทยานธรณีอุบลราชธานี (Ubon Ratchathani Geopark)'
  },
  'cpm' : {
    'data-name': 'ชัยภูมิ',
    'data-summary': 'จังหวัดชัยภูมิ ได้ประกาศจัดตั้งอุทยานธรณีชัยภูมิเป็นอุทยานธรณีในระดับท้องถิ่น เมื่อวันที่ 11 สิงหาคม 2564 ครอบคลุม 8 อำเภอ ได้แก่ อำเภอเมืองชัยภูมิ อำเภอบ้านเขว้า อำเภอหนองบัวระเหว อำเภอเทพสถิต อำเภอภักดีชุมพล อำเภอเกษตรสมบูรณ์ อำเภอหนองบัวแดง และอำเภอคอนสาร รวมพื้นที่ 8,732 ตารางกิโลเมตร',
    'data-museum': '-',
    'data-geopark': 'อุทยานธรณีชัยภูมิ (Chaiyaphum Geopark)'
  },
  'tak' : {
    'data-name' : 'ตาก',
    'data-summary' : 'จังหวัดตากได้ประกาศจัดตั้งอุทยานธรณีไม้กลายเป็นหินตาก เป็นอุทยานธรณีในระดับท้องถิ่น เมื่อวันที่ 30 มีนาคม พ.ศ. 2560 ครอบคลุมพื้นที่ 4 อำเภอของจังหวัดตาก ได้แก่ อำเภอสามเงา อำเภอบ้านตาก อำเภอเมืองตาก และอำเภอวังเจ้า รวมพื้นที่ 5,671 ตารางกิโลเมตร',
    'data-museum' : '-',
    'data-geopark' : 'อุทยานธรณีตาก (Tak Geopark)'
  },
  'lpg' :{
    'data-name' : 'ลำปาง',
    'data-summary' : 'ประกาศจัดตั้งอุทยานธรณีลำปางเป็นอุทยานธรณีในระดับท้องถิ่นเมื่อวันที่ 23 สิงหาคม 2565 ครอบคลุม 7 อำเภอ ได้แก่ อำเภอเมืองลำปางอำเภอเกาะคา อำเภอแม่เมาะ อำเภอแจ้ห่ม อำเภองาว อำเภอแม่ทะ และอำเภอเมืองปาน รวมพื้นที่ 2,012 ตารางกิโลเมตร',
    'data-museum' : '',
    'data-geopark' : 'อุทยานธรณีลำปาง (Lampang Geopark)'
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

  provinces.forEach((prov) => {
    const id = prov.id;
    if (!id) return;

    const hasMuseum = prov.dataset && prov.dataset.museum && prov.dataset.museum.trim() !== '-' && prov.dataset.museum.trim() !== '';
    const hasGeopark = prov.dataset && prov.dataset.geopark && prov.dataset.geopark.trim() !== '-' && prov.dataset.geopark.trim() !== '';

    // compute a simple anchor point using bbox center
    let bbox;
    try {
      bbox = prov.getBBox();
    } catch (err) {
      // getBBox can fail if element not rendered yet
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
      // small teardrop pointing down from head center
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
    }
  });
}

// Create pins after initialization and a short delay to ensure SVG rendered
setTimeout(() => {
  createMapPins();
}, 80);

// Re-select provinces after initialization (since class might have been added)
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



