/*
  Rename file for Qiniu & AWS uploads.
  Exports to ./routes/index.js
  Latest modified 2016-01-08 14:36
*/


function rename( filename ) {
  var name = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var length = 6;
  for(var i = 0; i < length; i++){
    name += possible.charAt( Math.floor(Math.random() * possible.length) );
  }
  var timestamp = new Date().getTime();
  name = timestamp + '-' + name + '-' + filename;
  return name;
};

exports.FileRename = rename;
