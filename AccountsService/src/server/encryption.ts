import bcrypt from 'bcrypt';
import StringCrypto from 'string-crypto';
import { ENV } from './environment-variables';

const bcryptSaltRounds = 10;
const CRYPTO_OPTIONS = {
  salt: ENV.ENCRYPT_SALT,
  iterations: 10,
  digest: 'sha512',
};
const {
  encryptString,
  decryptString,
} = new StringCrypto(CRYPTO_OPTIONS);

export function encryptPassword(plainText: string) {
  return bcrypt.hashSync(plainText, bcryptSaltRounds);
}

export function checkPassword(plainText: string, encryptedText: string) {
  return bcrypt.compareSync(plainText, encryptedText);
}

export function encryptData(jsonData: {}) {
  const stringed = JSON.stringify(jsonData);
  return encryptString(stringed, ENV.ENCRYPT_KEY);
}

export function decryptData(encrypted: string) {
  const decrypted = decryptString(encrypted, ENV.ENCRYPT_KEY);
  return JSON.parse(decrypted);
}