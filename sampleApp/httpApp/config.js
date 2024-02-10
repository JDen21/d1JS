/**
 * We can optionally define __D1__CONFIGS__ in
 * any first level files. Here we can configure the
 * behaviour of the app.
 */
const __D1__CONFIGS__ = {
  excludeFolderRouting: false,
  excludeFileRouting: false,
  router: {
    ignoreTrailingSlash: true,
    allowUnsafeRegex: false,
    discoveredRoutes: (discoveredRoutes) => {
      console.log(discoveredRoutes);
    }
  }
};

module.exports = {
  __D1__CONFIGS__
};
