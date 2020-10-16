const { validationResult } = require('express-validator');

function handleValidationErrors(req, res, next) {
  const validationRes = validationResult(req);
  if (!validationRes.isEmpty()) { next(validationRes.errors); return; }
  next();
}

module.exports = handleValidationErrors;