'use strict';

var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var del = require('del');
var gulp = require('gulp');
var header = require('gulp-header');
var htmlmin = require('gulp-htmlmin');
var jshint = require('gulp-jshint');
var moment = require('moment');
var rename = require('gulp-rename');
var replace = require('gulp-replace-task');
var run = require('gulp-run');
var runSequence = require('run-sequence');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var svgmin = require('gulp-svgmin');
var svgstore = require('gulp-svgstore');
var template = require('gulp-template');
var uglify = require('gulp-uglify');

var pkg = require('./package.json');
var banner = '/* <%= pkg.name %> <%= pkg.version %> (build <%= moment().toISOString() %>) */\n';

var jsSrc = [
  'src/js/hyperion.js',
  'src/js/config.js',
  'src/js/init.js'
];

var sassParams = {
  includePaths: [
    'libraries/normalize-scss/',
    'libraries/bourbon/app/assets/stylesheets/',
    'libraries/compass-mixins/lib/',
    'libraries/compass-breakpoint/stylesheets/',
    'libraries/singularity/stylesheets/',
    'src/sass/'
  ],
  errLogToConsole: true
};

gulp.task('sass:dev', function (cb) {
  gulp.src('src/sass/**/*.scss')
      .pipe(sourcemaps.init())
      .pipe(sass(sassParams).on('error', sass.logError))
      .pipe(autoprefixer({
        browsers: ['last 2 versions', 'ie >= 8', 'ff >= 5', 'chrome >= 20', 'opera >= 12', 'safari >= 4', 'ios >= 6', 'android >= 2', 'bb >= 6']
      }))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('css'))
      .on('end', cb);
});

gulp.task('sass:prod', function (cb) {
  gulp.src('src/sass/**/*.scss')
      .pipe(sass(sassParams).on('error', sass.logError))
      .pipe(autoprefixer({
        browsers: ['last 2 versions', 'ie >= 8', 'ff >= 5', 'chrome >= 20', 'opera >= 12', 'safari >= 4', 'ios >= 6', 'android >= 2', 'bb >= 6']
      }))
      .pipe(gulp.dest('css'))
      .on('end', cb);
});

gulp.task('clean:init', function (cb) {
  del(['css', 'img/icon', 'js', 'svg'], cb);
});

gulp.task('clean:exit', function (cb) {
  del(['build', 'tmp'], cb);
});

gulp.task('sync', function (cb) {
  runSequence('sync:css', 'sync:php', cb);
});

gulp.task('sync:css', function (cb) {
  run('bash sync.sh css 1').exec(cb);
});

gulp.task('sync:php', function (cb) {
  run('bash sync.sh php 1').exec(cb);
});

gulp.task('dev', function (cb) {
  runSequence('clean:init', 'sass:dev', 'sync', 'clean:exit', cb);
});

gulp.task('dev:css', ['sass:dev'], function (cb) {
  runSequence('sync:css', cb);
});

gulp.task('prod', function (cb) {
  runSequence('clean:init', 'sass:prod', 'clean:exit', cb);
});

gulp.task('watch', function () {
  gulp.watch(['!tmp', 'src/sass/**/*.scss'], ['dev:css']);
  gulp.watch(['!tmp', '**/*.inc', '**/*.info', '**/*.make', '**/*.php'], ['sync:php']);
});

gulp.task('default', ['dev', 'watch']);
