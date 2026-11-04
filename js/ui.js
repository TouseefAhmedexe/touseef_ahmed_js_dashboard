window.UIManager = (function () {
    'use strict';

    function renderAssignments(assignments, container, onDetailsClick) {
        if (!container) return;

        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        if (assignments.length === 0) {
            container.appendChild(window.DOMUtils.createEl('p', 'empty-message', 'No matching assignment modules found.'));
            return;
        }

        assignments.forEach(function (item) {
            const card = window.DOMUtils.createEl('article', 'card');
            card.appendChild(window.DOMUtils.createEl('h3', null, item.title ?? 'Untitled Task'));

            const statusClass = item.status === 'Completed' ? 'badge-completed' : 'badge-in-progress';
            card.appendChild(window.DOMUtils.createEl('span', `status-badge ${statusClass}`, item.status ?? 'Pending'));

            const progressWrapper = window.DOMUtils.createEl('div', 'card-progress-wrapper');
            progressWrapper.appendChild(window.DOMUtils.createEl('p', null, `Progress: ${item.progress ?? 0}%`));

            const progressBar = window.DOMUtils.createEl('progress');
            progressBar.value = item.progress ?? 0;
            progressBar.max = 100;
            progressWrapper.appendChild(progressBar);
            card.appendChild(progressWrapper);

            card.appendChild(window.DOMUtils.createEl('p', null, `Due Date: ${item.dueDate ?? 'N/A'}`));

            const btn = window.DOMUtils.createEl('button', 'btn btn-primary view-details-btn', 'View Details');
            btn.type = 'button';
            btn.dataset.id = item.id;
            btn.addEventListener('click', () => onDetailsClick(item));

            card.appendChild(btn);
            container.appendChild(card);
        });
    }

    function renderSummaryTable(assignments, tableBody) {
        if (!tableBody) return;

        while (tableBody.firstChild) {
            tableBody.removeChild(tableBody.firstChild);
        }

        assignments.forEach(function (task) {
            const row = window.DOMUtils.createEl('tr');
            row.appendChild(window.DOMUtils.createEl('td', null, (task.id || '').toUpperCase()));
            row.appendChild(window.DOMUtils.createEl('td', null, task.title ?? 'Untitled'));
            row.appendChild(window.DOMUtils.createEl('td', null, task.status ?? 'Pending'));
            row.appendChild(window.DOMUtils.createEl('td', null, `${task.progress ?? 0}%`));
            row.appendChild(window.DOMUtils.createEl('td', null, task.dueDate ?? 'N/A'));
            tableBody.appendChild(row);
        });
    }

    function renderNotifications(notifications, container, badgeElement, onMarkRead) {
        if (!container) return;

        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        const unreadCount = notifications.filter(n => !n.read).length;
        if (badgeElement) badgeElement.textContent = unreadCount;

        notifications.forEach(function (n) {
            const item = window.DOMUtils.createEl('div', `notification-item ${n.read ? 'read' : 'unread'}`);
            const infoGroup = window.DOMUtils.createEl('div');
            infoGroup.appendChild(window.DOMUtils.createEl('strong', null, n.title));
            infoGroup.appendChild(window.DOMUtils.createEl('p', null, n.time));

            item.appendChild(infoGroup);

            if (!n.read) {
                const readBtn = window.DOMUtils.createEl('button', 'btn btn-secondary', 'Mark Read');
                readBtn.addEventListener('click', () => onMarkRead(n.id));
                item.appendChild(readBtn);
            }

            container.appendChild(item);
        });
    }

    function renderInlineError(container, message, onRetry) {
        if (!container) return;
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        const errorWrapper = window.DOMUtils.createEl('div', 'error-state');
        errorWrapper.appendChild(window.DOMUtils.createEl('h3', null, 'Failed to Load Data'));
        errorWrapper.appendChild(window.DOMUtils.createEl('p', null, message));

        const retryBtn = window.DOMUtils.createEl('button', 'btn btn-primary', 'Retry Request');
        retryBtn.addEventListener('click', onRetry);
        errorWrapper.appendChild(retryBtn);

        container.appendChild(errorWrapper);
    }

    return {
        renderAssignments: renderAssignments,
        renderSummaryTable: renderSummaryTable,
        renderNotifications: renderNotifications,
        renderInlineError: renderInlineError
    };
})();