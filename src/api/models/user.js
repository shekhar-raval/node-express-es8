const { Schema, model, Types } = require('mongoose');
const bcrypt = require('bcryptjs');
const Jwt = require('jsonwebtoken');
const moment = require('moment');

const APIError = require('../../utils/APIError');
const {
  ROLES, DEFAULT_IMAGE,
  NO_RECORD_FOUND, NOT_FOUND,
  BAD_REQUEST, VALIDATION_ERROR,
  INVALID_CREDENTIALS,
  EMAIL_EXIST,
} = require('../../utils/constants');
const { saltRound, jwtExpirationInterval, jwtSecret } = require('../../config/env-vars');

const UserModel = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  photo: {
    type: String,
    default: DEFAULT_IMAGE,
  },
  role: {
    type: String,
    enum: ROLES,
    default: 'user',
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  active: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

UserModel.pre('save', async function save(next) {
  try {
    if (!this.isModified('password')) return next();
    const hash = await bcrypt.hash(this.password, Number(saltRound));
    this.password = hash;
    return next();
  } catch (err) {
    return next(err);
  }
});

UserModel.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'name', 'email', 'photo', 'role', 'active'];
    fields.forEach((field) => {
      transformed[field] = this[field];
    });
    return transformed;
  },
  token() {
    const playload = {
      exp: moment().add(jwtExpirationInterval, 'minutes').unix(),
      iat: moment().unix(),
      sub: this._id,
    };
    return Jwt.sign(playload, jwtSecret);
  },
  async matchPassword(password) {
    return bcrypt.compare(password, this.password);
  },
});

UserModel.statics = {
  async get(id) {
    if (!Types.ObjectId.isValid(id)) {
      throw new APIError({
        message: VALIDATION_ERROR,
        errors: [{
          field: 'id',
          location: 'body or params',
          messages: 'Please enter valid User ID',
        }],
        status: BAD_REQUEST,
      });
    }
    const user = await this.findById(id).exec();
    if (!user) throw new APIError({ message: NO_RECORD_FOUND, status: NOT_FOUND });
    return user;
  },

  async ValidateUserAndGenerateToken(options) {
    const { email, password } = options;
    const user = await this.findOne({ email }).exec();
    if (!user) {
      throw new APIError({ message: NO_RECORD_FOUND, status: NOT_FOUND });
    }
    if (!await user.matchPassword(password)) {
      throw new APIError({ message: INVALID_CREDENTIALS, status: BAD_REQUEST });
    }
    return { user: user.transform(), accessToken: user.token() };
  },

  checkDuplication(error) {
    if (error.code === 11000 && (error.name === 'BulkWriteError' || error.name === 'MongoError')) {
      const keys = Object.keys(error.keyPattern);
      if (keys.includes('name')) {
        return new APIError({ message: 'Name already exist', status: NOT_FOUND });
      }
      if (keys.includes('email')) {
        return new APIError({ message: EMAIL_EXIST, status: NOT_FOUND });
      }
    }
    return error;
  },
};

module.exports = model('users', UserModel);
