const mongos = require('../mongos');

const userSchema = new mongos.Schema({
  name: {
    type: String,
    validate: {
      validator(value) { return value.length > 3 },
      message: 'Name should be longer than 3 characters!'
    }
  },
  age: { type: Number },
  email: { type: String }
});

module.exports = mongos.model('users', userSchema);
