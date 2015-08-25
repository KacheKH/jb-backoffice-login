var gulp		= require( 'gulp' )
	, rename	= require( 'gulp-rename' )
	, concat	= require( 'gulp-concat' )
	, order		= require( 'gulp-order' )
	, gulpPrint	= require( 'gulp-print' )
	, less		= require( 'gulp-less' );


var paths		= {
	jsSrc		: 'src/**/*.js'
	, jsDest	: 'dist/js'
	, cssSrc	: 'src/**/*.less'
	, cssDest	: 'dist/css'
};


gulp.task( 'scripts', function() {

	return gulp.src( [ paths.jsSrc ] )
		.pipe( order( [
			// Where the module definition is
			'jb-backoffice-login.js',
			// Holds the module definition
			'**/*.js'
			], { base: './src/' } ) ) // does not seem to work without base –
		.pipe( gulpPrint() )
		.pipe( concat( 'jb-backoffice-login.js' ) )
		.pipe( gulp.dest( paths.jsDest ) );

} );




gulp.task( 'less', function() {

	return gulp.src( [ paths.cssSrc ] )
		.pipe( gulpPrint() )
		.pipe( less() )
		.pipe( concat( 'jb-backoffice-login.css' ) )
		.pipe( gulp.dest( paths.cssDest ) );

} );




gulp.task( 'watch', function() {

	gulp.watch( paths.jsSrc, [ 'scripts' ] );
	gulp.watch( paths.cssSrc, [ 'less' ] );

} );

gulp.task( 'default', [ 'scripts', 'less', 'watch' ] );
