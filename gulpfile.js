import gulp from 'gulp'
import dartSass from 'sass'
import gulpSass from 'gulp-sass'
import sourcemaps from 'gulp-sourcemaps'
import autoPrefixer from 'gulp-autoprefixer'
import htmlmin from 'gulp-htmlmin'
import image from 'gulp-image'
import { deleteAsync } from 'del'
import browserSync from 'browser-sync'

const styleFiles = 'src/styles/**/*.scss'
const htmlFiles = 'src/**/*.html'
const resourcesFiles = 'src/resources/'
const imageFiles = 'src/img/**/*.png'
const appLocation = 'app'
const appStyles =  'app/css'
const appImages = 'app/img'
const fontsLocation = 'src/resources/fonts/*.*'
const appFontsLocation = 'app/fonts'
const sass = gulpSass(dartSass)
const server = browserSync.create()

function cleanLocation() {
    return deleteAsync([appLocation])
}

function favicon() {
    return gulp.src('src/resources/favicon.ico')
        .pipe(gulp.dest(appLocation))
}

function fontsProcessing() {
    return gulp.src(fontsLocation)
        .pipe(gulp.dest(appFontsLocation))
}

function stylesProcessing() {
    return gulp.src(styleFiles)
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(autoPrefixer({
            cascade: false
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(appStyles))
}

function htmlProcessing() {
    return gulp.src(htmlFiles)
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest(appLocation))
}

function imagesProcessing() {
    return gulp.src(imageFiles)
        .pipe(image())
        .pipe(gulp.dest(appImages))
}

function reload(done) {
    server.reload();
    done();
}

function serve(done) {
    server.init({
        server: {
            baseDir: appLocation
        }
    })
    done();
}

function watchFiles() {
    gulp.watch(htmlFiles, gulp.series(htmlProcessing, reload))
    gulp.watch(styleFiles, gulp.series(stylesProcessing, reload))
    gulp.watch(imageFiles, gulp.series(imagesProcessing, reload))
}

const build = gulp.series(cleanLocation, fontsProcessing, stylesProcessing, favicon, htmlProcessing, imagesProcessing, serve, watchFiles)

export default build