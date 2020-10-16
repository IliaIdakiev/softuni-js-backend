const { body } = require('express-validator');
const userModel = require('../models/user');

const repeatPasswordCheck = body('repeatPassword').custom((value, { req }) => {
  if (value !== req.body.password) {
    throw new Error('Passwords don\'t match!');
  }
  return true;
});

const checkUsernameExistence = body('username').custom((value, { req }) => {
  return userModel.findOne({ username: value }).then(user => {
    if (user) { return Promise.reject('Username already in use!'); }
  });
});

module.exports = {
  repeatPasswordCheck,
  checkUsernameExistence
};