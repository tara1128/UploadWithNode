/*
  AWS S3 Configurations
  Exports to app.js
  Latest modified 2016-01-11 10:34
*/

var fs = require('fs');

var _d = new Date();
var _year = _d.getFullYear();
var _month = (_d.getMonth() + 1 < 10)?('0' + (_d.getMonth() + 1)):(_d.getMonth() + 1);
var dir = _year + '-' + _month + '-jide_upload';

if (!fs.existsSync(dir)){
  fs.mkdirSync(dir);
}

exports.DirName = dir;
