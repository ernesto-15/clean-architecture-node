const { config } = require('../../config');
const boom = require('@hapi/boom');

function withErrorStack(error, stack) {
  if (config.dev) {
    return {
      ok: false,
      ...error,
      stack,
    };
  }
  return error;
}

function wrapError(err, req, res, next) {
  if (!err.isBoom) {
    next(boom.badImplementation(err));
  }

  next(err);
}

function logError(err, req, res, next) {
  //console.log(err);
  next(err);
}

function errorHandler(err, req, res, next) {
  const {
    output: { statusCode, payload },
  } = err;
  //console.log(err)
  res.status(statusCode);
  res.json(withErrorStack(payload, err.stack));
}

module.exports = {
  wrapError,
  withErrorStack,
  logError,
  errorHandler,
};
