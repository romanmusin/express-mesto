/* eslint-disable prefer-regex-literals */
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');

const { PORT = 3000 } = process.env;
const router = require('./routes/users');
const cardRouter = require('./routes/cards');
const centralizedErrors = require('./middlewares/centralizedErrors');
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');
const { isValidUrl } = require('./utils/methods');
const NotFoundError = require('./errors/notFoundErr');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');
app.use(cookieParser());
app.use(express.json());

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().default('Жак-Ив Кусто').min(2).max(30),
    about: Joi.string().default('Исследователь').min(2).max(30),
    avatar: Joi.string().custom(isValidUrl),
    email: Joi.string().required().email(),
    password: Joi.string()
      .required()
      .pattern(new RegExp('^[a-zA-Z0-9]{8,}$')),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string()
      .required()
      .pattern(new RegExp('^[a-zA-Z0-9]{8,}$')),
  }),
}), login);

app.use(auth);

app.use(router);
app.use(cardRouter);
app.use(errors());

app.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(centralizedErrors);
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Запуск на порту ${PORT}`);
});
