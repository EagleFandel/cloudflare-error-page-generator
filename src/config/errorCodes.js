/**
 * Cloudflare Error Code Definitions
 * Contains all common Cloudflare error codes with their details
 */

export const ERROR_CODES = [
  {
    code: "500",
    title: "Internal Server Error",
    description: "The server encountered an internal error.",
    whatHappened: "The origin web server encountered an unexpected condition that prevented it from fulfilling the request.",
    whatCanIDo: "Please try again in a few minutes. If you are the site owner, check your server logs for more details."
  },
  {
    code: "502",
    title: "Bad Gateway",
    description: "The server received an invalid response from the upstream server.",
    whatHappened: "The origin web server is not reachable. Cloudflare could not establish a connection to the origin server.",
    whatCanIDo: "Please try again in a few minutes. If you are the site owner, check that your origin server is running and accessible."
  },
  {
    code: "503",
    title: "Service Temporarily Unavailable",
    description: "The server is temporarily unable to handle the request.",
    whatHappened: "The origin web server is refusing connections. The server may be overloaded or down for maintenance.",
    whatCanIDo: "Please try again in a few minutes. If you are the site owner, check your server status and capacity."
  },
  {
    code: "504",
    title: "Gateway Timeout",
    description: "The server did not receive a timely response from the upstream server.",
    whatHappened: "The origin web server timed out. Cloudflare was unable to get a response within the time limit.",
    whatCanIDo: "Please try again in a few minutes. If you are the site owner, check your server performance and timeout settings."
  },
  {
    code: "520",
    title: "Web Server Returned an Unknown Error",
    description: "The origin server returned an empty, unknown, or unexpected response.",
    whatHappened: "The origin web server returned an empty, unknown, or unexpected response to Cloudflare.",
    whatCanIDo: "Contact your hosting provider. If you are the site owner, check your origin server logs for errors."
  },
  {
    code: "521",
    title: "Web Server Is Down",
    description: "The origin server has refused the connection from Cloudflare.",
    whatHappened: "The origin web server is down or not responding. Cloudflare cannot establish a connection.",
    whatCanIDo: "Contact your hosting provider. If you are the site owner, ensure your web server is running and accepting connections."
  },
  {
    code: "522",
    title: "Connection Timed Out",
    description: "Cloudflare could not negotiate a TCP handshake with the origin server.",
    whatHappened: "The connection to the origin web server timed out. Cloudflare could not complete a TCP handshake.",
    whatCanIDo: "Contact your hosting provider. If you are the site owner, check your firewall settings and server availability."
  },
  {
    code: "523",
    title: "Origin Is Unreachable",
    description: "Cloudflare could not reach the origin server.",
    whatHappened: "The origin web server is unreachable. This could be a DNS issue or the server IP is incorrect.",
    whatCanIDo: "Contact your hosting provider. If you are the site owner, verify your DNS settings and origin IP address."
  },
  {
    code: "524",
    title: "A Timeout Occurred",
    description: "Cloudflare was able to connect but the origin did not respond in time.",
    whatHappened: "The origin web server acknowledged the connection but did not respond with data in time.",
    whatCanIDo: "Please try again. If you are the site owner, check your server performance and increase timeout limits if needed."
  },
  {
    code: "525",
    title: "SSL Handshake Failed",
    description: "Cloudflare could not negotiate an SSL/TLS handshake with the origin server.",
    whatHappened: "The SSL/TLS handshake between Cloudflare and the origin web server failed.",
    whatCanIDo: "Contact your hosting provider. If you are the site owner, check your SSL certificate configuration."
  },
  {
    code: "526",
    title: "Invalid SSL Certificate",
    description: "Cloudflare could not validate the SSL certificate on the origin server.",
    whatHappened: "The origin web server has an invalid or expired SSL certificate.",
    whatCanIDo: "Contact your hosting provider. If you are the site owner, install a valid SSL certificate on your origin server."
  },
  {
    code: "527",
    title: "Railgun Error",
    description: "The request timed out or failed after the WAN connection was established.",
    whatHappened: "The Railgun connection between Cloudflare and the origin server encountered an error.",
    whatCanIDo: "Please try again. If you are the site owner, check your Railgun configuration and server status."
  }
];

/**
 * Get error code definition by code
 * @param {string} code - The error code to look up
 * @returns {Object|undefined} The error code definition or undefined if not found
 */
export function getErrorByCode(code) {
  return ERROR_CODES.find(error => error.code === code);
}

/**
 * Get all available error codes
 * @returns {string[]} Array of error code strings
 */
export function getAvailableCodes() {
  return ERROR_CODES.map(error => error.code);
}
