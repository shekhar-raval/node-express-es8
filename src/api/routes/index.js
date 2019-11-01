const app = require('express').Router();

app.use('/auth', require('./auth'));

app.use('/users', require('./user'));

module.exports = app;
