/**
 * Universal Visitor Notification
 * Sends a silent Pushover notification on page load with page path and referrer.
 *
 * Usage: Add to your page before </body>:
 *   <script src="/components/visitor-notify.js"></script>
 */
(function() {
    'use strict';

    // Don't notify for localhost/dev
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') return;

    // Don't double-fire if already sent this page load
    if (window.__bbVisitorNotified) return;
    window.__bbVisitorNotified = true;

    fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            type: 'visitor',
            page: location.pathname,
            referrer: document.referrer || null
        })
    }).catch(function() {
        // Silently fail - visitor tracking is non-essential
    });
})();
