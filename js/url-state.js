window.URLState = (function () {
    'use strict';

    const ALLOWED_STATUSES = ['all', 'Completed', 'In Progress', 'Pending'];

    function readState() {
        const urlParams = new URLSearchParams(window.location.search);
        const filterParam = urlParams.get('filter');
        const searchParam = urlParams.get('search');

        return {
            filter: (filterParam && ALLOWED_STATUSES.includes(filterParam)) ? filterParam : 'all',
            search: searchParam || ''
        };
    }

    function syncState(filter, search) {
        const newUrl = new URL(window.location);

        if (filter && filter !== 'all' && ALLOWED_STATUSES.includes(filter)) {
            newUrl.searchParams.set('filter', filter);
        } else {
            newUrl.searchParams.delete('filter');
        }

        if (search && search.trim() !== '') {
            newUrl.searchParams.set('search', search.trim());
        } else {
            newUrl.searchParams.delete('search');
        }

        window.history.replaceState({}, '', newUrl);
    }

    return {
        readState: readState,
        syncState: syncState
    };
})();