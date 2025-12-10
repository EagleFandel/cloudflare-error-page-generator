/**
 * File download utility module for exporting HTML files
 * Uses Blob API to create downloadable files
 * 
 * Requirements: 5.4
 */

/**
 * Downloads HTML content as a file
 * @param {string} html - The HTML content to download
 * @param {string} filename - The filename for the download
 */
export function downloadHtml(html, filename) {
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates a filename for the error page based on error code
 * @param {string} errorCode - The error code (e.g., "502")
 * @returns {string} - The generated filename (e.g., "cloudflare-error-502.html")
 */
export function generateFilename(errorCode) {
  return `cloudflare-error-${errorCode}.html`;
}
