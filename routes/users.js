const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24).hex(),
  }),
}), getUser);

router.post('/users', createUser);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);
router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/^(http|https):\/\/[^ "]+\.[^ "]+$/),
  }),
}), updateAvatar);

module.exports = router;
