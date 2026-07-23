/* fluharty.link — interactive bits. Vanilla JS, no hurry. */
(function () {
    'use strict';

    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var CAN = ['var(--pink)', 'var(--cyan)', 'var(--lime)', 'var(--yellow)', 'var(--orange)', 'var(--purple)'];

    /* ---------- current year ---------- */
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------- hit counter (localStorage, odometer style) ---------- */
    var counterEl = document.getElementById('hit-counter');
    if (counterEl) {
        var BASE = 19940; // every good counter starts somewhere suspicious
        var visits = 0;
        try {
            visits = (parseInt(localStorage.getItem('flu-visits'), 10) || 0) + 1;
            localStorage.setItem('flu-visits', String(visits));
        } catch (e) { /* private browsing: counter stays at base */ }
        var digits = String(BASE + visits).padStart(7, '0');
        counterEl.innerHTML = '';
        digits.split('').forEach(function (d) {
            var b = document.createElement('b');
            b.textContent = d;
            counterEl.appendChild(b);
        });
    }

    /* ---------- spray splat on click ---------- */
    function makeSplat(x, y) {
        if (reducedMotion) return;
        var color = CAN[Math.floor(Math.random() * CAN.length)];
        var size = 40 + Math.random() * 50;
        var splat = document.createElement('div');
        splat.className = 'splat';
        splat.style.left = x + 'px';
        splat.style.top = y + 'px';
        splat.style.width = size + 'px';
        splat.style.height = size + 'px';
        // irregular blob + satellite droplets
        splat.innerHTML =
            '<svg viewBox="0 0 100 100" width="100%" height="100%">' +
            '<path d="M50 8 C68 10 82 20 88 38 C94 56 86 74 70 84 C54 94 34 92 20 80 ' +
            'C6 68 4 46 14 30 C24 14 32 6 50 8 Z" fill="' + color + '"/>' +
            '<circle cx="90" cy="22" r="5" fill="' + color + '"/>' +
            '<circle cx="12" cy="88" r="4" fill="' + color + '"/>' +
            '<circle cx="86" cy="78" r="3" fill="' + color + '"/>' +
            '</svg>';
        document.body.appendChild(splat);
        setTimeout(function () { splat.remove(); }, 950);
    }

    document.addEventListener('click', function (e) {
        // don't splat on interactive elements — let links be links
        if (e.target.closest('a, button, input, textarea, select, label')) return;
        makeSplat(e.clientX, e.clientY);
    });

    /* ---------- party mode ---------- */
    var PARTY_EMOJI = ['🎨', '📻', '💾', '📼', '✨', '🧢', '🛹', '💿'];
    var partyTimer = null;

    function dropEmoji() {
        var drop = document.createElement('span');
        drop.className = 'party-drop';
        drop.textContent = PARTY_EMOJI[Math.floor(Math.random() * PARTY_EMOJI.length)];
        drop.style.left = Math.random() * 100 + 'vw';
        drop.style.animationDuration = 2.5 + Math.random() * 2.5 + 's';
        document.body.appendChild(drop);
        setTimeout(function () { drop.remove(); }, 5200);
    }

    function toggleParty() {
        if (reducedMotion) return;
        var on = document.body.classList.toggle('party');
        if (on) {
            partyTimer = setInterval(dropEmoji, 220);
            setTimeout(function () {
                // parties that never end are just chores
                if (document.body.classList.contains('party')) toggleParty();
            }, 12000);
        } else {
            clearInterval(partyTimer);
            partyTimer = null;
        }
    }

    // konami code: up up down down left right left right b a
    var KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    var keyBuffer = [];
    document.addEventListener('keydown', function (e) {
        keyBuffer.push(e.key);
        if (keyBuffer.length > KONAMI.length) keyBuffer.shift();
        if (keyBuffer.join(',') === KONAMI.join(',')) {
            keyBuffer = [];
            toggleParty();
        }
    });

    // triple-click the wordmark
    var wordmark = document.getElementById('wordmark');
    if (wordmark) {
        var clicks = 0, clickTimer = null;
        wordmark.addEventListener('click', function () {
            clicks++;
            clearTimeout(clickTimer);
            clickTimer = setTimeout(function () { clicks = 0; }, 500);
            if (clicks >= 3) {
                clicks = 0;
                toggleParty();
            }
        });
    }
})();
