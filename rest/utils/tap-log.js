module.exports = function tapLog(message) {
  return function (data) {
    console.log(message);
    if (data instanceof Error) { return Promise.reject(data); }
    return Promise.resolve(data);
  };
};
