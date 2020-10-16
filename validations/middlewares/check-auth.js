module.exports = function checkAuth(shouldBeAuthenticated) {
  return function (req, res, next) {
    const isNotAuthWhenAuthIsRequired =
      shouldBeAuthenticated && !req.user;
    if (
      (isNotAuthWhenAuthIsRequired) ||
      (!shouldBeAuthenticated && req.user)
    ) {
      next(new Error('UNAUTHORIZED'));
      return;
    }
    next();
  };
};