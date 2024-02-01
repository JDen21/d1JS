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

module.exports = {
  testRoute,
  testRouteNoValidSend,
  testNoMethod
};
