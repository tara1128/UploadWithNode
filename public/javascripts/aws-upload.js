/*
  Browser client javascript for AWS Upload.
  Latest modified: 2016-01-13 18:49
*/


function doAWSUpload( fileId, rename, file, info ) {
  var file_name = file.name,
      file_type = file.type,
      file_size = file.size;
  var bucket = new AWS.S3();
  var uniqueName = rename;
  console.log('do AWS Upload:', info);
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
    var _em = $("#uploaded_aws_" + fileId);
    if(err){
      console.log(299, err);
      var errText = file_name + ' failed in uploading to AWS!';
      _em.html(errText).css("color", "#f33");
    }else{
      var url = 'https://s3.amazonaws.com/' + info.bucket + '/' + uniqueName;
      _em.find("a").attr("href", url).html(url);
      var delBtn = '<a class="aws_del" id="delAWS_'+ fileId +'" data="'+ fileId + '">(Remove from AWS)</a>';
      _em.append( delBtn );
      $("#delAWS_" + fileId).click(function(){
        $(this).html('waiting...');
        // doAWSDelObject( info, uniqueName, fileId );
      });
    }
  }).on('httpUploadProgress', function(progress){
    var _em = $("#uploaded_aws_" + fileId);
    var prg = Math.round(progress.loaded / progress.total * 100);
    _em.find("a").html("Uploading " + prg + "% ...");
  });
};


// doAWSDelObject();
// Delete a file from AWS S3 Bucket:
// function doAWSDelObject( info, filename, fileId ) {
function doAWSDelObject() {
  var bucket = new AWS.S3();
  bucket.config.update({
    //accessKeyId: info.accessKeyId,
    //secretAccessKey: info.secretAccessKey
    accessKeyId: 'AKIAJM36ZXMHGHJNHNSQ',
    secretAccessKey: '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'
  });
  // bucket.config.region = info.region;
  bucket.config.region = 'us-west-2';
  var params = {
    // Bucket: info.bucket,
    Bucket: 'test-jide-com',
    // Key: filename 
    Key: '1452063575759-5yd0-dog02.jpg' 
  };
  bucket.deleteObject(params, function(err, data){
    var delbtn = $("#delAWS_" + fileId);
    if(err){
      alert(0)
      delbtn.html("Delete failed!");
      setTimeout(function(){
        delbtn.html("Delete from AWS");
      }, 2000);
    }else{
      alert(1)
      $("#uploaded_aws_" + fileId).html('The file has been deleted from AWS S3 successfully !');
    }
  });
};

