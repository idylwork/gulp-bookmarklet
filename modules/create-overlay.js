/**
 * 画面全体をカバーするオーバーレイ要素を作成する
 */
() => {
  const overlay = document.createElement('div');
  overlay.style.display = 'flex';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.background = '#00000080';
  overlay.style.color = 'white';
  overlay.style.fontSize = '50px';
  return overlay;
}
