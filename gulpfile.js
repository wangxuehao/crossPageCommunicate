var gulp = require('gulp');
var gulpSequence = require('gulp-sequence');
var gulpConnect = require("gulp-connect");
gulp.task("server", function(){
  return gulpConnect.server({
    port: "9023",
    debug: true
  });
});
gulp.task("dev", gulpSequence('server'));