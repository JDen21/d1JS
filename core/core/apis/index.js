const send = require('./res/send');
const endHttp = require('./res/endHttp');
const setContentType = require('./res/setContentType');
const sendFile = require('./res/sendFile');

// * refix req, res for router handler
function refixNativeReqRes (req, res, params, store, searchParams) {
  req = { primitives: req, metadata: {} };
  res = { primitives: res, metadata: {} };
  res.status = function (statusCode) {
    res.primitives.statusCode = statusCode;
    return res;
  };
  res.contentType = setContentType; // * manually set content type
  res.send = send; // * sends data, resolves to json if object
  res.endHttp = endHttp; // * call this when you want to end a middleware without sending anything
  res.sendFile = sendFile; // * allows to send a static file. Static file should be outside the http app
  req.params = params; // * includes the params of request url
  req.store = store; // * a middleware store that the middleware can pass down the next middlewares
  req.query = searchParams; // * contains the query params of request url
  return [req, res];
}

module.exports = refixNativeReqRes;
