const {
  src,
  dest,
  watch,
  parallel
} = require('gulp');
const sass = require('gulp-sass');
const include = require('gulp-html-tag-include');
const babel = require('gulp-babel');
const notify = require('gulp-notify');

function template() {
  return src('./src/template/**.html')
    .pipe(include())
    .pipe(dest('./dist'))
}

function style() {
  return src('./src/scss/**.scss')
    .pipe(sass())
    .pipe(dest('./dist/css'))
}

function js() {
  return src('./src/js/**.js')
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(dest('./dist/js'))
}



// Watch files
function watchFiles() {
  watch("./src/template/**.html", template);
  watch("./src/scss/**.scss", style);
  watch("./src/js/**.js", js)
  src('./src/js/**.js')
  .pipe(notify('Gulp is Watching, cheer! 🍺'));
}

exports.js = js;
exports.template = template;
exports.style = style;
exports.default = parallel(template, style, js, watchFiles);
exports.watch = watchFiles;
