const rename = require('gulp-rename');
const gulp = require('gulp');
const del = require('del');
const argv = require('yargs').argv;
const spawn = require('child_process', ['clean']).spawn;
const runSequence = require('run-sequence');
const replace = require('gulp-replace');


// clean destination folder
gulp.task('clean', function() {
  return del('dist/**/*');
});

// build server 
gulp.task('build', (callback) => {
  let cmd = spawn('npm', ['run', 'build'])
    .on('error', (err) => {
      console.log(err);
      throw err;
    });

  cmd.stdout.on('data', (data) => {
    console.log(data.toString());
  });

  cmd.stderr.on('data', (data) => {
    console.log(data.toString());
  });

  cmd.on('exit', (code) => {
    console.log('child process exited with code ' + code.toString());
    gulp.src(['./pm2.config.json']).pipe(gulp.dest('dist/server'));
    gulp.src(['./package-prod.json']).pipe(rename('package.json')).pipe(gulp.dest('dist/server'));
    gulp.src(['./sslCertificates/*']).pipe(gulp.dest('dist/server/sslCertificates'));
    if (0 === code) {
      callback();
    }
  });
});

// Run all tasks
gulp.task('deploy:build', () => {
  runSequence('clean', 'build', () => {});
});