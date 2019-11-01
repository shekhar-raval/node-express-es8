const { omit } = require('lodash');
const User = require('../models/user');

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

exports.RemoveUser = async (user) => user.remove();
