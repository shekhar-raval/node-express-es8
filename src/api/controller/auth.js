const { Login, Register } = require('../service/auth');
const { OK, CREATED } = require('../../utils/constants');

/**
 * Authenticate User
 *
 * @public
 * @param {Request} req
 * @param {Response} res
 * @param {next} next
 */
exports.login = async (req, res, next) => {
  try {
    const data = await Login(req.body);
    res.status(OK).json({ data, success: 'SUCCESS' });
  } catch (err) {
    next(err);
  }
};

/**
 * Register a new User
 *
 * @public
 * @param {Request} req
 * @param {Response} res
 * @param {next} next
 */
exports.register = async (req, res, next) => {
  try {
    const data = await Register(req.body);
    res.status(CREATED).json({ data, success: 'SUCCESS' });
  } catch (err) {
    next(err);
  }
};
