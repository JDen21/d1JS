function init (req, res) {
  res.primitives.setHeader('X-Powered-By', 'dg1');
}

module.exports = [init];
