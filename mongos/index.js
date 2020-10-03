const mongos = require('./mongos');
const User = require('./models/user');

mongos.connect('mongodb://127.0.0.1:27017/softuni-test').then(() => {
  console.log('Connected to Database successfully!')


  User.create({
    name: 'Ivan', age: 20, email: 'sdadas'
  }).then((user) => {
    user.name = 'Test 1';
    return user.save();
  })
    .then(() => console.log('User was successfully modified!'))
    .catch(err => {
      console.log(err);
    });
});
