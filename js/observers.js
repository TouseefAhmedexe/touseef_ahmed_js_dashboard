window.ObserverUtils = (function () {
    'use strict';

    function initIntersectionObserver() {
        const sections = document.querySelectorAll('.dashboard-section');
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id.replace('section-', '');
                    window.StorageUtils.setSessionItem('bloomrix_last_section', sectionId);
                }
            });
        }, { threshold: 0.3 });

        sections.forEach(sec => observer.observe(sec));
    }

    return {
        initIntersectionObserver: initIntersectionObserver
    };
})();