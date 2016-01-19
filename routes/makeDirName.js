/*
  AWS S3 Configurations
  Exports to app.js
  Latest modified 2016-01-19 15:29
*/

var fs = require('fs');

var _d = new Date();
var _year = _d.getFullYear();
var _month = (_d.getMonth() + 1 < 10)?('0' + (_d.getMonth() + 1)):(_d.getMonth() + 1);
var dir = _year + '_' + _month + '_jide_upload';

if (!fs.existsSync(dir)){
  fs.mkdirSync(dir);
}

exports.DirName = dir;
