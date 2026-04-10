/* message.js — standalone message page: typewriter animation */

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

  /* ---- Typewriter ---- */
  var CHAR_DELAY = 50;
  var PARA_PAUSE = 180;
  var nodes = Array.from(document.querySelectorAll('[data-typewrite]'));

  /* Reset all nodes */
  nodes.forEach(function (el) { el.textContent = ''; });

  /* Shared blinking cursor */
  var cursor = document.createElement('span');
  cursor.className   = 'tw-cursor';
  cursor.textContent = '|';

  function typeNode(el, text, i, onDone) {
    if (i === 0) { el.appendChild(cursor); }
    if (i >= text.length) {
      if (cursor.parentNode === el) { el.removeChild(cursor); }
      onDone();
      return;
    }
    el.insertBefore(document.createTextNode(text.charAt(i)), cursor);
    setTimeout(function () { typeNode(el, text, i + 1, onDone); }, CHAR_DELAY);
  }

  function typeSequence(index) {
    if (index >= nodes.length) {
      if (cursor.parentNode) { cursor.parentNode.removeChild(cursor); }
      return;
    }
    var el   = nodes[index];
    var text = el.getAttribute('data-typewrite');
    /* Small initial delay on first node so the page-enter animation has settled */
    setTimeout(function () {
      typeNode(el, text, 0, function () { typeSequence(index + 1); });
    }, index === 0 ? 400 : PARA_PAUSE);
  }

  typeSequence(0);
})();
