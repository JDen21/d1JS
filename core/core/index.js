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
