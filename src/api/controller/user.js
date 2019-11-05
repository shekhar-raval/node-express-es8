const {
  Get, CreateUser,
  UpdateUser, RemoveUser,
  ReplaceUser,
} = require('../service/user');
const { ErrorHandler } = require('../../middleware/error');
const { CREATED } = require('../../utils/constants');

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const user = await Get(id);
    req.locals = { user };
    return next();
  } catch (error) {
    return ErrorHandler(error, req, res);
  }
};

/**
 * Get user
 * @public
 */
exports.get = (req, res) => res.json(req.locals.user.transform());

/**
 * Get logged in user info
 * @public
 */
exports.loggedIn = (req, res) => res.json(req.user.transform());

/**
 * Create new user
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const response = await CreateUser(req.body);
    return res.status(CREATED).json(response);
  } catch (error) {
    return next(error);
  }
};

/**
 * Update existing user
 * @public
 */
exports.update = async (req, res, next) => {
  try {
    const { user } = req.locals;
    const response = await UpdateUser(user, req.body);
    return res.json(response);
  } catch (error) {
    return next(error);
  }
};

/**
 * Replace existing user
 * @public
 */
exports.replace = async (req, res, next) => {
  try {
    const { user } = req.locals;
    const response = await ReplaceUser(user, req.body);
    return res.json(response);
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete user
 * @public
 */
exports.remove = async (req, res, next) => {
  try {
    const { user } = req.locals;
    await RemoveUser(user);
    res.status(203).end();
  } catch (error) {
    next(error);
  }
};
