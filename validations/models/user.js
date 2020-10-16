const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('../config/config');
const saltRounds = config.saltRounds;

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 8
  },
  password: {
    type: String,
    required: true
  }
});

userSchema.methods.comparePasswords = function (providedPassword) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(providedPassword, this.password, function (err, result) {
      if (err) { reject(err); return; }
      resolve(result);
    });
  });
};

userSchema.pre('save', function (done) {
  const user = this;

  if (!user.isModified('password')) {
    done();
    return;
  }

  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) { done(err); return; }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) { done(err); return; }
      user.password = hash;
      done();
    });
  });
});

module.exports = new mongoose.model('user', userSchema);
