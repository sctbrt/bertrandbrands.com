// Shared HTML utilities for API endpoints

/**
 * Escape HTML entities for safe interpolation
 */
export function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Generate a styled error page HTML
 * @param {string} title - Error title
 * @param {string} message - Error message
 * @param {Object} [options]
 * @param {string} [options.backHref='/#services'] - Back link URL
 * @param {string} [options.backLabel='Back to Services'] - Back link text
 */
export function errorPageHtml(title, message, { backHref = '/#services', backLabel = 'Back to Services' } = {}) {
  title = escapeHtml(title);
  message = escapeHtml(message);
  return `
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — Bertrand Brands</title>
  <meta name="robots" content="noindex">
  <link rel="icon" type="image/png" href="/assets/favicon.png">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0a0a0a;
      color: #ffffff;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .container {
      max-width: 420px;
      text-align: center;
    }
    h1 {
      font-size: 1.5rem;
      font-weight: 500;
      margin-bottom: 16px;
      color: #ffffff;
    }
    p {
      font-size: 0.95rem;
      color: #999999;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    a {
      display: inline-block;
      background: transparent;
      border: 1px solid #333333;
      color: #ffffff;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 6px;
      font-size: 0.9rem;
      transition: border-color 0.2s, background 0.2s;
    }
    a:hover {
      border-color: #555555;
      background: rgba(255, 255, 255, 0.05);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>${title}</h1>
    <p>${message}</p>
    <a href="${escapeHtml(backHref)}">${escapeHtml(backLabel)}</a>
  </div>
</body>
</html>
  `.trim();
}
