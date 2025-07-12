const JWT_SECRET = 'secret-key-for-testing';

/**
 * Base64URL encode (browser-compatible)
 */
function base64UrlEncode(str: string): string {
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Simple HMAC-SHA256 implementation for browser
 * Note: This is a PoC implementation - in production, use a proper crypto library
 */
async function hmacSha256(message: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
  const signatureArray = new Uint8Array(signature);
  const signatureString = String.fromCharCode(...signatureArray);
  return base64UrlEncode(signatureString);
}

/**
 * Generate a JWT token for API authentication
 * This is a PoC implementation with a fixed secret
 */
export async function generateAuthToken(): Promise<string> {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const payload = {
    // Basic payload for PoC - could include user info in a real app
    sub: 'test-user',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour expiration
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const message = `${encodedHeader}.${encodedPayload}`;
  
  const signature = await hmacSha256(message, JWT_SECRET);
  
  return `${message}.${signature}`;
}

/**
 * Get authorization headers with JWT token
 */
export async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await generateAuthToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}