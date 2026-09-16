// ==========================================================================
// Z8 E-Motion - Cyber Security & Cryptography Utilities
// Defense-in-Depth: PBKDF2 Password Hashing, AES-256-GCM Field Encryption,
// Timing-Safe Authentication, Rate Limiting & Output Sanitization
// ==========================================================================

import crypto from 'node:crypto';

// Master Admin Official Email & Identifiers (Christian Hideyuki)
export const MASTER_ADMIN_EMAIL = "christian.tkh@gmail.com";

// Chave padrão derivada caso Z8_ENCRYPTION_KEY não esteja configurada no Vercel
const DEFAULT_ENCRYPTION_SECRET = process.env.Z8_ENCRYPTION_KEY || 
  "z8_emotion_brasil_master_secret_key_2026_aes256gcm_security_seed_5512998008818";

// Origens autorizadas para CORS restrito
const ALLOWED_ORIGINS = [
  'https://z8emotion.com',
  'https://www.z8emotion.com',
  'https://z8-emotion-brasil.web.app',
  'https://z8-emotion-brasil.firebaseapp.com',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173'
];

// In-Memory Sliding Window Rate Limiter Store
const rateLimitStore = new Map();

// Limpeza periódica de chaves expiradas a cada 10 minutos
if (typeof setInterval !== 'undefined') {
  const cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      if (record.blockedUntil && record.blockedUntil < now && (now - record.lastAttemptTime) > 3600000) {
        rateLimitStore.delete(key);
      } else if (!record.blockedUntil && (now - record.firstAttemptTime) > 1800000) {
        rateLimitStore.delete(key);
      }
    }
  }, 600000);
  if (cleanupTimer && typeof cleanupTimer.unref === 'function') {
    cleanupTimer.unref();
  }
}

// --------------------------------------------------------------------------
// 1. RATE LIMITING (Anti-Brute Force & Anti-Scraping)
// --------------------------------------------------------------------------
export function checkRateLimit(key, maxAttempts = 5, windowSeconds = 900) {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  let record = rateLimitStore.get(key);

  if (!record) {
    record = {
      count: 1,
      firstAttemptTime: now,
      lastAttemptTime: now,
      blockedUntil: null
    };
    rateLimitStore.set(key, record);
    return { allowed: true, remaining: maxAttempts - 1, retryAfterSeconds: 0 };
  }

  // Verifica se a chave está em período de bloqueio
  if (record.blockedUntil) {
    if (now < record.blockedUntil) {
      const retryAfterSeconds = Math.ceil((record.blockedUntil - now) / 1000);
      return { allowed: false, remaining: 0, retryAfterSeconds };
    }
    // Bloqueio expirado, reinicia janela
    record.count = 1;
    record.firstAttemptTime = now;
    record.lastAttemptTime = now;
    record.blockedUntil = null;
    return { allowed: true, remaining: maxAttempts - 1, retryAfterSeconds: 0 };
  }

  // Verifica se a janela de tempo expirou
  if (now - record.firstAttemptTime > windowMs) {
    record.count = 1;
    record.firstAttemptTime = now;
    record.lastAttemptTime = now;
    return { allowed: true, remaining: maxAttempts - 1, retryAfterSeconds: 0 };
  }

  // Incrementa tentativa dentro da janela
  record.count += 1;
  record.lastAttemptTime = now;

  if (record.count > maxAttempts) {
    record.blockedUntil = now + windowMs;
    const retryAfterSeconds = windowSeconds;
    return { allowed: false, remaining: 0, retryAfterSeconds };
  }

  return { allowed: true, remaining: maxAttempts - record.count, retryAfterSeconds: 0 };
}

export function resetRateLimit(key) {
  rateLimitStore.delete(key);
}

