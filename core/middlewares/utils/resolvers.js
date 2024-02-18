const tcpPortUnused = require('tcp-port-used');
const path = require('path');
// * this resolver allows to actually just run the module without
// * having to define a server.
function resolveServer (appPath, serverDefFile) {
  let server = {
    __D1__SERVER__: {}
  };
  try {
    server = require(path.join(
      appPath,
      serverDefFile));
    if (!server.__D1__SERVER__.port) {
      server.__D1__SERVER__.port = 3000;
    }
    if (!server.__D1__SERVER__.host) {
      server.__D1__SERVER__.host = '127.0.0.1';
    }
    if (server.__D1__SERVER__.host === 'localhost') {
      server.__D1__SERVER__.host = '127.0.0.1';
    }
  } catch (_) {
    server.__D1__SERVER__ = {
      port: 3000,
      host: '127.0.0.1',
      cb: function () {
        console.log(`listening to http://${server.__D1__SERVER__.host}:${server.__D1__SERVER__.port}`);
      }
    };
  }
  return server;
}

function resolveResponse (actionReturn, res) {
  if (res.metadata.endHttp) {
    return;
  }
  if (actionReturn === null || typeof actionReturn === 'undefined') {
    res.status(500).send('Server error.');
    return;
  }
  res.status(200).send(actionReturn);
}

async function resolveListener (server, __D1__SERVER__) {
  let currPort = typeof __D1__SERVER__.port === 'string'
    ? parseInt(__D1__SERVER__.port)
    : __D1__SERVER__.port;
  let canRunPort = false;

  while (!canRunPort) {
    const isPortInUse = await tcpPortUnused.check(
      currPort,
      __D1__SERVER__.host);
    if (isPortInUse) {
      console.log(`port ${currPort} is busy, switching to port ${currPort + 1}` + '\n');
      currPort += 1;
      continue;
    }
    canRunPort = true;
  }
  __D1__SERVER__.port = currPort;
  server.listen(__D1__SERVER__.port, __D1__SERVER__.host, __D1__SERVER__.cb);
}

function resolveRoutePath (pathSection) {
  const validFileExtensions = ['.js', '.cjs', '.mjs'];
  // * remove file extension
  if (validFileExtensions.some(ext => pathSection.endsWith(ext))) {
    pathSection = pathSection.split('.')[0];
  }

  if (pathSection === 'index') {
    return '';
  }

  if (pathSection.startsWith('[') && pathSection.endsWith(']')) {
    pathSection = pathSection
      .replace('[', ':')
      .slice(0, -1);
    return `${pathSection}/`;
  }
  return `${pathSection}/`;
}

module.exports = {
  resolveServer,
  resolveResponse,
  resolveListener,
  resolveRoutePath
};
