/*
  Generate uptoken for Qiniu upload.
  Exports to ./routes/index.js
  Latest modified 2016-01-08 16:16
*/

var qiniu = require('qiniu');

function uptoken(bucketname) {
  var putPolicy = new qiniu.rs.PutPolicy(bucketname);
  return putPolicy.token();
}

exports.Uptoken = uptoken;
