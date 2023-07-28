const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync');
const concat = require('gulp-concat');
const uglify = require('gulp-uglifyjs');
const cssnano = require('gulp-cssnano');
const rename = require('gulp-rename');
const clean = require('gulp-clean');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const cache = require('gulp-cache');
const autoprefixer = require('gulp-autoprefixer');

// tasks

// лайв сервер
gulp.task('browser-sync', function(){
    browserSync({
        server: {
            baseDir: 'app'
        },
        notify: false
    });
});

// следим за изменениями js
gulp.task('scripts', function(){
    return gulp.src('app/js/script.js')
        .pipe(browserSync.reload({stream: true}))
});

// собираем библиотеки и минифицируем
gulp.task('libs', function(){
    return gulp.src([
        'app/libs/jquery/dist/jquery.min.js',
        'app/libs/select2/dist/js/select2.min.js',
        'app/libs/aos/dist/aos.js'
    ])
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('app/js'))
});

// следим за изменениями html
gulp.task('code', function(){
    return gulp.src('app/*.html')
        .pipe(browserSync.reload({stream: true})) // Обновляем HTML на странице при изменении
});

// компилируем sass/scss в css
gulp.task('sass', function(){
    return gulp.src('app/scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
});

// минифиццируем css
gulp.task('css-nano', function(){
    return gulp.src('app/scss/*.scss')
        .pipe(sass())
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(cssnano())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('app/css'));
});

// gulp buid

// чистим папку dist
gulp.task('clean', function(){
    return gulp.src('dist', {allowEmpty: true}).pipe(clean());
});

// сжатие картиночек
gulp.task('img', function(){
    return gulp.src('app/image/**/*.+(jpg|png)')
    .pipe(cache(imagemin({
        interlaced: true,
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()]
    })))
    .pipe(gulp.dest('dist/image'));
});

// переносим файлы в buld
gulp.task('prebuild', async function(){
    const buildCss = gulp.src([
        'app/css/**/*.min.css'
    ])
    .pipe(gulp.dest('dist/css'))

    const buildFonts = gulp.src([
        'app/fonts/**/*'
    ])
    .pipe(gulp.dest('dist/fonts'))

    const buildJs = gulp.src([
        'app/js/**/*'
    ])
    .pipe(gulp.dest('dist/js'))

    const buildHtml = gulp.src([
        'app/*.html'
    ])
    .pipe(gulp.dest('dist'));

    const buildIcons = gulp.src([
        'app/icons/**/*'
    ])
    .pipe(gulp.dest('dist/icons'));
});

// чистим кэш
gulp.task('clear', function (callback) {
	return cache.clearAll();
})

// gulp.watch
gulp.task('watch', function(){
    gulp.watch('app/scss/**/*.scss', gulp.parallel('sass')); //следим за sass файлами
    gulp.watch('app/js/script.js', gulp.parallel('scripts')); //следим за js
    gulp.watch('app/*.html', gulp.parallel('code')); //следим за html
});

gulp.task('default', gulp.parallel('sass', 'css-nano', 'libs', 'browser-sync', 'watch'));
gulp.task('build', gulp.series('clean', 'css-nano', 'prebuild', 'img', 'libs'));