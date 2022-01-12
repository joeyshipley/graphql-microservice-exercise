const ENV = {
  PORT: process.env.PORT || '',
  ENCRYPT_SALT: process.env.ENCRYPT_SALT || '',
  ENCRYPT_KEY: process.env.ENCRYPT_KEY || '',
  TOKEN_KEY: process.env.TOKEN_KEY || '',
};
exports.ENV = ENV;