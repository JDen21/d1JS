const __D1__SERVER__ = { 
    port: 3000,
    host: '127.0.0.1',
    cb: function () {
        console.log(`listening to http://${__D1__SERVER__.host}:${__D1__SERVER__.port}`)
    }
}
let data;
const __D1__CONFIGS__ = {
    middlewares: [],
    excludeFolderRouting: false,
    excludeFileRouting: false,
    router: {
        ignoreTrailingSlash: true,
        allowUnsafeRegex: false,
        discoveredRoutes: (discoveredRoutes) => {
            data = discoveredRoutes;
        }
    }
}

'GET /'
function handShake (req, res) {
    res.status(200).send(data);
}

'GET /test'
function handShakeTest (req, res) {
    res.status(200).send('Handshake success.');
}

function notARoute(req, res) {
    res.status(400).send('not a route');
}

'GET /unexported'
function unExportedRoute(req, res) {
    res.status(200).send('success');
}

module.exports = {
    __D1__SERVER__,
    __D1__CONFIGS__,
    handShake,
    shakeTest: handShakeTest,
    notARoute
}