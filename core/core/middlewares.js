function runMiddleWares (middlewares, pathData, req, res) {
  let actionReturn;
  middlewares.forEach((middleware) => {
    if (!res.metadata.endHttp) {
      if (typeof middleware === 'function') {
        actionReturn = middleware(req, res);
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
  reconcileResponse(actionReturn, res);
}

function reconcileResponse (actionReturn, res) {
  if (res.metadata.endHttp) {
    return;
  }
  if (actionReturn === null || typeof actionReturn === 'undefined') {
    res.status(500).send('No valid server response.');
    return;
  }
  res.status(200).send(actionReturn);
}

module.exports = {
  runMiddleWares
};
