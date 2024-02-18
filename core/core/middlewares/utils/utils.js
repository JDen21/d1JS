const fs = require('fs');
const util = require('util');
const acorn = require('acorn');
const path = require('path');
const errors = require('../../errors');
const { runMiddleWares } = require('../middlewares');
const refixNativeReqRes = require('../../apis/index');
const { resolveRoutePath } = require('./resolvers');

function debugObject (obj, decors) {
  return console.log(decors, util.inspect(obj, { showHidden: false, depth: null, colors: true }));
}
function checkNameDefined (contentBody, varName) {
  return contentBody.find(b => {
    return b.type === 'VariableDeclaration' &&
      b.declarations[0].id.name === varName;
  });
}

function checkDefinitionExported (contentBody, varName, booleanReturn = true) {
  return contentBody.find(b => {
    if (b.type !== 'ExpressionStatement') {
      return false;
    }
    if (b.expression.type !== 'AssignmentExpression' ||
      b.expression.operator !== '=') {
      return false;
    }

    if (b.expression.left.type !== 'MemberExpression') {
      return false;
    }

    const left = b.expression.left;
    if (left.object.name !== 'module' ||
      left.property.name !== 'exports') {
      return false;
    }

    const right = b.expression.right;
    if (right.type !== 'ObjectExpression') {
      return false;
    }
    if (booleanReturn) {
      return Boolean(right.properties
        .find(p =>
          p.type === 'Property' &&
          p.value.name === varName));
    }
    return right.properties
      .find(p =>
        p.type === 'Property' &&
        p.value.name === varName);
  });
}

function readFullFolder (folderPath, folderArr) {
  const folderContent = fs.readdirSync(folderPath, 'utf-8');
  for (let i = 0; i < folderContent.length; i++) {
    const currPath = path.join(folderPath, `./${folderContent[i]}`);
    if (fs.lstatSync(currPath).isDirectory()) {
      folderArr.push({
        type: 'folder',
        name: folderContent[i],
        content: readFullFolder(currPath, [])
      });
      continue;
    }
    const content = fs.readFileSync(currPath, 'utf-8');
    folderArr.push({
      type: 'file',
      name: folderContent[i],
      content: acorn.parse(content, { ecmaVersion: 2022 })
    });
  }
  return folderArr;
}

function findRouteInPaths (arr, configs, currPath, currUrl, exportFilePath) {
  /**
     * route syntax definition should be
     * an unassigned string
     * followed by a function
     *
     * recurse through folders
     * every file is end of line
     * just get all the routes, update then save
     */
  currPath.forEach((fileOrFolder) => {
    const currExportFilePath = `${exportFilePath}/${fileOrFolder.name}`;
    const path = resolveRoutePath(fileOrFolder.name);
    let thisPathUrl = currUrl;
    if (fileOrFolder.type === 'file') {
      if (!configs.excludeFileRouting && path) {
        thisPathUrl = `${currUrl}${path}`;
      }
      arr.push(...findRoutesInFile(fileOrFolder, thisPathUrl, currExportFilePath));
    } else {
      if (!configs.excludeFolderRouting) {
        thisPathUrl = `${thisPathUrl}${path}`;
      }
      findRouteInPaths(arr, configs, fileOrFolder.content, thisPathUrl, currExportFilePath);
    }
  });
}

function findRoutesInFile (currPath, currUrl, exportFilePath) {
  // * check if function is valid route path
  // * check if function is exported
  // * if all checks true, store
  let allExportedRoutes = [];
  const programAST = currPath.content.body;

  for (let nodeIdx = 0; nodeIdx < programAST.length; nodeIdx++) {
    const node = programAST[nodeIdx];
    let funcActionName = '';
    let funcActionPath = '';
    let funcActionMethod = '';
    const funcType = hasFunctionType(node);
    if (!funcType || nodeIdx === 0) {
      continue;
    }
    if (funcType === 'ArrowFunctionExpression') {
      funcActionName = node.declarations[0].id.name;
    }
    if (funcType === 'FunctionDeclaration') {
      funcActionName = node.id.name;
    }
    // * validate route path for this function
    const pathNode = programAST[nodeIdx - 1];
    if (pathNode.type !== 'ExpressionStatement') {
      continue;
    }
    if (pathNode.expression.type !== 'Literal') {
      continue;
    }
    if (!pathNode.expression.value) {
      continue;
    }

    const methodAndPath = pathNode.expression.value.split(' ');

    if (methodAndPath.length === 1) {
      funcActionMethod = 'get';
      funcActionPath = methodAndPath[0];
    } else {
      funcActionMethod = methodAndPath[0];
      funcActionPath = methodAndPath[1];
    }

    funcActionMethod = funcActionMethod.toUpperCase();
    if (funcActionPath.startsWith('/')) {
      funcActionPath = funcActionPath.split('/');
      funcActionPath.shift();
      funcActionPath = funcActionPath.join('/');
    }
    funcActionPath = `${currUrl}${funcActionPath}`;
    const newRecord = {
      method: funcActionMethod,
      endpoint: funcActionPath,
      action: funcActionName,
      filePath: exportFilePath
    };
    allExportedRoutes.push(newRecord);
  }

  // * replace function name with its export key
  const allActionFunction = allExportedRoutes.map(a => a.action);
  const keyValues = getFileExportsKeyValue(programAST, allActionFunction)
    .filter(kv => kv[0]);
  const allExportedValues = keyValues.map(kv => kv[1]);
  allExportedRoutes = allExportedRoutes
    .filter(f => allExportedValues.includes(f.action));

  allExportedRoutes.forEach((r) => {
    r.action = keyValues
      .find(kv => kv[1] === r.action)[0];
  });
  return allExportedRoutes;
}

function hasFunctionType (node) {
  if (node.type === 'FunctionDeclaration') {
    return 'FunctionDeclaration';
  }
  if (node.type === 'VariableDeclaration') {
    if (!node.declarations.length) {
      return;
    }
    const init = node.declarations[0].init;
    const type = init ? init.type : null;
    if (type === 'ArrowFunctionExpression') {
      return 'ArrowFunctionExpression';
    }
  }
}

// * if key is null, then value is not exported
function getFileExportsKeyValue (node, allValueNames) {
  return allValueNames.map(n => {
    let key = (checkDefinitionExported(node, n, false));
    if (key) {
      key = (
        key
          .expression
          .right
          .properties
          .filter(p => p.value.name === n)[0]
          .key
          .name
      );
    }
    return [key, n];
  });
}

function designateRoutes (router, routePaths, routerConfigs, middlewares) {
  routePaths.forEach(r => {
    errorOnInvalidMethod(r.method);
    router.on(r.method, r.endpoint, function (req, res, params, store, searchParams) {
      const [newReq, newRes] = refixNativeReqRes(req, res, params, store, searchParams);
      const action = require(r.filePath)[r.action];
      const allFnsToCall = [...middlewares, action];
      runMiddleWares(allFnsToCall, r, newReq, newRes);
    });
    if (routerConfigs.discoveredRoutes) {
      routerConfigs.discoveredRoutes(router.prettyPrint());
    }
  });
}

function errorOnInvalidMethod (method) {
  switch (method) {
    case 'GET':
    case 'POST':
    case 'PUT':
    case 'PATCH':
    case 'DELETE': {
      return;
    }
  }
  throw new Error(errors['0003'](method));
}

module.exports = {
  debugObject,
  checkNameDefined,
  checkDefinitionExported,
  readFullFolder,
  findRouteInPaths,
  errorOnInvalidMethod,
  designateRoutes
};
