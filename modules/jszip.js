/**
 * JSZipクラスをインポートする
 * @param {HTMLElement} target
 * @param {(HTMLElement) => void} action
 * @returns {JSZip}
 */
async () => {
  // スコープ内にオブジェクトを定義しておき、CommonJSモジュールとして受け取る
  const module = { exports: {} };
  const exports = module.exports;
  require('jszip/dist/jszip.min.js');
  const JSZip = module.exports
  return JSZip;
}
