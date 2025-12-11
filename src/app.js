/**
 * Main application entry point
 * Cloudflare Error Page Generator
 * 
 * Requirements: 1.1, 1.3, 2.3, 4.1, 6.2, 6.3, 8.2
 */

import { ERROR_CODES, getErrorByCode } from './config/errorCodes.js';
import { getConfig, updateConfig, onConfigChange, resetToDefaults } from './config/configManager.js';
import { generateRayId } from './generators/rayId.js';
import { generateHtml } from './generators/html.js';
import { copyToClipboard } from './utils/clipboard.js';
import { downloadHtml, generateFilename } from './utils/download.js';

// DOM Elements
let errorCodeSelect;
let domainNameInput;
let rayIdInput;
let customMessageInput;
let locationSelect;
let generateRayIdBtn;
let copyHtmlBtn;
let exportHtmlBtn;
let previewFrame;
let toast;

/**
 * Initialize DOM element references
 */
function initDomElements() {
  errorCodeSelect = document.getElementById('error-code');
  domainNameInput = document.getElementById('domain-name');
  rayIdInput = document.getElementById('ray-id');
  customMessageInput = document.getElementById('custom-message');
  locationSelect = document.getElementById('cf-location');
  generateRayIdBtn = document.getElementById('generate-ray-id');
  copyHtmlBtn = document.getElementById('copy-html');
  exportHtmlBtn = document.getElementById('export-html');
  previewFrame = document.getElementById('preview-frame');
  toast = document.getElementById('toast');
}

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - 'success' or 'error'
 */
function showToast(message, type = 'success') {
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}


/**
 * Update the preview iframe with generated HTML
 * @param {Object} config - Current configuration
 */
function updatePreview(config) {
  const html = generateHtml(config);
  
  // Write HTML to iframe
  const doc = previewFrame.contentDocument || previewFrame.contentWindow.document;
  doc.open();
  doc.write(html);
  doc.close();
}

/**
 * Populate error code dropdown from ERROR_CODES
 */
function populateErrorCodes() {
  errorCodeSelect.innerHTML = '';
  ERROR_CODES.forEach(error => {
    const option = document.createElement('option');
    option.value = error.code;
    option.textContent = `${error.code} - ${error.title}`;
    errorCodeSelect.appendChild(option);
  });
}

/**
 * Sync UI inputs with current config
 * @param {Object} config - Current configuration
 */
function syncUIWithConfig(config) {
  errorCodeSelect.value = config.errorCode;
  
  // Only update if different to avoid cursor jumping
  if (domainNameInput.value !== config.domainName && 
      document.activeElement !== domainNameInput) {
    domainNameInput.value = config.domainName === 'example.com' ? '' : config.domainName;
  }
  
  if (rayIdInput.value !== config.rayId && 
      document.activeElement !== rayIdInput) {
    rayIdInput.value = config.rayId;
  }
  
  if (customMessageInput.value !== config.customMessage && 
      document.activeElement !== customMessageInput) {
    customMessageInput.value = config.customMessage;
  }
  
  if (locationSelect && locationSelect.value !== config.location) {
    locationSelect.value = config.location || 'Frankfurt';
  }
}

/**
 * Handle error code selection change
 */
function handleErrorCodeChange() {
  updateConfig({ errorCode: errorCodeSelect.value });
}

/**
 * Handle domain name input change
 */
function handleDomainNameChange() {
  updateConfig({ domainName: domainNameInput.value || 'example.com' });
}

/**
 * Handle Ray ID input change
 */
function handleRayIdChange() {
  updateConfig({ rayId: rayIdInput.value });
}

/**
 * Handle custom message input change
 */
function handleCustomMessageChange() {
  updateConfig({ customMessage: customMessageInput.value });
}

/**
 * Handle location selection change
 */
function handleLocationChange() {
  updateConfig({ location: locationSelect.value });
}

/**
 * Handle generate Ray ID button click
 */
function handleGenerateRayId() {
  const newRayId = generateRayId();
  rayIdInput.value = newRayId;
  updateConfig({ rayId: newRayId });
  showToast('Ray ID 已生成', 'success');
}


/**
 * Handle copy HTML button click
 */
async function handleCopyHtml() {
  const config = getConfig();
  const html = generateHtml(config);
  
  const success = await copyToClipboard(html);
  
  if (success) {
    showToast('HTML 已复制到剪贴板', 'success');
  } else {
    showToast('复制失败，请手动复制', 'error');
  }
}

/**
 * Handle export HTML button click
 */
function handleExportHtml() {
  const config = getConfig();
  const html = generateHtml(config);
  const filename = generateFilename(config.errorCode);
  
  downloadHtml(html, filename);
  showToast(`已导出 ${filename}`, 'success');
}

/**
 * Bind event listeners to UI elements
 */
function bindEventListeners() {
  // Error code selection
  errorCodeSelect.addEventListener('change', handleErrorCodeChange);
  
  // Domain name input - update on input for real-time preview
  domainNameInput.addEventListener('input', handleDomainNameChange);
  
  // Ray ID input
  rayIdInput.addEventListener('input', handleRayIdChange);
  
  // Custom message input
  customMessageInput.addEventListener('input', handleCustomMessageChange);
  
  // Location selection
  if (locationSelect) {
    locationSelect.addEventListener('change', handleLocationChange);
  }
  
  // Generate Ray ID button
  generateRayIdBtn.addEventListener('click', handleGenerateRayId);
  
  // Copy HTML button
  copyHtmlBtn.addEventListener('click', handleCopyHtml);
  
  // Export HTML button
  exportHtmlBtn.addEventListener('click', handleExportHtml);
}

/**
 * Initialize the application
 */
function init() {
  // Initialize DOM references
  initDomElements();
  
  // Populate error code dropdown
  populateErrorCodes();
  
  // Bind event listeners
  bindEventListeners();
  
  // Subscribe to config changes for preview updates
  onConfigChange((config) => {
    updatePreview(config);
  });
  
  // Set default error code and trigger initial config
  const defaultConfig = getConfig();
  errorCodeSelect.value = defaultConfig.errorCode;
  
  // Generate initial Ray ID if empty
  if (!defaultConfig.rayId) {
    const initialRayId = generateRayId();
    updateConfig({ rayId: initialRayId });
  }
  
  // Sync UI with initial config
  syncUIWithConfig(getConfig());
  
  // Initial preview render
  updatePreview(getConfig());
  
  console.log('甩锅利器 - Cloudflare Error Page Generator initialized');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
