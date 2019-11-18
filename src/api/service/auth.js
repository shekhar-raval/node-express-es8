const moment = require('moment');
const User = require('../models/user');
const RefreshToken = require('../models/refresh-token');
const { jwtExpirationInterval } = require('../../config/env-vars');

/**
 * Return Formated Object With Tokens
 * @private
 *
 * @param {Object} user
 * @param {String} accessToken
 * @returns {Object} {tokenType, accessToken, refreshToken, expiresIn}
 */
const generateTokenResponse = (user, accessToken) => {
  const tokenType = 'Bearer';
  const refreshToken = RefreshToken.generate(user);
  const expiresIn = moment().add(jwtExpirationInterval, 'minutes');
  return {
    tokenType, accessToken, refreshToken, expiresIn,
  };
};

/**
 * Return's User Object and Jwt
 * if registration was successful
 *
 * @public
 * @param {Object} userData
 * @param {String} userData.email User Email
 * @param {String} userData.password User Password
 * @param {String} userData.name User Name
 *
 * @returns {Object} {token, user} User Object with Tokens
 */
exports.Register = async (userData) => {
  try {
    const us = new User(userData);
    const savedUser = await us.save();
    return { token: us.token(), user: savedUser.transform() };
  } catch (err) {
    throw User.checkDuplication(err);
  }
};

/**
 * Return's User Object and Jwt
 * if email and password was correct
 *
 * @public
 * @param {Object} userData
 * @param {String} userData.email User Email
 * @param {String} userData.password User password
 *
 * @returns {Object} {token, user} User Object with Tokens
 */
exports.Login = async (userData) => {
  const { user, accessToken } = await User.ValidateUserAndGenerateToken(userData);
  const tokens = generateTokenResponse(user, accessToken);
  return { tokens, user };
};
