# Intern Application & Training Dashboard

A Vanilla JavaScript dashboard application demonstrating browser APIs, web storage, dynamic DOM manipulation, and defensive programming without external dependencies or frameworks.

Task 14 deliverable for Bloomrix internship.

## Applied Browser APIs & Architecture

1. **Web Storage (`localStorage` & `sessionStorage`):**
   - User theme (`dashboard_theme`), active tab (`dashboard_active_tab`), and profile details saved in `localStorage`.
   - Data loading timestamp (`last_data_load`) saved in `sessionStorage`.

2. **URLSearchParams & History API:**
   - Active status filter is written to URL parameters (`?filter=Completed`) using `URLSearchParams` and `history.replaceState()`.

3. **Debounce Functionality:**
   - Text inputs in the search box are debounced by 300ms to reduce unnecessary re-rendering operations.

4. **FormData & File Input API:**
   - Profile update details and avatar metadata are processed cleanly via `FormData`.

5. **IntersectionObserver API:**
   - Tracks active dashboard sections and logs scroll position states to `sessionStorage`.

6. **Defensive Programming & Security:**
   - Node generation via `document.createElement()` and `textContent` prevents direct XSS vulnerabilities.
   - Defensive element checks prevent runtime failures on missing DOM nodes.

## How to Run
1. Open `index.html` using Visual Studio Code Live Server.
2. Inspect `Console`, `Network`, and `Application` -> `Local Storage` tabs in DevTools to verify API behavior.