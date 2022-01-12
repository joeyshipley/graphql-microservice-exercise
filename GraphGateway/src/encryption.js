const bcrypt = require('bcrypt');
const StringCrypto = require('string-crypto');
const { ENV } = require('./environment-variables');

// TODO: / NOTE: -- this is recreated from account service. Consider options to refactoring.

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

function encryptPassword(plainText) {
  return bcrypt.hashSync(plainText, bcryptSaltRounds);
}
exports.encryptPassword = encryptPassword;

function checkPassword(plainText, encryptedText) {
  return bcrypt.compareSync(plainText, encryptedText);
}
exports.checkPassword = checkPassword;

function encryptData(jsonData) {
  const stringed = JSON.stringify(jsonData);
  return encryptString(stringed, ENV.ENCRYPT_KEY);
}
exports.encryptData = encryptData;

function decryptData(encrypted) {
  const decrypted = decryptString(encrypted, ENV.ENCRYPT_KEY);
  return JSON.parse(decrypted);
}
exports.decryptData = decryptData;
