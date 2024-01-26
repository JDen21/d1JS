function runMiddleWares (middlewares, pathData, req, res) {
  middlewares.forEach(middleware => {
    if (!res.metadata.endHttp) {
      if (typeof middleware === 'function') {
        middleware(req, res);
      }
      if (typeof middleware === 'object') {
        if (middleware.onlyPaths) {
          const isIncluded = Boolean(
            middleware.onlyPaths.find(p => {
              return pathData.endpoint.startsWith(p);
            })
          );
          if (isIncluded) {
            middleware.cb(req, res);
          }
        } else if (middleware.excludePaths) {
          const isExcluded = Boolean(
            middleware.excludePaths.find(p => {
              return pathData.endpoint.startsWith(p);
            })
          );
          if (!isExcluded) {
            middleware.cb(req, res);
          }
        } else {
          middleware.cb(req, res);
        }
      }
    }
  });
}

module.exports = {
  runMiddleWares
};
