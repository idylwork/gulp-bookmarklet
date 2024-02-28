const gulp = require('gulp');
const PluginError = require('plugin-error');

module.exports = (message) => {
  gulp.emit('error', new PluginError('gulp-bookmarklet', message));
};
