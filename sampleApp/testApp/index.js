const __D1__SERVER__ = {
  port: 3000,
  host: '127.0.0.1',
  cb: function () {
    console.log(`listening to http://${__D1__SERVER__.host}:${__D1__SERVER__.port}`);
  },
  getServerInstance: function (server) {
    return server;
  }
};
let data;
const __D1__CONFIGS__ = {
  excludeFolderRouting: false,
  excludeFileRouting: false,
  router: {
    ignoreTrailingSlash: true,
    allowUnsafeRegex: false,
    discoveredRoutes: (discoveredRoutes) => {
      data = discoveredRoutes;
    }
  }
};

const __D1__MIDDLEWARES__ = [middleWare1, {
  cb: middleware2,
  excludePaths: ['/test']
  // onlyPaths: ['/'] // * excludePaths will be ignored if onlyPaths is present
}];

function middleWare1 (req, res) {
  console.log('middleware 1 is procced');
}

function middleware2 (req, res) {
  console.log('middleware 2 is procced');
  res.send('early returning middleware 2');
}

'GET /';
function handShake (req, res) {
  res.status(200).send(data);
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
  __D1__SERVER__,
  __D1__CONFIGS__,
  __D1__MIDDLEWARES__,
  handShake,
  shakeTest: handShakeTest,
  notARoute
};
