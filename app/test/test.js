'GET /test-in-folder';
function testShake (req, res) {
  res.status(200).send('testShake in folder.');
}

module.exports = {
  handShake: testShake
};
