const through = require('through2');
const PluginError = require('plugin-error');
const pluginName = 'gulp-bookmarklet';

/**
 * ブックマークレットに関する操作
 * コールバックの引数1にファイル、引数2にエラーコールバック
 * NULLを返すと何もしない
 *
 * @param {(File, (String) => void) => string | null} action アクション
 * @returns {Transfer}
 */
module.exports = function createTransfer(action) {
  return through.obj(async function (file, encoding, done) {
    if (file.isNull()) {
      // 何もしない
      return done(null, file);
    }

    if (file.isStream()) {
      // ストリームはサポートしない
      this.emit('error', new PluginError(pluginName, 'Streams not supported!'));
    }

    // プラグインの処理本体
    if (file.isBuffer()) {
      const result = await action(file, (message) => {
        this.emit('error', new PluginError(pluginName, message));
      });
      if (result ?? null !== null) {
        file.contents = Buffer.from(result);
      }

      return done(null, file);
    }

    this.push(file);
    done();
  });
};
