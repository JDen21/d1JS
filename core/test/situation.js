const __D1__SERVER__ = {
  port: 3000,
  host: '127.0.0.1',
  cb: function () {
    console.log(`listening to http://${__D1__SERVER__.host}:${__D1__SERVER__.port}`);
  },
  getServerInstance: function (server) {
    console.log({ server });
  }
};

module.exports = {
  diffKey: __D1__SERVER__
};
