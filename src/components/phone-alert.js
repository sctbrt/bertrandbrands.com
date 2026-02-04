/**
 * Phone Unavailable Alert
 * Injects a dismissible alert bar at the bottom of the viewport
 * and ghosts all phone-related elements on the page.
 *
 * Usage: Add to your page before </body>:
 *   <script src="/components/phone-alert.js"></script>
 *
 * Remove this script include from all pages when phone is restored.
 */
(function() {
    'use strict';

    var DISMISS_KEY = 'bb_phone_alert_dismissed';

    // Don't show if already dismissed this session
    if (sessionStorage.getItem(DISMISS_KEY)) {
        ghostPhoneElements();
        return;
    }

    // Create and inject alert bar
    var alert = document.createElement('div');
    alert.className = 'site-alert';
    alert.setAttribute('role', 'status');
    alert.innerHTML =
        '<p class="site-alert__text">Phone intake is temporarily unavailable. ' +
        'Please use our <a href="/intake/exploratory">online intake form</a> or ' +
        '<a href="mailto:hello@bertrandbrands.com">email us</a> instead.</p>' +
        '<button class="site-alert__close" aria-label="Dismiss alert">&times;</button>';

    document.body.appendChild(alert);

    // Dismiss handler
    alert.querySelector('.site-alert__close').addEventListener('click', function() {
        alert.classList.add('is-hidden');
        sessionStorage.setItem(DISMISS_KEY, '1');
    });

    // Ghost all phone elements on the page
    ghostPhoneElements();

    function ghostPhoneElements() {
        // Ghost all tel: links by wrapping parent elements or dimming directly
        var telLinks = document.querySelectorAll('a[href^="tel:"]');
        for (var i = 0; i < telLinks.length; i++) {
            var link = telLinks[i];

            // Check if parent is already marked
            if (link.closest('.phone-unavailable')) continue;

            // Ghost the floating phone button
            if (link.classList.contains('floating-phone')) {
                link.classList.add('phone-unavailable');
                continue;
            }

            // Ghost footer phone paragraphs
            var parentP = link.closest('p');
            if (parentP && (
                parentP.classList.contains('service-footer__phone') ||
                parentP.classList.contains('book-footer__phone') ||
                parentP.classList.contains('exp-footer__phone') ||
                parentP.classList.contains('cs-footer__phone') ||
                parentP.classList.contains('fs-footer__phone') ||
                parentP.classList.contains('ad-footer__phone') ||
                parentP.classList.contains('footer__link--phone') ||
                link.classList.contains('footer__link--phone')
            )) {
                parentP.classList.add('phone-unavailable');
                continue;
            }

            // Ghost footer links with phone class
            if (link.classList.contains('footer__link--phone')) {
                link.classList.add('phone-unavailable');
                continue;
            }

            // Ghost intake cards containing phone
            var card = link.closest('.intake-card');
            if (card && !card.classList.contains('phone-unavailable')) {
                card.classList.add('phone-unavailable');
                // Add label if not already present
                if (!card.querySelector('.phone-unavailable__label')) {
                    var footer = card.querySelector('.intake-card__footer');
                    if (footer) {
                        var label = document.createElement('span');
                        label.className = 'phone-unavailable__label';
                        label.textContent = 'Temporarily unavailable';
                        footer.appendChild(label);
                    }
                }
                continue;
            }

            // Ghost inline phone notes (e.g., exploratory page)
            if (parentP && parentP.classList.contains('exp-primary__note')) {
                parentP.classList.add('phone-unavailable');
                continue;
            }

            // Fallback: ghost the link itself
            link.style.opacity = '0.35';
            link.style.pointerEvents = 'none';
        }
    }
})();
