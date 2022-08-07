const Cards = require("../models/card");

module.exports.getAllCards = (req, res) => {
  Cards.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(() =>
      res.status(500).send({ message: "Ошибка на стороне сервера." })
    );
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Cards.create({ name, link, owner })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(400)
          .send({
            message: `Попытка использования некорректных данных при создании карточки -- ${err.name}`,
          });
      } else {
        res.status(500).send({ message: "Ошибка на стороне сервера." });
      }
    });
};

module.exports.deleteCardById = (req, res) => {
  const { cardId } = req.params;

  Cards.findByIdAndRemove(cardId)
    .orFail(() => new Error("NotFound"))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === "CastError") {
        res
          .status(400)
          .send({
            message: `Попытка использования некорректных данных при созданиии карточки -- ${err.name}`,
          });
      } else if (err.message === "NotFound") {
        res
          .status(404)
          .send({ message: "По указанному id карточка не найдена" });
      } else {
        res.status(500).send({ message: "Ошибка на стороне сервера." });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => new Error("NotFound"))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === "CastError") {
        res
          .status(400)
          .send({
            message: `Попытка использования некорректных данных при постановке лайка -- ${err.name}`,
          });
      } else if (err.message === "NotFound") {
        res
          .status(404)
          .send({ message: "Указанный id карточки не существует" });
      } else {
        res.status(500).send({ message: "Ошибка на стороне сервера." });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => new Error("NotFound"))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === "CastError") {
        res
          .status(400)
          .send({
            message: `Попытка использования некорректных данных при удалении лайка  -- ${err.name}`,
          });
      } else if (err.message === "NotFound") {
        res
          .status(404)
          .send({ message: "Указанный id карточки не существует" });
      } else {
        res.status(500).send({ message: "Ошибка на стороне сервера." });
      }
    });
};
