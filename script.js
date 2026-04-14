document.querySelectorAll('.contact-email').forEach(function(el) {
    var u = el.getAttribute('data-user');
    var d = el.getAttribute('data-domain');
    if (u && d) {
        el.href = 'mailto:' + u + '@' + d;
        el.textContent = u + '@' + d;
    }
});

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
