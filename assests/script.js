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
        { title: 'ค้นพบรอยเท้า', year: '1982' }, //
        { title: 'ขุดค้นฟอสซิล', year: '1982' },
        { title: 'ประกาศชื่อวิทยาศาสตร์', year: '1994' },
        { title: 'จัดแสดงในพิพิธภัณฑ์', year: '2001' },
      ],
    },
    'Kinnareemimus khonkaennsis': {
      model: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
      footprint: 'https://via.placeholder.com/600x300?text=Footprint+Kinnareemimus',
      timeline: [
        { title: 'ค้นพบรอยเท้า', year: '1995' }, 
        { title: 'ขุดค้นฟอสซิล', year: '1990' },
        { title: 'รายงานการค้นพบ', year: '1994' },
        { title: 'จัดแสดงพิพิธภัณฑ์', year: 'ไม่มีข้อมูลชัดเจน' }, 
      ],
    },
    'Sittakosaurus satyarakki': {
      model: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
      footprint: 'https://via.placeholder.com/600x300?text=Footprint+Sittakosaurus',
      timeline: [
        { title: 'ค้นพบรอยเท้า', year: '1992' }, 
        { title: 'ขุดค้นฟอสซิล', year: '1980-1990' }, // 
        { title: 'ประกาศสายพันธุ์', year: '1992' }, 
        { title: 'เข้าสู่พิพิธภัณฑ์', year: 'ไม่มีข้อมูลชัดเจน' }, //
      ],
    },
    'Ratchasimasaurus suranareae': {
      model: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
      footprint: 'https://via.placeholder.com/600x300?text=Footprint+Ratchasimasaurus',
      timeline: [
        { title: 'ค้นพบรอยเท้า', year: '2011' }, 
        { title: 'ขุดค้นฟอสซิล', year: '2010' }, 
        { title: 'ตีพิมพ์ชื่อวิทยาศาสตร์', year: '2011' },
        { title: 'จัดแสดงพิพิธภัณฑ์', year: 'ไม่มีข้อมูลชัดเจน' },
      ],
    },
    'Siamodon nimngami': {
      model: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
      footprint: 'https://via.placeholder.com/600x300?text=Footprint+Siamodon',
      timeline: [
        { title: 'ค้นพบรอยเท้า', year: '2010' },
        { title: 'ขุดค้นฟอสซิล', year: '2011' },//
        { title: 'ประกาศชื่อวิทยาศาสตร์', year: '2011' },
        { title: 'จัดแสดงพิพิธภัณฑ์', year: 'ไม่มีข้อมูลชัดเจน' },//
      ],
    },
    'Sirindhorna khoratensis': {
      model: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
      footprint: 'https://via.placeholder.com/600x300?text=Footprint+Sirindhorna',
      timeline: [
        { title: 'ค้นพบรอยเท้า', year: '2007' }, 
        { title: 'ขุดค้นฟอสซิล', year: '2007' },
        { title: 'ตีพิมพ์ทางวิทยาศาสตร์', year: '2015' },
        { title: 'ประกาศชื่อ', year: '2010' },
      ],
    },
    'Isanosaurus attavipatchi': {
      model: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
      footprint: 'https://via.placeholder.com/600x300?text=Footprint+Isanosaurus',
      timeline: [
        { title: 'ค้นพบรอยเท้า', year: '1998' }, 
        { title: 'ขุดค้นฟอสซิล', year: '1998' },
        { title: 'รายงานทางวิทยาศาสตร์', year: '2000' },
        { title: 'จัดแสดงพิพิธภัณฑ์', year: 'ไม่มีข้อมูลชัดเจน' },//
      ],
    },
    'Minimocursor phunoiensis': {
      model: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
      footprint: 'https://via.placeholder.com/600x300?text=Footprint+Minimocursor',
      timeline: [
        { title: 'ค้นพบรอยเท้า', year: '2013' }, //
        { title: 'ขุดค้นฟอสซิล', year: '2023' },
        { title: 'ประกาศสายพันธุ์ใหม่', year: '2023' },
        { title: 'เข้าสู่พิพิธภัณฑ์', year: '2024' }, //
      ],
    },
    'Siamotyrannus isanensis': {
      model: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
      footprint: 'https://via.placeholder.com/600x300?text=Footprint+Siamotyrannus',
      timeline: [
        { title: 'ค้นพบรอยเท้า', year: '1993' }, //
        { title: 'ขุดค้นฟอสซิล', year: '1993' },
        { title: 'ประกาศชื่อวิทยาศาสตร์', year: '1996' },
        { title: 'จัดแสดงพิพิธภัณฑ์', year: '1990' },
      ],
    },
    'Siamosaurus suteethorni': {
      model: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
      footprint: 'https://via.placeholder.com/600x300?text=Footprint+Siamosaurus',
      timeline: [
        { title: 'ค้นพบรอยเท้า', year: '1976' }, 
        { title: 'ขุดค้นฟอสซิล', year: '1970-1980' },
        { title: 'ประกาศชื่อวิทยาศาสตร์', year: '1986' },
        { title: 'การทบทวนชื่อ', year: 'ไม่มีข้อมูลชัดเจน' },//
      ],
    },
    'Phuwiangvenator yaemniyomi': {
      model: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
      footprint: 'https://via.placeholder.com/600x300?text=Footprint+Phuwiangvenator',
      timeline: [
        { title: 'ค้นพบรอยเท้า', year: '1993' }, 
        { title: 'ขุดค้นฟอสซิล', year: '1993' },
        { title: 'รายงานการค้นพบ', year: '2019' },
        { title: 'จัดแสดงพิพิธภัณฑ์', year: '2011' }, //
      ],
    },
    'Vayuraptor nongbualamphuensis': {
      model: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
      footprint: 'https://via.placeholder.com/600x300?text=Footprint+Vayuraptor',
      timeline: [
        { title: 'ค้นพบรอยเท้า', year: '1988' }, 
        { title: 'ขุดค้นฟอสซิล', year: '1988' },
        { title: 'ประกาศชื่อวิทยาศาสตร์', year: '2019' },
        { title: 'จัดแสดงพิพิธภัณฑ์', year: '2017' },
      ],
    },
    'Siamraptor suwati': {
      model: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
      footprint: 'https://via.placeholder.com/600x300?text=Footprint+Siamraptor',
      timeline: [
        { title: 'ค้นพบรอยเท้า', year: '2007' },
        { title: 'ขุดค้นฟอสซิล', year: '2007-2009' },
        { title: 'ประกาศชื่อวิทยาศาสตร์', year: '2019' },
        { title: 'จัดแสดงพิพิธภัณฑ์', year: '2019' },
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
const provinces = document.querySelectorAll('.th-map .province');
const mapNameEl = document.getElementById('mapProvinceName');
const mapSummaryEl = document.getElementById('mapProvinceSummary');
const mapMuseumEl = document.getElementById('mapProvinceMuseum');
const mapGeoparkEl = document.getElementById('mapProvinceGeopark');

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
