// Announcement Banner — Dismissible transition notice
// Stored in localStorage to persist across sessions

(function () {
  const STORAGE_KEY = 'bb_announcement_dismissed_v1';

  // Don't show if already dismissed
  if (localStorage.getItem(STORAGE_KEY)) return;

  // Inject styles
  const style = document.createElement('style');
  style.textContent = `
    .announcement-banner {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1060;
      transform: translateY(-100%);
      opacity: 0;
      transition: transform var(--duration-fast) var(--ease-out),
                  opacity var(--duration-fast) var(--ease-out);
    }
    .announcement-banner.is-visible {
      transform: translateY(0);
      opacity: 1;
    }
    .announcement-banner__inner {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-3);
      padding: var(--space-2) var(--space-4);
      background: linear-gradient(135deg, rgba(217, 119, 6, 0.12), rgba(139, 92, 246, 0.08));
      border-bottom: 1px solid rgba(217, 119, 6, 0.2);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
    }
    .announcement-banner__text {
      margin: 0;
      font-family: var(--font-body);
      font-size: var(--text-sm);
      font-weight: var(--font-normal);
      color: var(--text-muted);
      text-align: center;
      line-height: var(--leading-normal);
    }
    .announcement-banner__text strong {
      color: var(--text);
      font-weight: var(--font-medium);
    }
    .announcement-banner__link {
      color: var(--accent);
      text-decoration: none;
      font-weight: var(--font-medium);
      transition: color var(--duration-instant) var(--ease-out);
    }
    .announcement-banner__link:hover {
      color: var(--text);
    }
    .announcement-banner__close {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      padding: 0;
      border: none;
      border-radius: 4px;
      background: transparent;
      color: var(--text-subtle);
      font-size: 18px;
      line-height: 1;
      cursor: pointer;
      transition: color var(--duration-instant) var(--ease-out),
                  background var(--duration-instant) var(--ease-out);
    }
    .announcement-banner__close:hover {
      color: var(--text);
      background: rgba(255, 255, 255, 0.06);
    }
    @media (max-width: 600px) {
      .announcement-banner__inner {
        padding: var(--space-2) var(--space-3);
        gap: var(--space-2);
      }
      .announcement-banner__text {
        font-size: var(--text-xs);
      }
    }
  `;
  document.head.appendChild(style);

  // Create banner element
  const banner = document.createElement('div');
  banner.className = 'announcement-banner';
  banner.id = 'announcementBanner';
  banner.setAttribute('role', 'status');
  banner.innerHTML = `
    <div class="announcement-banner__inner">
      <p class="announcement-banner__text">
        <strong>Bertrand Brands</strong> is now part of
        <a href="https://bertrandgroup.ca" class="announcement-banner__link">Bertrand Group</a>
        — same team, broader vision.
      </p>
      <button class="announcement-banner__close" aria-label="Dismiss announcement">&times;</button>
    </div>
  `;

  // Insert at top of body
  document.body.prepend(banner);

  // Dismiss handler
  banner.querySelector('.announcement-banner__close').addEventListener('click', function () {
    banner.classList.remove('is-visible');
    localStorage.setItem(STORAGE_KEY, '1');
    // Remove from DOM after transition
    setTimeout(function () { banner.remove(); }, 350);
  });

  // Animate in after a short delay (let the page settle)
  requestAnimationFrame(function () {
    setTimeout(function () { banner.classList.add('is-visible'); }, 600);
  });
})();
