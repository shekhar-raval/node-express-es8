const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpirationInterval: process.env.JWT_EXPIRATION_MINUTES,
  mongo: {
    uri: process.env.NODE_ENV === 'development' ? process.env.MONGO_URI_TEST : process.env.MONGO_URI,
    options: {
      keepAlive: 1000,
      autoReconnect: true,
      reconnectTries: 5,
      reconnectInterval: 3000,
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    },
  },
  rateLimitTime: process.env.RATE_LIMIT_TIME,
  rateLimitRequest: process.env.RATE_LIMIT_REQUEST,
  saltRound: process.env.NODE_ENV === 'development' ? process.env.SALT_ROUND_DEV : process.env.SALT_ROUND_PROD,
  logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
};
