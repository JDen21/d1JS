// * refix req, res for router handler
function refixNativeReqRes (req, res, params, store, searchParams) {
  req = { primitives: req, metadata: {} };
  res = { primitives: res, metadata: {} };
  res.status = function (statusCode) {
    res.primitives.statusCode = statusCode;
    return res;
  };
  // res.send = function (value) {
  //   res.metadata.endHttp = true;
  //   res.primitives.end(value);
  //   return res;
  // };
  res.contentType = setContentType;
  res.send = send;
  res.endHttp = function () {
    res.metadata.endHttp = true;
  };
  req.params = params;
  req.store = store;
  req.query = searchParams;
  return [req, res];
}

function send (value) {
  if (!this.metadata.contentTypeSet) {
    let contentType = 'text/plain';
    if (typeof value === 'object') {
      contentType = 'application/json';
    }
    try {
      JSON.parse(value);
      contentType = 'application/json';
    } catch (_) {};
    this.metadata.contentTypeSet = true;
    this.primitives.setHeader('Content-Type', contentType);
  }
  if (typeof value === 'object') {
    value = JSON.stringify(value);
  }
  this.primitives.end(value);
  return this;
}

function setContentType (contentType) {
  this.metadata.contentTypeSet = true;
  this.primitives.setHeader('Content-Type', contentType);
  return this;
}

module.exports = refixNativeReqRes;
