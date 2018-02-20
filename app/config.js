const { INSTANCE_LOCATOR, KEY, PORT, DEBUG } = process.env;
let { ENDPOINT } = process.env;

const DEFAULT_ENDPOINT = '/textsync/tokens';
const getMissingKeyErrorString = keyName =>
  `Unable to find environment variable: ${keyName}! ` +
  `Did you remember to set the ${keyName} value in your .env file?`;

if (!INSTANCE_LOCATOR) {
  throw new Error(getMissingKeyErrorString('INSTANCE_LOCATOR'));
}
if (!KEY) {
  throw new Error(getMissingKeyErrorString('KEY'));
}

ENDPOINT = ENDPOINT || DEFAULT_ENDPOINT;

module.exports = { INSTANCE_LOCATOR, KEY, PORT, DEBUG, ENDPOINT };
