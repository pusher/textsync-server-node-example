const TextSync = require('textsync-server-node');
const config = require('./config');
const htmlGenerator = require('./html-generator');
const http = require('http');
const url = require('url');

const debug = (...args) => {
  if (config.DEBUG) {
    console.log('debug::: ', ...args);
  }
};

const port = config.PORT || 3030;
const textsync = new TextSync({
  instanceLocator: config.INSTANCE_LOCATOR,
  key: config.KEY
});

let html = htmlGenerator.generate(config.ENDPOINT);

const server = http.createServer((req, res) => {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  const { method, headers } = req;
  const _url = req.url;
  let path = url.parse(_url).pathname;
  if (method !== 'POST' || !hasJSONHeader(headers)) {
    res.setHeader('Content-Type', 'text/html');
    res.write(html);
    res.end();
    return;
  }
  parseJSONBody(req)
    .then(body => {
      debug('received auth request');
      debug('req.body:', req.body);
      // The permissions function should take information about the user from the
      // req object and determine the permissions the user has for the requested
      // document.
      //
      // The users permissions should be modelled as an array of the permissions
      // exposed by TextSync.Permissions. The permissions function should return
      // a promise resolving to this array.
      //
      // For simplicity, this permissions function is granting full READ/WRITE
      // permissions to all requests
      const permissionsFn = documentId => {
        return Promise.resolve([
          TextSync.Permissions.READ,
          TextSync.Permissions.WRITE
        ]);
      };

      // set the tokenExpiry to 20 minutes
      let options = { tokenExpiry: 1 * 60 * 20 };
      let token = textsync
        .authorizeDocument(body, permissionsFn, options)
        .then(token => {
          res.setHeader('Content-Type', 'application/json');
          res.write(JSON.stringify(token));
          res.end();
        })
        .catch(err => {
          console.error('Error, authorizing document', err);
          res.statusCode = 500;
          res.write('Internal Server Error');
          res.end();
        });
    })
    .catch(err => {
      console.error('Error parsing json', err);
      res.statusCode = 400;
      res.write('Malformed JSON');
      res.end();
    });
});

const hasJSONHeader = headers => {
  let contentType = headers['content-type'];
  if (!contentType) return false;
  return contentType.split(';')[0] === 'application/json';
};

const parseJSONBody = req => {
  let body = '';
  return new Promise((resolve, reject) => {
    req
      .on('data', chunk => {
        body += chunk.toString();
      })
      .on('end', () => {
        let json;
        try {
          json = JSON.parse(body);
        } catch (e) {
          reject(e);
        }
        resolve(json);
      });
  });
};

server.listen(port, () => {
  let msg = `listening on ${port}`;
  if (config.DEBUG) msg += ' - DEBUG mode';
  console.log(msg);
});
