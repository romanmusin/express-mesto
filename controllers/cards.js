const card = require('../models/card');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  card
    .create({ name, link, owner })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Введены невалидные данные' });
      }
      res.status(500).send({ message: 'Произошла ошибка сервера' });
    });
};

module.exports.getCards = (req, res) => {
  card
    .find({})
    .then((card) => {
      res.send(card);
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.deleteCards = (req, res) => {
  card
    .findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Нет карточки с таким id' });
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Введен невалидный id карточки' });
      }
      res.status(500).send({ message: 'Произошла ошибка сервера' });
    });
};

module.exports.likeCard = (req, res) => {
  card
    .findByIdAndUpdate(req.params.cardId, {
      $addToSet: { likes: req.user._id },
    })
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Нет карточки с таким id' });
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Введен невалидный id карточки' });
      }
      res.status(500).send({ message: 'Произошла ошибка сервера' });
    });
};

module.exports.dislikeCard = (req, res) => {
  card
    .findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } })
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Нет карточки с таким id' });
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Введен невалидный id карточки' });
      }
      res.status(500).send({ message: 'Произошла ошибка сервера' });
    });
};
