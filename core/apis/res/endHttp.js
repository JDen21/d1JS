function endHttp () {
  if (!this.metadata.contentTypeSet) {
    throw new Error('Unable to infer content type. Set it using res.setContentType');
  }
  this.metadata.endHttp = true;
  return this;
}

module.exports = endHttp;
