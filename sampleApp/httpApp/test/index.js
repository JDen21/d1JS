const path = require('path');
'post /no-send';
function testRoute (req, res) {
  return 'route that not call send';
}
'get /no-valid-send';
function testRouteNoValidSend (req, res) {

}

'/no-valid-method';
function testNoMethod (req, res) {
  return 'this path defaults to get';
}

'get /async-method';
function asyncMethod (req, res) {
  return Promise.resolve({ asc: 'this is async response.' });
}

'get /test-static-file';
function sendFileMethod (req, res) {
  res.sendFile(path.join(__dirname, '../../static/test.html'));
}

module.exports = {
  testRoute,
  testRouteNoValidSend,
  testNoMethod,
  asyncMethod,
  sendFileMethod
};
