const path = require('path');
const { minify: terserMinify } = require('terser');
const createTransfer = require('./lib/createTransfer');
const BookmarkletUtils = require('./lib/bookmarklet-utils');
const replaceRequirement = require('./lib/replaceRequirement');

/**
 * JavaScriptをブックマークレット形式に変換する
 *
 * @param {boolean} options.scheme JavaScript スキーマを付加する
 * @param {boolean} options.minify コードをミニファイする
 * @param {boolean} options.require require メソッドの解決をする
 * @param {boolean} options.debug デバッグ出力を有効にする
 * @returns {Transfer}
 */
module.exports = function gulpBookmarklet({ require = true, scheme = true, minify = true, debug = false } = {}) {
  return createTransfer(async (file) => {
    // JSファイル以外は何もしない
    if (path.extname(file.path) !== '.js') return null;

    var contents = file.contents.toString();

    // モジュールの解決
    if (require) {
      contents = replaceRequirement(contents, file.path, {
        basePaths: [`${__dirname}/modules`, `${__dirname}/node_modules`],
        debug,
      });
    }

    // ミニファイ
    if (minify) {
      let result = await terserMinify(contents, {
        output: {
          quote_style: 3,
        },
        compress: {
          drop_console: true
        },
      });
      if (result.code) {
        // 引数のみ元のコードを保持する
        const argumentsText = BookmarkletUtils.getArguments(contents);
        contents = result.code;
        contents = BookmarkletUtils.setArguments(contents, argumentsText);
      }
    }

    // スキーマ付加
    if (scheme) {
      contents = BookmarkletUtils.scheme(contents);
    }
    return contents;
  });
}
