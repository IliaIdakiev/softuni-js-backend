module.exports = function setValidationErrorViewName(viewName) {
  return function (req, res, next) {
    res.locals.validationErrorViewName = viewName;
    next();
  }
}