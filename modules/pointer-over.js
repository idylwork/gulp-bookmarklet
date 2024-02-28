/**
 * マウスポインターを乗せたことにする
 * @param {HTMLElement} target
 * @param {(HTMLElement) => void} action
 * @returns
 */
(target, action) => new Promise((resolve) => {
  let event = new PointerEvent('pointerover', { bubbles: true });
  setTimeout(() => {
    target.dispatchEvent(event);
    setTimeout(() => resolve(action(target)), 10);
  }, 0);
})
