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
  errorCode: '502',
  errorTitle: 'Bad Gateway',
  errorDescription: 'The server received an invalid response from the upstream server.',
  domainName: 'example.com',
  rayId: '',
  visitorIp: '',
  timestamp: '',
  customMessage: ''
};

/**
 * Current configuration state
 */
let currentConfig = { ...DEFAULT_CONFIG };

/**
 * List of change listeners
 */
let changeListeners = [];

/**
 * Apply default values for empty fields
 * @param {Object} config - Configuration object
 * @returns {Object} Configuration with defaults applied
 */
function applyDefaults(config) {
  const result = { ...config };
  
  // Apply default domain if empty
  if (!result.domainName || result.domainName.trim() === '') {
    result.domainName = DEFAULT_CONFIG.domainName;
  }
  
  // Generate Ray ID if empty
  if (!result.rayId || result.rayId.trim() === '') {
    result.rayId = generateRayId();
  }
  
  // Generate timestamp if empty
  if (!result.timestamp || result.timestamp.trim() === '') {
    result.timestamp = new Date().toISOString();
  }
  
  // Apply default visitor IP placeholder if empty
  if (!result.visitorIp || result.visitorIp.trim() === '') {
    result.visitorIp = 'Not available';
  }
  
  return result;
}

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
 * @returns {Object} Current configuration with defaults applied
 */
export function getConfig() {
  return applyDefaults({ ...currentConfig });
}

/**
 * Update configuration with partial values
 * @param {Object} partial - Partial configuration to merge
 */
export function updateConfig(partial) {
  if (!partial || typeof partial !== 'object') {
    return;
  }
  
  // If error code is being updated, also update title and description
  if (partial.errorCode && partial.errorCode !== currentConfig.errorCode) {
    const errorDetails = getErrorByCode(partial.errorCode);
    if (errorDetails) {
      partial.errorTitle = errorDetails.title;
      partial.errorDescription = errorDetails.description;
    }
  }
  
  currentConfig = { ...currentConfig, ...partial };
  notifyListeners(getConfig());
}

/**
 * Reset configuration to default values
 */
export function resetToDefaults() {
  currentConfig = { ...DEFAULT_CONFIG };
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
