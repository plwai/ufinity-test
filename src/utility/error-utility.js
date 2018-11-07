class WarnError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, WarnError);
    }
  }
}

module.exports = WarnError;
