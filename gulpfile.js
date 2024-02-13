import gulp from 'gulp'
import dartSass from 'sass'
import gulpSass from 'gulp-sass'
import sourcemaps from 'gulp-sourcemaps'
import autoPrefixer from 'gulp-autoprefixer'
import htmlmin from 'gulp-htmlmin'
import image from 'gulp-image'
import svgSprite from 'gulp-svg-sprite'
import { deleteAsync } from 'del'
import browserSync from 'browser-sync'

const styleFiles = 'src/styles/**/*.scss'
const htmlFiles = 'src/**/*.html'
const scriptsFiles = 'src/scripts/**/*.js'
const svgSource = 'src/img/svg/**/*.svg'
const resourcesFiles = 'src/resources/'
const imageFiles = 'src/img/**/*.png'
const appLocation = 'app'
const appStyles =  'app/css'
const appImages = 'app/img'
const appScripts = 'app/scripts'
const appSvg = 'app/img/svg'
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

function scriptsProcessing() {
    return gulp.src(scriptsFiles)
        .pipe(gulp.dest(appScripts))
}

function imagesProcessing() {
    return gulp.src(imageFiles)
        .pipe(image())
        .pipe(gulp.dest(appImages))
}

function svgProcessing() {
    return gulp.src(svgSource)
        .pipe(svgSprite({
            mode: {
                stack: {
                    sprite: '../sprite.svg'
                }
            }
        }))
        .pipe(gulp.dest(appSvg))
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
    gulp.watch(scriptsFiles, gulp.series(scriptsProcessing, reload))
    gulp.watch(svgSource, gulp.series(svgProcessing, reload))
}

const build = gulp.series(cleanLocation, fontsProcessing, stylesProcessing, scriptsProcessing, favicon, htmlProcessing, imagesProcessing, svgProcessing, serve, watchFiles)

export default build