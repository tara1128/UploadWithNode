/*
  routes/index.js for upload.
  Render index page
  Latest modified 2016-02-03 11:22
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
var recentFileName = './recentUpload/recent.txt';
var recentFileTmpl = require('../routes/recentFileTmpl');
var userDataDir = './users/';
var cookieOfUserName = 'AlexUploader';
var cookieOfUserLevel = 'AlexUploaderLevel';

/* Prepare Qiniu config, we make Qiniu upload in Node Server not in browser*/
qiniu.conf.ACCESS_KEY = qnConf.QiniuConfig.ACCESS_KEY;
qiniu.conf.SECRET_KEY = qnConf.QiniuConfig.SECRET_KEY;

/* GET Index page */
router.get('/', function(req, res){
  var cookies = req.cookies;// Since we use cookie parser in app.js, we could get cookies here
  var uploadUser = cookies[cookieOfUserName];
  var userLevel = cookies[cookieOfUserLevel] || 1;
  if( uploadUser ){ // Have logged in
    res.render('index', {
      username: uploadUser,
      userlevel: userLevel,
      domain: qnConf.QiniuConfig.Domain,
      uptokenUrl: qnConf.QiniuConfig.Uptoken_Url,
      localSave: jdConf.localSaveApi
    });
  }else{
    res.render('login');
  }
});

/* POST to login */
router.post('/login', multipartMiddleware, function(req, res){
  var username = req.body.username,
      password = req.body.password;
  var isFound = 0;
  var userLevel = 0; // Different buttons shown to users of different levels
  var userFile = userDataDir + username + '.txt'; // One user occupied one file
  fs.readFile(userFile, 'utf-8', function(err, data){
    if(err){// No such user
      res.status(500).send(); 
    }else{
      var thisUser = JSON.parse( data );
      if( password == thisUser.password ){
        userLevel = thisUser.level;
        res.cookie(cookieOfUserName, username);
        res.cookie(cookieOfUserLevel, userLevel);
        res.status(200).send();//Login successful
      }else{ // Password incorrect
        res.status(444).send(); 
      }
    }
  });
});

/* POST to logout */
router.post('/logout', multipartMiddleware, function(req, res){
  res.clearCookie(cookieOfUserName);
  res.clearCookie(cookieOfUserLevel);
  res.status(200).send();
});

/* POST to change password */
router.post('/changePassword', multipartMiddleware, function(req, res){
  var username = req.body.username,
      oldPassword = req.body.oldPassword,
      newPassword = req.body.newPassword;
  var userFile = userDataDir + username + '.txt'; // One user occupied one file
  fs.readFile(userFile, 'utf-8', function(err, data){
    if(err){ // No such user
      res.status(500).send(); 
    }else{
      var thisUser = JSON.parse( data );
      if( oldPassword == thisUser.password ){ // Old one matches, password can be changed:
        thisUser.password = newPassword;
        var userToString = JSON.stringify(thisUser);
        fs.writeFile( userFile, userToString, function(error, d){
          if(error){
            res.send({code: 0, msg: 'Failed! Please try again!'});
          }else{
            res.clearCookie(cookieOfUserName);
            res.clearCookie(cookieOfUserLevel);
            res.send({code: 1, msg: 'You have changed your password successfully!<br>Please login again!'});
          }
        });
      }else{ // Failed because of incorrect old password 
        res.send({code: 0, msg: 'Make sure you have the correct OLD password!'});
      }
    }
  }); // end read File
});

/* POST to add a new user */
router.post('/addUser', multipartMiddleware, function(req, res){
  var username = req.body.name,
      password = req.body.password,
      level    = req.body.Level;
  var userId   = username + '_' + parseInt( Math.random()*1000000 );
  var userData = '{"id":"'+ userId +'","username":"'+ username +'","password":"'+ password +'","level":"'+ level +'"}';
  var trgtPath = userDataDir + username + '.txt';
  fs.open( trgtPath, 'wx', function(err, data){
    if(err){
      res.status(200).send({code: 0, msg: 'User exists!'});
    }else{
      fs.writeFile( trgtPath, userData, function(error, d){
        if(error){
          res.status(200).send({code: 0, msg: 'User exists!'});
        }else{
          res.status(200).send({code: 1, msg: 'New user has been added successfully!'});
        }
      });
    }
  });
});

