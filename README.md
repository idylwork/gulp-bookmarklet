# gulp-bookmarklet

JavaScript をブックマークレット形式に変換する Gulp プラグインです。

## Features

### 用意されたモジュールのインポート

`const InstantDownload = require('instant-download'); `

- `scroll` 継続的にスクロールしながら DOM 要素の読み込みを検知する
- `content` DOM 要素からデータを取り出すための`Content`クラス
- `create-overlay` 画面全体をカバーするオーバーレイ要素を作成する
- `instant-download` データをファイルとしてダウンロードするためのメソッド群
- `pointer-over` DOM 要素のマウスポインターを乗せたことにして処理を行う

### ファイルのインポート

`const example = require('./example_file');`

### JavaScript のミニファイ

コードを圧縮し、文字数を削減します。
また、`console.log`を削除します。

### ブックマークレット用のフォーマット

`javascript:`を付加し、ブックマークレットとしてお気に入りに登録することで JavaScript を実行できる形に変換します。

#### 即時引数の引数保存

ページ既存のスクリプトに影響を与えずに設定値を受け渡すため、即時関数によるクロージャを使うこともあるかもしれません。
以下の形式でファイルを作っている場合は引数部分のみミニファイをかけずに元の表記を保持します。

```js
;(({ text }) => {
  // ... source
})({ text: 'example' })
```

## Installation

```bash
npm install gulp-bookmarklet
```

## Usage

```js:gulpfile.js
const gulp = require('gulp');
const bookmarklet = require('./gulp-bookmarklet');

gulp.task('build', (done) => {
  gulp.src(['src/**/*.js'])
    .pipe(bookmarklet())
    .pipe(gulp.dest('dist/'));

  done();
});
```

[gulpfile.js のサンプル](./gulpfile-sample.js)

## Options

- `scheme` JavaScript スキーマを付加する
- `minify` コードをミニファイする
- `require` require メソッドの解決をする
- `debug` デバッグ出力を有効にする

### ブックマークレットに変換する

すべての変換をかけてブックマークレットとして登録できる形にする。

```js:gulpfile.js
gulp.src(['src/**/*.js'])
  .pipe(bookmarklet())
  .pipe(gulp.dest('dist/'));
```

### 開発用に最小限の変換

`require()`の解決のみ行い、開発用コンソールから実行・デバッグしやすい形に整形する

```js:gulpfile.js
gulp.src(['src/**/*.js'])
  .pipe(bookmarklet({
    scheme: false,
    minify: false,
  }))
  .pipe(gulp.dest('dist/'));
```
