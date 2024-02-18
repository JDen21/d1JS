const fs = require('fs');
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

module.exports = sendFile;
