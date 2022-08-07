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
    user.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
      .then((updatedUser) => {
        if (!updatedUser) {
          return res.status(404).send({ message: 'Пользователь отсутствует' });
        }
        res.send(updatedUser);
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          return res.status(400).send({ message: 'Переданы некорректные данные' });
        }
        res.status(500).send({ message: 'Серверная ошибка' });
      });
};

module.exports.updateAvatar = (req, res) => {
    const { avatar } = req.body;
    user.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
      .then((userAvatar) => {
        if (!userAvatar) {
          return res.status(404).send({ message: 'Пользователь отсутствует' });
        }
        res.send(userAvatar);
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          return res.status(400).send({ message: 'Переданы некорректные данные' });
        }
        res.status(500).send({ message: 'Серверная ошибка' });
      });
};

