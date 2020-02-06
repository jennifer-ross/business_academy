var gulp         = require('gulp'),
		sass         = require('gulp-sass'),
		browserSync  = require('browser-sync'),
		concat       = require('gulp-concat'),
		uglify       = require('gulp-uglify-es').default,
		cleancss     = require('gulp-clean-css'),
		autoprefixer = require('gulp-autoprefixer'),
		rsync        = require('gulp-rsync'),
		newer        = require('gulp-newer'),
		rename       = require('gulp-rename'),
		responsive   = require('gulp-responsive'),
		del          = require('del');
		// wp_css_outDir = '/Applications/MAMP/htdocs/wp-content/themes/fastsol_digital/css',
		// wp_Dir = '/Applications/MAMP/htdocs/wp-content/themes/fastsol_digital/';

// Local Server
gulp.task('browser-sync', function() {
	browserSync({
		open: false,
		socket: {
			domain: "http://localhost:3000",
		},
		server: {
			baseDir: 'app'
		},
		notify: true,
		// online: false, // Work offline without internet connection
		// tunnel: true, tunnel: 'projectname', // Demonstration page: http://projectname.localtunnel.me
	})
});
function bsReload(done) { browserSync.reload(); done(); };

function cleanDist() {
	del('dist/');
}

gulp.task('build', async function () {
	console.log('Building...');
	gulp.series(cleanDist, 'styles', 'scripts');
	gulp.src('app/css/**/*.css')
		.pipe(gulp.dest('dist/css/'));
	gulp.src('app/js/**/*.js')
		.pipe(gulp.dest('dist/js/'));
	gulp.src('app/img/**/*')
		.pipe(gulp.dest('dist/img/'));
	gulp.src('app/fonts/**/*')
		.pipe(gulp.dest('dist/fonts/'));
	return gulp.src('app/*.html')
		.pipe(gulp.dest('dist/'));
});

// Custom Styles
gulp.task('styles', function() {
	return gulp.src('app/sass/**/*.sass')
	.pipe(sass({ outputStyle: 'expanded' }))
	.pipe(concat('styles.min.css'))
	.pipe(autoprefixer({
		flexbox: true,
		grid: 'autoplace',
		overrideBrowserslist: ['last 10 versions','cover 99.5%', 'unreleased versions', 'last 2 years','ie 6-8','Firefox > 20','dead']
	}))
	.pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Optional. Comment out when debugging
	.pipe(gulp.dest('app/css'))
	// .pipe(gulp.dest(wp_css_outDir))
	.pipe(browserSync.stream())
});

// Scripts & JS Libraries
gulp.task('scripts', function() {
	return gulp.src([
		// 'node_modules/jquery/dist/jquery.min.js', // Optional jQuery plug-in (npm i --save-dev jquery)
		// 'node_modules/wow.js/dist/wow.min.js',
		// 'app/js/_lazy.js', // JS library plug-in example
		// 'app/libs/ScrollMagic.min.js',
		// 'app/js/_custom.js', // Custom scripts. Always at the end
		])
	.pipe(concat('scripts.min.js'))
	.pipe(uglify()) // Minify js (opt.)
	.pipe(gulp.dest('app/js'))
	.pipe(browserSync.reload({ stream: true }))
});

// Responsive Images
gulp.task('img-responsive', async function() {
	return gulp.src('app/img/_src/**/*.{png,jpg,jpeg,webp,raw}')
		.pipe(newer('app/img/@1x'))
		.pipe(responsive({
			'*': [{
				// Produce @2x images
				width: '100%', quality: 90, rename: { prefix: '@2x/', },
			}, {
				// Produce @1x images
				width: '50%', quality: 90, rename: { prefix: '@1x/', }
			}]
		})).on('error', function () { console.log('No matching images found') })
		.pipe(rename(function (path) {path.extname = path.extname.replace('jpeg', 'jpg')}))
		.pipe(gulp.dest('app/img'))
});
gulp.task('img', gulp.series('img-responsive', bsReload));

// Clean @*x IMG's
gulp.task('cleanimg', function() {
	return del(['app/img/@*'], { force: true })
});

// Code & Reload
gulp.task('code', function() {
	return gulp.src('app/**/*.html')
	.pipe(browserSync.reload({ stream: true }))
});

gulp.task('reload', function(done) {
	browserSync.reload(); done();
	// return gulp.src('app/**/*.js').pipe(browserSync.reload({ stream: false }))
});


// Deploy
gulp.task('rsync', function() {
	return gulp.src('app/')
	.pipe(rsync({
		root: 'app/',
		hostname: 'username@yousite.com',
		destination: 'yoursite/public_html/',
		// include: ['*.htaccess'], // Included files
		exclude: ['**/Thumbs.db', '**/*.DS_Store'], // Excluded files
		recursive: true,
		archive: true,
		silent: false,
		compress: true
	}))
});

gulp.task('watch', function() {
	gulp.watch('app/sass/**/*.sass', gulp.parallel('styles'));
	gulp.watch(['libs/**/*.js', 'app/js/_custom.js'], gulp.parallel('scripts'));
	gulp.watch('app/*.html', gulp.parallel('code'));
	// gulp.watch(wp_Dir+'**/*.php', gulp.parallel('reload'));
	// gulp.watch(wp_Dir+'**/*.js', gulp.parallel('reload'));
	gulp.watch(['app/**/*.js','app/**/*.php','app/**/*.png','app/**/*.jpg','app/**/*.svg'], gulp.parallel('reload'));
});

gulp.task('default', gulp.parallel('styles', 'browser-sync', 'watch'));
