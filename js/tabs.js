window.TabsManager = (function () {
    'use strict';

    const ALLOWED_SECTIONS = ['overview', 'profile', 'assignments', 'notifications', 'progress', 'diagnostics'];

    function switchTab(sectionId) {
        const targetSection = ALLOWED_SECTIONS.includes(sectionId) ? sectionId : 'overview';
        window.StorageUtils.setItem('bloomrix_active_tab', targetSection);

        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(function (btn) {
            const isActive = btn.dataset.section === targetSection;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        const sections = document.querySelectorAll('.dashboard-section');
        sections.forEach(function (sec) {
            sec.classList.toggle('active', sec.id === `section-${targetSection}`);
        });
    }

    return {
        switchTab: switchTab,
        ALLOWED_SECTIONS: ALLOWED_SECTIONS
    };
})();