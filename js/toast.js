window.ToastUtils = (function () {
    'use strict';

    function showToast(message, duration = 3500) {
        const container = window.DOMUtils.safeGetElement('toast-container');
        if (!container) return;

        const toast = window.DOMUtils.createEl('div', 'toast', message);
        container.appendChild(toast);

        setTimeout(function () {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, duration);
    }

    return {
        showToast: showToast
    };
})();