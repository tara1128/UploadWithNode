/*
  AWS S3 Configurations
  Exports to app.js
  Latest modified 2016-02-03 11:28
*/

var fs = require('fs');

var _d = new Date();
var _year = _d.getFullYear();
var _month = (_d.getMonth() + 1 < 10)?('0' + (_d.getMonth() + 1)):(_d.getMonth() + 1);
var dir = 'alex_upload/' + _year + '_' + _month;

if (!fs.existsSync(dir)){
  fs.mkdirSync(dir);
}

exports.DirName = dir;
