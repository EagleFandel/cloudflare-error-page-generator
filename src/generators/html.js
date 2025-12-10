/**
 * HTML Generator Module
 * Generates Cloudflare-style error pages as complete standalone HTML
 */

import { getErrorByCode, ERROR_CODES } from '../config/errorCodes.js';

/**
 * Cloudflare logo SVG (simplified version)
 */
const CLOUDFLARE_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 44" class="cf-logo">
  <path fill="#f38020" d="M40.4 35.2l2.7-9.4c.5-1.7.3-3.3-.6-4.4-.8-1-2.1-1.6-3.6-1.7l-24.4-.3c-.2 0-.4-.1-.5-.2-.1-.2-.1-.3 0-.5.1-.2.3-.4.5-.4l24.6-.3c3.5-.2 7.3-3.1 8.5-6.6l1.5-4.5c.1-.2.1-.4 0-.5-1.8-8.1-9-14.1-17.6-14.1-9.8 0-17.9 7.3-19.1 16.8-.1 0-.2 0-.3 0-4.7 0-8.5 3.8-8.5 8.5 0 .7.1 1.4.2 2.1.1.3-.1.6-.4.6H1.1c-.3 0-.6.2-.7.5l-2.7 9.4c-.5 1.7-.3 3.3.6 4.4.8 1 2.1 1.6 3.6 1.7l35.8.3c.2 0 .4.1.5.2.1.2.1.3 0 .5-.1.2-.3.4-.5.4z"/>
  <path fill="#faae40" d="M45.3 20.4l-1.2-4.1c-.1-.2-.3-.4-.5-.4-.2 0-.5.1-.6.3l-2.1 2.9c-.8 1.1-2.4 2-3.8 2l-24.4.3c-.2 0-.4.1-.5.2-.1.2-.1.3 0 .5.1.2.3.4.5.4l24.6.3c3.5.2 6.5 3.1 6.5 6.6v.5c0 .3.2.5.5.5h3.3c.3 0 .5-.2.6-.5.5-3.4-.1-6.8-2.9-9.5z"/>
</svg>`;

/**
 * Generate inline CSS styles for the error page
 * @returns {string} CSS styles
 */
function generateStyles() {
  return `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif;
      background-color: #1a1a2e;
      color: #ffffff;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    
    .cf-error-page {
      flex: 1;
      display: flex;
      flex-direction: column;
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 20px;
      width: 100%;
    }
    
    .cf-header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 30px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .cf-logo {
      width: 130px;
      height: 44px;
      margin-bottom: 20px;
    }
    
    .cf-error-code {
      font-size: 120px;
      font-weight: 700;
      color: #f38020;
      line-height: 1;
      margin-bottom: 10px;
    }
    
    .cf-error-title {
      font-size: 28px;
      font-weight: 600;
      color: #ffffff;
      margin-bottom: 10px;
    }
    
    .cf-domain {
      font-size: 18px;
      color: #a0a0a0;
    }
    
    .cf-content {
      flex: 1;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-bottom: 40px;
    }
    
    .cf-section {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      padding: 30px;
      border-left: 4px solid #f38020;
    }
    
    .cf-section h3 {
      font-size: 20px;
      font-weight: 600;
      color: #f38020;
      margin-bottom: 15px;
    }
    
    .cf-section p {
      font-size: 16px;
      line-height: 1.6;
      color: #d0d0d0;
    }
    
    .cf-custom-message {
      background: rgba(243, 128, 32, 0.1);
      border: 1px solid rgba(243, 128, 32, 0.3);
      border-radius: 4px;
      padding: 15px;
      margin-top: 15px;
      font-style: italic;
    }
    
    .cf-footer {
      text-align: center;
      padding-top: 30px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      color: #808080;
      font-size: 14px;
    }
    
    .cf-footer p {
      margin: 5px 0;
    }
    
    .cf-footer .cf-ray-id {
      font-family: monospace;
      color: #f38020;
    }
    
    @media (max-width: 768px) {
      .cf-content {
        grid-template-columns: 1fr;
        gap: 20px;
      }
      
      .cf-error-code {
        font-size: 80px;
      }
      
      .cf-error-title {
        font-size: 22px;
      }
      
      .cf-section {
        padding: 20px;
      }
    }
  `;
}


/**
 * Escape HTML special characters to prevent XSS
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Generate a complete Cloudflare-style error page HTML
 * @param {Object} config - Configuration object
 * @param {string} config.errorCode - Error code (e.g., "502")
 * @param {string} [config.domainName] - Domain name to display
 * @param {string} [config.rayId] - Ray ID for the request
 * @param {string} [config.visitorIp] - Visitor IP address
 * @param {string} [config.timestamp] - Timestamp string
 * @param {string} [config.customMessage] - Custom message to display
 * @returns {string} Complete HTML document
 */
export function generateHtml(config) {
  const {
    errorCode = '500',
    domainName = 'example.com',
    rayId = '',
    visitorIp = '',
    timestamp = new Date().toISOString(),
    customMessage = ''
  } = config || {};

  // Get error details from error codes
  const errorDetails = getErrorByCode(errorCode) || getErrorByCode('500');
  
  const safeErrorCode = escapeHtml(errorDetails.code);
  const safeErrorTitle = escapeHtml(errorDetails.title);
  const safeDomainName = escapeHtml(domainName || 'example.com');
  const safeRayId = escapeHtml(rayId || 'Not available');
  const safeVisitorIp = escapeHtml(visitorIp || 'Not available');
  const safeTimestamp = escapeHtml(timestamp);
  const safeWhatHappened = escapeHtml(errorDetails.whatHappened);
  const safeWhatCanIDo = escapeHtml(errorDetails.whatCanIDo);
  const safeCustomMessage = escapeHtml(customMessage);

  const customMessageHtml = safeCustomMessage 
    ? `<div class="cf-custom-message">${safeCustomMessage}</div>` 
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeErrorCode} | ${safeDomainName}</title>
  <style>${generateStyles()}</style>
</head>
<body>
  <div class="cf-error-page">
    <header class="cf-header">
      ${CLOUDFLARE_LOGO_SVG}
      <div class="cf-error-code">${safeErrorCode}</div>
      <h1 class="cf-error-title">${safeErrorTitle}</h1>
      <p class="cf-domain">${safeDomainName}</p>
    </header>
    
    <main class="cf-content">
      <section class="cf-section">
        <h3>What happened?</h3>
        <p>${safeWhatHappened}</p>
        ${customMessageHtml}
      </section>
      
      <section class="cf-section">
        <h3>What can I do?</h3>
        <p>${safeWhatCanIDo}</p>
      </section>
    </main>
    
    <footer class="cf-footer">
      <p>Ray ID: <span class="cf-ray-id">${safeRayId}</span></p>
      <p>Your IP: ${safeVisitorIp}</p>
      <p>${safeTimestamp}</p>
    </footer>
  </div>
</body>
</html>`;
}

/**
 * Generate a preview HTML (same as full HTML for this implementation)
 * @param {Object} config - Configuration object
 * @returns {string} Complete HTML document for preview
 */
export function generatePreview(config) {
  return generateHtml(config);
}
