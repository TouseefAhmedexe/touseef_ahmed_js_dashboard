window.APIUtils = (function () {
    'use strict';

    function fetchDashboardData() {
        return fetch('data/dashboard.json')
            .then(function (response) {
                if (!response.ok) {
                    throw new Error(`HTTP Error ${response.status}: Failed to retrieve dashboard data.`);
                }
                return response.json();
            })
            .then(function (data) {
                if (!Array.isArray(data)) {
                    throw new Error('Data Format Error: Received payload is not an array.');
                }
                window.StorageUtils.setSessionItem('bloomrix_last_fetch', new Date().toISOString());
                return data;
            });
    }

    return {
        fetchDashboardData: fetchDashboardData
    };
})();