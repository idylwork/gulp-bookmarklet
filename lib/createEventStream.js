const es = require('event-stream');
const PluginError = require('plugin-error');

/**
 * gulp-module-include
 * 汎用のモジュールやファイルを読み込む
 * `require('example-filename')`のコードがあるとパスを解決して参照先のファイルソースに置き換える
 *
 * @param {boolean} param.debug デバッグ出力を有効化するか
 * @returns
 */
module.exports = function (action) {
  return es.map((file, callback) => {
    if (file.isNull()) {
      return callback(null, file);
    }


    if (file.isStream()) {
      throw new PluginError('gulp-bookmarklet', 'Stream not supported.');
    }

    if (file.isBuffer()) {
      const result = action(file, (message) => {
        throw new PluginError('gulp-bookmarklet', message);
      });
      if (result ?? null !== null) {
        file.contents = Buffer.from(result);
      }
    }

    callback(null, file);
  });
};
