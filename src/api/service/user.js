const { omit } = require('lodash');
const User = require('../models/user');

/**
 * Get logged in user info
 * @public
 */
exports.LoginUser = (req, res) => res.json(req.user.transform());

/**
 * Create User
 * @public
 */
exports.CreateUser = async (userData) => {
  try {
    const user = new User(userData);
    const su = await user.save();
    return su.transform();
  } catch (err) {
    throw User.checkDuplication(err);
  }
};

/**
 * Get User By ID
 * @public
 */
exports.Get = async (id) => User.get(id);

/**
 * Update Existing User
 * @public
 */
exports.UpdateUser = async (user, newData) => {
  try {
    const role = user.role !== 'admin' ? 'role' : '';
    const userToUpdate = omit(newData, role);
    const updateData = Object.assign(user, userToUpdate);
    return updateData;
  } catch (err) {
    throw User.checkDuplication(err);
  }
};

/**
 * Replace existing user
 * @public
 */
exports.ReplaceUser = async (user, newUserData) => {
  try {
    const newUser = new User(newUserData);
    const ommitRole = user.role !== 'admin' ? 'role' : '';
    const newUserObject = omit(newUser.toObject(), '_id', ommitRole);

    await user.update(newUserObject, { override: true, upsert: true });
    const savedUser = await User.findById(user._id);

    return savedUser.transform();
  } catch (error) {
    throw User.checkDuplicateEmail(error);
  }
};

exports.RemoveUser = async (user) => user.remove();
