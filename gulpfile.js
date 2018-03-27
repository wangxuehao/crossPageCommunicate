var gulp = require('gulp');
var gulpSequence = require('gulp-sequence');
var gulpConnect = require("gulp-connect");
var gulpOpen = require("gulp-open");
var gulpConfig = require("./gulp.config.json");
var portNum = gulpConfig.dev.port;

//task：启动server
gulp.task("server", function(){
  return gulpConnect.server({
    port: portNum,
    debug: true
  });
});

//task：打开测试页
gulp.task("openBrowser",function(){
  var pageAUrl = gulpConfig.dev.pageAUrl;
  var pageBUrl = gulpConfig.dev.pageBUrl;
  return gulp.src('')
    .pipe(gulpOpen({
      uri:pageAUrl
    }))
    .pipe(gulpOpen({
      uri:pageBUrl
    }));
});


gulp.task("dev", gulpSequence(['server','openBrowser']));