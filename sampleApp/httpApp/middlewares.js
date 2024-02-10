/**
 * __D1__MIDDLEWARES is an array that can take objects or
 * middleware functions. Can only be defined in first level files
 * If object, keys are:
 * cb: The middleware function to run
 * excludePaths: the paths where the middleware does not run [Array of String paths]
 * onlyPaths: the paths where the middleware run. If used excludePaths is not used by the app [Array of String paths]
 * */

const __D1__MIDDLEWARES__ = [
  // middleWare1,
  {
    cb: middleWare1,
    excludePaths: ['/test']
  },
  {
    cb: middleware2,
    onlyPaths: ['/test'] // * excludePaths will be ignored if onlyPaths is present
  }
];

function middleWare1 (req, res) {
  res.send('early returning middleware');
}

function middleware2 (req, res) {
  console.log('middleware that does not attempt to send data');
}

module.exports = {
  __D1__MIDDLEWARES__
};
