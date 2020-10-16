module.exports = function globalErrorHandler(err, req, res, next) {
  if (res.locals.validationErrorViewName) {
    res.render(res.locals.validationErrorViewName, { errors: err, ...req.body });
    return;
  }
  if (err.message === 'BAD_REQUEST') {
    res.status(400);
    return;
  }
  if (err.message === 'UNAUTHORIZED') {
    res.redirect('/');
    return;
  }
};
