/**
 * 🔐 CRIPTOGRAFIA DE CAMPOS SENSÍVEIS
 * 
 * Usa AES-256-GCM para criptografar dados sensíveis no banco (CPF, dados médicos).
 * Requisito LGPD: dados de saúde devem ser criptografados at-rest.
 * 
 * Uso no modelo:
 *   cpf: { type: String, set: encrypt, get: decrypt }
 */

const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const TAG_LENGTH = 16;
const ENCODING = 'hex';

// Derivar chave de 256 bits a partir do JWT_SECRET
const getEncryptionKey = () => {
  const secret = process.env.ENCRYPTION_KEY || process.env.JWT_SECRET || 'default_dev_key_change_me';
  return crypto.createHash('sha256').update(secret).digest();
};

/**
 * Criptografa um texto plano
 * @param {string} plainText - Texto a ser criptografado
 * @returns {string} - Texto criptografado (iv:tag:ciphertext)
 */
const encrypt = (plainText) => {
  if (!plainText || typeof plainText !== 'string') return plainText;

  // Não re-criptografar se já está criptografado (formato iv:tag:cipher)
  if (plainText.includes(':') && plainText.length > 60) return plainText;

  try {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(plainText, 'utf8', ENCODING);
    encrypted += cipher.final(ENCODING);

    const tag = cipher.getAuthTag();

    // Formato: iv:tag:ciphertext (tudo em hex)
    return `${iv.toString(ENCODING)}:${tag.toString(ENCODING)}:${encrypted}`;
  } catch (error) {
    console.error('Erro ao criptografar:', error.message);
    return plainText; // Fallback: retorna sem criptografar
  }
};

/**
 * Descriptografa um texto criptografado
 * @param {string} encryptedText - Texto criptografado (iv:tag:ciphertext)
 * @returns {string} - Texto original
 */
const decrypt = (encryptedText) => {
  if (!encryptedText || typeof encryptedText !== 'string') return encryptedText;

  // Se não está no formato criptografado, retorna como está
  const parts = encryptedText.split(':');
  if (parts.length !== 3) return encryptedText;

  try {
    const key = getEncryptionKey();
    const iv = Buffer.from(parts[0], ENCODING);
    const tag = Buffer.from(parts[1], ENCODING);
    const encrypted = parts[2];

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);

    let decrypted = decipher.update(encrypted, ENCODING, 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    console.error('Erro ao descriptografar:', error.message);
    return encryptedText; // Fallback
  }
};

/**
 * Mascara um CPF (ex: 123.456.789-00 → ***.***.789-00)
 */
const maskCPF = (cpf) => {
  if (!cpf) return '';
  const clean = cpf.replace(/\D/g, '');
  if (clean.length !== 11) return '***.***.***-**';
  return `***.***. ${clean.slice(6, 9)}-${clean.slice(9)}`;
};

/**
 * Mascara um telefone (ex: (11) 99999-9999 → (11) *****-9999)
 */
const maskPhone = (phone) => {
  if (!phone) return '';
  const clean = phone.replace(/\D/g, '');
  if (clean.length < 8) return '****-****';
  return `(${clean.slice(0, 2)}) *****-${clean.slice(-4)}`;
};

module.exports = { encrypt, decrypt, maskCPF, maskPhone };
