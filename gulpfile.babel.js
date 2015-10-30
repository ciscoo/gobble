import gulp from 'gulp';
import browserSync from 'browser-sync';
import gulpLoadPlugins from 'gulp-load-plugins';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

gulp.task('jshint', () =>
  gulp.src('src/scripts/**/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')))
);

gulp.task('images', () =>
  gulp.src('src/img/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images'))
    .pipe($.size({title: 'images'}))
);

gulp.task('copy', () =>
  gulp.src([
    'src/*',
    '!src/*.html',
    'node_modules/apache-server-configs/dist/.htaccess'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'))
    .pipe($.size({title: 'copy'}))
);

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

gulp.task('scripts', () =>
  gulp.src(['./src/scripts/app.js'])
    .pipe($.newer('.tmp/scripts'))
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/scripts'))
    .pipe($.concat('main.min.js'))
    .pipe($.uglify({preserveComments: 'some'}))
    .pipe($.size({title: 'scripts'}))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('dist/scripts')))

gulp.task('serve', ['styles'], () => {
  browserSync({
      server: 'dev'
  });

  gulp.watch(['styles/**/*.{scss}'], ['styles', reload]);
});

gulp.task('default', ['serve']);