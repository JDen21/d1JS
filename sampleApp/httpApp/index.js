/**
 * Files named index in any level of folder will
 * be ignored in route paths.
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

'GET /unexported';
// function unExportedRoute (req, res) {
//   res.status(200).send('success');
// }

module.exports = {
  handShake,
  shakeTest: handShakeTest,
  notARoute
};
