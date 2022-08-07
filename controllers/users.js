const User = require("../models/user");

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() =>
      res.status(500).send({ message: "Ошибка на стороне сервера." })
    );
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail(() => new Error("NotFound"))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "CastError") {
        res
          .status(400)
          .send({
            message: `Попытка использования некорректных данных при поиске пользователя -- ${err.name}`,
          });
      } else if (err.message === "NotFound") {
        res
          .status(404)
          .send({ message: "По указанному id пользователь не найден" });
      } else {
        res.status(500).send({ message: "Ошибка на стороне сервера." });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        res
          .status(400)
          .send({
            message: `Попытка использования некорректных данных при создании пользователя -- ${err.name}`,
          });
      } else {
        res.status(500).send({ message: "Ошибка на стороне сервера." });
      }
    });
};

module.exports.updateProfile = (req, res) => {
    const { name, about } = req.body;
    const userId = req.user._id;
    User.findByIdAndUpdate(
      userId,
      { name, about },
      {
        new: true,
        runValidators: true,
      },
    )
      .then((user) => {
        if (user != null) {
          res.send({ data: user });
        } else {
          const error = new Error(
            `Пользователь по указанному _id: ${userId} не найден.`,
          );
          error.name = 'UserNotFound';
          throw error;
        }
      })
      .catch((err) => {
        if (err.name === 'UserNotFound') {
          res.status(404).send({
            message: `${err.message}`,
          });
          return;
        }
        if (err.name === 'ValidationError') {
          res.status(400).send({
            message: 'Переданы некорректные данные при обновлении профиля',
          });
          return;
        }
        res
          .status(500)
          .send({ message: 'Произошла ошибка при изменении профиля' });
      });
  };
  
  module.exports.updateAvatar = (req, res) => {
    const { avatar } = req.body;
    const userId = req.user._id;
    User.findByIdAndUpdate(
      userId,
      { avatar },
      {
        new: true,
        runValidators: true,
      },
    )
      .then((user) => {
        if (user != null) {
          res.send({ data: user });
        } else {
          const error = new Error(
            `Пользователь по указанному _id: ${userId} не найден.`,
          );
          error.name = 'UserNotFound';
          throw error;
        }
      })
      .catch((err) => {
        if (err.name === 'UserNotFound') {
          res.status(404).send({
            message: `${err.message}`,
          });
          return;
        }
        if (err.name === 'ValidationError') {
          res.status(400).send({
            message: 'Переданы некорректные данные при обновлении аватара',
          });
          return;
        }
        res
          .status(500)
          .send({ message: 'Произошла ошибка при изменении аватара' });
      });
  };

