document.querySelectorAll('.contact-email').forEach(function(el) {
    var u = el.getAttribute('data-user');
    var d = el.getAttribute('data-domain');
    if (u && d) {
        el.href = 'mailto:' + u + '@' + d;
        el.textContent = u + '@' + d;
    }
});