/* GET recent file list to show in browser */
router.get('/recentfiles', function(req, res){
  var showHowManyRecentFiles = 50;
  var result = { code: 0, data: "", num: showHowManyRecentFiles };
  fs.readFile( recentFileName, 'utf-8', function(err, data){
    if( data ){
      var infoArr = data.split("\n");
      infoArr = infoArr.slice(0, infoArr.length-1); // The last one is empty
      infoArr = infoArr.reverse();
      var len = infoArr.length;
      if( showHowManyRecentFiles > len ){ showHowManyRecentFiles = len; }
      result.code = 1;
      result.data = infoArr.slice( 0, showHowManyRecentFiles );
    };
    res.send( result );
  });
});

/* GET to clear the recent files, empty the file 'recent.txt' */
router.get('/clearRecentFiles', function(req, res){
  fs.writeFile( recentFileName, '', function(err, data){
    if(err){
      res.sendStatus({code: 0, data: 'Error!'});
    }else{
      res.sendStatus({code: 1, data: 'Recent files have been cleared successfully!'});
    }
  });
});

/* POST to save files in Local Server */
router.post(jdConf.localSaveApi, multipartMiddleware, function(req, res){
  // This middleware will create temp files on your server and never clean them up.
  // So be sure to delete all req.files when done.
  var file = req.files.file;
  var tempPath = file.path,
      fileName = file.name,
      fileType = file.type,
      fileSize = file.size;
  var uploadDirName = dirName.DirName;
  var dirNameEncode = encodeURIComponent( uploadDirName );//Encode it for client
  var filenameWithMd5 = MD5( new Date().getTime() ) + '_' + fileName;// For local server
  var filenameForCloud = fileRename.FileRename(fileName);// For Qiniu & AWS
  var targetPath = path.resolve('./' + uploadDirName + '/' + filenameWithMd5);
  // Save file in local server:
  fs.rename(tempPath, targetPath, function(err, data){
    if(err){
      var result = 'Your file ' + fileName + ' failed in uploading! Try again!';
      res.status(result).send(); 
    }else{
      var result = 'Your file ' + fileName + ' has been stored in Server successfully!';
      var uploadInfos = {
        FileRename: filenameForCloud,
        FileDirName: dirNameEncode,
        AWSInfo: awsConf.myConfig, // Test with my own account
        QiniuInfo: null
      };
      // Do AWS upload in browser client, with AWSInfo of uploadInfos
      // Do Qiniu upload in here:
      var qiniu_uptoken = generateUptoken.Uptoken(qnConf.QiniuConfig.Bucket_Name);
      var extra = null;

      fs.readFile(targetPath, function(error, data){
        if(error){
          var result = 'Read file in server failed!';
          res.status(result).send( uploadInfos ); // Send datas to the client in the function of 'FileUploaded'!
        }else{
          qiniu.io.put(qiniu_uptoken, uploadDirName + '/' + filenameForCloud, data, extra, function(err, ret){
            if(err){
              var result = 'There is an error in qiniu.io.put!';
              res.status(result).send( uploadInfos ); // Send datas to the client in the function of 'FileUploaded'!
            }else{
              var result = 'Qiniu upload has completed successfully!';
              var url = qnConf.QiniuConfig.Domain + ret.key;
              uploadInfos.QiniuInfo = { // Overwrite QiniuInfo, whose initial value is null
                hash: ret.hash,
                link: url
              };
              var userIP = '0.0.0.0';
              if( require('ipware') ){
                var getIP = require('ipware')().get_ip;
                userIP = getIP(req).clientIp;
              };
              var cookies = req.cookies;// Since we use cookie parser in app.js, we could get cookies here
              var uploader = cookies[cookieOfUserName];
              var text = uploader + '+' + url + "+" + require('../routes/formatTime').formattedTime( new Date() ) + "\n";
              fs.writeFile( recentFileName, text, {flag: 'a'}, function(err, data){ }); // flag 'a' means 'Adding' or 'Appending'
              uploadInfos.recentInfo = text; // Send to browser to show this file in recent file list.
              res.status(200).send( uploadInfos ); // Send datas to the client in the function of 'FileUploaded'!
            }
          });
        }
      });// End readFile

    }
  });
});


module.exports = router;
