//------ NodeJS Core Modules ------
const http = require('http');
const path = require('path');
const fs = require('fs');
const qs = require('querystring');

//------ Third-Partu Modules ------
const formidable = require('formidable');

//--------- Local Modules ---------
const config = require('./config.json');

//----------- CONSTANTS -----------
const VIEWS_PATH = path.resolve(config.viewsDir);
const DATA_PATH = path.resolve(config.dataDir);
const DATA_BREEDS_PATH = path.join(DATA_PATH, '/breeds.json');
const DATA_CATS_PATH = path.join(DATA_PATH, '/cats.json');
const CONTENT_PATH = path.resolve('content');

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
      sendFile(res, fullStaticFilePath, pathname);
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
    sendFile(res, fullFilePath, pathname);
  },
  POST: (req, res, pathname) => {
    if (pathname === '/addBreed') {
      collectRequestData(req, result => {
        fs.readFile(DATA_BREEDS_PATH, function(err, data) {
          let json;
          if (data.length !== 0) { // .json file is not empty
            json = JSON.parse(data)
            json.push(result.breed);
          } else {  // .json file is empty
            json = [result.breed];
          }
  
          fs.writeFile(DATA_BREEDS_PATH, JSON.stringify(json), (err) => {
            if (err) {
              console.log(err);
              return;
            }
          });
        });
        res.writeHead(301, { location: '/' }).end();
      });
    } else if (pathname === '/addCat') {
      collectRequestData(req, result => {
        fs.readFile(DATA_CATS_PATH, function(err, data) {
          let json;
          if (data.length !== 0) {
            json = JSON.parse(data);
            json.push({breed: result.breed, description: result.description, name: result.name, path: result.newPath, imageRelativePath: result.imageRelativePath });
          } else {
            json = [{breed: result.breed, description: result.description, name: result.name, path:result.newPath, imageRelativePath: result.imageRelativePath }];
          }

          //TODO: Check if file with the same name already exists in images, otherwise the code below will replace the old one.
          fs.copyFile(result.oldPath, result.newPath, function(err) {
            if (err) {
              console.log(err);
            }
          });//TODO: Remove file from TEMP

          fs.writeFile(DATA_CATS_PATH, JSON.stringify(json), (err) => {
            console.log(err);
            return;
          });
        });
        res.writeHead(301, { location: '/' }).end();
      });
    }
  }
};

function sendFile(res, fullFilePath, pathname) {
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

    if (pathname === '/addCat') {
      fs.readFile(DATA_BREEDS_PATH, function(err, buffer) {
        let breeds;
        if (buffer.length !== 0) {
          breeds = JSON.parse(buffer);
        } else {
          breeds = [];
        }

        let catBreedPlaceholder = breeds.map(breed => `<option value="${breed}">${breed}</option>`).join('');
        data = data.toString().replace('{{catBreeds}}', catBreedPlaceholder);
        res.writeHead(200, {
          'Content-Length': Buffer.byteLength(data),
          'Content-Type': type || 'text/plain'
        }).end(data);
      });
    } else if (pathname === '/') {
      fs.readFile(DATA_CATS_PATH, function(err, buffer) {
        let cats;
        if (buffer.length !== 0) {
          cats = JSON.parse(buffer);
        } else {
          cats = [];
        }

        let catsPlaceholder = cats.map(cat => `
          <li>
            <img src="${cat.imageRelativePath}" alt="${cat.name}">
            <h3>${cat.name}</h3>
            <p><span>Breed: </span>${cat.breed}</p>
            <p><span>Description: </span>${cat.description}</p>
            <ul class="buttons">
              <li class="btn edit"><a href="">Change Info</a></li>
              <li class="btn delete"><a href="">New Home</a></li>
            </ul>
          </li>
        `).join('');

        data = data.toString().replace('{{cats}}', catsPlaceholder);
        res.writeHead(200, {
          'Content-Length': Buffer.byteLength(data),
          'Content-Type': type || 'text/plain'
        }).end(data);
      });
    } else {
      res.writeHead(200, {
        'Content-Length': Buffer.byteLength(data),
        'Content-Type': type || 'text/plain'
      }).end(data);
    }
  });
}

function collectRequestData(req, callback) {
  const FORM_URLENCODED = 'application/x-www-form-urlencoded';
  const FORM_MULTIPART = 'multipart/form-data';

  if (req.headers['content-type'] === FORM_URLENCODED) {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString(); // convert Buffer to string
    });
    req.on('end', () => {
      callback(qs.parse(body));
    });
  } else if (req.headers['content-type'].includes(FORM_MULTIPART)) {
    let data = {};
    const form = formidable({ multiples: true });
    form.parse(req, (err, fields, files) => {
      data.oldPath = files.upload.path;
      data.newPath = `${CONTENT_PATH}/images/${files.upload.name}`;
      data.imageRelativePath = `/content/images/${files.upload.name}`;
      data.breed = fields.breed;
      data.description = fields.description;
      data.name = fields.name;
    });

    req.on('end', () => {
      callback(data);
    });
  } else {
    callback(null);
  }
}
