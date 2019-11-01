const { Strategy, ExtractJwt } = require('passport-jwt');
const { jwtSecret } = require('../config/env-vars');

const JwtOptions = {
  secretOrKey: jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
};

const JWT = async (payload, done) => {
  done();
};

exports.Jwt = new Strategy(JwtOptions, JWT);
