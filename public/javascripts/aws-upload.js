/*
  Browser client javascript for AWS Upload.
  Latest modified: 2016-01-22 18:26
*/


function doAWSUpload( fileId, rename, dirname, file, info ) {
  var file_name = file.name,
      file_type = file.type,
      file_size = file.size;
  var uniqueName = rename;
  var dirNameDec = decodeURIComponent( dirname );
  var forKey = dirNameDec + "/" + uniqueName;
  var bucket = new AWS.S3();
  bucket.config.region = info.region;
  bucket.config.update({
    accessKeyId: info.accessKeyId,
    secretAccessKey: info.secretAccessKey
  });
  var params = {
    Bucket: info.bucket,
    Key: forKey,
    ContentType: file_type,
    Body: file,
    ACL: info.acl,
    ServerSideEncryption: info.ServerSideEncryption
  };
  bucket.putObject(params, function(err, data){
    var _em = $("#uploaded_aws_" + fileId);
    if(err){
      var errText = file_name + ' failed in uploading to AWS!';
      _em.html(errText).css("color", "#f33");
    }else{
      var url = 'https://'+ info.bucket + '.s3.amazonaws.com/' + forKey;
      _em.find("a").attr("href", url).html(url);
      /*
      var delBtn = '<a class="aws_del" id="delAWS_'+ fileId +'" data="'+ fileId + '">(Remove from AWS)</a>';
      _em.append( delBtn );
      $("#delAWS_" + fileId).click(function(){
        $(this).html('waiting...');
        doAWSDelObject( info, uniqueName, fileId );
      });
      */ // No permission of deleting yet.
    }
  }).on('httpUploadProgress', function(progress){
    var _em = $("#uploaded_aws_" + fileId);
    var prg = Math.round(progress.loaded / progress.total * 100);
    if(!prg) { prg = 0; }
    _em.find("a").html("Uploading " + prg + "% ...");
  });
};


// Delete a file from AWS S3 Bucket:
function doAWSDelObject( info, filename, fileId ) {
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
    var delbtn = $("#delAWS_" + fileId);
    if(err){
      delbtn.html("Delete failed!");
      setTimeout(function(){
        delbtn.html("Delete from AWS");
      }, 2000);
    }else{
      $("#uploaded_aws_" + fileId).html('The file has been deleted from AWS S3 successfully !');
    }
  });
};

