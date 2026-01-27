/**
 * Main Scripts — bertrandbrands.com
 */

(function() {
    'use strict';

    // === Theme Detection ===
    // Respect system preference, allow manual override
    function initTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
        }
    }

    // === Smooth Scroll for Anchor Links ===
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // === Mobile Menu ===
    function initMobileMenu() {
        const menuBtn = document.querySelector('.header__menu-btn');
        const nav = document.querySelector('.header__nav');
        if (!menuBtn || !nav) return;

        menuBtn.addEventListener('click', () => {
            const isOpen = nav.classList.toggle('is-open');
            menuBtn.setAttribute('aria-expanded', isOpen);
        });
    }

    // === Initialize ===
    document.addEventListener('DOMContentLoaded', () => {
        initTheme();
        initSmoothScroll();
        initMobileMenu();
    });

})();
