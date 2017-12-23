'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const rename = require('gulp-rename');
const babel = require('gulp-babel');
const nodemon = require('gulp-nodemon');
const plumber = require('gulp-plumber');

gulp.task('sass', function () {
	console.log('sass task started');
	const plugins = [autoprefixer({browsers: ['last 2 versions']}), cssnano()];
	return gulp.src('./client/styles/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(postcss(plugins))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('./dist/css'));
});

gulp.task('babel', () => {
	return gulp.src('./client/js/main.js')
		.pipe(plumber({
			errorHandler: onError
		}))
		.pipe(babel({
			presets: ['env']
		}))
		.pipe(gulp.dest('./dist/js'));
});

const onError =  (err)  => {
	console.log(err);
};

gulp.task('watch', function() {
  	console.log('watch started');
	gulp.watch('./client/styles/*.scss', ['sass'])
	gulp.watch('./client/js/*.js', ['babel'])
});

gulp.task('nodemon', function () {
	nodemon({
		script: 'app.js',
		ext: 'js html',
		env: {
			'NODE_ENV': 'development'
		}
	})
	.on('start', ['sass', 'babel', 'watch'])
	.on('change', ['sass', 'babel', 'watch'])
	.on('restart', function () {
	    console.log('nodemon restarted!');
	});
});

gulp.task('default', ['nodemon']);
