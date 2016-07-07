var dateformat = require('dateformat'),
	del = require('del'),
	fs = require('fs'),
	path = require('path'),
	ftp = require('vinyl-ftp'),
	gulp = require('gulp'),
	merge = require('merge-stream'),
	sequence = require('run-sequence'),
	sha1 = require('sha1'),
	sourcemaps = require('gulp-sourcemaps'),
	streamqueue = require('streamqueue'),
	YAML = require('yamljs');

var _ = require('gulp-load-plugins')();

// _.libraries();

var libs = require('./libraries.json');

var contentDir = 'content';
var buildDir = 'build/';

var src = {
	assets: 'src/assets/**',
	contentAssets: contentDir + '/assets/**',
	html: 'src/*.html',
	scripts: {
		all: 'src/scripts/**/*.js'
	},
	styles: {
		main: 'src/styles/app.scss',
		all: 'src/styles/**/*.scss'
	},
	views: 'src/views/**/*.html'
};

var filenames = {
	libs: 'libs.min.js',
	libstyles: 'libs.min.css',
	scripts: 'app.min.js',
	styles: 'app.min.css',
	templateCache: 'templates.min.js'
};

var out = {
	scripts: buildDir + 'scripts',
	styles: buildDir + 'styles'
};

var minifyHtmlOpts = {
	empty: true,
	quotes: true
};

// TODO: Make own node module from that
var templateOptions = {
	imports: {
		text: function(str) {

			return str ? '<p>' + str.replace(/\n[ \t]*\n/g, '</p><p>').replace(/\n/g, ' ') + '</p>' : str;
		},
		date: function(date, format) {
			return dateformat(date, format || 'dd. mmmm yyyy');
		},
		idfor: function(str) {
			return str ? 'id_' + sha1(str) : '';
		},
		join: function(input, sep) {
			var separator = sep || ' ';
			return typeof(input) === 'string' ? input : input.join(separator);
		},
		esc: function(input) {
			return typeof(input) === 'string' ? input.replace(/'/g, "\\'") : input;
		}
	}
};

function content() {
	var files = fs.readdirSync(contentDir);
	var content = {};

	files.map(function(file) {
		return path.join(contentDir, file);
	}).filter(function(file) {
		return fs.statSync(file).isFile() && file.match(/\.yml$/);
	}).forEach(function(file) {
		var module = path.basename(file, '.yml');
		content[module] = YAML.load(file);
	});

	return content;
}

gulp.task('assets', function() {
	var srcAssets = gulp.src(src.assets, { base: 'src/' });
	var contentAssets = gulp.src(src.contentAssets, { base: 'content/' });

	return merge(srcAssets, contentAssets)
		.pipe(_.imagemin())
		.pipe(gulp.dest(buildDir))
		.pipe(_.connect.reload())
		.on('error', function() {
			console.error(arguments);
		});
});

gulp.task('bower', function(done) {
	_.bower({ cmd: 'update' })
		.pipe(_.fncallback(function() {
			done();
		}));
});

gulp.task('clean', function() {
	return del(buildDir);
});

gulp.task('htaccess', function() {
	return gulp.src('src/.htaccess')
		.pipe(gulp.dest(buildDir));
});

gulp.task('html', function() {
	return gulp.src(src.html)
		.pipe(_.template(content(), templateOptions))
		.pipe(_.minifyHtml(minifyHtmlOpts))
		.pipe(gulp.dest(buildDir))
		.pipe(_.connect.reload());
});

gulp.task('scripts', ['jshint'], function() {
	return gulp.src(src.scripts.all)
		.pipe(_.template(content(), templateOptions))
		.pipe(sourcemaps.init())
			.pipe(_.concat(filenames.scripts))
			.pipe(_.ngAnnotate())
			.pipe(_.uglify())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(out.scripts))
		.pipe(_.connect.reload());
});

gulp.task('jshint', function() {
	return gulp.src(src.scripts.all)
		.pipe(_.template(content(), templateOptions))
		.pipe(_.jshint())
		.pipe(_.jshint.reporter('jshint-stylish'));
});

// gulp.task('libs', ['libs.styles'], function() {
// 	return _.libraries.files('js')
// 		.pipe(_.concat(filenames.libs))
// 		.pipe(gulp.dest(out.scripts));
// });

// gulp.task('libs.styles', function() {
// 	return _.libraries.files('css')
// 		.pipe(_.concat(filenames.libstyles))
// 		.pipe(gulp.dest(out.styles));
// });

// Copy all required library files (without updating them from bower)
gulp.task('libs', ['libs.styles'], function(done) {
	// Concatenate libs once bower finished updating
	var libStreams = libs.map(function(lib) {
		return gulp.src(lib.src, { cwd: 'bower_components/' + lib.name });
	});

	// Merge all library streams into one file and output it
	streamqueue.apply(this, [{ objectMode: true }].concat(libStreams))
		.pipe(_.concat(filenames.libs))
		.pipe(gulp.dest(out.scripts))
		.once('end', function() {
			done();
		});
});

gulp.task('libs.styles', function(done) {
	var libStreams = libs
		.filter(function(lib) {
			return !!lib.styles;
		})
		.map(function(lib) {
			return gulp.src(lib.styles, { cwd: 'bower_components/' + lib.name });
		});

	streamqueue.apply(this, [{ objectMode: true }].concat(libStreams))
		.pipe(_.concat(filenames.libstyles))
		.pipe(gulp.dest(out.styles))
		.once('end', function() {
			done();
		});
});

gulp.task('serve', function() {
	_.connect.server({
		root: buildDir,
		port: 4242,
		livereload: true,
		fallback: buildDir + '/index.html'
	});
});

gulp.task('styles', function() {
	return gulp.src(src.styles.main)
		.pipe(_.sass())
		.pipe(_.concat(filenames.styles))
		.pipe(_.autoprefixer())
		.pipe(_.combineMediaQueries())
		.pipe(_.minifyCss())
		.pipe(gulp.dest(out.styles))
		.pipe(_.connect.reload());
});

gulp.task('templates', function() {
	return gulp.src(src.views)
		.pipe(_.template(content(), templateOptions))
		.pipe(_.minifyHtml(minifyHtmlOpts))
		.pipe(_.angularTemplatecache({
			root: 'views',
			standalone: true,
			filename: filenames.templateCache
		}))
		.pipe(gulp.dest(out.scripts))
		.pipe(_.connect.reload());
});

gulp.task('deploy', function() {

	var remote = '/';

	var loginData = {
		host: process.env.ftphost,
		user: process.env.ftpuser,
		password: process.env.ftppassword
	};

	var conn = ftp.create({
		host: loginData.host,
		user: loginData.user,
		password: loginData.password,
		parallel: 5,
		log: _.util.log
	});

	return gulp.src(['build/**', 'build/**/.*'], { buffer: false })
		.pipe(conn.newer(remote))
		.pipe(conn.dest(remote));
});

gulp.task('watch', function() {
	gulp.watch(contentDir + '/**', ['html', 'templates', 'assets', 'scripts']);

	gulp.watch(src.html, ['html']);
	gulp.watch(src.assets, ['assets']);
	gulp.watch(src.views, ['templates']);
	gulp.watch(src.scripts.all, ['scripts']);
	gulp.watch(src.styles.all, ['styles']);
});

gulp.task('build', function(done) {
	sequence(
		'bower',
		['assets', 'htaccess', 'html', 'scripts', 'libs', 'styles', 'templates'],
		done
	);
});

gulp.task('dev', function(done) {
	sequence(
		'build',
		['serve', 'watch'],
		done
	);
});

gulp.task('default', ['dev']);
