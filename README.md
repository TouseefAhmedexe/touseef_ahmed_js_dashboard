# Bloomrix Intern Application & Training Dashboard

A framework-free Vanilla JavaScript dashboard application demonstrating browser APIs, web storage persistence, accessible modal dialogs, File API validation, URL state synchronization, and defensive programming.

Task 14 deliverable for Bloomrix internship.

## Applied Browser APIs & Fixes

1. **Web Storage (`localStorage` & `sessionStorage`):**
   - Theme preference (`bloomrix_theme`), active navigation section (`bloomrix_active_tab`), notifications read state (`bloomrix_notifications`), and user profile object (`bloomrix_profile`) stored in `localStorage`.
   - Populates inputs (`#user-name`, `#user-email`) automatically upon browser reload via `restoreState()`.
   - Data fetch timestamp (`bloomrix_last_fetch`) and last observed view (`bloomrix_last_section`) stored in `sessionStorage`.

2. **Notifications & Per-Card Progress:**
   - Dedicated Notifications section renders read/unread alerts with interactive buttons and badge counts.
   - Assignment cards render `<progress>` elements fed directly from `item.progress`. Overall dashboard progress computes total progress averages.

3. **URLSearchParams & History API:**
   - Whitelisted status filters (`?filter=Completed`) and debounced search strings (`?search=Task`) sync seamlessly via `history.replaceState()`.

4. **File API & Defensive File Validation:**
   - Drag-and-drop dropzone validates MIME types (`image/*`, `application/pdf`) and byte size limits (<= 2MB) prior to processing.

5. **Accessibility & Modal Dialog Security:**
   - Modal dialog includes `role="dialog"`, `aria-modal="true"`, Escape-key dismissal, background scroll lock (`.modal-open`), focus trapping, and focus restoration to triggering controls.

6. **Defensive Programming & IIFE Encapsulation:**
   - Encapsulated inside an IIFE to prevent global namespace pollution.
   - All DOM selections guarded with `safeGetElement()`. Direct node generation via `createEl()` prevents XSS vulnerabilities.

## DevTools Verification
1. Open `index.html` via Live Server.
2. Open DevTools (**F12**):
   - **Application -> Local Storage:** Confirm `bloomrix_profile` restored into form inputs on reload.
   - **Network Tab:** Inspect `200 OK` JSON fetching.
   - **Console Tab:** Confirm clean execution with zero uncaught errors.