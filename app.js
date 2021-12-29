require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const { PORT = 3000 } = process.env;
const router = require('./routes/users');
const cardRouter = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '61cabab87edecfff35dc8985',
  };

  next();
});

app.use(express.json());
app.use(router);
app.use(cardRouter);
app.use((req, res) => {
  res.status(404).send({ message: 'Сервер недоступен' });
});

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().default('Жак-Ив Кусто').min(2).max(30),
    about: Joi.string().default('Исследователь').min(2).max(30),
    avatar: Joi.string().default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png').pattern(/^(http|https):\/\/[^ "]+\.[^ "]+$/),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.listen(PORT, () => {
  console.log(`Стартуем на порту ${PORT}`);
});
