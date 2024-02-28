/**
 * DOM要素へのアクセスとデータ取得
 */
class Content {
  static Value = class {
    constructor(value) {
      this.value = Content.Value.removeUnmanagedSpaces(value) ?? '';
    }

    toString() {
      return this.plain;
    }

    /** テキストをそのまま取得 */
    get plain() {
      return this.value.trim();
    }

    /** DOM要素のテキストから数値を取り出す */
    get number() {
      if (!this.value) return 0;
      const numberText = this.value.replace(/[^\d]/g, '');
      return parseFloat(numberText || 0);
    }

    /** DOM要素のテキストをフォーマット解釈して数値に変換する (変換失敗でそのままの文字列) */
    get numberFormat() {
      if (!this.value) return 0;

      let units = new Map([['万', 10000], ['億', 100000000]]);
      let numberText = this.value.trim().replace(/,/g, '');
      let unit = 1;
      units.forEach((targetUnit, targetChar) => {
        if (numberText.indexOf(targetChar) >= 0) {
          unit = targetUnit;
          numberText = numberText.replace(targetChar, '');
        }
      });
      if (/^[\d\.]+$/.test(numberText)) {
        return parseFloat(numberText) * unit;
      }
      return this.value;
    }

    /** DOM要素のテキスト内からフォーマット解釈して数値に変換する (変換失敗で0) */
    get numberFormatForce() {
      const number = new Content.Value(this.replace(/[^\d\.万億]/g, '')).numberFormat;
      return typeof number === 'number' ? number : 0;
    }

    /** 日付文字列として取得 */
    get date() {
      const text = (new Date(Date.parse(this.value.trim()))).toLocaleString('ja-JP');
      return text === 'Invalid Date' ? '-' : text;
    }

    /**
     * テキストを置換して取得
     * @param {string | RegExp} searchValue
     * @param {replaceValue} string
     * @returns {string}
     */
    replace(searchValue, replaceValue) {
      return typeof this.value === 'string' ? this.value.trim().replace(searchValue, replaceValue) : this.value;
    }
    /**
     * 正規表現\s対応外の空白文字を削除
     * @param {any} value
     * @returns {any}
     */
    static removeUnmanagedSpaces(value) {
      return typeof value === 'string' ? value.replace(/[\u001c-\u001f\u11a3-\u11a7\u180e\u200b-\u200f\u2060\u3164\u034f\u202a-\u202e\u2061-\u2063]/g, '') : value;
    }
  }

  constructor(el) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el;
  }

  /** DOM要素からテキストを取得する */
  get text() {
    return new Content.Value(this.el?.innerText)
  }

  /** DOM要素からテキストを無変換で取得する */
  get innerText() {
    return this.text.plain;
  }

  /**
   * DOM要素からプロパティを取得する
   */
  prop(prop) {
    return new Content.Value(this.el?.getAttribute(prop))
  }

  /**
   * セレクタからDOM要素を検索する
   * @param {*} selector
   * @param {*} index 複数見つけた場合のインデックス指定 (-1で最後の要素)
   * @returns {Content}
   */
  find(selector, index = 0) {
    const element = index === 0 ? this.el?.querySelector(selector) : ([...this.el?.querySelectorAll(selector)].at(index) ?? null);
    return new Content(element);
  }

  /**
   * テキストから条件を満たす一番深いDOM要素を検索 (1件もヒットしなかった場合はNULL)
   * @param {RegExp|string} regexp 検索する文字列
   * @returns {Content}
   */
  findText(regexp) {
    if (!this.el) return new Content(null);

    const child = regexp instanceof RegExp
      ? [...this.el.children].find(target => regexp.test(target.innerText))
      : [...this.el.children].find(target => target.innerText.includes(regexp))
    const element = child ? Content.getElementFromInnerText(child, regexp) : null;
    return new Content(element);
  }

  /**
   * DOM要素が存在するか
   * @returns
   */
  isExists() {
    return this.el !== null;
  }

  /**
   * テキストから条件を満たす一番深いDOM要素を検索
   * @param {HTMLElement} el
   * @param {RegExp|string} regexp 検索する文字列 (正規表現の先頭^・末尾$には非対応)
   * @returns {HTMLElement|null}
   */
  static getElementFromInnerText(el, regexp) {
    const child = regexp instanceof RegExp
      ? [...el.children].find(target => regexp.test(target.innerText))
      : [...el.children].find(target => target.innerText.includes(regexp))
    return child ? this.getElementFromInnerText(child, regexp) : el;
  }
}
