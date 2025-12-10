/**
 * Clipboard utility module for copying text to clipboard
 * Implements fallback for older browsers that don't support navigator.clipboard
 * 
 * Requirements: 6.1, 6.2, 6.3
 */

/**
 * Copies text to the clipboard
 * @param {string} text - The text to copy to clipboard
 * @returns {Promise<boolean>} - Promise resolving to true on success, false on failure
 */
export async function copyToClipboard(text) {
  // Try modern Clipboard API first
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      // Fall through to fallback method
    }
  }

  // Fallback for older browsers using execCommand
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    // Prevent scrolling to bottom of page
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  } catch (error) {
    return false;
  }
}
