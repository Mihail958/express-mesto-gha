const User = require('../models/user');
const {
  BAD_REQUEST_CODE,
  PAGE_NOT_FOUND_CODE,
  COMMON_ERROR_CODE,
} = require('../consts/error_codes');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_CODE).send({
          message: 'Переданы некорректные данные при создании пользователя',
        });
        return;
      }
      res
        .status(COMMON_ERROR_CODE)
        .send({ message: 'Произошла ошибка при создании пользователя' });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch(() => {
      res
        .status(COMMON_ERROR_CODE)
        .send({ message: 'Произошла ошибка при поиске пользователей' });
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user != null) {
        res.send({ data: user });
      } else {
        const error = new Error(
          `Пользователь по указанному _id: ${req.params.userId} не найден.`,
        );
        error.name = 'UserNotFound';
        throw error;
      }
    })
    .catch((err) => {
      if (err.name === 'UserNotFound') {
        res.status(PAGE_NOT_FOUND_CODE).send({ message: `${err.message}` });
        return;
      }
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_CODE).send({
          message: 'Переданы некорректные данные при поиске пользователя по ID',
        });
        return;
      }
      res
        .status(COMMON_ERROR_CODE)
        .send({ message: 'Произошла ошибка при поиске пользователя по ID' });
    });
};


module.exports.updateUserProfile = (req, res) => {
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
        res.status(PAGE_NOT_FOUND_CODE).send({
          message: `${err.message}`,
        });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_CODE).send({
          message: 'Переданы некорректные данные при обновлении профиля',
        });
        return;
      }
      res
        .status(COMMON_ERROR_CODE)
        .send({ message: 'Произошла ошибка при изменении профиля' });
    });
};

module.exports.updateUserAvatar = (req, res) => {
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
        res.status(PAGE_NOT_FOUND_CODE).send({
          message: `${err.message}`,
        });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_CODE).send({
          message: 'Переданы некорректные данные при обновлении аватара',
        });
        return;
      }
      res
        .status(COMMON_ERROR_CODE)
        .send({ message: 'Произошла ошибка при изменении аватара' });
    });
};
