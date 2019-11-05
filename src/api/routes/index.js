const express = require('express');

const app = express.Router();

/**
 * GET v1/docs
 */
app.use('/docs', express.static('docs'));

/**
 * GET v1/coverage
 */
app.use('/coverage', express.static('docs'));

app.use('/auth', require('./auth'));

app.use('/users', require('./user'));

module.exports = app;
