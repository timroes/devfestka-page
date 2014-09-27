var concat = require('gulp-concat'),
	debug = require('gulp-debug'),
	gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	minifyCss = require('gulp-minify-css'),
	ngAnnotate = require('gulp-ng-annotate'),
	rimraf = require('rimraf'),
	sourcemaps = require('gulp-sourcemaps'),
	templateCache = require('gulp-angular-templatecache'),
	uglify = require('gulp-uglify'),
	webserver = require('gulp-webserver');

gulp.task('assets', function() {
	gulp.src('src/assets/**', { base: 'src' })
		.pipe(gulp.dest('build'));
});

gulp.task('build', ['assets', 'html', 'js', 'libs', 'styles', 'templates']);

gulp.task('clean', function(cb) {
	rimraf('build', cb);
});

gulp.task('default', ['serve']);

gulp.task('html', function() {
	gulp.src(['src/**/*.html', '!src/views/**', '!src/scripts/directives/**'])
		.pipe(gulp.dest('build'));
});

gulp.task('js', ['jshint'], function() {
	gulp.src('src/scripts/**/*.js')
		.pipe(sourcemaps.init())
			.pipe(concat('app.min.js'))
			.pipe(ngAnnotate())
			.pipe(uglify())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('build/scripts'));
});

gulp.task('jshint', function() {
	gulp.src('src/scripts/**/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('libs', function() {
	gulp.src('src/libs/**', { base: 'src' })
		.pipe(gulp.dest('build'));
});

gulp.task('serve', ['build'], function() {
	gulp.watch('src/**', ['build']);
	gulp.src('./build')
		.pipe(webserver({ livereload: true, open: true }));
});

gulp.task('styles', function() {
	gulp.src('src/styles/*.css')
		.pipe(concat('app.css'))
		.pipe(minifyCss())
		.pipe(gulp.dest('build/styles'));
});

gulp.task('templates', function() {
	gulp.src('src/views/**/*.html')
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