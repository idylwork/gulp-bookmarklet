/**
 * 継続的にスクロールしながらDOM要素の読み込みを検知する
 * ```
 * Scroll.start(document.body, (nodes) => {
 *   console.log(nodes);
 * }, () => {
 *   console.log('Timeed out.')
 * });
 * ```
 */
({
  /** 動作中のDOM要素変更検知オブザーバー */
  _observer: null,
  /** スクロールインターバルID */
  _interval: null,
  /** プロセス初期化時の処理 */
  _config: {
    unitLength: 300,
    unitInterval: 150,
    limitCount: 20,
  },

  /**
   * 設定変更
   * @param config.unitLength {number} スクロール距離
   * @param config.unitInterval {number} スクロール間隔ミリ秒
   * @param config.timeout {number} タイムアウトミリ秒
   * @returns
   */
  config({ unitLength = 300, unitInterval = 150, timeout = 10000 }) {
    this._config.unitLength = unitLength
    this._config.unitInterval  = unitInterval
    this._config.limitCount = Math.ceil(timeout / unitInterval)
    return this;
  },

  /**
   * 継続スクロールとDOM監視を開始する
   * @param {HTMLElement} container
   * @param {({ resolve: Function, reject: Function, nodes: HTMLElement[] }) => void} onChange
   * @param {() => void} onTimeout
   */
  start(container, onChange, onTimeout = () => {}) {
    // 初期表示要素を検査する
    onChange([...container.children]);

    // DOM要素追加検知
    const observer = new MutationObserver(async (records) => {
      const nodes = [];
      records.forEach(record => {
        record.addedNodes.forEach(node => {
          if (node instanceof Element) {
            nodes.push(node);
          }
        });
      });
      onChange(nodes);
    });
    observer.observe(container, { childList: true, subtree: true, attributes: false, characterData: false });
    this._observer = observer;

    // 継続スクロール
    let lastScrollY = window.scrollY;
    let timeoutCount = 0;
    this._interval = setInterval(() => {
      if (lastScrollY === window.scrollY) {
        timeoutCount += 1;
        console.info(`ScrollTimeout: ${timeoutCount}/${this._config.limitCount}`);
      } else {
        timeoutCount = 0;
      }
      lastScrollY = window.scrollY;
      window.scrollTo({ top: window.scrollY + this._config.unitLength, behavior: 'smooth' });
      if (timeoutCount > this._config.limitCount) {
        clearInterval(this._interval);
        onTimeout();
      }
    }, this._config.unitInterval);

    return this;
  },

  /**
   * 継続スクロールとDOM監視を停止する
   */
  stop() {
    this._observer?.disconnect();
    this._observer = null;
    clearInterval(this._interval);

    return this;
  },
})
