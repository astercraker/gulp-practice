const { src, dest, series, watch, parallel } = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const del = require('del');
const inject = require('gulp-inject');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
//const uglify = require("gulp-uglify-es").default;
const concat = require('gulp-concat');
const gutil = require('gulp-util');
const babel = require('gulp-babel');

function import_scss() {
    return src('src/scss/main.scss')
      .pipe(
        inject(
      src(['src/scss/**/*.scss' ], {
        read: false
      }),
      {
        empty: true,
        starttag: '/* inject:imports */',
        endtag: '/* endinject */',
        transform: function(filepath) {
          let fileName = filepath.replace(/^.*[\\\/]/, '');
          filepath = filepath.split('/').slice(-2).join('/').replace('scss/','') ;
          return (fileName != 'main.scss')?'@import "' + filepath + '";':null;
        }
      }
        )
      )
      .pipe(dest('src/scss'));
}

function clearDistFolder(){
    return del('dist/**', {force:true});
}

function copyHtml () {
    return src('./src/**/*.html')
        .pipe(dest('./dist/'));
};

function clearSrcStyles(){
    return del('src/css/**', {force:true});
}

function styleProduction(){
    return src('./src/scss/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer, cssnano]))
    .pipe(sourcemaps.write('.'))
    .pipe( dest('./dist/assets/css') )
}

function style(){
    return src('./src/scss/main.scss')
    .pipe(sass())
    .pipe( dest('./src/css') )
    .pipe( browserSync.stream() )
}

function watchTask(){
    browserSync.init({
        server:{
            baseDir: './src',
            routes: {
              '/node_modules' : './node_modules'
            }
        }
    })
    watch(['./src/scss/**/*.scss', "!./src/scss/main.scss"], series( import_scss, style ))
    watch('./src/**/*.html').on('change', browserSync.reload)
    watch('./src/js/**/*.js').on('change', browserSync.reload)
}

function jsDist() {
  return src([
          'node_modules/three/build/three.js',
          'node_modules/three/examples/js/loaders/OBJLoader.js',
          'node_modules/three/examples/js/loaders/GLTFLoader.js',
          'node_modules/three/examples/js/controls/OrbitControls.js',
          'src/js/**/*.js'
      ])
      .pipe(babel({ presets: ["@babel/preset-env"],ignore: [
        './gulpfile.js',
        './node_modules/**/*.js',
    ] }))
      .pipe(uglify())
      .pipe(uglify().on('error', gutil.log))
      .pipe(concat('script.js'))
      .pipe(dest('dist/assets/js'));
}

exports.imports = import_scss;
exports.jsconcat = series(clearDistFolder, jsDist);
exports.build = series(
    clearDistFolder,
    parallel(copyHtml,styleProduction,jsDist)
);
exports.default = series(
    clearSrcStyles,
    style,
    watchTask
);