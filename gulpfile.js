// plugins
var gulp = require('gulp');
var templateCache = require('gulp-angular-templatecache');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var ngAnnotate = require('gulp-ng-annotate');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var args = require('yargs').argv;
var clean = require('gulp-clean');
var replace  = require('gulp-replace');
var eslint = require('gulp-eslint');
var notify = require('gulp-notify');


// tasks
gulp.task('default', ['js', 'css', 'html']);
gulp.task('watch', watch);
gulp.task('build', ['cleanDist', 'html']);

gulp.task('html', html);
gulp.task('templates', templates);

gulp.task('env', env);
gulp.task('lint', lint);
gulp.task('js', ['env', 'templates', 'lint'], js);
gulp.task('jsMinify', ['js'], jsMinify);

gulp.task('sassTask', sassTask);
gulp.task('fonts', fonts);
gulp.task('css', ['sassTask', 'fonts'], css);
gulp.task('cssMinify', ['css'], cssMinify);

gulp.task('cleanDist', ['jsMinify', 'cssMinify'], cleanDist);


// functions
function watch() {
	gulp.watch('src/**/*.js', ['js']);
	gulp.watch('src/**/*.scss', ['css']);
	gulp.watch('src/**/*.html', ['templates', 'html']);
}

function templates() {
	return gulp.src([
		'src/**/*.html',
		'!src/index.html'
	]).pipe(templateCache({ standalone: true }))
	.pipe(gulp.dest('src/'));
}

function html() {
	return gulp.src('src/index.html')
		.pipe(gulp.dest('dist/'));
}

function env() {
	var env = args.prod ? "'https://quoteextension.firebaseio.com/prod'" : "'https://quoteextension.firebaseio.com/dev'";

	return gulp.src('src/app.js')
		.pipe(replace(/\/\*gulp-replace-db\*\/(.*?)\/\*end\*\//g, '/*gulp-replace-db*/' + env + '/*end*/'))
		.pipe(replace(/\/\*gulp-replace-ref\*\/(.*?)\/\*end\*\//g, '/*gulp-replace-ref*/' + 'new Firebase(' + env + ')/*end*/'))
		.pipe(gulp.dest('src/'));
}

function lint() {
	return gulp.src([
		'src/**/*.js',
		'!src/templates.js'
	]).pipe(eslint())
	.pipe(eslint.format())
	.pipe(eslint.failAfterError());
}

function js() {
	return gulp.src([
		'!src/**/*.spec.js',
		'bower_components/angular/angular.js',
		'bower_components/angular-animate/angular-animate.js',
		'bower_components/ui-router/release/angular-ui-router.js',
		'bower_components/firebase/firebase.js',
		'bower_components/angularfire/dist/angularfire.js',
		'bower_components/firebase-util/dist/firebase-util.js',
		'bower_components/underscore/underscore.js',
		'src/**/*.js'
	]).pipe(concat('all.js'))
	.pipe(ngAnnotate())
	.pipe(gulp.dest('dist/'));
}

function sassTask() {
	return gulp.src('src/scss/app.scss')
		.pipe(sass())
		.on('error', notify.onError(function(err) {
			return 'error running sass task ' + err;
		}))
		.pipe(autoprefixer())
		.pipe(gulp.dest('src/scss/'));
}

function fonts() {
	return gulp.src([
		'bower_components/ionicons/fonts/*'
	]).pipe(gulp.dest('dist/fonts/'));
}

function css() {
	return gulp.src([
		'bower_components/ionicons/css/ionicons.css',
		'src/scss/app.css'
	]).pipe(concat('all.css'))
	.pipe(gulp.dest('dist/'));
}

function jsMinify() {
	return gulp.src('dist/all.js')
		.pipe(uglify({
			compress: {
				drop_console: true
			}
		}))
		.pipe(rename({ extname: '.min.js' }))
		.pipe(gulp.dest('dist/'));
}

function cssMinify() {
	return gulp.src('dist/all.css')
		.pipe(minifyCss({ keepSpecialComments: 0 }))
		.pipe(rename({ extname: '.min.css' }))
		.pipe(gulp.dest('dist/'));
}

function cleanDist() {
	return gulp.src([
		'!dist/**/*.min.js',
		'!dist/**/*.min.css',
		'dist/**/*.js',
		'dist/**/*.css'
	]).pipe(clean());
}