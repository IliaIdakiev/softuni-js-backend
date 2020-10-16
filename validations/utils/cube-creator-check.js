module.exports = function (req) {
  return function cubeCreatorCheck(cube) {
    if (cube.creatorId !== req.user._id) {
      return Promise.reject(new Error('UNAUTHORIZED'))
    }
    return cube;
  };
};