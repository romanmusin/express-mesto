const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const user = require('../models/user');

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
  } = req.body;

  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      user.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      }).then(() => res.status(200).send({
        data: {
          name,
          about,
          avatar,
          email,
        },
      }))
        .catch((err) => {
          if (err.code === 11000) {
            const errNew = new Error('Пользователь уже зарегистрирован');
            errNew.statusCode = 409;

            next(errNew);
          }
          res.status(500).send({ message: 'Произошла ошибка сервера' });
        });
    });
};
module.exports.getUsers = (req, res) => {
  user
    .find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getUser = (req, res) => {
  user
    .findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Нет пользователя с таким id' });
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Введен невалидный id пользователя' });
      }
      res.status(500).send({ message: 'Произошла ошибка сервера' });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  user
    .findByIdAndUpdate(
      req.user._id,
      { name, about },
      {
        new: true,
        runValidators: true,
      },
    )
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Нет пользователя с таким id' });
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Введены невалидные данные' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Введен невалидный id пользователя' });
      }
      res.status(500).send({ message: 'Произошла ошибка сервера' });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  user
    .findByIdAndUpdate(
      req.user._id,
      { avatar },
      {
        new: true,
        runValidators: true,
      },
    )
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Нет пользователя с таким id' });
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Введены невалидные данные' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Введен невалидный id пользователя' });
      }
      res.status(500).send({ message: 'Произошла ошибка сервера' });
    });
};

module.exports.userInfo = (req, res, next) => {
  user.findById(req.user._id)
    .then((user) => {
      if (!user) {
        const err = new Error('Пользователь с указанным _id не найден');
        err.statusCode = 404;

        next(err);
      } else {
        res.send({ data: user });
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  user.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        const err = new Error('Неправильные почта или пароль');
        err.statusCode = 401;

        next(err);
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            const err = new Error('Неправильные почта или пароль');
            err.statusCode = 401;

            next(err);
          }

          return user;
        });
    })
    .then((user) => {
      const { NODE_ENV, JWT_SECRET } = process.env;

      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'strong-secret', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: 'None',
        secure: true,
      })
        .status(200)
        .send({ token, message: 'Пользователь успешно зарегистрирован' });
    })
    .catch(next);
};
