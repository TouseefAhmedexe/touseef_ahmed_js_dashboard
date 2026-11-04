window.StorageUtils = (function () {
    'use strict';

    function getItem(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error(`[StorageUtils] Error reading key '${key}' from localStorage:`, e);
            return defaultValue;
        }
    }

    function setItem(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error(`[StorageUtils] Error writing key '${key}' to localStorage:`, e);
            return false;
        }
    }

    function getSessionItem(key, defaultValue = null) {
        try {
            const item = sessionStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error(`[StorageUtils] Error reading key '${key}' from sessionStorage:`, e);
            return defaultValue;
        }
    }

    function setSessionItem(key, value) {
        try {
            sessionStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error(`[StorageUtils] Error writing key '${key}' to sessionStorage:`, e);
            return false;
        }
    }

    function clearAll() {
        try {
            localStorage.clear();
            sessionStorage.clear();
            return true;
        } catch (e) {
            console.error('[StorageUtils] Error clearing web storage:', e);
            return false;
        }
    }

    return {
        getItem: getItem,
        setItem: setItem,
        getSessionItem: getSessionItem,
        setSessionItem: setSessionItem,
        clearAll: clearAll
    };
})();