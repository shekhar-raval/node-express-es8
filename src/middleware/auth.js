const passport = require('passport');
const {
  ROLES, UNAUTHORIZED, LOGGED_IN, FORBIDDEN,
} = require('../utils/constants');
const APIError = require('../utils/APIError');

const handleJWT = (req, res, next, roles) => async (err, user, info) => {
  const error = err || info;

  const apiError = new APIError({
    message: error ? error.message : 'Unauthorized',
    status: UNAUTHORIZED,
    stack: error ? error.stack : undefined,
  });
  if (err || !user) {
    return next(apiError);
  } if (roles === LOGGED_IN) {
    if (user.role !== 'admin' && req.params.userId !== user._id.toString()) {
      apiError.status = FORBIDDEN;
      apiError.message = 'Forbidden';
      return next(apiError);
    }
  } else if (!roles.includes(user.role)) {
    apiError.status = FORBIDDEN;
    apiError.message = 'Forbidden';
    return next(apiError);
  }

  req.user = user;

  return next();
};

exports.Authorize = (roles = ROLES) => (req, res, next) => passport.authenticate('jwt',
  { session: false },
  handleJWT(req, res, next, roles))(req, res, next);
