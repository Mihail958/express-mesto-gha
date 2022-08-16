const jwt = require('jsonwebtoken');
const statusCodes = require('../utils/statusCodes');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res(statusCodes.ERROR_CODE_401).send({ message: 'Необходима авторизация' });
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
    req.user = payload;
    next();
  } catch (err) {
    return res.status(statusCodes.ERROR_CODE_401).send({ message: 'Необходима авторизация' });
  }
};
