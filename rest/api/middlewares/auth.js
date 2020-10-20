module.exports.isAuth =
  function (shouldBeAuthenticated, userRoles) {
    return function (req, res, next) {
      // check if token exists and if its valid
      // check if the endpoint requires authentication and if the user is authenticated
      // check if current user role is in userRoles if any
      // if conditions are not met return 401
      next();
    }
  }