const Cards = require('../models/card');
const NotFound = require('../errors/NotFound');
const ForbiddenError = require('../errors/ForbiddenError');
const BadRequest = require('../errors/BadRequest');

module.exports.getAllCards = (req, res, next) => {
  Cards.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => next(err));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Cards.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'BadRequest') {
        next(new BadRequest('Некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCardById = (req, res, next) => {
  Cards.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFound('Карточка с указанным id не найдена');
      }
      if (card.owner._id.toString() !== req.user._id.toString()) {
        throw new ForbiddenError('Вы не можете удалить чужую карточку');
      }
      card.remove();
      res.status(200).send({ data: card, message: 'Карточка успешно удалена' });
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  Cards.findByIdAndUpdate(
    cardId,
    {
      $addToSet: { likes: userId },
    },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFound('Карточка с указанным id не найдена');
      }
      res.status(200).send(card);
    })
    .catch((error) => {
      if (error.name === 'BadRequest') {
        next(new BadRequest('Некорректые данные карточки'));
      } else {
        next(error);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  Cards.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFound('Карточка с указанным id не найдена');
      }
      res.send({ data: card });
    })
    .catch((error) => {
      if (error.name === 'BadRequest') {
        next(new BadRequest('Некорректые данные карточки'));
      } else {
        next(error);
      }
    });
};
