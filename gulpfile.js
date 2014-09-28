var concat = require('gulp-concat'),
	debug = require('gulp-debug'),
	gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	less = require('gulp-less'),
	merge = require('merge-stream'),
	minifyCss = require('gulp-minify-css'),
	ngAnnotate = require('gulp-ng-annotate'),
	rimraf = require('gulp-rimraf'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	templateCache = require('gulp-angular-templatecache'),
	uglify = require('gulp-uglify'),
	webserver = require('gulp-webserver');

gulp.task('assets', function() {
	return gulp.src('src/assets/**', { base: 'src' })
		.pipe(gulp.dest('build'));
});

gulp.task('build', ['assets', 'html', 'js', 'libs', 'styles', 'templates']);

gulp.task('clean', function(cb) {
	return gulp.src('./build', { read: false })
		.pipe(rimraf());
});

gulp.task('default', ['serve']);

gulp.task('html', function() {
	return gulp.src(['src/**/*.html', '!src/views/**', '!src/scripts/directives/**'])
		.pipe(gulp.dest('build'));
});

gulp.task('js', ['jshint'], function() {
	return gulp.src('src/scripts/**/*.js')
		.pipe(sourcemaps.init())
			.pipe(concat('app.min.js'))
			.pipe(ngAnnotate())
			.pipe(uglify())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('build/scripts'));
});

gulp.task('jshint', function() {
	return gulp.src('src/scripts/**/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('libs', function() {
	return gulp.src('src/libs/**', { base: 'src' })
		.pipe(gulp.dest('build'));
});

gulp.task('serve', ['build'], function() {
	gulp.watch('src/**', ['build']);
	gulp.src('./build')
		.pipe(webserver({ livereload: true, open: true }));
});

gulp.task('styles', function() {

	var less_src = gulp.src('src/styles/**/*.less')
		.pipe(less());

	var sass_src = gulp.src('src/styles/**/*.sass')
		.pipe(sass());

	var css_src = gulp.src('src/styles/**/*.css');

	return merge(less_src, sass_src, css_src)
		.pipe(concat('app.css'))
		.pipe(minifyCss())
		.pipe(gulp.dest('build/styles'));
});

gulp.task('templates', function() {
	return gulp.src('src/views/**/*.html')
		.pipe(templateCache({ standalone: true }))
		.pipe(gulp.dest('build/scripts'));
});

// gulp.task('upload', ['build'], function() {
// 	var login_data;
// 	try {
// 		login_data = require('./ftplogin.json');
// 	} catch(e) {
// 		console.error("Cannot find ftplogin.json file with ftp login data.\nSkipping upload...");
// 		return;
// 	}

// 	gulp.src('./build/**')
// 		.pipe(ftp(login_data));
// });