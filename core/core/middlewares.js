async function runMiddleWares (middlewares, pathData, req, res) {
  let actionReturn;
  for (let i = 0; i < middlewares.length; i++) {
    const middleware = middlewares[i];
    if (!res.metadata.endHttp) {
      if (typeof middleware === 'function') {
        actionReturn = await Promise.resolve(middleware(req, res));
      }
      if (typeof middleware === 'object') {
        if (middleware.onlyPaths) {
          const isIncluded = Boolean(
            middleware.onlyPaths.find(p => {
              return pathData.endpoint.startsWith(p);
            })
          );
          if (isIncluded) {
            await Promise.resolve(middleware.cb(req, res));
          }
        } else if (middleware.excludePaths) {
          const isExcluded = Boolean(
            middleware.excludePaths.find(p => {
              return pathData.endpoint.startsWith(p);
            })
          );
          if (!isExcluded) {
            await Promise.resolve(middleware.cb(req, res));
          }
        } else {
          await Promise.resolve(middleware.cb(req, res));
        }
      }
    }
  }
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
