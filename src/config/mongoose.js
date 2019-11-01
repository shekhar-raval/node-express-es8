const mongoose = require('mongoose');
const { env, mongo: { uri, options } } = require('./env-vars');

mongoose.Promise = global.Promise;

mongoose.set('debug', env !== 'production');

mongoose.connection.on('error', (err) => {
  console.log(`MongoDB Connection Error ${err}`);
});

mongoose.connection.on('connected', () => {
  console.log('Connected To DB');
});


/**
 * Connect to mongo db
 * @returns {object} Mongoose connection
 * @public
 */
exports.Connect = () => {
  mongoose.connect(uri, options);
  return mongoose.connection;
};
