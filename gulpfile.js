/*global require*/
"use strict";

var gulp = require('gulp'),
    path = require('path'),
    data = require('gulp-data'),
    pug = require('gulp-pug'),
    concat = require('gulp-concat'),
    prefix = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    exec = require('gulp-exec'),
    browserSync = require('browser-sync');

/*
 * Directories here
 */
var paths = {
    src: './src/',
    public: './public/',
    sass: './src/sass/',
    css: './public/css/',
    img: {
        in: './src/img/',
        out: './public/img'
    },
    js: {
        in: './src/js/',
        out: './public/js'
    },
    data: './src/_data/'
};

/**
 * Compile .pug files and pass in data from json file
 * matching file name. index.pug - index.pug.json
 */
gulp.task('pug', function () {
    return gulp.src('./src/*.pug')
        .pipe(data(function (file) {
            return require(paths.data + path.basename(file.path) + '.json');
        }))
        .pipe(pug())
        .on('error', function (err) {
            process.stderr.write(err.message + '\n');
            this.emit('end');
        })
        .pipe(gulp.dest(paths.public));
});

/**
 * Recompile .pug files and live reload the browser
 */
gulp.task('rebuild', ['pug'], function () {
    browserSync.reload();
});

/**
 * Wait for pug and sass tasks, then launch the browser-sync Server
 */
gulp.task('browser-sync', ['sass', 'pug'], function () {
    browserSync({
        port: 4000,
        server: {
            baseDir: paths.public
        },
        notify: false
    });
});

/**
 * Compile .scss files into public css directory With autoprefixer no
 * need for vendor prefixes then live reload the browser.
 */
gulp.task('sass', function () {
    return gulp.src(paths.sass + '*.scss')
        .pipe(sass({
            includePaths: [paths.sass],
            outputStyle: 'compressed'
        }))
        .on('error', sass.logError)
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {
            cascade: true
        }))
        .pipe(gulp.dest(paths.css))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('js', function () {

    return gulp.src([
        paths.js.in + 'jquery-3.2.1.min.js',
        paths.js.in + 'script.js'
    ])
        .pipe(concat('scripts.js'))
        .pipe(uglify())
        .pipe(gulp.dest(paths.js.out))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('copysw', ['updatesw'], function () {
    return gulp.src([
        paths.js.in + 'service-worker.js',
        paths.js.in + 'sw-toolbox.js',
    ])
        .pipe(gulp.dest(paths.public))
        .pipe(browserSync.reload({
            stream: true
        }));
});


gulp.task('img', function () {
    return gulp.src(paths.img.in + '**/*')
        .pipe(gulp.dest(paths.img.out))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('other', function () {
    return gulp.src([
        paths.src + 'browserconfig.xml',
        paths.src + 'manifest.json'
    ])
        .pipe(gulp.dest(paths.public))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('updatesw', function () {
    var options = {
        continueOnError: false, // default = false, true means don't emit error event
        pipeStdout: false, // default = false, true means stdout is written to file.contents
        customTemplatingThing: "test" // content passed to gutil.template()
    };
    var reportOptions = {
        err: true, // default = true, false means don't write err
        stderr: true, // default = true, false means don't write stderr
        stdout: true // default = true, false means don't write stdout
    };
    return gulp.src(paths.js.in + 'service-worker.js')
        .pipe(exec('node ./scripts/update-sw-version.js', options))
        .pipe(exec.reporter(reportOptions));
});


/**
 * Watch scss files for changes & recompile
 * Watch .pug files run pug-rebuild then reload BrowserSync
 */
gulp.task('watch', function () {
    gulp.watch(paths.js.in + '**/*.js', ['js']);
    gulp.watch(paths.sass + '**/*.scss', ['sass']);
    gulp.watch(paths.img.in + '**/*', ['img']);
    gulp.watch('./src/**/*.pug', ['rebuild']);
});

// Build task compile sass and pug.
gulp.task('build', ['sass', 'js', 'copysw', 'img', 'other', 'pug']);

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync then watch
 * files for changes
 */
gulp.task('default', ['browser-sync', 'watch']);
