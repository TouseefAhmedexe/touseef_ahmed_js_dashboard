const appState = {
    assignments: [],
    filter: 'all',
    searchQuery: '',
    activeSection: 'profile',
    theme: 'light'
};

document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initUrlParams();
    initNavigation();
    loadDashboardData();
    initFormHandlers();
    initModalHandlers();
    initIntersectionObserver();
});

function initTheme() {
    const savedTheme = localStorage.getItem('dashboard_theme') || 'light';
    appState.theme = savedTheme;
    document.body.setAttribute('data-theme', savedTheme);

    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
        themeBtn.addEventListener('click', function () {
            appState.theme = appState.theme === 'light' ? 'dark' : 'light';
            document.body.setAttribute('data-theme', appState.theme);
            localStorage.setItem('dashboard_theme', appState.theme);
            showToast(`Theme switched to ${appState.theme} mode`);
        });
    }
}

function loadDashboardData() {
    fetch('data.json')
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to retrieve assignment data');
            }
            return response.json();
        })
        .then((data) => {
            appState.assignments = data;
            renderAssignments();
            updateProgress();
            sessionStorage.setItem('last_data_load', new Date().toISOString());
        })
        .catch((error) => {
            showToast(error.message);
        });
}

function renderAssignments() {
    const listContainer = document.getElementById('assignment-list');
    if (!listContainer) return;

    while (listContainer.firstChild) {
        listContainer.removeChild(listContainer.firstChild);
    }

    const filtered = appState.assignments.filter((item) => {
        const matchesStatus = appState.filter === 'all' || item.status === appState.filter;
        const matchesSearch = item.title.toLowerCase().includes(appState.searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    if (filtered.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.textContent = 'No matching assignments found.';
        listContainer.appendChild(emptyMsg);
        return;
    }

    filtered.forEach((item) => {
        const card = document.createElement('article');
        card.className = 'card';

        const title = document.createElement('h3');
        title.textContent = item.title;

        const status = document.createElement('p');
        status.textContent = `Status: ${item.status}`;

        const due = document.createElement('p');
        due.textContent = `Due Date: ${item.dueDate}`;

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'view-details-btn';
        btn.dataset.id = item.id;
        btn.textContent = 'View Details';

        card.appendChild(title);
        card.appendChild(status);
        card.appendChild(due);
        card.appendChild(btn);

        listContainer.appendChild(card);
    });
}

function initUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const filterParam = urlParams.get('filter');
    if (filterParam) {
        appState.filter = filterParam;
        const selectElement = document.getElementById('status-filter');
        if (selectElement) selectElement.value = filterParam;
    }
}

function initNavigation() {
    const savedSection = localStorage.getItem('dashboard_active_tab');
    if (savedSection) {
        switchTab(savedSection);
    }

    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach((btn) => {
        btn.addEventListener('click', function () {
            const sectionTarget = this.dataset.section;
            switchTab(sectionTarget);
        });
    });

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function (e) {
            appState.searchQuery = e.target.value;
            renderAssignments();
        }, 300));
    }

    const filterSelect = document.getElementById('status-filter');
    if (filterSelect) {
        filterSelect.addEventListener('change', function (e) {
            appState.filter = e.target.value;
            syncFilterToUrl(appState.filter);
            renderAssignments();
        });
    }
}

function switchTab(sectionId) {
    appState.activeSection = sectionId;
    localStorage.setItem('dashboard_active_tab', sectionId);

    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.section === sectionId);
    });

    const sections = document.querySelectorAll('.dashboard-section');
    sections.forEach((sec) => {
        sec.classList.toggle('active', sec.id === `section-${sectionId}`);
    });
}

function syncFilterToUrl(filterValue) {
    const newUrl = new URL(window.location);
    if (filterValue === 'all') {
        newUrl.searchParams.delete('filter');
    } else {
        newUrl.searchParams.set('filter', filterValue);
    }
    window.history.replaceState({}, '', newUrl);
}

function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

function initModalHandlers() {
    const listContainer = document.getElementById('assignment-list');
    if (listContainer) {
        listContainer.addEventListener('click', function (e) {
            const btn = e.target.closest('.view-details-btn');
            if (btn) {
                const id = btn.dataset.id;
                openModal(id);
            }
        });
    }

    const closeBtn = document.getElementById('modal-close-btn');
    const modal = document.getElementById('assignment-modal');

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', function (e) {
            if (e.target === modal) closeModal();
        });
    }
}

function openModal(id) {
    const assignment = appState.assignments.find((item) => item.id === id);
    if (!assignment) return;

    document.getElementById('modal-title').textContent = assignment.title;
    document.getElementById('modal-description').textContent = assignment.description;
    document.getElementById('modal-due-date').textContent = assignment.dueDate;
    document.getElementById('modal-status').textContent = assignment.status;

    const modal = document.getElementById('assignment-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.setAttribute('aria-hidden', 'false');
    }
}

function closeModal() {
    const modal = document.getElementById('assignment-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.setAttribute('aria-hidden', 'true');
    }
}

function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 3000);
}

function initFormHandlers() {
    const form = document.getElementById('profile-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(form);

        const userName = formData.get('userName');
        const userEmail = formData.get('userEmail');
        const avatarFile = formData.get('avatarFile');

        if (userName && userEmail) {
            const profileData = { name: userName, email: userEmail };
            localStorage.setItem('user_profile', JSON.stringify(profileData));

            if (avatarFile && avatarFile.name) {
                showToast(`Profile updated with avatar: ${avatarFile.name}`);
            } else {
                showToast('Profile updated successfully');
            }
        }
    });
}

function updateProgress() {
    if (appState.assignments.length === 0) return;

    const completed = appState.assignments.filter((a) => a.status === 'Completed').length;
    const percentage = Math.round((completed / appState.assignments.length) * 100);

    const progressBar = document.getElementById('dashboard-progress');
    const progressText = document.getElementById('progress-percentage');

    if (progressBar) progressBar.value = percentage;
    if (progressText) progressText.textContent = `${percentage}%`;
}

function initIntersectionObserver() {
    const sections = document.querySelectorAll('.dashboard-section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                sessionStorage.setItem('last_active_view', entry.target.id);
            }
        });
    }, { threshold: 0.5 });

    sections.forEach((sec) => observer.observe(sec));
}