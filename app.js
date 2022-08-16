const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const routesUsers = require('./routes/users');
const routesCards = require('./routes/cards');
const NotFound = require('./errors/NotFound');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// логин
app.post('/signin', login);

// регистрация
app.post('/signup', createUser);

app.use(auth);
app.use('/cards', require('./routes/cards'));

app.use(routesUsers);
app.use(routesCards);

app.use(() => {
  throw new NotFound('Запрашиваемый ресурс не найден');
});

app.use(errors());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.listen(PORT, () => {
  console.log(`Сервер запущен, использован порт: ${PORT}`);
});
