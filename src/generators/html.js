/**
 * HTML Generator Module
 * Generates Cloudflare-style error pages as complete standalone HTML
 */

import { getErrorByCode, ERROR_CODES } from '../config/errorCodes.js';

/**
 * Generate inline CSS styles for the error page (Cloudflare authentic style)
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
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: #ffffff;
      color: #333;
      font-size: 14px;
      line-height: 1.5;
    }
    
    .cf-wrapper {
      max-width: 1100px;
      margin: 0 auto;
      padding: 20px;
    }
    
    /* Header Section */
    .cf-header {
      padding: 15px 0;
    }
    
    .cf-error-title {
      font-size: 42px;
      font-weight: 300;
      color: #333;
      display: inline;
    }
    
    .cf-header-meta {
      display: inline;
      font-size: 12px;
      color: #666;
      margin-left: 15px;
      font-family: Monaco, Menlo, Consolas, monospace;
    }
    
    .cf-error-subtitle {
      font-size: 24px;
      font-weight: 300;
      color: #666;
      margin-top: 5px;
    }
    
    /* Status Diagram Section */
    .cf-status-section {
      background: #e8e8e8;
      padding: 30px 20px;
      margin: 20px 0;
      position: relative;
    }
    
    .cf-status-diagram {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      gap: 0;
      max-width: 600px;
      margin: 0 auto;
      position: relative;
    }
    
    .cf-status-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
      position: relative;
      z-index: 2;
    }
    
    .cf-status-icon {
      width: 80px;
      height: 80px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .cf-status-badge {
      position: absolute;
      bottom: 0;
      right: 5px;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: bold;
      color: white;
    }
    
    .cf-status-badge.success {
      background: #2ecc40;
    }
    
    .cf-status-badge.error {
      background: #dc3545;
    }
    
    .cf-status-location {
      font-size: 12px;
      color: #666;
      margin-top: 8px;
      height: 16px;
    }
    
    .cf-status-label {
      font-size: 14px;
      color: #666;
      margin-top: 4px;
    }
    
    .cf-status-state {
      font-size: 14px;
      font-weight: 500;
      margin-top: 2px;
    }
    
    .cf-status-state.working {
      color: #2ecc40;
    }
    
    .cf-status-state.error {
      color: #dc3545;
    }
    
    /* Connection lines */
    .cf-connection-line {
      position: absolute;
      top: 40px;
      height: 3px;
      background: #999;
      z-index: 1;
    }
    
    .cf-line-1 {
      left: calc(16.67% + 40px);
      width: calc(33.33% - 80px);
    }
    
    .cf-line-2 {
      left: calc(50% + 40px);
      width: calc(33.33% - 80px);
    }
    
    /* Browser Icon */
    .browser-icon {
      width: 60px;
      height: 50px;
    }
    
    /* Cloud Icon */
    .cloud-icon {
      width: 70px;
      height: 50px;
    }
    
    /* Server Icon */
    .server-icon {
      width: 50px;
      height: 55px;
    }
    
    /* Content Section */
    .cf-content {
      display: flex;
      gap: 40px;
      padding: 30px 0;
    }
    
    .cf-content-left {
      flex: 1;
    }
    
    .cf-content-right {
      flex: 1;
    }
    
    .cf-content h2 {
      font-size: 21px;
      font-weight: 400;
      color: #333;
      margin-bottom: 15px;
    }
    
    .cf-content p {
      font-size: 14px;
      line-height: 1.7;
      color: #555;
      margin-bottom: 15px;
    }
    
    .cf-content strong {
      font-weight: 600;
      color: #333;
    }
    
    .cf-content a {
      color: #0051c3;
      text-decoration: none;
    }
    
    .cf-content a:hover {
      text-decoration: underline;
    }
    
    .cf-custom-message {
      background: #fff8e6;
      border-left: 4px solid #f38020;
      padding: 12px 15px;
      margin-top: 15px;
      font-style: italic;
      color: #666;
    }
    
    /* Responsive */
    @media (max-width: 768px) {
      .cf-error-title {
        font-size: 32px;
      }
      
      .cf-header-meta {
        display: block;
        margin-left: 0;
        margin-top: 10px;
      }
      
      .cf-content {
        flex-direction: column;
        gap: 20px;
      }
      
      .cf-status-diagram {
        flex-direction: column;
        gap: 20px;
      }
      
      .cf-connection-line {
        display: none;
      }
    }
  `;
}

/**
 * Browser icon SVG
 */
function getBrowserIcon() {
  return `<svg class="browser-icon" viewBox="0 0 60 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="56" height="46" rx="3" fill="#d0d0d0" stroke="#999" stroke-width="2"/>
    <rect x="2" y="2" width="56" height="12" rx="3" fill="#bbb"/>
    <circle cx="12" cy="8" r="2" fill="#888"/>
    <circle cx="20" cy="8" r="2" fill="#888"/>
    <circle cx="28" cy="8" r="2" fill="#888"/>
    <rect x="8" y="20" width="44" height="4" fill="#bbb"/>
    <rect x="8" y="28" width="30" height="4" fill="#bbb"/>
    <rect x="8" y="36" width="38" height="4" fill="#bbb"/>
  </svg>`;
}

/**
 * Cloud icon SVG
 */
function getCloudIcon() {
  return `<svg class="cloud-icon" viewBox="0 0 70 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M55 42H18c-7.18 0-13-5.82-13-13 0-6.08 4.18-11.18 9.82-12.6C16.28 9.34 22.56 4 30 4c8.28 0 15.12 6.08 16.38 14.02C52.86 19.18 58 24.9 58 31.8 58 37.42 53.42 42 47.8 42H55c2.76 0 5-2.24 5-5s-2.24-5-5-5h-2" fill="#999"/>
    <path d="M55 42H18c-7.18 0-13-5.82-13-13 0-6.08 4.18-11.18 9.82-12.6C16.28 9.34 22.56 4 30 4c8.28 0 15.12 6.08 16.38 14.02C52.86 19.18 58 24.9 58 31.8 58 37.42 53.42 42 47.8 42" stroke="#777" stroke-width="2" fill="none"/>
  </svg>`;
}

/**
 * Server/Host icon SVG
 */
function getServerIcon() {
  return `<svg class="server-icon" viewBox="0 0 50 55" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="30" width="40" height="22" rx="2" fill="#999" stroke="#777" stroke-width="2"/>
    <rect x="10" y="35" width="30" height="4" fill="#666"/>
    <rect x="10" y="42" width="20" height="4" fill="#666"/>
    <ellipse cx="25" cy="15" rx="18" ry="10" fill="#bbb" stroke="#999" stroke-width="2"/>
    <path d="M7 15v15M43 15v15" stroke="#999" stroke-width="2"/>
  </svg>`;
}

/**
 * Checkmark SVG
 */
function getCheckmark() {
  return `<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2 7L5.5 10.5L12 3.5" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

/**
 * X mark SVG
 */
function getXmark() {
  return `<svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M2 2L10 10M10 2L2 10" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`;
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
 * Format timestamp to Cloudflare style
 * @param {string} timestamp - ISO timestamp
 * @returns {string} Formatted time string
 */
function formatTimestamp(timestamp) {
  try {
    const date = new Date(timestamp);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds} UTC`;
  } catch {
    return new Date().toISOString().split('T')[1].split('.')[0] + ' UTC';
  }
}

/**
 * Generate a complete Cloudflare-style error page HTML
 * @param {Object} config - Configuration object
 * @param {string} config.errorCode - Error code (e.g., "502")
 * @param {string} [config.domainName] - Domain name to display
 * @param {string} [config.rayId] - Ray ID for the request
 * @param {string} [config.timestamp] - Timestamp string
 * @param {string} [config.customMessage] - Custom message to display
 * @param {string} [config.location] - Cloudflare location (e.g., "Frankfurt")
 * @returns {string} Complete HTML document
 */
export function generateHtml(config) {
  const {
    errorCode = '522',
    domainName = 'example.com',
    rayId = '',
    timestamp = new Date().toISOString(),
    customMessage = '',
    location = 'Frankfurt'
  } = config || {};

  // Get error details from error codes
  const errorDetails = getErrorByCode(errorCode) || getErrorByCode('522');
  
  const safeErrorCode = escapeHtml(errorDetails.code);
  const safeErrorTitle = escapeHtml(errorDetails.title);
  const safeDomainName = escapeHtml(domainName || 'example.com');
  const safeRayId = escapeHtml(rayId || 'Not available');
  const safeLocation = escapeHtml(location);
  const formattedTime = formatTimestamp(timestamp);
  const safeCustomMessage = escapeHtml(customMessage);

  const customMessageHtml = safeCustomMessage 
    ? `<div class="cf-custom-message">${safeCustomMessage}</div>` 
    : '';

  // Determine status based on error code
  const isHostError = ['520', '521', '522', '523', '524', '525', '526', '527'].includes(errorCode);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Error ${safeErrorCode} | ${safeDomainName}</title>
  <style>${generateStyles()}</style>
</head>
<body>
  <div class="cf-wrapper">
    <!-- Header -->
    <header class="cf-header">
      <h1 class="cf-error-title">Error ${safeErrorCode}</h1>
      <span class="cf-header-meta">Ray ID: ${safeRayId} • ${formattedTime}</span>
      <p class="cf-error-subtitle">${safeErrorTitle}</p>
    </header>
    
    <!-- Status Diagram -->
    <section class="cf-status-section">
      <div class="cf-status-diagram">
        <div class="cf-connection-line cf-line-1"></div>
        <div class="cf-connection-line cf-line-2"></div>
        
        <!-- Browser -->
        <div class="cf-status-item">
          <div class="cf-status-icon">
            ${getBrowserIcon()}
            <span class="cf-status-badge success">${getCheckmark()}</span>
          </div>
          <span class="cf-status-location">You</span>
          <span class="cf-status-label">Browser</span>
          <span class="cf-status-state working">Working</span>
        </div>
        
        <!-- Cloudflare -->
        <div class="cf-status-item">
          <div class="cf-status-icon">
            ${getCloudIcon()}
            <span class="cf-status-badge success">${getCheckmark()}</span>
          </div>
          <span class="cf-status-location">${safeLocation}</span>
          <span class="cf-status-label">Cloudflare</span>
          <span class="cf-status-state working">Working</span>
        </div>
        
        <!-- Host -->
        <div class="cf-status-item">
          <div class="cf-status-icon">
            ${getServerIcon()}
            <span class="cf-status-badge ${isHostError ? 'error' : 'success'}">${isHostError ? getXmark() : getCheckmark()}</span>
          </div>
          <span class="cf-status-location">${safeDomainName}</span>
          <span class="cf-status-label">Host</span>
          <span class="cf-status-state ${isHostError ? 'error' : 'working'}">${isHostError ? 'Error' : 'Working'}</span>
        </div>
      </div>
    </section>
    
    <!-- Content -->
    <main class="cf-content">
      <div class="cf-content-left">
        <h2>What happened?</h2>
        <p>${escapeHtml(errorDetails.whatHappened)}</p>
        ${customMessageHtml}
      </div>
      
      <div class="cf-content-right">
        <h2>What can I do?</h2>
        <p><strong>If you're a visitor of this website:</strong></p>
        <p>Please try again in a few minutes.</p>
        <p><strong>If you're the owner of this website:</strong></p>
        <p>${escapeHtml(errorDetails.whatCanIDo)} <a href="https://support.cloudflare.com/hc/en-us/articles/200171906" target="_blank">Additional troubleshooting information</a>.</p>
      </div>
    </main>
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
