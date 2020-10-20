module.exports = function (err, req, res, next) {
  console.error(err);
  res.status(500).end({ message: 'Server Error' });
};
