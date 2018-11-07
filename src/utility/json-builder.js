const createErrorJson = err => {
  const errorJson = { message: err.message };

  return errorJson;
};

module.exports = {
  createErrorJson,
};
