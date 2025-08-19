// Edge Runtime compatible password utilities using Web Crypto API
// This is an alternative to bcryptjs for Edge Runtime compatibility

const encoder = new TextEncoder();

/**
 * Generate a random salt
 */
function generateSalt(length = 16): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(length));
}

/**
 * Hash password with salt using PBKDF2
 */
async function hashPasswordWithSalt(password: string, salt: Uint8Array, iterations = 100000): Promise<string> {
  const passwordBuffer = encoder.encode(password);
  
  const key = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt as BufferSource,
      iterations: iterations,
      hash: 'SHA-256'
    },
    key,
    256
  );

  const hashArray = new Uint8Array(hashBuffer);
  const saltBase64 = btoa(String.fromCharCode(...salt));
  const hashBase64 = btoa(String.fromCharCode(...hashArray));
  
  return `${iterations}:${saltBase64}:${hashBase64}`;
}

/**
 * Salt and hash password (Edge Runtime compatible)
 */
export async function saltAndHashPasswordEdge(password: string): Promise<string> {
  const salt = generateSalt();
  return await hashPasswordWithSalt(password, salt);
}

/**
 * Verify password against hash (Edge Runtime compatible)
 */
export async function verifyPasswordEdge(password: string, hashedPassword: string): Promise<boolean> {
  try {
    const [iterationsStr, saltBase64, hashBase64] = hashedPassword.split(':');
    
    if (!iterationsStr || !saltBase64 || !hashBase64) {
      return false;
    }

    const iterations = parseInt(iterationsStr, 10);
    const salt = new Uint8Array(
      atob(saltBase64).split('').map(char => char.charCodeAt(0))
    );

    const expectedHash = await hashPasswordWithSalt(password, salt, iterations);
    const [, , expectedHashBase64] = expectedHash.split(':');
    
    return hashBase64 === expectedHashBase64;
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}

/**
 * Migrate from bcrypt hash to Edge-compatible format
 * Use this function to gradually migrate existing bcrypt hashes
 */
export function isBcryptHash(hash: string): boolean {
  return hash.startsWith('$2b$') || hash.startsWith('$2a$') || hash.startsWith('$2y$');
}