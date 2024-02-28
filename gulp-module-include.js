const replaceRequirement = require('./lib/replaceRequirement');
const createEventStream = require('./lib/createEventStream');

/**
 * gulp-module-include
 * 汎用のモジュールやファイルを読み込む
 * `require('example-filename')`のコードがあるとパスを解決して参照先のファイルソースに置き換える
 *
 * @param {boolean} param.debug デバッグ出力を有効化するか
 * @returns
 */
module.exports = function gulpModuleInclude({ debug = true } = {}) {
  return createEventStream((file) => replaceRequirement(`${file.contents}`, file.path, {
    basePaths: [`${__dirname}/modules`, `${__dirname}/node_modules`],
    debug,
  }));
};
