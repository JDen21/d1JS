const path = require('path');
const http = require('http');
const findMyWay = require('find-my-way');
const errors = require('./errors');
const constants = require('./constants');
const {
  checkDefinitionExported,
  readFullFolder,
  findRouteInPaths,
  designateRoutes
} = require('./utils');

/**
 * User can only define the server in the app folder
 * There will be app reserved names, which should only be found in main index.js
 * __D1__SERVER__: Object that contains the description for the server instance to create
 * __D1__CONFIGS__: Object containing extra configs and config overrides.
 *
 * Routing will be composed of a path preprocessor and an action
 * 'path'
 * function action
 * ex.
 * '/'
 * function (req, res, next) {
 *  some action to do
 * }
 *
 * every function action is a middleware
 * which means you can reuse them anywhere
 * else you want. it also possible to create
 * a function action with no path.
 *
 * Route paths will include folders, filenames, and specified routes
 * ex. user might provide path '/login' in file accounts/user.js
 * then the final route path will be '/accounts/user/login'.
 * if the filename is index.js then the filename will be excluded
 * in the route path.
 *
 * There should be no need to provide a callback, the app will only
 * serve routes where there is an exported function action with route path
 *
 *
 * res.metadata.endHttp = setting this to true will stop the call through next middlewares
 * res.send automatically sets endHttp to true. However when using native call,
 * user should manually set endHttp
 *
 * if middleware.onlyPaths exist, middleware,excludePaths will be ignored
 * __D1__SERVER__.getServerInstance: provides the native server object via cb
 */

function serve (applicationPath) {
  // * use acorn to check for file details
  const app = readFullFolder(applicationPath, []);

  // * check for one of the deg 1 app files for server definition
  const fileWithServerDefExported = app.find(f => {
    if (f.type !== 'file') {
      return false;
    }
    // * this should be acorn parsed AST
    const contentBody = f.content.body;
    const isDefinitionExported = (
      checkDefinitionExported(
        contentBody,
        constants.reservedVarKeys[0]
      )
    );
    return Boolean(isDefinitionExported);
  });

  if (!fileWithServerDefExported) {
    throw new Error(errors['0001'](constants.reservedVarKeys[0]));
  }

  const { __D1__SERVER__ } = (
    require(
      path.join(
        applicationPath,
        fileWithServerDefExported.name
      )
    )
  );

  // * get the configs
  const __D1__CONFIGS__ = (() => {
    const conf = app.find(f => {
      if (f.type !== 'file') {
        return false;
      }
      const contentBody = f.content.body;
      const isDefinitionExported = (
        checkDefinitionExported(
          contentBody,
          constants.reservedVarKeys[1]
        )
      );
      return Boolean(isDefinitionExported);
    });
    if (conf) {
      const confPath = path.join(applicationPath, conf.name);
      const { __D1__CONFIGS__ } = require(confPath);
      return __D1__CONFIGS__;
    }
  })() ?? {};

  const routerConfigs = __D1__CONFIGS__?.router || {};
  const router = findMyWay(routerConfigs);

  const __D1__MIDDLEWARES__ = (() => {
    const mw = app.find(f => {
      if (f.type !== 'file') {
        return false;
      }
      const contentBody = f.content.body;
      const isDefinitionExported = (
        checkDefinitionExported(
          contentBody,
          constants.reservedVarKeys[2]
        )
      );
      return Boolean(isDefinitionExported);
    });
    if (mw) {
      const mwPath = path.join(applicationPath, mw.name);
      const { __D1__MIDDLEWARES__ } = require(mwPath);
      return __D1__MIDDLEWARES__;
    }
  })();
  const middlewares = __D1__MIDDLEWARES__ || [];

  const routePaths = [];
  findRouteInPaths(routePaths, __D1__CONFIGS__, app, '/', applicationPath);
  designateRoutes(router, routePaths, routerConfigs, middlewares);

  // * instantiate a server
  let server = http.createServer(
    function requestListener (primReq, primRes) {
      primReq.metadata = { __D1__CONFIGS__, __D1__SERVER__ };
      router.lookup(primReq, primRes);
    }
  );

  if (__D1__SERVER__.getServerInstance) {
    server = __D1__SERVER__.getServerInstance(server);
  }

  server.listen(__D1__SERVER__.port, __D1__SERVER__.host, __D1__SERVER__.cb);
}

module.exports = serve;
