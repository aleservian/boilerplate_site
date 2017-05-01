const gulp = require('gulp'),
      concat = require('gulp-concat'),
      connect = require('gulp-connect'),
      minifyCSS = require('gulp-csso'),
      pug = require('gulp-pug'),
      stylus = require('gulp-stylus'),
      uglify = require('gulp-uglify'),
      spritesmith = require('gulp.spritesmith'),
      koutoSwiss  = require('kouto-swiss'),
      plumber = require('gulp-plumber');

/*******CONNECT***********/
gulp.task('connectDist', () => {
  connect.server({
    name: 'Dist App',
    root: 'dist',
    port: 3000,
    livereload: true
  });
});

/*******PUG***********/
gulp.task('views', () => {
  gulp.src(['!src/views/template.pug','src/views/**/*.pug'])
    .pipe(plumber())
    .pipe(pug({
      pretty: true
    }))
    .pipe(connect.reload())
    .pipe(gulp.dest('dist/'))
});

/********CSS**********/
gulp.task('css', () => {
    gulp.src('src/styl/main.styl')
    .pipe(plumber())
    .pipe(stylus({
        use:[koutoSwiss()]
    }))
    .pipe(minifyCSS())
    .pipe(connect.reload())
    .pipe(gulp.dest('dist/css'))
});

/*******SPRITES***********/
gulp.task('sprites', () => {
  const spriteData = gulp.src('src/sprites/*.png')
    .pipe(spritesmith({
      imgName: 'img-sprites.png',
      cssName: 'sprites.styl',
      cssFormat: 'stylus',
      algorithm: 'top-down',
      cssTemplate: 'src/stylus.template.mustache'
    }));
    spriteData.img.pipe(gulp.dest('src/img/'));
    spriteData.css.pipe(gulp.dest('src/styl/settings'));
});

/************JS***********/
gulp.task('js', () => {
  gulp.src(['src/js/**/*.js','!src/js/basket.min.js'])
    .pipe(plumber())
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
});

/***********COPY IMAGES***************/
gulp.task('image:copy', () => {
     gulp.src('src/img/**/*')
    .pipe(plumber())
    .pipe(gulp.dest('dist/img'));
});

/*********COPY FONT*******/
gulp.task('fonts:copy', () => {
  gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));
});

/*******WATCH***********/
gulp.task('watch',() => {
  gulp.watch('src/views/**/*.pug', ['views']);
  gulp.watch('src/styl/**/*.styl', ['css']);
  gulp.watch('src/sprites/*.png', ['sprites']);
  gulp.watch('src/js/**/*.js', ['js']);
  gulp.watch('src/img/**/*.{jpg,png,gif}', ['image:copy']);
  gulp.watch('src/fonts/**/*', ['fonts:copy']);
});

/*******DEFAULT***********/
gulp.task('default', ['connectDist','views','css','sprites','js','image:copy','fonts:copy','watch']);