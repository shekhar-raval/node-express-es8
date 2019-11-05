const { Schema, model } = require('mongoose');
const moment = require('moment');
const crypto = require('crypto');

/**
 * Refresh Token Schema
 * @private
 */
const RefreshTokenModel = new Schema({
  token: {
    type: String,
    required: true,
    index: true,
  },
  id: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  email: {
    type: String,
    ref: 'users',
    required: true,
  },
  expires: {
    type: Date,
  },
});

RefreshTokenModel.statics = {
  /**
   * Generate Refresh token and Returns it
   * @public
   *
   * @param {Object} user User Object
   * @param {String} user.email User's Email
   * @param {String} user.password User's Password
   *
   * @returns {String} Refresh Token
   */
  generate(user) {
    const { email, id } = user;
    const token = `${id}.${crypto.randomBytes(40).toString('hex')}`;
    const expires = moment().add(30, 'days').toDate();
    const Obj = new RefreshToken({
      token, id, email, expires,
    });
    Obj.save();
    return Obj.token;
  },
};

const RefreshToken = model('RefreshToken', RefreshTokenModel);

/**
 * @typedef RefreshToken
 */
module.exports = RefreshToken;
