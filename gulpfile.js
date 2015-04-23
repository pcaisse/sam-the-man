var gulp = require('gulp'),
    source = require('vinyl-source-stream'),
    browserify = require('browserify'),
    reactify = require('reactify'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify');
 
var sourcesDir = './src/',
    appEntryPoint = 'app.js',
    targetDir = './static/js/';

// gulp.task('js', function() {
//     var bundler = browserify('./src/*.jsx')
//     return bundler
//         .transform(reactify)
//         .bundle()
//         .pipe(jshint)
//         .pipe(concat('all.js'))
//         .pipe(uglify())
//         .pipe(rename({suffix: '.min'}))
//         .pipe(gulp.dest('static/js'))
//         .pipe(notify({ message: 'Scripts task complete' }));
// });
 
gulp.task('default', function() {
    return browserify({entries: [sourcesDir + appEntryPoint], debug: true})
        .transform(reactify)
        .bundle()
        .pipe(source(appEntryPoint))
        .pipe(gulp.dest(targetDir))
        .pipe(notify('Bundling done.'));
});
 
gulp.task('watch', function() {
    gulp.watch(sourcesDir + '*.js*', ['default']);
});