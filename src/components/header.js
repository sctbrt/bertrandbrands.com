/**
 * Universal Header Component
 * Injects the standard Bertrand Brands header into any page.
 *
 * Usage: Add to your page before </body>:
 *   <script src="/components/header.js"></script>
 *
 * The header will be injected at the start of <body> automatically.
 */
(function() {
    'use strict';

    // Header HTML template
    const headerHTML = `
<header class="header">
    <div class="header__glass">
        <div class="header__inner">
            <a href="/?skip" class="header__logo">
                <img src="/assets/bertrand-brands-logomark.png" alt="" class="header__logo-icon">
                <img src="/assets/bertrand-brands-wordmark-light-2026.png" alt="Bertrand Brands" class="header__logo-text">
            </a>
            <button class="header__toggle" aria-label="Toggle menu" aria-expanded="false" aria-controls="mainNav">
                <span></span>
                <span></span>
                <span></span>
            </button>
            <nav class="header__nav" id="mainNav">
                <a href="/?skip#about" class="header__link">About</a>
                <a href="/?skip#process" class="header__link">How It Works</a>
                <div class="header__dropdown">
                    <a href="/?skip#services" class="header__link header__link--dropdown">
                        Services
                        <svg class="header__dropdown-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                    </a>
                    <div class="header__dropdown-menu">
                        <a href="/focus-studio" class="header__dropdown-item header__dropdown-item--violet">
                            <img src="/assets/bertrand-brands-logomark.png" alt="" class="header__dropdown-mark">
                            <span class="header__dropdown-label">Focus Studio</span>
                        </a>
                        <a href="/core-services" class="header__dropdown-item">
                            <img src="/assets/bertrand-brands-logomark.png" alt="" class="header__dropdown-mark">
                            <span class="header__dropdown-label">Core Systems</span>
                        </a>
                        <a href="/exploratory" class="header__dropdown-item header__dropdown-item--blue">
                            <img src="/assets/bertrand-brands-logomark.png" alt="" class="header__dropdown-mark">
                            <span class="header__dropdown-label">Exploratory</span>
                        </a>
                    </div>
                </div>
                <a href="/book" class="header__link header__link--cta">Book a Call</a>
                <span class="header__divider" aria-hidden="true"></span>
                <a href="https://clients.bertrandbrands.com" class="header__link header__link--portal">Client Portal</a>
            </nav>
        </div>
    </div>
</header>`;

    // Inject header at start of body
    function injectHeader() {
        // Check if header already exists
        if (document.querySelector('.header')) return;

        // Create temporary container and extract header
        const temp = document.createElement('div');
        temp.innerHTML = headerHTML.trim();
        const header = temp.firstChild;

        // Insert at start of body
        document.body.insertBefore(header, document.body.firstChild);

        // Initialize header functionality
        initMobileMenu();
        initAmbientLighting();
    }

    // Mobile menu toggle
    function initMobileMenu() {
        const toggle = document.querySelector('.header__toggle');
        const nav = document.querySelector('.header__nav');
        const header = document.querySelector('.header');
        if (!toggle || !nav) return;

        toggle.addEventListener('click', function() {
            const isOpen = nav.classList.toggle('is-open');
            toggle.classList.toggle('is-open', isOpen);
            toggle.setAttribute('aria-expanded', isOpen);
            if (header) header.classList.toggle('nav-open', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close menu when clicking a link
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('is-open');
                toggle.classList.remove('is-open');
                toggle.setAttribute('aria-expanded', 'false');
                if (header) header.classList.remove('nav-open');
                document.body.style.overflow = '';
            });
        });

        // Close on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && nav.classList.contains('is-open')) {
                nav.classList.remove('is-open');
                toggle.classList.remove('is-open');
                toggle.setAttribute('aria-expanded', 'false');
                if (header) header.classList.remove('nav-open');
                document.body.style.overflow = '';
                toggle.focus();
            }
        });
    }

    // Ambient header lighting animation (30fps throttled)
    function initAmbientLighting() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const header = document.querySelector('.header');
        const headerGlass = document.querySelector('.header__glass');
        if (!header || !headerGlass) return;

        // Enable lights immediately on sub-pages (no intro animation)
        header.classList.add('lights-on');

        let pos1 = 15, pos2 = 85, dir1 = 1, dir2 = -1;
        let lastFrame = 0;
        const FRAME_INTERVAL = 1000 / 30; // 30fps

        function animateLights(timestamp) {
            if (timestamp - lastFrame < FRAME_INTERVAL) {
                requestAnimationFrame(animateLights);
                return;
            }
            lastFrame = timestamp;

            pos1 += dir1 * 0.06;
            pos2 += dir2 * 0.05;

            if (pos1 > 35 || pos1 < 10) dir1 *= -1;
            if (pos2 > 90 || pos2 < 60) dir2 *= -1;

            headerGlass.style.setProperty('--orange-pos-1', pos1 + '%');
            headerGlass.style.setProperty('--orange-pos-2', pos2 + '%');
            requestAnimationFrame(animateLights);
        }
        requestAnimationFrame(animateLights);
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectHeader);
    } else {
        injectHeader();
    }
})();
