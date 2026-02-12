import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getConfig,
  updateConfig,
  resetToDefaults,
  onConfigChange,
  getDefaultConfig,
  clearListeners
} from './configManager.js';

describe('Configuration Manager Module', () => {
  beforeEach(() => {
    // Reset to defaults and clear listeners before each test
    clearListeners();
    resetToDefaults();
  });

  describe('getConfig', () => {
    it('should return default configuration on initialization', () => {
      const config = getConfig();
      
      expect(config.errorCode).toBe('522');
      expect(config.errorTitle).toBe('Connection Timed Out');
      expect(config.domainName).toBe('example.com');
    });

    it('should apply default domain when empty', () => {
      updateConfig({ domainName: '' });
      const config = getConfig();
      
      expect(config.domainName).toBe('example.com');
    });

    it('should auto-generate Ray ID when empty', () => {
      const config = getConfig();
      
      expect(config.rayId).toBeDefined();
      expect(config.rayId.length).toBe(16);
      expect(/^[0-9a-f]{16}$/.test(config.rayId)).toBe(true);
    });

    it('should auto-generate timestamp when empty', () => {
      const config = getConfig();
      
      expect(config.timestamp).toBeDefined();
      expect(config.timestamp.length).toBeGreaterThan(0);
    });

    it('should keep generated defaults stable across repeated reads', () => {
      const firstRead = getConfig();
      const secondRead = getConfig();

      expect(secondRead.rayId).toBe(firstRead.rayId);
      expect(secondRead.timestamp).toBe(firstRead.timestamp);
    });

    it('should apply default visitor IP when empty', () => {
      const config = getConfig();
      
      expect(config.visitorIp).toBe('Not available');
    });
  });

  describe('updateConfig', () => {
    it('should update configuration with partial values', () => {
      updateConfig({ domainName: 'mysite.com' });
      const config = getConfig();
      
      expect(config.domainName).toBe('mysite.com');
      expect(config.errorCode).toBe('522'); // Other values unchanged
    });

    it('should update error title and description when error code changes', () => {
      updateConfig({ errorCode: '503' });
      const config = getConfig();
      
      expect(config.errorCode).toBe('503');
      expect(config.errorTitle).toBe('Service Temporarily Unavailable');
    });

    it('should handle null or undefined partial gracefully', () => {
      const configBefore = getConfig();
      updateConfig(null);
      updateConfig(undefined);
      const configAfter = getConfig();
      
      expect(configAfter.errorCode).toBe(configBefore.errorCode);
    });

    it('should preserve custom Ray ID when provided', () => {
      const customRayId = 'abcd1234efgh5678';
      updateConfig({ rayId: customRayId });
      const config = getConfig();
      
      expect(config.rayId).toBe(customRayId);
    });

    it('should regenerate and persist Ray ID when empty value is provided', () => {
      updateConfig({ rayId: '' });
      const firstRead = getConfig();
      const secondRead = getConfig();

      expect(firstRead.rayId).toMatch(/^[0-9a-f]{16}$/);
      expect(secondRead.rayId).toBe(firstRead.rayId);
    });

    it('should update custom message', () => {
      updateConfig({ customMessage: 'Server maintenance in progress' });
      const config = getConfig();
      
      expect(config.customMessage).toBe('Server maintenance in progress');
    });

    it('should fall back to default error details when invalid error code is provided', () => {
      updateConfig({ errorCode: '999' });
      const config = getConfig();

      expect(config.errorCode).toBe('522');
      expect(config.errorTitle).toBe('Connection Timed Out');
      expect(config.errorDescription).toBe('Cloudflare could not negotiate a TCP handshake with the origin server.');
    });
  });

  describe('resetToDefaults', () => {
    it('should reset all values to defaults', () => {
      updateConfig({
        errorCode: '503',
        domainName: 'custom.com',
        customMessage: 'Custom message'
      });
      
      resetToDefaults();
      const config = getConfig();
      const defaults = getDefaultConfig();
      
      expect(config.errorCode).toBe(defaults.errorCode);
      expect(config.customMessage).toBe(defaults.customMessage);
    });
  });

  describe('onConfigChange', () => {
    it('should notify callback when config changes', () => {
      const callback = vi.fn();
      onConfigChange(callback);
      
      updateConfig({ domainName: 'newsite.com' });
      
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(expect.objectContaining({
        domainName: 'newsite.com'
      }));
    });

    it('should notify callback on reset', () => {
      const callback = vi.fn();
      onConfigChange(callback);
      
      resetToDefaults();
      
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should return unsubscribe function', () => {
      const callback = vi.fn();
      const unsubscribe = onConfigChange(callback);
      
      updateConfig({ domainName: 'test.com' });
      expect(callback).toHaveBeenCalledTimes(1);
      
      unsubscribe();
      updateConfig({ domainName: 'another.com' });
      expect(callback).toHaveBeenCalledTimes(1); // Still 1, not called again
    });

    it('should throw error for non-function callback', () => {
      expect(() => onConfigChange('not a function')).toThrow('Callback must be a function');
      expect(() => onConfigChange(null)).toThrow('Callback must be a function');
    });

    it('should support multiple listeners', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      
      onConfigChange(callback1);
      onConfigChange(callback2);
      
      updateConfig({ errorCode: '500' });
      
      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);
    });
  });

  describe('getDefaultConfig', () => {
    it('should return default configuration object', () => {
      const defaults = getDefaultConfig();
      
      expect(defaults.errorCode).toBe('522');
      expect(defaults.errorTitle).toBe('Connection Timed Out');
      expect(defaults.domainName).toBe('example.com');
      expect(defaults.customMessage).toBe('');
    });

    it('should return a copy, not the original', () => {
      const defaults1 = getDefaultConfig();
      defaults1.errorCode = '999';
      const defaults2 = getDefaultConfig();
      
      expect(defaults2.errorCode).toBe('522');
    });
  });
});
