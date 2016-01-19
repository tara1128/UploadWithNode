/*
  Browser client javascript for Jide Upload.
  Using Plupload to select files and save files in Jide server.
  After saving, do Qiniu upload and AWS S3 upload, etc.
  Latest modified: 2016-01-19 13:43
*/

var _SCOPE = {
  containerId:        'plupContainer',
  filePickerId:       'plupFilePicker',
  fileListId:         'plupFileList',
  fileConsoleId:      'plupFileConsole',
  fileListEmptyId:    'plupEmpty',
  fileDomainId:       'plupDomain',
  fileUptokenId:      'plupUptoken',
  fileLocalSaveId:    'plupLocalSave',
  swfUrl:             '/lib/Moxie.swf',
  xapUrl:             '/lib/Moxie.xap',
  maxFileSize:        '10mb'
};

var _ELE = {
  container:          document.getElementById( _SCOPE.containerId ),
  filePicker:         document.getElementById( _SCOPE.filePickerId ),
  fileList:           document.getElementById( _SCOPE.fileListId ),
  fileListEmpty:      document.getElementById( _SCOPE.fileListEmptyId ),
  fileConsole:        document.getElementById( _SCOPE.fileConsoleId ),
  fileDomain:         document.getElementById( _SCOPE.fileDomainId ),
  fileUptoken:        document.getElementById( _SCOPE.fileUptokenId ),
  fileLocalSave:      document.getElementById( _SCOPE.fileLocalSaveId )
};

var _TMPL = {
  Uploading: function( filename, id ){
    var tmpl = '<div class="uploading" id="uploading_'+ id +'"><span>'+ filename +' is being uploaded...</span></div>';
    return tmpl;
  },
  Uploaded: function( id, imgsrc, url, name, size, hash ){
    var tmpl = '<div class="uploaded clearfix" id="ed_'+ id +'">\
                  <div class="uploaded-left">\
                    <img src="' + imgsrc + '" width="64">\
                  </div>\
                  <div class="uploaded-right">\
                    <p><b>Name: </b><em>'+ name +'</em></p>\
                    <p><b>Size: </b><em>'+ parseFloat(size/1024).toFixed(2) +'KB</em></p>\
                    <p><b>Link: </b><em><a href="'+ url +'" target="_blank">'+ url +'</a></em></p>\
                    <p><b>Hash: </b><em>'+ hash +'</em></p>\
                    <p><b>AWS: </b><em id="uploaded_aws_'+ id +'"><a href="#" target="_blank"></a></em></p>\
                  </div>\
                </div>';
    return tmpl;
  }
};

// In filters 'mime_types' of plupload, adding an extension of 'js' cannot make js files acceptable.
// Use method below to overwrite window.mOxie.Mime.mimes, make the value of key 'js' is 'application/javascript' 
window.mOxie.Mime.addMimeType("application/javascript,js");

var _JideUploader = new plupload.Uploader({
  runtimes:           'html5,flash,silverlight,html4',
  file_data_name:     'file',
  container:          _SCOPE.containerId,
  browse_button:      _SCOPE.filePickerId,
  uptoken_url:        _ELE.fileUptoken.innerHTML,
  url:                _ELE.fileLocalSave.innerHTML,
  flash_swf_url:      _SCOPE.swfUrl,
  silverlight_xap_url:_SCOPE.xapUrl,
  filters: {
    max_file_size:    _SCOPE.maxFileSize,
    mime_types: [
      {title: 'Image files', extensions: 'jpg,png,gif'},
      {title: 'Static files', extensions: 'css,js'},
      {title: 'Zip files', extensions: 'zip'}
    ],
    prevent_duplicates: true
  },
  init: {

    // After the init event incase you need to perform actions there, fire this:
    PostInit: function() {
      _ELE.fileList.innerHTML = '';
    },

    // After all files were filtered and added to the queue, fire this:
    FilesAdded: function(up, files) {
      $(_ELE.fileListEmpty).hide();
      $(_ELE.fileList).show();
      plupload.each(files, function(file) { // Everytime adding one file, run this:
        _ELE.fileList.innerHTML += _TMPL.Uploading( file.name, file.id );
      });
      _JideUploader.start();
      return false;
    },

    // While ONE file is being uploaded, fire this:
    UploadProgress: function(up, file) {
    },

    // Only when ONE file is SUCCESSFULLY uploaded, fire this and do uploads of Qiniu, AWS, etc.
    FileUploaded: function(up, file, res) { 
      var nativeFile = file.getNative();
      var upInfos = JSON.parse(res.response);
      var rename = upInfos.FileRename,
          awsInfo = upInfos.AWSInfo,
          qinInfo = upInfos.QiniuInfo;
      $("#uploading_" + file.id).remove();
      var file_type = nativeFile.type;
      var file_link = qinInfo.link;
      var img_src = qinInfo.link;
      if( file_type.indexOf("image") < 0 ) { // When file is NOT an image
        img_src = '/lib/file_ok.png';
      }
      _ELE.fileList.innerHTML += _TMPL.Uploaded(file.id, img_src, file_link, file.name, file.size, qinInfo.hash);
      doAWSUpload( file.id, rename, nativeFile, awsInfo );
      // doAnotherUpload(); // And other upload services here.
      // NOTICE: We do Qiniu upload in Node server, NOT in browser client.
    },

    // When all files in a queue are uploaded, fire this: 
    UploadComplete: function(up, files) {
      plupload.each(files, function(file) { // Everytime completing one file, run this:
        $("#uploading_" + file.id).remove();
      });
    },

    // When an error occurs, fire this:
    Error: function(up, err) {
      _ELE.fileConsole.innerHTML = 'Upload failed!';
    }
  }
});

_JideUploader.init();

