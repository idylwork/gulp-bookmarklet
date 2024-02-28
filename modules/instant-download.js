/**
 * ファイルのダウンロードを処理するメソッド郡
 */
({
  bomUtf8: new Uint8Array([0xEF, 0xBB, 0xBF]),
  JSZip: null,

  /**
   * ZIPファイルにまとめてダウンロード
   * @param fileName {string}
   * @param files {Object}
   * @returns {string}
   */
  async zip(fileName, files) {
    let blob
    try {
      blob = await this.createZip(fileName, files)
    } catch (error) {
      console.error(error)
      return 'ZIPファイルの作成に失敗しました'
    }
    return this.file(fileName.endsWith('.zip') ? fileName : `${fileName}.zip`, blob)
  },

  /**
   * Blobをダウンロード
   * @param fileName {string}
   * @param data {Blob|string}
   */
  file(fileName, data) {
    const blob = data instanceof Blob ? data : new Blob([this.bomUtf8, data], { type: `text/${fileName.split('.').at(-1)}` })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = this.encodeFileName(fileName)
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    return 'ダウンロードを開始します'
  },

  /**
   * 複数BlobをZIPファイルにまとめたBlobを作成
   * @param fileName {string}
   * @param files {Object<string, Blob | Object>}
   * @throws
   */
  async createZip(fileName, files = {}) {
    const jszip = new this.JSZip()
    this.addFileToZip(jszip, fileName, files)
    return await jszip.generateAsync({ type: 'blob', compression: 'DEFLATE' })
  },

  /**
   * CDNからライブラリをダウンロード
   * @param url
   * @param load
   * @returns
   * @throws
   */
  useCDN(url, load) {
    return new Promise(resolve => {
      const script = document.createElement('script')
      script.setAttribute('src', url)
      script.addEventListener('load', () => {
        resolve(load())
        document.head.removeChild(script)
      })
      document.head.appendChild(script)
    })
  },

  /**
   * ZIPファイルに再起的にファイルを追加する
   * @param folder {JSZip | Object<string, Blob | Object>}
   * @param fileName {string}
   * @param content {Blob | Object}
   */
  addFileToZip(folder, fileName, content) {
    if (content instanceof Blob || !(content instanceof Object)) {
      folder.file(this.encodeFileName(fileName), content)
    } else {
      const childFolder = folder.folder(this.encodeFileName(fileName))
      Object.entries(content).forEach(([childFileName, childContent]) => {

        this.addFileToZip(childFolder, childFileName, childContent)
      })
    }
  },

  /**
   * ファイル名のエスケープ
   */
  encodeFileName(name) {
    return name.replace(/[\\\/:*?"<>|]/g, char => '%' + char.charCodeAt(0).toString(16))
  },

  /**
   * モデルリストをCSVに変換
   * @param {Object[]} dataList
   * @param {string} separator 区切り文字
   * @returns {string}
   */
  convertToCSV(dataList, separator = ',') {
    const table = this.convertToTable(dataList);
    return table.map((row) => this.joinCSVRow(row, separator)).join('\n');
  },

  /**
   * データをCSV行に変換
   * @param {any} row
   * @param {string} separator 区切り文字
   * @returns {string} 結合された文字列
   */
  joinCSVRow(row, separator = ',') {
    const regexp = separator === '\t' ? /[\t\n"]/ : /[,\n"]/
    console.log(row.map((item, index) => (
      typeof index === 0 || (typeof item === 'string' && regexp.test(item))
        ? `"${item.replace(/"/g, '""').replace(/\n/g, '\r\n')}"`
        : item
    )).join(separator));
    return row.map((item, index) => (
      typeof index === 0 || (typeof item === 'string' && regexp.test(item))
        ? `"${item.replace(/"/g, '""').replace(/\n/g, '\r\n')}"`
        : item
    )).join(separator);
  },

  /**
   * モデルリストを二次元配列に変換
   * @param {Object[]} dataList
   * @returns {any[][]}
   */
  convertToTable(dataList) {
    if (!dataList.length) return [];

    const headerIndexes = Object.fromEntries(
      Object.keys(dataList[0]).map((key, index) => [key, index])
    )
    const rows = [];
    dataList.forEach((data) => {
      const row = [];
      Object.entries(data).forEach(([key, value]) => {
        if (!(key in headerIndexes)) {
          headerIndexes[key] = headerIndexes.length;
        }
        row[headerIndexes[key]] = value;
      });
      rows.push(row);
    });

    return [Object.keys(headerIndexes), ...rows];
  },
})
