const express = require('express');
const path = require('path');
const handlebars = require('express-handlebars');

const app = express();

const jsonBodyParser = express.json();
const urlencodedBodyParser = express.urlencoded({ extended: true });

const users = [
  { name: 'Ivan', age: 20 },
  { name: 'Stefan', age: 30 }
];

app.engine('.hbs', handlebars({
  extname: '.hbs'
}));
app.set('view engine', '.hbs');

app.use(jsonBodyParser);
app.use(urlencodedBodyParser);

app.use('/public', express.static('./static'));

app.get('/', function (req, res) {
  res.render('home', { users });
});

app.get('/user/:idx', function (req, res) {
  const selectedUser = users[req.params.idx];
  res.render('home', { users, selectedUser, selectedUserIndex: req.params.idx });
});

app.post('/user/:idx', function (req, res) {
  const { name, age } = req.body;
  users[req.params.idx] = { name, age: +age };
  res.redirect('/');
});

app.post('/user', function (req, res) {
  const { name, age } = req.body;
  users.push({ name, age: +age });
  res.redirect('/');
});

app.get('/about', function (req, res) {
  res.render('about');
});

app.post('/', function (req, res) {
  console.log(req.body);
  res.send(req.body);
});

app.listen(3000, function () {
  console.log('App is listening on :3000');
});