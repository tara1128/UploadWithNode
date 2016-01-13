/*
  Browser client javascript for AWS Upload.
  Latest modified: 2016-01-13 16:25
*/


function doAWSUpload( upId, rename, file, info ) {
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
      var errText = file_name + ' failed in uploading to AWS!';
      $("#uploaded_aws_" + upId).html(errText).css("color", "#f33");
    }else{
      var url = 'https://s3.amazonaws.com/' + info.bucket + '/' + uniqueName;
      $("#uploaded_aws_" + upId).find("a").attr("href", url).html(url);
    }
  }).on('httpUploadProgress', function(progress){
    // console.log( 'AWS uploading...', Math.round(progress.loaded / progress.total * 100) );
  });
};

// Delete a file from AWS S3 Bucket:
function doAWSDelObject( info, filename ) {
  var bucket = new AWS.S3();
  bucket.config.update({
    accessKeyId: info.accessKeyId,
    secretAccessKey: info.secretAccessKey
  });
  bucket.config.region = info.region;
  var params = {
    Bucket: info.bucket,
    Key: filename 
  };
  bucket.deleteObject(params, function(err, data){
    if(err){
      console.log('Delete Err! ', err);
    }else{
      console.log('Delete done!');
    }
  });
};

