//------ NodeJS Core Modules ------
const http = require('http');
const path = require('path');
const fs = require('fs');
const qs = require('querystring');

//--------- Local Modules ---------
const config = require('./config.json');

//----------- CONSTANTS -----------
const VIEWS_PATH = path.resolve(config.viewsDir);
const DATA_PATH = path.resolve(config.dataDir);

const routeFileMap = {
  '/': '/home/index.html',
  '/addBreed': '/addBreed.html',
  '/addCat': '/addCat.html'
};

const mimeTypeMap = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json'
}

//-----------------------------------------------------------------------------------
http.createServer(httpHandler).listen(config.port, function () {
  console.log(`Server is listening on ${config.port}`);
});

function httpHandler(req, res) {
  const { pathname, searchParams } = new URL(req.url, `http://${req.headers.host}`);
  const method = req.method.toUpperCase();
  actions[method](req, res, pathname);
}

//----------- ACTION OBJS -----------
const actions = {
  GET: (req, res, pathname) => {
    if (pathname.includes('/content/')) { // For static files
      const fullStaticFilePath = path.resolve(pathname.slice(1));
      sendFile(res, fullStaticFilePath);
      return;
    }

    const relativeFilePath = routeFileMap[pathname];
    if (!relativeFilePath) {
      const body = 'Not Found';
      res.writeHead(404, {
        'Content-Length': Buffer.byteLength(body),
        'Content-Type': 'text/plain'
      }).end(body);
      return;
    }
  
    const fullFilePath = path.join(VIEWS_PATH, relativeFilePath);
    sendFile(res, fullFilePath);
  },
  POST: (req, res, pathname) => {
    if (pathname === '/addBreed') {
      const fullFilePath = path.join(DATA_PATH, '/breeds.json');
      collectRequestData(req, result => {
        fs.readFile(fullFilePath, function(err, data) {
          let json;
          if (data.length !== 0) { // .json file is not empty
            json = JSON.parse(data)
            json.push(result.breed);
          } else {  // .json file is empty
            json = [result.breed];
          }
  
          fs.writeFile(fullFilePath, JSON.stringify(json), (err) => {
            if (err) {
              console.log(err);
              return;
            }
          });
        });
        res.writeHead(301, { location: '/' }).end();
      });
    } else if (pathname === '/addCat') {
        const fullFilePath = path.join(DATA_PATH, '/cats.json');
        //TODO implement addCat functionality
    }
  }
};

function sendFile(res, fullFilePath) {
  const fileExt = path.extname(fullFilePath);
  const type = mimeTypeMap[fileExt];

  fs.readFile(fullFilePath, function (err, data) {
    if (err) {
      const { message } = err;
      res.writeHead(500, {
        'Content-Length': Buffer.byteLength(message),
        'Content-Type': 'text/plain'
      }).end(message);
      return;
    }

    res.writeHead(200, {
      'Content-Length': Buffer.byteLength(data),
      'Content-Type': type || 'text/plain'
    }).end(data);
  });
}

function collectRequestData(req, callback) {
  const FORM_URLENCODED = 'application/x-www-form-urlencoded';
  if (req.headers['content-type'] === FORM_URLENCODED) {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString(); // convert Buffer to string
    });
    req.on('end', () => {
      callback(qs.parse(body));
    });
  } else {
    callback(null);
  }
}
