# Bloomrix Modular Intern Application & Training Dashboard

A fully modular Vanilla JavaScript application constructed following clean architectural principles, native Browser APIs, web storage persistence, file upload validation, accessible modal dialogs, and URL state sync.

Task 14 deliverable for Bloomrix internship.

## Architecture Breakdown

```text
touseef_ahmed_js_intern_dashboard/
├── index.html          # Semantic layout, notification panels, forms, and accessibility markup
├── style.css           # Custom property themes (dark/light mode), grid layouts, and card styles
├── data/
│   └── dashboard.json  # Mock JSON dataset featuring per-task progress attributes
└── js/
    ├── api.js          # Fetch API logic with status checks and payload validation
    ├── app.js          # Application entry point & IIFE initialization orchestrator
    ├── data-utils.js   # Pure math & data filtering helper utilities
    ├── debounce.js     # Universal debounce higher-order utility
    ├── dom-utils.js    # Defensive DOM lookups (`safeGetElement`) and element builders (`createEl`)
    ├── modal.js        # Accessible modal dialog logic with focus trap, aria attributes & Escape key
    ├── observers.js    # IntersectionObserver logic tracking view history to sessionStorage
    ├── storage.js      # Try-catch guarded Web Storage abstraction layer
    ├── tabs.js         # Navigation tab switcher with tablist/tabpanel accessibility
    ├── toast.js        # Dynamic notification toast system
    ├── ui.js           # Dedicated UI renderer functions for assignment cards, table, and errors
    └── url-state.js    # Whitelisted URLSearchParams & history.replaceState state sync