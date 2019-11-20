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
 *
 * @param {Object} userData userData
 * @param {String} userData.email User's Email
 * @param {String} userData.password User's Password
 * @param {String} userData.name User's Name
 *
 * @returns {User} Created User Object
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
 *
 * @param {ObjectId} id mongoose Object id of user
 * @returns {Promise<User>} user data
 */
exports.Get = async (id) => User.get(id);

/**
 * Update Existing User
 * @public
 *
 * @param {Object} user User Data (Old)
 * @param {Object} newData User Data (new)
 *
 * @returns {User} Updated user data
 */
exports.UpdateUser = async (user, newData) => {
  try {
    const role = user.role !== 'admin' ? 'role' : '';
    const userToUpdate = omit(newData, role);
    const updateData = Object.assign(user, userToUpdate);
    const savedUser = await updateData.save();
    return savedUser.transform();
  } catch (err) {
    throw User.checkDuplication(err);
  }
};

/**
 * Replace existing user
 * @public
 *
 * @param {Object} user User Data (Old)
 * @param {Object} newUserData User Data (New)
 *
 * @returns {User} Replaced user data
 */
exports.ReplaceUser = async (user, newUserData) => {
  try {
    const newUser = new User(newUserData);
    const ommitRole = user.role !== 'admin' ? 'role' : '';
    const newUserObject = omit(newUser.toObject(), '_id', ommitRole);

    await user.updateOne(newUserObject, { override: true, upsert: true });
    const savedUser = await User.findById(user._id);

    return savedUser.transform();
  } catch (error) {
    throw User.checkDuplication(error);
  }
};

/**
 * Remove User
 * @public
 *
 * @param {Object} user User to be Removed
 */
exports.RemoveUser = async (user) => user.remove();

/**
 * Upload Image to System
 * @param {Req} file - File Object in Request
 */
exports.UploadFile = async (file) => {
  const { path } = file;
  return path;
};
