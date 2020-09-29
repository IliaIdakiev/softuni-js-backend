// const stream = require('stream');

// function createReadableStream(data) {
//   let counter = 0;
//   const rs = stream.Readable({
//     read(size) {
//       const item = data[counter++] || null;
//       this.push(item ? Buffer.from(item.toString()) : null);
//     }
//   });
//   return rs;
// }

// function createWritableStream() {
//   let data;

//   const ws = stream.Writable({
//     write(chunk, enc, next) {
//       data = !data ? chunk : Buffer.concat([data, chunk]);
//       next();
//     },
//     // final() {
//     //   console.log(data);
//     // }
//   });

//   ws.on('finish', function () {
//     console.log(data);
//   });

//   return ws;
// }

// const rs = createReadableStream([1, 2, 3, 4, 5, 6, 7]);
// const ws = createWritableStream();

// ws.on('finish', function () {
//   console.log('All Done!');
// });

// rs.pipe(ws);

// const _ = require('lodash');

// const res = _.chunk(['a', 'b', 'c', 'd'], 2);

// console.log(res);

// const fs = require('fs');
// const config = require('./config.json');
// console.log(config.port);

// try {
//   let content = fs.readFileSync('./config.json', { encoding: 'utf-8' });
//   content = JSON.parse(content);
//   console.log(content.port);
// } catch (e) {
//   console.error(e);
// }

// const utils = require('./utils');

// console.log(utils.sum(1, 3));

// console.log('Hello!');

// setTimeout(() => {
//   console.log('Hello from setTimeout 1!');
// }, 3000);

// setTimeout(() => {
//   console.log('Hello from setTimeout 2!');
// }, 4000);

// console.log('End');

const config = require('./config.json');
const http = require('http');
const fs = require('fs');
const url = require('url');
const stream = require('stream');
const zlib = require('zlib');

const zips = zlib.createDeflate();

// https://asecuritysite.com/coding/asc2

function lowerToUpper(letterCode) {
  // pass CharCode here
  // code reference http://www.asciitable.com/ charCodeAt returns
  // The first 128 Unicode code points are a direct match of the ASCII character encoding. (For information on Unicode, see the JavaScript Guide.)
  // ^ from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt

  if (letterCode >= 97 && letterCode <= 122) {
    // its a lowerCase ascii char

    return letterCode - 32;
  }

  return letterCode; // every other case
}

function createUppercaseStream() {
  const ts = stream.Transform({
    transform(chunk, enc, next) {
      for (let i = 0; i < chunk.length; i++) {
        chunk[i] = lowerToUpper(chunk[i]);
      }
      next(null, chunk);
    }
  });

  return ts;
}

const us = createUppercaseStream();


http.createServer(function (req, res) {
  const path = url.parse(req.url).pathname;
  if (path === '/') {
    const rs = fs.createReadStream('./text.txt', { highWaterMark: 10 });
    // rs.on('data', function (chunk) {
    //   console.log(chunk);
    // });
    // res.on('finish', function () {
    //   console.log('END');
    // })
    res.writeHead(200, { 'Content-type': 'text/plain' });
    rs.pipe(us).pipe(res);
    // fs.readFile(, { encoding: 'utf-8' }, function (err, content) {
    //   res.end(content.toUpperCase());
    // });
  } else if (path === '/test') {
    res.end('HELLO!');
  }
  // res.write();
  // res.end('Hello Word!');
}).listen(config.port);


for (var i = 0; i < 5; i++) {
  setTimeout(function () { console.log(i); }, 0);
}