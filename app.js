const express = require('express');
const mongoose = require('mongoose');
const { PORT = 3000 } = process.env;
const router = require('./routes/users');
const cardRouter = require('./routes/cards');
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

app.listen(PORT, () => {
  console.log(`Стартуем на порту ${PORT}`);
});
