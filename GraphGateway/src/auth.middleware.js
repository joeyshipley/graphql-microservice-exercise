const { verify } = require('jsonwebtoken');
const { ENV } = require('./environment-variables');
const { decryptData } = require('./encryption');

const isIntrospectionQuery = ({ operationName }) => {
  return operationName === 'IntrospectionQuery'
}

const auth = ({ req }) => {
  if(isIntrospectionQuery(req.body)) {
    return;
  }

  if(!req.headers.authorization) {
    return { authPayload: null };
  }

  const bearer = req.headers.authorization.replace('Bearer ','');
  const decoded = verify(bearer, ENV.TOKEN_KEY);
  const decrypted = decryptData(decoded.payload);
  return { authPayload: decrypted };
}
module.exports = auth;

