const crypto = require('crypto');
const bcrypt = require('bcrypt');

// Generar un secreto seguro
const secret = crypto.randomBytes(64).toString('hex');
console.log(secret)

// Hashear el secreto para mayor seguridad
const hashedSecret = bcrypt.hashSync(secret, 10);

module.exports = {
  secret,
  hashedSecret
};
