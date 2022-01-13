const cardRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { isValidUrl } = require('../utils/methods');

const {
  createCard,
  getCards,
  deleteCards,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cardRouter.get('/', getCards);

cardRouter.post('/', celebrate({

  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(isValidUrl),
  }),
}), createCard);

cardRouter.delete('/:cardId', celebrate({

  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
}), deleteCards);

cardRouter.put('/:cardId/likes', celebrate({

  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
}), likeCard);

cardRouter.delete('/:cardId/likes', celebrate({

  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
}), dislikeCard);

module.exports = cardRouter;
