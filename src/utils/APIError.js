const { INTERNAL_SERVER_ERROR } = require('./constants');

class APIError extends Error {
  /**
    * Creates an API error.
    * @param {string} message - Error message.
    * @param {Array} errors - Array of validation fields Errors.
    * @param {number} status - HTTP status code of error.
    * @param {boolean} isPublic - Whether the message should be visible to user or not.
    */
  constructor({
    message,
    stack,
    errors = [],
    status = INTERNAL_SERVER_ERROR,
    isPublic = false,
  }) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.errors = errors;
    this.status = status;
    this.isPublic = isPublic;
    this.stack = stack;
  }
}

module.exports = APIError;
