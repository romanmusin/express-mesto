const jwt = require('jsonwebtoken');

const { JWT_SECRET, NODE_ENV } = process.env;
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    const err = new Error('Необходима авторизация');
    err.statusCode = 401;

    next(err);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'strong-secret',
    );
  } catch (err) {
    const errNew = new Error('Ошибка авторизации');
    errNew.statusCode = 401;

    next(errNew);
  }
  req.user = payload;
  next();
};
