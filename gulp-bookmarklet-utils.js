const createTransfer = require('./lib/createTransfer');
const bookmarkletUtils = require('./lib/bookmarklet-utils');

/**
 * JavaScriptのURLスキームを付加する
 * @returns {Transfer}
 */
function scheme() {
  return createTransfer((file) => bookmarkletUtils.scheme(file.contents));
}

/**
 * 引数のコードを保持する
 * @returns {Transfer}
 */
function storeArgs() {
  return createTransfer((file) => bookmarkletUtils.getArguments(file.contents))
}

/**
 * 保持した引数のコードを復帰させる
 * @returns {Transfer}
 */
function restoreArgs() {
  return createTransfer((file) => bookmarkletUtils.setArguments(file.contents));
}

module.exports = { scheme, storeArgs, restoreArgs };
