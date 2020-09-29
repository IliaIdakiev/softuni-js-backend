const config = require('./config.json');
const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const VIEWS_PATH = path.resolve(config.viewsDir);
const STATIC_FILES_PATH = path.resolve(config.staticFilesDir);

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

function httpHandler(req, res) {
  const { pathname, query } = url.parse(req.url, true);
  const method = req.method.toUpperCase();
  if (method === 'GET') {
    if (pathname.includes(`/${config.staticFilesDir}/`)) {
      const fullStaticFilePath = path.resolve(pathname.slice(1));
      sendFile(res, fullStaticFilePath);
      return;
    }

    const fileRelativePath = routeFileMap[pathname];

    if (!fileRelativePath) {
      const data = 'Not Found';
      res.writeHead(404, {
        'Content-Length': Buffer.byteLength(data),
        'Content-Type': 'text/plain'
      }).end(data);
      return;
    }

    const fullFilePath = path.join(VIEWS_PATH, fileRelativePath);
    sendFile(res, fullFilePath);
  } else if (method === 'POST') {
    res.writeHead(301, { location: '/' }).end();
  }

}

http.createServer(httpHandler).listen(config.port, function () {
  console.log(`Server is listening on ${config.port}`);
});