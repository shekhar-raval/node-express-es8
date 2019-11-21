const redis = require('redis');
const { promisify } = require('util');
const { redisHost, redisPort } = require('./env-vars');
const logger = require('./logger');

/**
 * Create Redis Connection
 * @private
 */
const client = redis.createClient({
  host: redisHost,
  port: redisPort,
});

/**
 * Logs Info when connected to Redis Server
 * @public
 */
client.on('connect', () => logger.info('Redis Server is Running'));

/**
 * Logs Error while connecting to Redis Server
 * @public
 */
client.on('error', (err) => logger.error(`Error Connecting to Redis Server ${err}`));

/**
 * Promisify Get function
 * @public
 */
exports.TTGet = promisify(client.get).bind(client);

/**
 * Promisify Set Value with Expiration function
 * @public
 */
exports.TTSet = promisify(client.setex).bind(client);

/**
 * Returns Redis Client
 * @public
 * @returns {Function} client
 */
exports.RedisClient = () => client;
