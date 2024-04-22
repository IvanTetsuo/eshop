require('dotenv').config()
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const mainRouter = require('./routes');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_CONNECTION_URI);
app.set('view engine', 'ejs');
app.use(express.json()); //это для того чтобы распарсить json (в body)
app.use(express.urlencoded({ extended: true })); //это для того чтобы распарсить url encoded (тоже в body)
app.use(express.static(__dirname + '/public'));

app.use(mainRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});