const {
    src,
    dest,
    watch,
    parallel
} = require('gulp');
const sass = require('gulp-sass');
const include = require('gulp-html-tag-include');
const babel = require('gulp-babel');
const browsersync = require("browser-sync").create();
const notify = require('gulp-notify');
const autoprefixer = require('gulp-autoprefixer');
const plumber = require('gulp-plumber');
const webpack = require('webpack-stream');
const svgSprite = require('gulp-svg-sprite');
const sourcemaps = require('gulp-sourcemaps');

// BrowserSync
function browserSync(done) {
    browsersync.init({
        server: {
            baseDir: "./dist/"
        },
        port: 3000
    });
    done();
}

// BrowserSync Reload
function browserSyncReload(done) {
    browsersync.reload();
    done();
}

// html
function html() {
    return src('./src/template/**.html')
        .pipe(include())
        .pipe(plumber({
            errorHandler: function(err) {
                notify.onError({
                    title: "Gulp error in " + err.plugin,
                    message: err.toString()
                })(err);
            }
        }))
        .pipe(dest('./dist'))
        .pipe(browsersync.stream());
}

// styles
function style() {
    return src('./src/scss/**.scss')
        .pipe(plumber({
            errorHandler: function(err) {
                notify.onError({
                    title: "Gulp error in " + err.plugin,
                    message: err.toString()
                })(err);
            }
        }))
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('./dist/css'))
        .pipe(browsersync.stream());
}

// icons
function svg() {
    return src('./src/svg/**.svg')
        .pipe(plumber({
            errorHandler: function(err) {
                notify.onError({
                    title: "Gulp error in " + err.plugin,
                    message: err.toString()
                })(err);
            }
        }))
        .pipe(svgSprite({
          mode: {
           symbol: {
             dest: '.',
             example: true,
             sprite: 'sprite.svg'
           },
         }
        }))
        .pipe(dest('./dist/svg'))
        .pipe(browsersync.stream());
}


// js
function js() {
    return src(['./src/js/**.js'])
        .pipe(plumber({
            errorHandler: function(err) {
                notify.onError({
                    title: "Gulp error in " + err.plugin,
                    message: err.toString()
                })(err);
            }
        }))
        .pipe(webpack({
            watch: true,
            mode: "production",
            entry: {
              index: './src/js/main.js',
            },
            output: {
                filename: "[name].js"
            },
            optimization: {
                splitChunks: {
                  chunks: 'all'
                }
             },
            devtool: "source-map",
            performance: { hints: false },
            module: {
                rules: [{
                    test: /\.(js|jsx)$/,
                    exclude: /(node_modules)/,
                    loader: 'babel-loader',
                    query: {
                        presets: [
                            ['@babel/preset-env', {
                                modules: false
                            }],
                        ],
                    },
                }, ],
            },
            resolve: {
                modules: ['node_modules'],
            }
        }))
        .pipe(dest('./dist/js'))
        .pipe(browsersync.stream());
}



// Watch files
function watchFiles() {
    watch("./src/template/**/*.html", html);
    watch("./src/scss/**/*.scss", style);
    watch("./src/svg/**.svg", svg);
    watch("./src/js/**/*.js", js);
    src('./src/js/**/*.js')
        .pipe(notify('Gulp is Watching, cheer! 🍺'));
}

exports.js = js;
exports.html = html;
exports.style = style;
exports.svg = svg;
exports.default = parallel(html, style, svg, js, watchFiles, browserSync);
exports.watch = watchFiles;
