const {
  Get, CreateUser,
  UpdateUser, RemoveUser,
  ReplaceUser,
  UploadFile,
} = require('../service/user');
const { Handler } = require('../../middleware/error');
const { CREATED } = require('../../utils/constants');
const { CreateCache, GetCache } = require('../../utils/cache');

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const data = await GetCache(req.path, req.params);
    if (data) {
      req.locals = { data };
      return next();
    }
    const user = await Get(id);
    req.locals = { user };
    await CreateCache(user, req.path, req.params);
    return next();
  } catch (error) {
    return Handler(error, req, res, next);
  }
};

/**
 * Get user
 * @public
 */
exports.get = (req, res) => res.json({ data: req.locals.user.transform(), success: 'SUCCESS' });

/**
 * Get logged in user info
 * @public
 */
exports.loggedIn = (req, res) => res.json({ data: req.user.transform(), success: 'SUCCESS' });

/**
 * Create new user
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const response = await CreateUser(req.body);
    return res.status(CREATED).json({ data: response, success: 'SUCCESS' });
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
    return res.json({ data: response, success: 'SUCCESS' });
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
    return res.json({ data: response, success: 'SUCCESS' });
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

exports.upload = async (req, res, next) => {
  try {
    const data = await UploadFile(req.file);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};
