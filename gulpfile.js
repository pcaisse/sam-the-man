var gulp = require('gulp'),
    source = require('vinyl-source-stream'),
    browserify = require('browserify'),
    reactify = require('reactify'),
    streamify = require('gulp-streamify'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify');
 
var sourcesDir = './src/',
    appEntryPoint = 'app.js',
    targetDir = './static/js/';
 
gulp.task('dev', function() {
    return browserify({entries: [sourcesDir + appEntryPoint], debug: true})
        .transform(reactify)
        .bundle()
        .pipe(source(appEntryPoint))
        .pipe(gulp.dest(targetDir))
        .pipe(notify('Dev build done.'));
});
 
gulp.task('dist', function() {
    return browserify({entries: [sourcesDir + appEntryPoint], debug: false})
        .transform(reactify)
        .bundle()
        .pipe(source(appEntryPoint))
        .pipe(streamify(jshint()))
        .pipe(jshint.reporter('default'))
        .pipe(streamify(uglify()))
        .pipe(gulp.dest(targetDir))
        .pipe(notify('Production build done.'));
});
 
gulp.task('watch', function() {
    gulp.watch(sourcesDir + '**/*.js*', ['dev']);
});