const express = require('express');
const bodyParser = require('body-parser');
const TextSync = require('textsync-server-node');
const config = require('./config');
const htmlGenerator = require('./html-generator');

const app = express();
const port = config.PORT || 3030;
const textsync = new TextSync({
  instanceLocator: config.INSTANCE_LOCATOR,
  key: config.KEY
});

const debug = (...args) => {
  if (config.DEBUG) {
    console.log('debug::: ', ...args);
  }
};

// Allow CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post(config.ENDPOINT, (req, res) => {
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
    .authorizeDocument(req.body, permissionsFn, options)
    .then(token => {
      res.json(token);
    });
});

const html = htmlGenerator.generate(config.ENDPOINT);
app.get('/', (req, res) => {
  res.set('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
});

app.listen(port, () => {
  let msg = `listening on ${port}`;
  if (config.DEBUG) msg += ' - DEBUG mode';
  console.log(msg);
});
