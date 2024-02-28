
module.exports = {
  /**
   * JavaScriptのURLスキームを付加する
   * @param {string} contents コード
   * @returns {string}
   */
  scheme(contents) {
    return `javascript: ${contents}`;
  },

  /**
   * 英数字以外をURIエンコードする
   * @param {string} contents コード
   * @returns {string}
   */
  escape(contents) {
    return contents.replace(/[^\x00-\x7F]*/g, (word) => encodeURIComponent(word));
  },

  /**
   * 引数のコードを取得する
   * @param {string} contents コード
   * @returns {string | null} 引数部分のコード
   */
  getArguments(contents) {
    const argumentsText = `${contents}`.match(/\( *([^\)]*) *\);?\s*$/)[1] ?? null;
    return `(${argumentsText})`;
  },

  /**
   * 引数のコードを置換する
   * @param {string} contents コード
   * @param {string} argumentsText 復帰させる引数部
   * @returns {string}
   */
  setArguments(contents, argumentsText = null) {
    if (!argumentsText) return contents;

    return `${contents}`.replace(/\(\{([^\(]*)\}\);?$/, argumentsText);
  },
}