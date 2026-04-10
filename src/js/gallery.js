/* gallery.js — standalone gallery page logic + lightbox
   Touch-safe: no competing scroll containers, class-based body lock */

(function () {
  'use strict';

  /* ---- Mobile protection ---- */
  document.addEventListener('selectstart', function (e) { e.preventDefault(); });
  document.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  document.addEventListener('dragstart',   function (e) { e.preventDefault(); });
  document.addEventListener('touchmove', function (e) {
    if (e.touches.length > 1) { e.preventDefault(); }
  }, { passive: false });

  /* ---- Back button ---- */
  document.getElementById('back-btn').addEventListener('click', function () {
    if (history.length > 1) {
      history.back();
    } else {
      window.location.href = '../../index.html';
    }
  });

  /* ---- Gallery state ---- */
  var items        = Array.from(document.querySelectorAll('.gallery-item'));
  var lightboxIndex = 0;

  var lb      = document.getElementById('gallery-lightbox');
  var lbImg   = document.getElementById('lightbox-img');
  var lbClose = lb.querySelector('.lightbox-close');
  var lbPrev  = lb.querySelector('.lightbox-btn--prev');
  var lbNext  = lb.querySelector('.lightbox-btn--next');
  var lbCap   = lb.querySelector('.lightbox-caption');
  var lbCount = lb.querySelector('.lightbox-counter');

  /* ---- Staggered entrance via IntersectionObserver ---- */
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el  = entry.target;
      var idx = parseInt(el.getAttribute('data-index') || 0, 10);
      el.style.transitionDelay = (idx * 55) + 'ms';
      el.classList.add('visible');
      observer.unobserve(el);
    });
  }, { threshold: 0.05 });

  items.forEach(function (item) {
    observer.observe(item);
    item.addEventListener('click', function () {
      openLightbox(parseInt(item.getAttribute('data-index'), 10));
    });
  });

  /* ---- Lightbox controls ---- */
  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', function () { showAt(lightboxIndex - 1); });
  lbNext.addEventListener('click', function () { showAt(lightboxIndex + 1); });

  /* Close on backdrop tap (only if target is the lightbox backdrop itself) */
  lb.addEventListener('click', function (e) {
    if (e.target === lb) { closeLightbox(); }
  });

  /* Keyboard nav */
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'ArrowLeft')  { showAt(lightboxIndex - 1); }
    if (e.key === 'ArrowRight') { showAt(lightboxIndex + 1); }
    if (e.key === 'Escape')     { closeLightbox(); }
  });

  /* Touch swipe — listeners on the lightbox itself, passive so scroll is unaffected */
  var touchStartX = 0;
  var touchStartY = 0;
  lb.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].clientX;
    touchStartY = e.changedTouches[0].clientY;
  }, { passive: true });

  lb.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - touchStartX;
    var dy = e.changedTouches[0].clientY - touchStartY;
    /* Only trigger swipe if horizontal movement dominates */
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
      showAt(lightboxIndex + (dx < 0 ? 1 : -1));
    }
  }, { passive: true });

  /* ---- Lightbox open / close ---- */
  function openLightbox(index) {
    lb.classList.add('open');
    /* Use class-based body lock — avoids iOS position:fixed jank */
    document.body.classList.add('lightbox-open');
    showAt(index);
  }

  function closeLightbox() {
    lb.classList.remove('open');
    document.body.classList.remove('lightbox-open');
    lbImg.style.opacity   = '0';
    lbImg.style.transform = 'scale(.94)';
  }

  /* ---- Show photo at index (wraps around) ---- */
  function showAt(index) {
    var total = items.length;
    index = ((index % total) + total) % total;
    lightboxIndex = index;

    var item    = items[index];
    var src     = item.querySelector('img').src;
    var caption = item.querySelector('.gallery-item__caption').textContent;

    lbImg.style.opacity   = '0';
    lbImg.style.transform = 'scale(.94)';

    setTimeout(function () {
      lbImg.src             = src;
      lbImg.alt             = caption;
      lbCap.textContent     = caption;
      lbCount.textContent   = (index + 1) + ' / ' + total;
      lbImg.style.opacity   = '1';
      lbImg.style.transform = 'scale(1)';
    }, 120);
  }
})();
