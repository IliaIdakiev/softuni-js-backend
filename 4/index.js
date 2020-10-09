const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
var jwt = require('jsonwebtoken');
// const session = require('express-session');
// const uuid = require('uuid');
// const COOKIE_NAME = 'COOKIE_NAME';
const TOKEN_KEY = 'TOKEN_KEY';
const secret = 'secret';


// const sessionStore = {

// };

// function session(config) {
//   return function (req, res, next) {
//     if (!req.cookies[COOKIE_NAME]) {
//       const id = uuid.v1();
//       sessionStore[id] = {};
//       res.cookie(COOKIE_NAME, id, { httpOnly: config ? !!config.httpOnly : false });
//       req.session = sessionStore[id];
//     } else {
//       const id = req.cookies[COOKIE_NAME];
//       req.session = sessionStore[id];
//     }
//     next();
//   };
// }

function jwtSession(config) {
  return function (req, res, next) {
    let token = req.cookies[TOKEN_KEY] || req.headers[TOKEN_KEY];
    const originalWrite = res.write;

    let isJWTSessionSet = false;
    function setJWTSession(cb) {
      if (isJWTSessionSet) { cb(); return; }
      isJWTSessionSet = true;

      jwt.sign(req.session, secret, config, (err, token) => {
        if (err) { next(err); return; }
        res.cookie(TOKEN_KEY, token);
        res.set(TOKEN_KEY, token);
        cb();
      });
    }

    res.write = function (chunk, encoding, callback) {
      setJWTSession(() => originalWrite.call(res, chunk, encoding, callback));
    };
    const originalEnd = res.end;
    res.end = function (chunk, encoding) {
      setJWTSession(() => originalEnd.call(res, chunk, encoding));
    };
    if (!token) {
      req.session = {};
      next();
      return;
    }

    jwt.verify(token, secret, function (err, decoded) {
      req.session = decoded;
      next();
    });
  }
}

const app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(cookieParser());
app.use(jwtSession());
// app.use(session({ httpOnly: true, secret: '123' }));

let users = [
  {
    id: 1,
    firstName: 'Ivan',
    age: 20
  },
  {
    id: 2,
    firstName: 'Todor',
    age: 30
  },
  {
    id: 3,
    firstName: 'Alex',
    age: 50
  }
];

app.get('/api/users', function (req, res) {
  res.send(users);
});

app.get('/api/user/:id', function (req, res) {
  const id = +req.params.id;
  const user = users.find(u => u.id === id);
  res.send(user);
});

app.delete('/api/user/:id', function (req, res) {
  const id = +req.params.id;
  const userIndex = users.findIndex(u => u.id === id);
  const user = users[userIndex];
  users = [...users.slice(0, userIndex), ...users.slice(userIndex + 1)];
  req.session.deletedUsers = (req.session.deletedUsers || []).concat(user);
  res.send(user);
});

app.get('*', function (req, res) {
  res.sendFile(path.resolve('./index.html'));
  // res.render('index');
});

app.listen(3000, function () {
  console.log('Server is listening on 3000');
});