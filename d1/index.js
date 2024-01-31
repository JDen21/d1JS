const serve = require('./core/index.js');

serve(process.argv.slice(2)[0] || '../app');
