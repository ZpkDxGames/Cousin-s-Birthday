/*  splash.js — Cinematic name-reveal splash: loading → envelope open → circle-wipe → hub
    GPU-composited (transform/opacity only) for 120 Hz displays. */

(function () {
  'use strict';

  /* ---- DOM refs ---- */
  const splash     = document.getElementById('splash');
  const loader     = splash.querySelector('.loader');
  const barFill    = splash.querySelector('.loader-bar-fill');
  const percentEl  = splash.querySelector('.loader-percent');
  const nameLetters= splash.querySelectorAll('.ln');
  const lineLeft   = splash.querySelector('.ll--left');
  const lineRight  = splash.querySelector('.ll--right');
  const envelope   = splash.querySelector('.envelope');
  const particles  = splash.querySelector('.particles');
  const streaks    = splash.querySelector('.streaks');
  const circleWipe = splash.querySelector('.circle-wipe');
  const hub        = document.getElementById('hub');

  /* ---- Constants ---- */
  const LOAD_DURATION  = 4000 + Math.floor(Math.random() * 1001); // 4000–5000 ms
  const PARTICLE_COUNT = 45;

  /* ================================================
     PARTICLES — three shapes: dots, stars, rings
     ================================================ */
  function spawnParticles() {
    var types = ['dot', 'star', 'ring'];
    for (var i = 0; i < PARTICLE_COUNT; i++) {
      var p = document.createElement('span');
      var type = types[i % types.length];
      p.classList.add('particle', 'particle--' + type);

      var size = Math.random() * 5 + 2;
      p.style.setProperty('--size', size + 'px');
      p.style.setProperty('--dur', (Math.random() * 7 + 4) + 's');
      p.style.setProperty('--delay', (Math.random() * 6) + 's');
      p.style.setProperty('--drift', -(Math.random() * 300 + 80) + 'px');
      p.style.left = Math.random() * 100 + '%';
      p.style.top  = (50 + Math.random() * 50) + '%';
      particles.appendChild(p);
    }
  }

  /* ================================================
     LIGHT STREAKS — randomise positions & timing
     ================================================ */
  function initStreaks() {
    var STREAK_REFS = splash.querySelectorAll('.streak');
    STREAK_REFS.forEach(function (s) {
      s.style.left = Math.random() * 100 + '%';
      s.style.setProperty('--dur', (Math.random() * 4 + 2.5) + 's');
      s.style.setProperty('--delay', (Math.random() * 5) + 's');
      s.style.height = (Math.random() * 60 + 40) + 'px';
      s.style.opacity = '0';
    });
  }

  /* ================================================
     NAME DROP — staggered letter entrance
     ================================================ */
  function dropLetters() {
    return new Promise(function (resolve) {
      var delays = [0, 100, 200, 300];
      nameLetters.forEach(function (el, i) {
        setTimeout(function () {
          el.classList.add('drop');
        }, delays[i]);
      });
      // After last letter lands, expand lines
      setTimeout(function () {
        lineLeft.classList.add('expand');
        lineRight.classList.add('expand');
        resolve();
      }, delays[nameLetters.length - 1] + 650);
    });
  }

  /* ================================================
     BURST — small particle explosion at 100%
     ================================================ */
  function burst() {
    var count = 18;
    var origin = loader.querySelector('.loader-name');
    if (!origin) origin = loader;
    for (var i = 0; i < count; i++) {
      var dot   = document.createElement('span');
      dot.className = 'burst-particle';
      var angle = (360 / count) * i;
      var dist  = 60 + Math.random() * 40;
      var rad   = angle * Math.PI / 180;
      var tx    = Math.cos(rad) * dist;
      var ty    = Math.sin(rad) * dist;
      dot.style.position  = 'absolute';
      dot.style.left = '50%';
      dot.style.top  = '44%';
      dot.style.transition = 'transform .7s cubic-bezier(.22,1,.36,1), opacity .7s ease';
      dot.style.transform  = 'translate(-50%, -50%) translate(0px, 0px) scale(1)';
      dot.style.opacity    = '1';
      loader.appendChild(dot);
      dot.offsetWidth;
      dot.style.transform = 'translate(-50%, -50%) translate(' + tx + 'px, ' + ty + 'px) scale(0)';
      dot.style.opacity   = '0';
    }
  }

  /* ================================================
     LOADING — smooth eased progress with bar fill
     ================================================ */
  function animateLoading() {
    return new Promise(function (resolve) {
      var start = null;

      function tick(ts) {
        if (!start) start = ts;
        var elapsed = ts - start;

        // Ease-out cubic deceleration
        var t = Math.min(elapsed / LOAD_DURATION, 1);
        t = 1 - Math.pow(1 - t, 3);

        var pct = Math.round(t * 100);
        percentEl.textContent = pct + '%';
        barFill.style.width = (t * 100) + '%';

        if (t < 1) {
          requestAnimationFrame(tick);
        } else {
          burst();
          resolve();
        }
      }

      requestAnimationFrame(tick);
    });
  }

  /* ================================================
     MORPH: loader → envelope (with class transitions)
     ================================================ */
  function morphToEnvelope() {
    return new Promise(function (resolve) {
      loader.classList.add('hide');

      setTimeout(function () {
        envelope.classList.add('show');
        resolve();
      }, 550);
    });
  }

  /* ================================================
     ENVELOPE OPEN → CIRCLE-WIPE → HUB
     ================================================ */
  function openEnvelope() {
    if (envelope.classList.contains('opening')) return;
    envelope.classList.add('opening');

    // After the flap opens and letter peeks, trigger circle wipe
    setTimeout(function () {
      triggerCircleWipe();
    }, 1200);
  }

  function triggerCircleWipe() {
    // Diagonal of viewport so the circle covers everything
    var diag = Math.ceil(Math.sqrt(
      window.innerWidth * window.innerWidth +
      window.innerHeight * window.innerHeight
    )) * 2;

    circleWipe.classList.add('expand');
    circleWipe.style.width  = diag + 'px';
    circleWipe.style.height = diag + 'px';

    // Once circle covers screen, reveal hub and fade circle away
    setTimeout(function () {
      // Hide splash entirely
      splash.classList.add('fade-out');
      hub.hidden = false;
      hub.classList.add('reveal');

      // Init hub interactions as soon as hub transition ends
      hub.addEventListener('transitionend', function handler(e) {
        if (e.target !== hub) return;
        hub.removeEventListener('transitionend', handler);
        initHub();
      });

      // Fade out the wipe
      setTimeout(function () {
        circleWipe.classList.add('fade');
        // Clean up splash after transitions
        setTimeout(function () {
          splash.style.display = 'none';
        }, 600);
      }, 200);
    }, 950);
  }

  /* ================================================
     HUB — ambient particles + card interactions
     ================================================ */
  function initHub() {
    spawnHubParticles();
    initCards();
    initCardNavigation();
  }

  function spawnHubParticles() {
    var container = document.querySelector('.hub-particles');
    if (!container) return;
    for (var i = 0; i < 20; i++) {
      var p = document.createElement('span');
      p.classList.add('hub-particle');
      var size = Math.random() * 5 + 2;
      p.style.setProperty('--dur', (Math.random() * 8 + 5) + 's');
      p.style.setProperty('--delay', (Math.random() * 6) + 's');
      p.style.setProperty('--drift', -(Math.random() * 200 + 80) + 'px');
      p.style.width  = size + 'px';
      p.style.height = size + 'px';
      p.style.left   = Math.random() * 100 + '%';
      p.style.top    = (55 + Math.random() * 45) + '%';
      container.appendChild(p);
    }
  }

  function initCards() {
    var cards = document.querySelectorAll('.hub-card');
    cards.forEach(function (card) {
      // 3-D tilt on mouse move
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var cx   = rect.left + rect.width  / 2;
        var cy   = rect.top  + rect.height / 2;
        var dx   = (e.clientX - cx) / (rect.width  / 2);
        var dy   = (e.clientY - cy) / (rect.height / 2);
        card.style.transform =
          'translateX(6px) scale(1.01) rotateX(' + (-dy * 4) + 'deg) rotateY(' + (dx * 4) + 'deg)';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }

  function triggerCardWobble(card) {
    card.classList.remove('wobble');
    card.offsetWidth; // force reflow
    card.classList.add('wobble');
    card.addEventListener('animationend', function handler() {
      card.classList.remove('wobble');
      card.removeEventListener('animationend', handler);
    });
  }

  function spawnCardRipple(card) {
    var ripple = document.createElement('span');
    ripple.style.cssText = [
      'position:absolute',
      'border-radius:50%',
      'background:rgba(255,255,255,.12)',
      'width:10px',
      'height:10px',
      'top:50%',
      'left:50%',
      'transform:translate(-50%,-50%) scale(0)',
      'pointer-events:none',
      'z-index:0',
      'transition:transform .6s ease, opacity .6s ease'
    ].join(';');
    card.appendChild(ripple);
    ripple.offsetWidth; // reflow
    ripple.style.transform = 'translate(-50%,-50%) scale(20)';
    ripple.style.opacity   = '0';
    ripple.addEventListener('transitionend', function () { ripple.remove(); });
  }

  /* ================================================
     PAGE NAVIGATION — hub cards → individual pages
     ================================================ */
  function initCardNavigation() {
    document.querySelectorAll('.hub-card[data-page]').forEach(function (card) {
      card.addEventListener('click', function () {
        var pageId = card.getAttribute('data-page');
        triggerCardWobble(card);
        spawnCardRipple(card);
        setTimeout(function () {
          window.location.href = 'src/pages/' + pageId + '.html';
        }, 220);
      });
    });
  }

  /* ---- Event listeners for envelope ---- */
  function attachEnvelopeListeners() {
    envelope.addEventListener('click', openEnvelope);
    envelope.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openEnvelope();
      }
    });
  }

  /* ================================================
     INIT
     ================================================ */

  /* ---- Mobile protection: selection, drag, context, pinch-zoom ---- */
  document.addEventListener('selectstart', function (e) { e.preventDefault(); });
  document.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  document.addEventListener('dragstart',   function (e) { e.preventDefault(); });
  document.addEventListener('touchmove', function (e) {
    if (e.touches.length > 1) { e.preventDefault(); }
  }, { passive: false });

  spawnParticles();
  initStreaks();

  dropLetters()
    .then(function () {
      return animateLoading();
    })
    .then(function () {
      return new Promise(function (r) { setTimeout(r, 500); });
    })
    .then(morphToEnvelope)
    .then(function () {
      attachEnvelopeListeners();
    });
})();
