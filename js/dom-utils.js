window.DOMUtils = (function () {
    'use strict';

    function safeGetElement(id) {
        const el = document.getElementById(id);
        if (!el) {
            console.warn(`[DOMUtils] Element with ID '${id}' was not found in the DOM.`);
        }
        return el;
    }

    function createEl(tag, className, textContent) {
        const el = document.createElement(tag);
        if (className) el.className = className;
        if (textContent !== undefined && textContent !== null) {
            el.textContent = textContent;
        }
        return el;
    }

    return {
        safeGetElement: safeGetElement,
        createEl: createEl
    };
})();