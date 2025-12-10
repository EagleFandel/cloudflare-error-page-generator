/**
 * Ray ID Generator Module
 * Generates and validates Cloudflare-style Ray IDs
 */

/**
 * Generates a random 16-character hexadecimal Ray ID
 * @returns {string} A 16-character lowercase hexadecimal string
 */
export function generateRayId() {
  const hexChars = '0123456789abcdef';
  let rayId = '';
  for (let i = 0; i < 16; i++) {
    rayId += hexChars[Math.floor(Math.random() * 16)];
  }
  return rayId;
}

/**
 * Validates if a string is a valid Ray ID format
 * @param {string} rayId - The Ray ID to validate
 * @returns {boolean} True if valid, false otherwise
 */
export function validateRayId(rayId) {
  if (typeof rayId !== 'string') {
    return false;
  }
  // Must be exactly 16 characters and contain only hex characters (case-insensitive)
  return /^[0-9a-f]{16}$/i.test(rayId);
}
