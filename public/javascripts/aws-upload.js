/*
  Browser client javascript for AWS Upload.
  Latest modified: 2016-01-08 15:34
*/


function doAWSUpload( rename, file, info ) {
  var file_name = file.name,
      file_type = file.type,
      file_size = file.size;
  var bucket = new AWS.S3();
  var uniqueName = rename;
  bucket.config.update({
    accessKeyId: info.accessKeyId,
    secretAccessKey: info.secretAccessKey
  });
  bucket.config.region = info.region;
  var params = {
    Bucket: info.bucket,
    Key: uniqueName,
    ContentType: file_type,
    Body: file,
    ACL: 'public-read',
    ServerSideEncryption: info.ServerSideEncryption
  };
  bucket.putObject(params, function(err, data){
    if(err){
      var errText = ' ' + file_name + ' failed in uploading to AWS! ' + err;
      _ELE.fileConsole.innerHTML += errText;
    }else{
      var url = 'https://s3.amazonaws.com/' + info.bucket + '/' + uniqueName;
      console.log( 'AWS OK~!!', file_type, data );
      _ELE.fileConsole.innerHTML += ' AWS upload succeeded! ' + url;
    }
  }).on('httpUploadProgress', function(progress){
    console.log( 'AWS uploading...', Math.round(progress.loaded / progress.total * 100) );
  });
};

function doAWSDelObject( info ) {
  var bucket = new AWS.S3();
  bucket.config.update({
    accessKeyId: info.accessKeyId,
    secretAccessKey: info.secretAccessKey
  });
  bucket.config.region = info.region;
  var params = {
    Bucket: info.bucket,
    Key: '1452235675459-ndcmIl-new-hand.png'
  };
  bucket.deleteObject(params, function(err, data){
    if(err){
      console.log('Delete Err! ', err);
    }else{
      console.log('Delete done!');
    }
  });
};

