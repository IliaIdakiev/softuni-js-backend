const exprss = require('./exprss');

const app = exprss();

function logRequestDate(req, res, next) {
  console.log(Date.now());
  next();
}

function bodyParser(req, res, next) {
  let data;

  req.on('data', function (chunk) {
    data = data ? Buffer.concat(data, chunk) : chunk;
  });

  req.on('end', function () {
    const body = JSON.parse(data.toString());
    req.body = body;
    next();
  });
}

app.get('/', logRequestDate, function (req, res) {
  res.end('HELLO FROM EXPRSS');
});

app.post('/', logRequestDate, bodyParser, function (req, res) {
  console.log(req.body);
  res.end(req.body);
});

const users = [];

app.post('/user', bodyParser, function (req, res) {
  users.push(req.body);
  res.end('O.K');
})

app.listen(3000, function () {
  console.log('EXPRSS is listening on :3000');
});