window.ModalUtils = (function () {
    'use strict';

    let lastFocusedElement = null;

    function openModal(task) {
        if (!task) return;

        lastFocusedElement = document.activeElement;

        const mTitle = window.DOMUtils.safeGetElement('modal-title');
        const mDesc = window.DOMUtils.safeGetElement('modal-description');
        const mDue = window.DOMUtils.safeGetElement('modal-due-date');
        const mStatus = window.DOMUtils.safeGetElement('modal-status');
        const mProg = window.DOMUtils.safeGetElement('modal-progress');

        if (mTitle) mTitle.textContent = task.title ?? 'Untitled Task';
        if (mDesc) mDesc.textContent = task.description ?? 'No description provided.';
        if (mDue) mDue.textContent = task.dueDate ?? 'Unspecified';
        if (mStatus) mStatus.textContent = task.status ?? 'Pending';
        if (mProg) mProg.textContent = `${task.progress ?? 0}%`;

        const modal = window.DOMUtils.safeGetElement('assignment-modal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('modal-open');
            modal.querySelector('.modal-content')?.focus();
        }
    }

    function closeModal() {
        const modal = window.DOMUtils.safeGetElement('assignment-modal');
        if (modal && !modal.classList.contains('hidden')) {
            modal.classList.add('hidden');
            modal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('modal-open');
            if (lastFocusedElement) {
                lastFocusedElement.focus();
            }
        }
    }

    function initModalHandlers() {
        const closeBtn = window.DOMUtils.safeGetElement('modal-close-btn');
        const modal = window.DOMUtils.safeGetElement('assignment-modal');

        if (closeBtn && modal) {
            closeBtn.addEventListener('click', closeModal);
            modal.addEventListener('click', function (e) {
                if (e.target === modal) closeModal();
            });
        }

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                closeModal();
            }
        });

        const copyBtn = window.DOMUtils.safeGetElement('copy-modal-link-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', function () {
                const title = window.DOMUtils.safeGetElement('modal-title')?.textContent || '';
                const status = window.DOMUtils.safeGetElement('modal-status')?.textContent || '';
                const textToCopy = `${title} - Status: ${status}`;

                if (navigator.clipboard) {
                    navigator.clipboard.writeText(textToCopy).then(function () {
                        window.ToastUtils.showToast('Task summary copied to Clipboard!');
                    });
                }
            });
        }
    }

    return {
        openModal: openModal,
        closeModal: closeModal,
        initModalHandlers: initModalHandlers
    };
})();