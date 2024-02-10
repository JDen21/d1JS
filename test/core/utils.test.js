const t = require('tap');
const { checkDefinitionExported } = require('../../core/core/middlewares/utils/utils');
const { isDefinitionExportedData } = require('./utils.data');

t.test('Should check object exports with same key/value', (t) => {
  const contentBodySameKey = isDefinitionExportedData.exportedInObjSameKey;
  const contentBodyDiffKey = isDefinitionExportedData.exportedDiffKey;

  t.ok(checkDefinitionExported(contentBodySameKey, '__D1__SERVER__'));
  t.ok(checkDefinitionExported(contentBodyDiffKey, '__D1__SERVER__'));

  t.end();
});
