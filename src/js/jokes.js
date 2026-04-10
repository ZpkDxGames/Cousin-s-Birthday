/* jokes.js — standalone jokes page: flip-card interactions */

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

  /* ---- Flip cards ---- */
  document.querySelectorAll('[data-joke]').forEach(function (card) {
    card.addEventListener('click', function () {
      card.classList.toggle('flipped');
    });
  });
})();
