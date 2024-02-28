const fs = require('fs');
const path = require('path');
const glob = require('glob');
const stripBom = require('strip-bom');
const PluginError = require('plugin-error');

/**
 * 文章中の`require`メソッドをインクルードファイルの内容に置換する
 * @param {string} content ファイルソース
 * @param {string} filePath ファイルパス (相対パスに使用)
 * @param {string[]} options.basePaths モジュールが格納されているディレクトリリスト
 * @param {bolean} options.debug デバッグ出力を有効にするか
 * @returns {string} インクルード解決済みのファイルソース
 */
const replaceRequirement = (content, filePath, { basePaths = [], debug = false } = {}) => {
  // JSファイル以外は何もしない
  if (path.extname(filePath) !== '.js') return content;

  // `required()`をコード内から検索する
  const matches = [...content.matchAll(/^(?<indent>\s*)(?<prefix>.*[ =])require\((?<pathArg>'[\w-_\.\/]+'|"[\w-_\.\/]+")\)/mg)];
  if (!matches.length) return content;

  const relativeBasePath = path.dirname(filePath);

  matches.forEach((match) => {
    const { indent, prefix, pathArg } = match.groups;
    let includePathText = pathArg.slice(1, -1);
    includePathText = /\./.test(includePathText) ? includePathText : `${includePathText}.js`;

    // インクルード対象ファイルを検索する (最初に見つかったファイルを対象にする)
    let includePath = null;
    if (!includePathText.includes('./')) {
      // 相対パスでない場合
      for (const basePath of basePaths) {
        const fileMatches = glob.sync(path.join(basePath, includePathText), { mark: true });
        if (fileMatches.length) {
          includePath = fileMatches[0];
          break;
        }
      }
    } else {
      // 相対パス
      includePath = glob.sync(path.join(relativeBasePath, includePathText), { mark: true });
    }

    if (!includePath) throw new PluginError('gulp-bookmarklet', `No such file. ${filePath} << ${path.relative(relativeBasePath, includePathText)}`);
    if (debug) console.log(`  ${filePath} << ${path.relative(relativeBasePath, includePathText)}`);

    // 再起的に読み込む
    const fileContentsRaw = stripBom(fs.readFileSync(includePath));

    // 再起的にインクルード先のインクルードを解決する
    let includeContent = replaceRequirement(fileContentsRaw.toString(), includePath, { basePaths, debug });

    // インクルードするソース各行にインデント追加
    if (indent) {
      includeContent = includeContent.split('\n').map((line) => `${indent}${line}`).join('\n');
    }
    // インクルードされたコードを挿入
    content = content.replace(match[0], `${indent}${prefix}${includeContent}`);
  });

  return content;
};

module.exports = replaceRequirement
