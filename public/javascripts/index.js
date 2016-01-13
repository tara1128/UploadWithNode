/*
  Browser client javascript for Jide Upload.
  Using Plupload to select files and save files in Jide server.
  After saving, do Qiniu upload and AWS S3 upload, etc.
  Latest modified: 2016-01-11 10:51
*/

var _SCOPE = {
  containerId:        'plupContainer',
  filePickerId:       'plupFilePicker',
  fileListId:         'plupFileList',
  fileConsoleId:      'plupFileConsole',
  fileDomainId:       'plupDomain',
  fileUptokenId:      'plupUptoken',
  fileLocalSaveId:    'plupLocalSave',
  swfUrl:             '/public/lib/Moxie.swf',
  xapUrl:             '/public/lib/Moxie.xap',
  maxFileSize:        '10mb'
};

var _ELE = {
  container:          document.getElementById( _SCOPE.containerId ),
  filePicker:         document.getElementById( _SCOPE.filePickerId ),
  fileList:           document.getElementById( _SCOPE.fileListId ),
  fileConsole:        document.getElementById( _SCOPE.fileConsoleId ),
  fileDomain:         document.getElementById( _SCOPE.fileDomainId ),
  fileUptoken:        document.getElementById( _SCOPE.fileUptokenId ),
  fileLocalSave:      document.getElementById( _SCOPE.fileLocalSaveId )
};

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
      {title: 'Zip files', extensions: 'zip'}
    ]
  },
  init: {

    // After the init event incase you need to perform actions there, fire this:
    PostInit: function() {
      _ELE.fileList.innerHTML = '';
    },

    // After all files were filtered and added to the queue, fire this:
    FilesAdded: function(up, files) {
      plupload.each(files, function(file) {
        var everyText = file.name + ' | ';
        _ELE.fileList.innerHTML += everyText;
      });
      _JideUploader.start();
      return false;
    },

    // While ONE file is being uploaded, fire this:
    UploadProgress: function(up, file) {
      // console.log('Progress...', up, file);
    },

    // Only when ONE file is SUCCESSFULLY uploaded, fire this and do uploads of Qiniu, AWS, etc.
    FileUploaded: function(up, file, res) { 
      var nativeFile = file.getNative();
      var upInfos = JSON.parse(res.response);
      var rename = upInfos.FileRename,
          awsInfo = upInfos.AWSInfo,
          qinInfo = upInfos.QiniuInfo;
      doAWSUpload( rename, nativeFile, awsInfo );
      doAWSDelObject(awsInfo);
      // doAnotherUpload(); // And other upload services here.
      // NOTICE: We do Qiniu upload in Node server, NOT in browser client.
    },

    // When all files in a queue are uploaded, fire this: 
    UploadComplete: function(up, files) {
    },

    // When an error occurs, fire this:
    Error: function(up, err) {
      _ELE.fileConsole.innerHTML = 'Upload failed!';
    }
  }
});

_JideUploader.init();

