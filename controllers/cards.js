const Cards = require('../models/card');
const NotFound = require('../errors/NotFound');
const InternalServerError = require('../errors/InternalServerError');
const BadRequest = require('../errors/BadRequest');

module.exports.getAllCards = (req, res, next) => {
  Cards.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(() => next(new InternalServerError('Ошибка на стороне сервера.')));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Cards.create({ name, link, owner })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        next(new InternalServerError('Ошибка на стороне сервера.'));
      }
    });
};

module.exports.deleteCardById = (req, res, next) => {
  const { cardId } = req.params;

  Cards.findByIdAndRemove(cardId)
    .orFail(() => new Error('NotFound'))
    .then(() => new BadRequest('Переданы некорректные данные'))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else if (err.message === 'NotFound') {
        next(new NotFound('По указанному id карточка не найдена'));
      } else {
        next(new InternalServerError('Ошибка на стороне сервера.'));
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new Error('NotFound'))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else if (err.message === 'NotFound') {
        next(new NotFound('По указанному id карточка не найдена'));
      } else {
        next(new InternalServerError('Ошибка на стороне сервера.'));
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new Error('NotFound'))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else if (err.message === 'NotFound') {
        next(new NotFound('По указанному id карточка не найдена'));
      } else {
        next(new InternalServerError('Ошибка на стороне сервера.'));
      }
    });
};
