const user = require("../models/user");

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  user
    .create({ name, about, avatar })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({ message: "Введены невалидные данные" });
      }
      res.status(500).send({ message: "Произошла ошибка сервера" });
    });
};

module.exports.getUsers = (req, res) => {
  user
    .find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

module.exports.getUser = (req, res) => {
  user
    .findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: "Нет пользователя с таким id" });
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(400).send({ message: "Введен невалидный id пользователя" });
      }
      res.status(500).send({ message: "Произошла ошибка сервера" });
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
        res.status(404).send({ message: "Нет пользователя с таким id" });
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({ message: "Введены невалидные данные" });
      } else if (err.name === "CastError") {
        res.status(400).send({ message: "Введен невалидный id пользователя" });
      }
      res.status(500).send({ message: "Произошла ошибка сервера" });
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
        res.status(404).send({ message: "Нет пользователя с таким id" });
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({ message: "Введены невалидные данные" });
      } else if (err.name === "CastError") {
        res.status(400).send({ message: "Введен невалидный id пользователя" });
      }
      res.status(500).send({ message: "Произошла ошибка сервера" });
    });
};
