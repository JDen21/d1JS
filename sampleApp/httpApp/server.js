/**
 * We can define a server only in first level files or if no valid server is defined
 * then the app tries its best to automatically spin up a server.
 * Uncommenting the codes below will switch the app port to 5000
 */

// const __D1__SERVER__ = {
//   port: 5000,
//   host: 'localhost',
//   cb: function () {
//     console.log(`listening to http://${__D1__SERVER__.host}:${__D1__SERVER__.port}`);
//   },
//   getServerInstance: function (server) {
//     return server;
//   }
// };

// module.exports = {
//   __D1__SERVER__
// };
