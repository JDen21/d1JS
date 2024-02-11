const fs = require('fs');

// * refix req, res for router handler
function refixNativeReqRes (req, res, params, store, searchParams) {
  req = { primitives: req, metadata: {} };
  res = { primitives: res, metadata: {} };
  res.status = function (statusCode) {
    res.primitives.statusCode = statusCode;
    return res;
  };
  res.contentType = setContentType;
  res.send = send;
  res.endHttp = endHttp;
  res.sendFile = sendFile;
  req.params = params;
  req.store = store;
  req.query = searchParams;
  return [req, res];
}

function endHttp () {
  if (!this.metadata.contentTypeSet) {
    throw new Error('Unable to infer content type. Set it using res.setContentType');
  }
  this.metadata.endHttp = true;
  return this;
}

function setContentType (contentType) {
  this.primitives.setHeader('Content-Type', contentType);
  this.metadata.contentTypeSet = true;
  return this;
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
  this.metadata.endHttp = true;
  this.primitives.end(value);
}

function sendFile (filePath) {
  const stat = fs.statSync(filePath);
  this.primitives.setHeader('Content-Length', stat.size);
  let fileExtension = filePath.split('.');
  fileExtension = fileExtension.length > 1 ? fileExtension[fileExtension.length - 1] : null;
  switch (fileExtension) {
    case 'html':
    case 'css':
    case 'csv':
    case 'xml': {
      this.primitives.setHeader('Content-Type', `text/${fileExtension}`);
      this.metadata.contentTypeSet = true;
      break;
    }
  }

  if (!this.metadata.contentTypeSet) {
    throw new Error(`Unable to infer content type ${filePath}. Set it using res.setContentType`);
  }
  const readStream = fs.createReadStream(filePath);
  readStream.pipe(this.primitives);
  this.metadata.endHttp = true;
}

module.exports = refixNativeReqRes;
