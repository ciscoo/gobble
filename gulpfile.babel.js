import gulp from 'gulp';
import browserSync from 'browser-sync';
import gulpLoadPlugins from 'gulp-load-plugins';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

gulp.task('styles', () => {
    const AUTOPREFIXER_BROWSERS = ['last 2 versions, > 5%'];
    const SASS_OPTS = {
        //includePaths: ['bower_components/susy/sass'],
        precision: 10
    };

    return gulp.src(['styles/**/*.scss'])
        .pipe($.sourcemaps.init())
        .pipe($.sass(SASS_OPTS).on('error', $.sass.logError))
        .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest('dev/styles'))
        .pipe($.size({title: 'styles'}));
});

gulp.task('serve', ['styles'], () => {
    browserSync({
        server: 'dev'
    });

    gulp.watch(['styles/**/*.{scss}'], ['styles', reload]);
});

gulp.task('default', ['serve']);