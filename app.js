const express = require('express');
const mongoose = require('mongoose');
const routesUsers = require('./routes/users');
const routesCards = require('./routes/cards');
const bodyParser = require('body-parser');


const { PORT = 3000 } = process.env;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(routesUsers);
app.use(routesCards);

app.use((req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

mongoose.connect('mongodb://localhost:27017/mestodb ', {
  // useNewUrlParser: true
});

app.use((req, res, next) => {
  req.user = {
    _id: '62ef9d2256f5d69128e6fc61' 
  };

  next();
}); 

app.listen(PORT, () => {
  console.log(`Рабочий порт: ${PORT}`);
});