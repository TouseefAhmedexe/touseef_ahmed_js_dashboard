window.DataUtils = (function () {
    'use strict';

    function calculateStats(assignments) {
        if (!Array.isArray(assignments) || assignments.length === 0) {
            return { total: 0, completed: 0, pending: 0, overallPercentage: 0 };
        }

        const total = assignments.length;
        const completed = assignments.filter(a => a.status === 'Completed').length;
        const totalProgressSum = assignments.reduce((sum, item) => sum + (item.progress || 0), 0);
        const overallPercentage = Math.round(totalProgressSum / total);

        return {
            total: total,
            completed: completed,
            pending: total - completed,
            overallPercentage: overallPercentage
        };
    }

    function filterAssignments(assignments, filter, searchQuery) {
        if (!Array.isArray(assignments)) return [];

        const query = (searchQuery || '').toLowerCase();
        return assignments.filter(function (item) {
            const matchesStatus = (filter === 'all' || item.status === filter);
            const matchesSearch = (item.title || '').toLowerCase().includes(query) ||
                                  (item.description || '').toLowerCase().includes(query);
            return matchesStatus && matchesSearch;
        });
    }

    return {
        calculateStats: calculateStats,
        filterAssignments: filterAssignments
    };
})();