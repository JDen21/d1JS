/**
 * Files named index in any level of folder will
 * be ignored in route paths.
 * Three native objects in the app: request, response, server
 * request and response is passed in all middlewares in the app
 * and is passed down from first middleware to the route middleware
 */
'GET /';
function handShake (req, res) {
  res.status(200).send('handshake test');
}

'GET /test';
function handShakeTest (req, res) {
  res.status(200).send('Handshake success.');
}

function notARoute (req, res) {
  res.status(400).send('not a route');
}

module.exports = {
  handShake,
  shakeTest: handShakeTest,
  notARoute
};
