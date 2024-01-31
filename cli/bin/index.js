#!/usr/bin/env node

const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');
// const path = require('path');
const argv = yargs(hideBin(process.argv))
  .command('init [dir]', 'initialize a d1 app', (yargs) => {
    yargs.positional('dir', {
      type: 'string',
      describe: 'build path'
    });
  })
  .help()
  .argv;

if (argv._.length && argv._[0] === 'init') {
  const buildPath = argv.dir;
  console.log(buildPath);
}