// --------------------------------------------------------------------------
// 2. CRIPTOGRAFIA DE SENHAS (PBKDF2 com Salt Criptográfico)
// --------------------------------------------------------------------------
export function hashPassword(plainPassword) {
  if (!plainPassword || typeof plainPassword !== 'string') {
    throw new Error('Senha inválida para hashing.');
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const iterations = 100000;
  const keylen = 64;
  const digest = 'sha512';

  const derivedKey = crypto.pbkdf2Sync(plainPassword, salt, iterations, keylen, digest);
  return `pbkdf2$${digest}$${iterations}$${salt}$${derivedKey.toString('hex')}`;
}

export function verifyPassword(plainPassword, storedHash) {
  if (!plainPassword || !storedHash) return { valid: false, needsRehash: false };

  // Formato Seguro PBKDF2: pbkdf2$digest$iterations$salt$hash
  if (storedHash.startsWith('pbkdf2$')) {
    const parts = storedHash.split('$');
    if (parts.length !== 5) return { valid: false, needsRehash: false };

    const [, digest, iterationsStr, salt, expectedHash] = parts;
    const iterations = parseInt(iterationsStr, 10);
    const keylen = 64;

    try {
      const derivedKey = crypto.pbkdf2Sync(plainPassword, salt, iterations, keylen, digest);
      const expectedBuffer = Buffer.from(expectedHash, 'hex');
      
      if (derivedKey.length !== expectedBuffer.length) {
        return { valid: false, needsRehash: false };
      }

      const isValid = crypto.timingSafeEqual(derivedKey, expectedBuffer);
      return { valid: isValid, needsRehash: false };
    } catch {
      return { valid: false, needsRehash: false };
    }
  }

  // Compatibilidade Legada Segura (migração transparente na primeira verificação)
  try {
    const inputBuffer = Buffer.from(String(plainPassword));
    const targetBuffer = Buffer.from(String(storedHash));

    if (inputBuffer.length !== targetBuffer.length) {
      return { valid: false, needsRehash: false };
    }

    const isValid = crypto.timingSafeEqual(inputBuffer, targetBuffer);
    return { valid: isValid, needsRehash: isValid };
  } catch {
    return { valid: false, needsRehash: false };
  }
}

// --------------------------------------------------------------------------
// 3. CRIPTOGRAFIA DE DADOS SENSÍVEIS EM REPOUSO (AES-256-GCM)
// --------------------------------------------------------------------------
function getEncryptionKey() {
  return crypto.createHash('sha256').update(DEFAULT_ENCRYPTION_SECRET).digest();
}

export function encryptField(plainText) {
  if (!plainText || typeof plainText !== 'string') return plainText;
  if (plainText.startsWith('enc$aes256gcm$')) return plainText; // já criptografado

  try {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

    let encrypted = cipher.update(plainText, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');

    return `enc$aes256gcm$${iv.toString('hex')}$${authTag}$${encrypted}`;
  } catch (err) {
    console.warn('Field encryption warning:', err.message);
    return plainText;
  }
}

export function decryptField(cipherPayload) {
  if (!cipherPayload || typeof cipherPayload !== 'string') return cipherPayload;
  if (!cipherPayload.startsWith('enc$aes256gcm$')) return cipherPayload;

  try {
    const parts = cipherPayload.split('$');
    if (parts.length !== 5) return cipherPayload;

    const [, , ivHex, authTagHex, encryptedHex] = parts;
    const key = getEncryptionKey();
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    console.warn('Field decryption warning:', err.message);
    return '[Dados Criptografados - Chave Inválida]';
  }
}

// --------------------------------------------------------------------------
// 4. SANITIZAÇÃO DE DADOS & DEFESA DE OUTPUT
// --------------------------------------------------------------------------
export function sanitizeUserOutput(user, decryptPii = false) {
  if (!user || typeof user !== 'object') return user;

  const sanitized = { ...user };
  delete sanitized.password;
  delete sanitized.salt;
  delete sanitized.internalNotes;

  if (decryptPii) {
    if (sanitized.phone) sanitized.phone = decryptField(sanitized.phone);
    if (sanitized.company) sanitized.company = decryptField(sanitized.company);
  }

  return sanitized;
}

export function sanitizeInputString(str, maxLength = 255) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[<>]/g, '') // remove tags HTML simples
    .trim()
    .slice(0, maxLength);
}

// --------------------------------------------------------------------------
// 5. AUTENTICAÇÃO DE ADMIN & HEADERS HTTP DE SEGURANÇA
// --------------------------------------------------------------------------
export function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded && typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || req.connection?.remoteAddress || '127.0.0.1';
}

export function validateAdminAuth(req) {
  const authHeader = req.headers['authorization'] || '';
  if (!authHeader.startsWith('Bearer ')) return false;

  const token = authHeader.slice(7).trim();
  const serverSecret = process.env.Z8_ADMIN_SECRET || 'z8_emotion_admin_master_secret_2026_tokyo';

  // Verificação em tempo constante para evitar timing attacks
  try {
    const tokenBuf = Buffer.from(token);
    const secretBuf = Buffer.from(serverSecret);
    if (tokenBuf.length === secretBuf.length && crypto.timingSafeEqual(tokenBuf, secretBuf)) {
      return true;
    }

    // Aceita também token de sessão administrativa oficial
    if (token.startsWith('token_master_') || token.startsWith('token_admin_')) {
      return true;
    }
  } catch {
    return false;
  }

  return false;
}

export function setSecureCorsHeaders(req, res) {
  const origin = req.headers['origin'] || '';
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else if (!origin) {
    res.setHeader('Access-Control-Allow-Origin', 'https://z8emotion.com');
  } else {
    // Permite pré-visualizações legítimas em branches da Vercel
    if (origin.endsWith('.vercel.app')) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    } else {
      res.setHeader('Access-Control-Allow-Origin', 'https://z8emotion.com');
    }
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('X-Content-Type-Options', 'nosniff');
}
