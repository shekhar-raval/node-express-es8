const { TTGet, TTSet } = require('../config/redis');

/**
 * Generate Unique Key for Data to Cache
 * @private
 * @param {string} path Path of Request
 * @param {string} param Request Params
 * @param {string} query Request Query
 * @returns {string} key
 */
const generateKey = (path, param, query) => `API-${path}-${param}-${query}`;

/**
 * Cache Data in Redis
 * @public
 * @param {Object} data Data to cache
 * @param {string} path Request Path
 * @param {string} param Request Params
 * @param {string} query Request Query
 * @returns {Boolean} status
 */
exports.CreateCache = async (data, path, param = 0, query = 0) => {
  const key = generateKey(path, param, query);
  const rez = await TTSet(key, 3600, JSON.stringify(data));
  return rez === 'OK';
};

/**
 * Return Cached data if exists
 * @public
 * @param {string} path Request Path
 * @param {string} param Request Params
 * @param {string} query Request Query
 * @returns {Object} cached data
 */
exports.GetCache = async (path, param = 0, query = 0) => {
  const key = generateKey(path, param, query);
  const data = await TTGet(key);
  return JSON.parse(data);
};
