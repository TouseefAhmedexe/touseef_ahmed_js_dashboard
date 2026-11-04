(function () {
    'use strict';

    const appState = {
        assignments: [],
        notifications: [
            { id: 1, title: 'Welcome to Task 14 Dashboard', time: 'Just now', read: false },
            { id: 2, title: 'Task 7 Submission Reviewed', time: '2 hours ago', read: false },
            { id: 3, title: 'New Training Milestone Available', time: '1 day ago', read: true }
        ],
        filter: 'all',
        searchQuery: '',
        activeSection: 'overview',
        theme: 'light',
        sessionStartTime: Date.now()
    };

    document.addEventListener('DOMContentLoaded', function () {
        initTheme();
        initClock();
        restoreState();
        initNavigation();
        initDropZone();
        initProfileForm();
        initNotifications();
        window.ModalUtils.initModalHandlers();
        initDiagnostics();
        loadDashboardData();
        window.ObserverUtils.initIntersectionObserver();
        initStorageReset();
    });

    function initTheme() {
        const savedTheme = window.StorageUtils.getItem('bloomrix_theme', 'light');
        appState.theme = ['light', 'dark'].includes(savedTheme) ? savedTheme : 'light';
        document.body.setAttribute('data-theme', appState.theme);

        const themeBtn = window.DOMUtils.safeGetElement('theme-toggle-btn');
        if (themeBtn) {
            themeBtn.addEventListener('click', function () {
                appState.theme = appState.theme === 'light' ? 'dark' : 'light';
                document.body.setAttribute('data-theme', appState.theme);
                window.StorageUtils.setItem('bloomrix_theme', appState.theme);
                window.ToastUtils.showToast(`Theme switched to ${appState.theme} mode`);
            });
        }
    }

    function initClock() {
        const clockElement = window.DOMUtils.safeGetElement('live-clock');
        const timerElement = window.DOMUtils.safeGetElement('session-timer');

        setInterval(function () {
            const now = new Date();
            if (clockElement) {
                clockElement.textContent = now.toTimeString().split(' ')[0];
            }

            if (timerElement) {
                const elapsedSeconds = Math.floor((Date.now() - appState.sessionStartTime) / 1000);
                const minutes = String(Math.floor(elapsedSeconds / 60)).padStart(2, '0');
                const seconds = String(elapsedSeconds % 60).padStart(2, '0');
                timerElement.textContent = `${minutes}:${seconds}`;
            }
        }, 1000);
    }

    function restoreState() {
        const urlState = window.URLState.readState();
        appState.filter = urlState.filter;
        appState.searchQuery = urlState.search;

        const filterSelect = window.DOMUtils.safeGetElement('status-filter');
        if (filterSelect) filterSelect.value = appState.filter;

        const searchInput = window.DOMUtils.safeGetElement('search-input');
        if (searchInput) searchInput.value = appState.searchQuery;

        const savedSection = window.StorageUtils.getItem('bloomrix_active_tab') || 
                             window.StorageUtils.getSessionItem('bloomrix_last_section');
        window.TabsManager.switchTab(savedSection || 'overview');

        loadSavedProfile();
        loadSavedNotifications();
    }

    function initNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                window.TabsManager.switchTab(this.dataset.section);
            });
        });

        const searchInput = window.DOMUtils.safeGetElement('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', window.debounce(function () {
                appState.searchQuery = searchInput.value;
                window.URLState.syncState(appState.filter, appState.searchQuery);
                updateAssignmentsView();
            }, 300));
        }

        const filterSelect = window.DOMUtils.safeGetElement('status-filter');
        if (filterSelect) {
            filterSelect.addEventListener('change', function (e) {
                appState.filter = e.target.value;
                window.URLState.syncState(appState.filter, appState.searchQuery);
                updateAssignmentsView();
            });
        }
    }

    function loadDashboardData() {
        const listContainer = window.DOMUtils.safeGetElement('assignment-list');

        window.APIUtils.fetchDashboardData()
            .then(function (data) {
                appState.assignments = data;
                updateAssignmentsView();
                updateStatsView();
            })
            .catch(function (error) {
                window.ToastUtils.showToast(error.message);
                window.UIManager.renderInlineError(listContainer, error.message, loadDashboardData);
            });
    }

    function updateAssignmentsView() {
        const container = window.DOMUtils.safeGetElement('assignment-list');
        const filtered = window.DataUtils.filterAssignments(appState.assignments, appState.filter, appState.searchQuery);
        window.UIManager.renderAssignments(filtered, container, window.ModalUtils.openModal);
    }

    function updateStatsView() {
        const stats = window.DataUtils.calculateStats(appState.assignments);

        const statCompleted = window.DOMUtils.safeGetElement('stat-completed');
        const statPending = window.DOMUtils.safeGetElement('stat-pending');
        const statTotal = window.DOMUtils.safeGetElement('stat-total');
        const progressText = window.DOMUtils.safeGetElement('progress-percentage');
        const progressFill = window.DOMUtils.safeGetElement('progress-bar-fill');

        if (statCompleted) statCompleted.textContent = stats.completed;
        if (statPending) statPending.textContent = stats.pending;
        if (statTotal) statTotal.textContent = stats.total;
        if (progressText) progressText.textContent = `${stats.overallPercentage}%`;
        if (progressFill) progressFill.style.width = `${stats.overallPercentage}%`;

        const tableBody = window.DOMUtils.safeGetElement('summary-table-body');
        window.UIManager.renderSummaryTable(appState.assignments, tableBody);
    }

    function initDropZone() {
        const dropZone = window.DOMUtils.safeGetElement('drop-zone');
        const fileInput = window.DOMUtils.safeGetElement('avatar-file');
        const fileDetails = window.DOMUtils.safeGetElement('file-details');

        if (!dropZone || !fileInput) return;

        dropZone.addEventListener('click', () => fileInput.click());
        dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
        dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
        dropZone.addEventListener('drop', function (e) {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            if (e.dataTransfer.files.length > 0) {
                validateFile(e.dataTransfer.files[0], fileInput, fileDetails);
            }
        });

        fileInput.addEventListener('change', function () {
            if (fileInput.files.length > 0) {
                validateFile(fileInput.files[0], fileInput, fileDetails);
            }
        });
    }

    function validateFile(file, inputElement, detailsElement) {
        const isValidType = file.type.startsWith('image/') || file.type === 'application/pdf';
        if (!isValidType) {
            window.ToastUtils.showToast('Invalid File Type: Upload an Image or PDF document.');
            inputElement.value = '';
            if (detailsElement) detailsElement.classList.add('hidden');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            window.ToastUtils.showToast('File Too Large: Maximum size limit is 2MB.');
            inputElement.value = '';
            if (detailsElement) detailsElement.classList.add('hidden');
            return;
        }

        if (detailsElement) {
            detailsElement.classList.remove('hidden');
            detailsElement.textContent = `Valid File: ${file.name} (${Math.round(file.size / 1024)} KB)`;
        }
    }

    function initProfileForm() {
        const form = window.DOMUtils.safeGetElement('profile-form');
        if (!form) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = new FormData(form);

            const profileData = {
                name: formData.get('userName'),
                email: formData.get('userEmail'),
                track: formData.get('internTrack'),
                fileName: formData.get('avatarFile')?.name || 'None uploaded'
            };

            window.StorageUtils.setItem('bloomrix_profile', profileData);
            loadSavedProfile();
            window.ToastUtils.showToast('Profile updated and saved to LocalStorage');
        });
    }

    function loadSavedProfile() {
        const profile = window.StorageUtils.getItem('bloomrix_profile');
        if (!profile) return;

        const pName = window.DOMUtils.safeGetElement('preview-name');
        const pEmail = window.DOMUtils.safeGetElement('preview-email');
        const pTrack = window.DOMUtils.safeGetElement('preview-track');
        const pFile = window.DOMUtils.safeGetElement('preview-file');

        if (pName) pName.textContent = profile.name || 'Not set';
        if (pEmail) pEmail.textContent = profile.email || 'Not set';
        if (pTrack) pTrack.textContent = profile.track || 'Not set';
        if (pFile) pFile.textContent = profile.fileName || 'None uploaded';

        const inputName = window.DOMUtils.safeGetElement('user-name');
        const inputEmail = window.DOMUtils.safeGetElement('user-email');
        const inputTrack = window.DOMUtils.safeGetElement('intern-track');

        if (inputName && profile.name) inputName.value = profile.name;
        if (inputEmail && profile.email) inputEmail.value = profile.email;
        if (inputTrack && profile.track) inputTrack.value = profile.track;
    }

    function initNotifications() {
        updateNotificationsView();

        const markAllBtn = window.DOMUtils.safeGetElement('mark-all-read-btn');
        if (markAllBtn) {
            markAllBtn.addEventListener('click', function () {
                appState.notifications.forEach(n => n.read = true);
                window.StorageUtils.setItem('bloomrix_notifications', appState.notifications);
                updateNotificationsView();
                window.ToastUtils.showToast('All notifications marked as read.');
            });
        }
    }

    function loadSavedNotifications() {
        const saved = window.StorageUtils.getItem('bloomrix_notifications');
        if (Array.isArray(saved)) {
            appState.notifications = saved;
        }
    }

    function updateNotificationsView() {
        const container = window.DOMUtils.safeGetElement('notification-list');
        const badge = window.DOMUtils.safeGetElement('unread-count');
        window.UIManager.renderNotifications(appState.notifications, container, badge, function (id) {
            const item = appState.notifications.find(n => n.id === id);
            if (item) {
                item.read = true;
                window.StorageUtils.setItem('bloomrix_notifications', appState.notifications);
                updateNotificationsView();
            }
        });
    }

    function initDiagnostics() {
        const diagOnline = window.DOMUtils.safeGetElement('diag-online');
        const diagAgent = window.DOMUtils.safeGetElement('diag-agent');
        const diagClipboard = window.DOMUtils.safeGetElement('diag-clipboard');
        const diagStorage = window.DOMUtils.safeGetElement('diag-storage');

        if (diagOnline) diagOnline.textContent = navigator.onLine ? 'Connected (Online)' : 'Offline';
        if (diagAgent) diagAgent.textContent = navigator.userAgent;
        if (diagClipboard) diagClipboard.textContent = navigator.clipboard ? 'Supported' : 'Not Supported';
        if (diagStorage) diagStorage.textContent = window.localStorage ? 'Supported (5MB)' : 'Not Supported';
    }

    function initStorageReset() {
        const resetBtn = window.DOMUtils.safeGetElement('clear-storage-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', function () {
                window.StorageUtils.clearAll();
                window.ToastUtils.showToast('Web storage reset complete. Reloading...');
                setTimeout(() => window.location.reload(), 1200);
            });
        }
    }
})();