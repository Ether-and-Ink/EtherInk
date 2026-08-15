document.querySelectorAll('.contact-email').forEach(function(el) {
    var u = el.getAttribute('data-user');
    var d = el.getAttribute('data-domain');
    if (u && d) {
        el.href = 'mailto:' + u + '@' + d;
        el.textContent = u + '@' + d;
    }
});

// Feedback form. Composes a prefilled email to admin@etherink.net and hands it
// to the visitor's mail app. No network calls, no third-party services, no keys
// — the browser's mailto handler does the sending.
(function initFeedbackForm() {
    var form = document.getElementById('feedbackForm');
    if (!form) return;
    var status = document.getElementById('fbStatus');
    var ADMIN = 'admin' + '@' + 'etherink.net';

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Honeypot: real people never see this field, so a filled value = bot.
        var hp = document.getElementById('fbWebsite');
        if (hp && hp.value) { return; }

        var type = document.getElementById('fbType').value;
        var title = document.getElementById('fbTitle').value.trim();
        var message = document.getElementById('fbMessage').value.trim();
        var email = document.getElementById('fbEmail').value.trim();

        if (!title || !message) {
            status.textContent = 'Please add a title and a message.';
            status.className = 'feedback-status error';
            return;
        }

        var subject = '[' + type + '] ' + title;
        var body = message +
            '\n\n—\nType: ' + type +
            (email ? '\nReply to: ' + email : '') +
            '\nSent from etherink.net';

        window.location.href = 'mailto:' + ADMIN +
            '?subject=' + encodeURIComponent(subject) +
            '&body=' + encodeURIComponent(body);

        status.textContent = 'Opening your email app… if nothing happens, email ' + ADMIN + ' directly.';
        status.className = 'feedback-status ok';
    });
})();

// Deep-link to an app section via query param, e.g. ?app=bibliomancy or
// ?app=lore-night (aliases accepted). Anchors like #bibliomancy also work on
// their own; this just adds a friendly ?app= form and normalizes aliases.
(function initSectionDeepLink() {
    var params = new URLSearchParams(window.location.search);
    var want = (params.get('app') || params.get('section') || '').toLowerCase().trim();
    if (!want) return;
    var map = {
        'bibliomancy': 'bibliomancy', 'bib': 'bibliomancy', 'books': 'bibliomancy',
        'lore-night': 'lore-night', 'lorenight': 'lore-night', 'lore': 'lore-night', 'trivia': 'lore-night',
        'apps': 'apps', 'about': 'about', 'contact': 'contact', 'support': 'contact', 'feedback': 'contact'
    };
    var id = map[want];
    var target = id && document.getElementById(id);
    if (!target) return;
    function go() { target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    if (document.readyState === 'complete') { go(); }
    else { window.addEventListener('load', go); }
})();

// Interactive auto-scrolling carousel. The track has two copies of each image
// back-to-back so we can seamlessly wrap around when scrollLeft crosses the
// half-width boundary. The rAF loop advances scrollLeft at a constant speed,
// and any user interaction (hover, touch, drag, wheel, scroll) pauses the
// auto-advance for a short idle window.
(function initSliders() {
    var sliders = document.querySelectorAll('.app-slider');
    if (!sliders.length) return;

    var PIXELS_PER_SECOND = 40;
    var IDLE_RESUME_MS = 2500;

    sliders.forEach(function(slider) {
        var lastInteraction = -Infinity;
        var hovering = false;
        var lastTime = null;

        function halfWidth() {
            return slider.scrollWidth / 2;
        }

        function tick(now) {
            if (lastTime == null) lastTime = now;
            var dt = now - lastTime;
            lastTime = now;

            var idle = !hovering && (now - lastInteraction) > IDLE_RESUME_MS;
            if (idle) {
                slider.scrollLeft += (PIXELS_PER_SECOND * dt) / 1000;
            }

            var hw = halfWidth();
            if (hw > 0 && slider.scrollLeft >= hw) {
                slider.scrollLeft -= hw;
            } else if (hw > 0 && slider.scrollLeft < 0) {
                slider.scrollLeft += hw;
            }

            requestAnimationFrame(tick);
        }

        function mark() { lastInteraction = performance.now(); }

        slider.addEventListener('mouseenter', function() { hovering = true; });
        slider.addEventListener('mouseleave', function() { hovering = false; mark(); });
        ['pointerdown','touchstart','wheel','scroll'].forEach(function(ev) {
            slider.addEventListener(ev, mark, { passive: true });
        });

        if (document.readyState === 'complete') {
            requestAnimationFrame(tick);
        } else {
            window.addEventListener('load', function() { requestAnimationFrame(tick); });
        }
    });
})();
