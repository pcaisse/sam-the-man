var gulp = require('gulp'),
    source = require('vinyl-source-stream'),
    browserify = require('browserify'),
    reactify = require('reactify'),
    streamify = require('gulp-streamify'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    notify = require('gulp-notify'),
    react = require('gulp-react');
 
var sourcesDir = './src/',
    allSources = sourcesDir + '**/*',
    appEntryPoint = 'app.js',
    targetDir = './static/js/';

gulp.task('lint', function() {
    return gulp.src(allSources)
        .pipe(react())
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('dev', function() {
    return browserify({entries: [sourcesDir + appEntryPoint], transform: ['reactify'], debug: true})
        .bundle()
        .pipe(source(appEntryPoint))
        .pipe(gulp.dest(targetDir))
        .pipe(notify('Dev build done.'));
});
 
gulp.task('dist', function() {
    process.env.NODE_ENV = 'production';
    return browserify({entries: [sourcesDir + appEntryPoint], transform: ['reactify'], debug: false})
        .bundle()
        .pipe(source(appEntryPoint))
        .pipe(streamify(uglify()))
        .pipe(gulp.dest(targetDir))
        .pipe(notify('Production build done.'));
});
 
gulp.task('watch', function() {
    gulp.watch(allSources, ['dev']);
});