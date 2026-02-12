/**
 * Configuration Manager Module
 * Manages error page configuration state with reactive updates
 */

import { generateRayId } from '../generators/rayId.js';
import { getErrorByCode } from './errorCodes.js';

/**
 * Default configuration values
 */
const DEFAULT_CONFIG = {
  errorCode: '522',
  errorTitle: 'Connection Timed Out',
  errorDescription: 'Cloudflare could not negotiate a TCP handshake with the origin server.',
  domainName: 'example.com',
  rayId: '',
  visitorIp: '',
  timestamp: '',
  customMessage: '',
  location: 'Frankfurt'
};

/**
 * Normalize configuration values and ensure consistent defaults
 * @param {Object} config - Configuration object
 * @returns {Object} Normalized configuration
 */
function normalizeConfig(config) {
  const result = { ...config };
  const fallbackError = getErrorByCode(DEFAULT_CONFIG.errorCode) || {
    code: DEFAULT_CONFIG.errorCode,
    title: DEFAULT_CONFIG.errorTitle,
    description: DEFAULT_CONFIG.errorDescription
  };

  const requestedError = typeof result.errorCode === 'string' ? getErrorByCode(result.errorCode) : undefined;
  const finalError = requestedError || fallbackError;

  result.errorCode = finalError.code;
  result.errorTitle = finalError.title;
  result.errorDescription = finalError.description;

  if (typeof result.domainName !== 'string' || result.domainName.trim() === '') {
    result.domainName = DEFAULT_CONFIG.domainName;
  }

  if (typeof result.rayId !== 'string' || result.rayId.trim() === '') {
    result.rayId = generateRayId();
  }

  if (typeof result.timestamp !== 'string' || result.timestamp.trim() === '') {
    result.timestamp = new Date().toISOString();
  }

  if (typeof result.visitorIp !== 'string' || result.visitorIp.trim() === '') {
    result.visitorIp = 'Not available';
  }

  if (typeof result.customMessage !== 'string') {
    result.customMessage = '';
  }

  if (typeof result.location !== 'string' || result.location.trim() === '') {
    result.location = DEFAULT_CONFIG.location;
  }

  return result;
}

/**
 * Current configuration state
 */
let currentConfig = normalizeConfig(DEFAULT_CONFIG);

/**
 * List of change listeners
 */
let changeListeners = [];

/**
 * Notify all registered listeners of config change
 * @param {Object} config - The updated configuration
 */
function notifyListeners(config) {
  changeListeners.forEach(callback => {
    try {
      callback(config);
    } catch (error) {
      console.error('Error in config change listener:', error);
    }
  });
}

/**
 * Get the current configuration
 * @returns {Object} Current normalized configuration
 */
export function getConfig() {
  return { ...currentConfig };
}

/**
 * Update configuration with partial values
 * @param {Object} partial - Partial configuration to merge
 */
export function updateConfig(partial) {
  if (!partial || typeof partial !== 'object' || Array.isArray(partial)) {
    return;
  }

  currentConfig = normalizeConfig({ ...currentConfig, ...partial });
  notifyListeners(getConfig());
}

/**
 * Reset configuration to default values
 */
export function resetToDefaults() {
  currentConfig = normalizeConfig(DEFAULT_CONFIG);
  notifyListeners(getConfig());
}

/**
 * Register a callback to be notified when configuration changes
 * @param {Function} callback - Function to call with updated config
 * @returns {Function} Unsubscribe function
 */
export function onConfigChange(callback) {
  if (typeof callback !== 'function') {
    throw new Error('Callback must be a function');
  }
  
  changeListeners.push(callback);
  
  // Return unsubscribe function
  return () => {
    changeListeners = changeListeners.filter(cb => cb !== callback);
  };
}

/**
 * Get the default configuration (for reference)
 * @returns {Object} Default configuration object
 */
export function getDefaultConfig() {
  return { ...DEFAULT_CONFIG };
}

/**
 * Clear all change listeners (useful for testing)
 */
export function clearListeners() {
  changeListeners = [];
}
