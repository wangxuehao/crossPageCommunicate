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


//task：打开postMessage测试页
gulp.task("openBrowser_postMessage",function(){
  var pageUrl = gulpConfig.dev.pageUrl_postMessage;
  return gulp.src('')
    .pipe(gulpOpen({
      uri:pageUrl
    }));
});


//task：打开localStorage测试页
gulp.task("openBrowser_localStorage",function(){
  var pageUrl = gulpConfig.dev.pageUrl_localStorage;
  return gulp.src('')
    .pipe(gulpOpen({
      uri:pageUrl
    }));
});


//task：打开util-v2测试页
gulp.task("openBrowser_util",function(){
  var pageA = gulpConfig.dev.pageA_util_v2;
  var pageB = gulpConfig.dev.pageB_util_v2;
  return gulp.src('')
    .pipe(gulpOpen({
      uri:pageA
    }))
    .pipe(gulpOpen({
      uri:pageB
    }));
});

gulp.task("dev", gulpSequence(['server','openBrowser']));
gulp.task("postMsg", gulpSequence(['server','openBrowser_postMessage']));
gulp.task("localStorage", gulpSequence(['server','openBrowser_localStorage']));
gulp.task("util", gulpSequence(['server','openBrowser_util']));


