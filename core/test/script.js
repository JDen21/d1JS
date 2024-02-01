const fs = require('fs');
const path = require('path');
const acorn = require('acorn');
const { debugObject } = require('../core/utils');

const fileContent = fs.readFileSync(path.join(__dirname, './situation.js'), 'utf-8');

const parsedContent = acorn.parse(fileContent, { ecmaVersion: 2022 });
debugObject(JSON.parse(JSON.stringify(parsedContent.body)));

// console.log('lalaala',checkDefinitionExported(JSON.parse(JSON.stringify(parsedContent.body)), '__D1__SERVER__'));
