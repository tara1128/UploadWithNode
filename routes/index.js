/*
  routes/index.js for Jide upload.
  Render index page
  Latest modified 2016-01-11 10:55
*/

var express = require('express');
var qiniu = require('qiniu');
var fs = require('fs');
var path = require('path');
var MD5 = require('md5');
var router = express.Router();
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var jdConf = require('../config/jide_config');
var awsConf = require('../config/aws_config');
var qnConf = require('../config/qiniu_config');
var dirName = require('../routes/makeDirName');
var fileRename = require('../routes/fileRename');
var generateUptoken = require('../routes/generateUptoken');

/* Prepare Qiniu config, we make Qiniu upload in Node Server not in browser*/
qiniu.conf.ACCESS_KEY = qnConf.QiniuJideConfig.ACCESS_KEY;
qiniu.conf.SECRET_KEY = qnConf.QiniuJideConfig.SECRET_KEY;

/* GET Index page */
router.get('/', function(req, res){
  res.render('index', {
    H1: 'Jide Upload',
    H2: 'We store static resources in Qiniu and AWS permanently',
    desc: 'Select one or more files to upload!',
    domain: qnConf.QiniuJideConfig.Domain,
    uptokenUrl: qnConf.QiniuJideConfig.Uptoken_Url,
    localSave: jdConf.localSaveApi,
    selText: 'Select File'
  });
});

/* POST to save files in Jide Local Server */
router.post(jdConf.localSaveApi, multipartMiddleware, function(req, res){
  // This middleware will create temp files on your server and never clean them up.
  // So be sure to delete all req.files when done.
  var file = req.files.file;
  var tempPath = file.path,
      fileName = file.name,
      fileType = file.type,
      fileSize = file.size;
  var uploadDirName = dirName.DirName;
  var filenameWithMd5 = MD5( new Date().getTime() ) + '-' + fileName;// For local server
  var filenameForCloud = fileRename.FileRename(fileName);// For Qiniu & AWS
  var targetPath = path.resolve('./' + uploadDirName + '/' + filenameWithMd5);
  // Save file in Jide local server:
  fs.rename(tempPath, targetPath, function(err, data){
    if(err){
      var result = 'Your file ' + fileName + ' failed in uploading! Try again!';
      res.status(result).send(); 
    }else{
      var result = 'Your file ' + fileName + ' has been stored in Jide Server successfully!';
      var uploadInfos = {
        FileRename: filenameForCloud,
        AWSInfo: awsConf.myConfig // Test with my own account
        // AWSInfo: awsConf.JideTestConfig // Test with jide test account
        // AWSInfo: awsConf.JideProdConfig // Publish with jide production account
      };
      // Do AWS upload in browser client:
      res.status(result).send( uploadInfos ); // Send datas to the client in the function of 'FileUploaded'!
      // Do Qiniu upload in here:
      var qiniu_uptoken = generateUptoken.Uptoken(qnConf.QiniuJideConfig.Bucket_Name);
      var extra = null;
      fs.readFile(targetPath, function(error, data){
        qiniu.io.put(qiniu_uptoken, uploadDirName + '/' + filenameForCloud, data, extra, function(err, ret){
          if(err){
            console.log('Something is wrong with Qiniu upload! ', err);
          }else{
            console.log('qiniu: ', ret);
            console.log('Qiniu URL = ', qnConf.QiniuJideConfig.Domain + uploadDirName + '/' + filenameForCloud);
          }
        });
      });
    }
  });
});


module.exports = router;
