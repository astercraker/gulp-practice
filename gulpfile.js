const { src, dest, series, watch } = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const del = require('del');
const inject = require('gulp-inject');

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

function clearSrcStyles(){
    return del('src/css/**', {force:true});
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
            baseDir: './src/'
        }
    })
    watch(['./src/scss/**/*.scss', "!./src/scss/main.scss"], series( import_scss, style ))
    watch('./src/*.html').on('change', browserSync.reload)
    watch('./src/js/**/*.js').on('change', browserSync.reload)
}
exports.imports = import_scss;
exports.style = series(
    clearSrcStyles,
    style,
    watchTask
);