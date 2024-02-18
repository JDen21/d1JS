function setContentType (contentType) {
  this.primitives.setHeader('Content-Type', contentType);
  this.metadata.contentTypeSet = true;
  return this;
}

module.exports = setContentType;
