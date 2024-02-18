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

module.exports = send;
