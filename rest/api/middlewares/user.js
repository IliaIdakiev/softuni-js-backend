module.exports.extractBodyData = function extractBodyData(req, res, next) {
  const { email, password } = req.body;
  req.body = { email, password };
  next();
};