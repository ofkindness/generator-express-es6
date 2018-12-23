const { src, task, watch } = require('gulp');
const eslint = require('gulp-eslint');
const excludeGitignore = require('gulp-exclude-gitignore');
const plumber = require('gulp-plumber');

task('static', () => src('**/*.js')
  .pipe(excludeGitignore())
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError()));

task('test', (cb) => {
  let mochaErr;

  return src('test/**/*.js')
    .pipe(plumber())
    .pipe(mocha({
      reporter: 'spec'
    }))
    .on('error', (err) => {
      mochaErr = err;
    })
    .on('end', () => {
      cb(mochaErr);
    });
});

task('watch', () => watch(['**/*.js', 'test/**'], ['test']));

task('prepublish', () => {});
