/*
  Browser client javascript for Upload.
  Using Plupload to select files and save files in local server.
  After saving, do Qiniu upload and AWS S3 upload, etc.
  Latest modified: 2016-02-02 16:40
*/

// IDs and settings:
var _SCOPE = {
  wholeWrapperId:     'J_Wrapper',
  contentWrapId:      'J_contentWrapper',
  logoutBtnId:        'J_logout',
  addUserBtnId:       'J_addUser',
  changePWBtnId:      'J_changePW',
  eleAttachToLvCls:   'J_attachToLevel',
  userMenuId:         'J_userMenu',
  userDropDownId:     'J_userDropDown',
  containerId:        'plupContainer',
  filePickerId:       'plupFilePicker',
  fileListId:         'plupFileList',
  fileWarningId:      'plupWarning',
  fileListEmptyId:    'plupEmpty',
  fileRecentId:       'plupRecent',
  fileDomainId:       'plupDomain',
  fileUptokenId:      'plupUptoken',
  fileLocalSaveId:    'plupLocalSave',
  btnClearRecentId:   'clearRecent',
  swfUrl:             '/lib/Moxie.swf',
  xapUrl:             '/lib/Moxie.xap',
  maxFileSize:        '10mb',
  adminLevel:         '2',
  recentFilesMaxNum:   0
};

// Elements:
var _ELE = {
  wholeWrapper:       document.getElementById( _SCOPE.wholeWrapperId ),
  contentWrapper:     document.getElementById( _SCOPE.contentWrapId ),
  logoutButton:       document.getElementById( _SCOPE.logoutBtnId ),
  addUserButton:      document.getElementById( _SCOPE.addUserBtnId ),
  changePWButton:     document.getElementById( _SCOPE.changePWBtnId ),
  elesAttachToLv:     document.getElementsByClassName( _SCOPE.eleAttachToLvCls ),
  userMenu:           document.getElementById( _SCOPE.userMenuId ),
  userDropDown:       document.getElementById( _SCOPE.userDropDownId ),
  container:          document.getElementById( _SCOPE.containerId ),
  filePicker:         document.getElementById( _SCOPE.filePickerId ),
  fileList:           document.getElementById( _SCOPE.fileListId ),
  fileListEmpty:      document.getElementById( _SCOPE.fileListEmptyId ),
  fileRecentBox:      document.getElementById( _SCOPE.fileRecentId ),
  fileWarning:        document.getElementById( _SCOPE.fileWarningId ),
  btnClearRecent:     document.getElementById( _SCOPE.btnClearRecentId ),
  fileDomain:         document.getElementById( _SCOPE.fileDomainId ),
  fileUptoken:        document.getElementById( _SCOPE.fileUptokenId ),
  fileLocalSave:      document.getElementById( _SCOPE.fileLocalSaveId )
};

// Templates:
var _TMPL = {
  Uploading: function( filename, id ){
    var tmpl = '<div class="uploading" id="uploading_'+ id +'"><span>'+ filename +' is being uploaded...</span></div>';
    return tmpl;
  },
  Uploaded: function( id, imgsrc, url, name, size, hash ){
    var tmpl = '<div class="uploaded clearfix" id="ed_'+ id +'">\
                  <a class="uploaded-close" id="close_'+ id +'">Close</a>\
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
  },
  RecentFile: function( ip, url, time ) {
    var tmpl = '<span class="recent-item recentItem clearfix">\
                  <b class="recent-ip">'+ ip +'</b>\
                  <a class="recent-url" href="'+ url +'" target="_blank">'+ url +'</a>\
                  <s class="recent-time">'+ time +'</s>\
                </span>';
    return tmpl;
  },
  NoRecentFile: function(txt) {
    var tmpl = '<p class="nofile">'+ txt + '</p>';
    return tmpl;
  },
  ChangingPW: function(){
    var tmpl = '<div class="change-pw-prompt">\
                  <div class="pop-row J_oldPsw"></div>\
                  <div class="pop-row J_newPsw"></div>\
                  <div class="pop-row J_newPswConfirm"></div>\
                </div>';
    return tmpl;
  },
  AddOneUser: function(){
    var tmpl = '<div class="add-user-prompt">\
                  <div class="pop-row pop-txt">Enter username, not more than 32 characters:</div>\
                  <div class="pop-row J_newUserName"></div>\
                  <div class="pop-row pop-txt">Create an simple original password, not less than 6 characters:</div>\
                  <div class="pop-row J_newUserPsw"></div>\
                  <div class="pop-row pop-txt">Select user level:</div>\
                  <div class="pop-row pop-radios">\
                    <input type="radio" name="levels" checked="checked" class="u-level pop-radio" id="J_popRadio_1" value="1">\
                    <label for="J_popRadio_1">Normal user</label>\
                    <input type="radio" name="levels" class="u-level pop-radio" id="J_popRadio_2" value="2">\
                    <label for="J_popRadio_2">Advanced user</label>\
                  </div>\
                </div>';
    return tmpl;
  }
};

// Render elements that attached to user levels:
$.each(_ELE.elesAttachToLv, function(i, el){
  var level = $(el).attr('data');
  if( level == _SCOPE.adminLevel ){
    $(el).show();
  }else{
    $(el).remove();
  }
});

// User menu events:
_ELE.userMenu.addEventListener('click', function(){
  var me = $(this);
  var icon = me.find("s");
  var dropDown = $(_ELE.userDropDown);
  var sta = dropDown.attr('data');
  if( sta == 'fold' ){
    me.css('margin-top', '18px');
    icon.css('right', '-8px');
    dropDown.slideDown(200).attr('data', 'unfold');
  }else{
    dropDown.slideUp(200).attr('data', 'fold');
    me.css('margin-top', '28px');
    icon.css('right', '0px');
  }
});

// Listening click to add one user:
_ELE.addUserButton.addEventListener('click', function(){
  popToAddUser();
});

// Method to render a prompt for adding one user:
function popToAddUser() {
  var U_createUserName = new Input({
    id: 'newUserName_id', 
    name: 'username',
    type: 'text',
    validType: [],
    clsName: 'J_inputNewUserName',
    maxlength: 32,
    placeholder: 'Username',
    errorMsg: 'Incorrect!',
    style: 'U_inputPrimary flex100'
  });
  var U_createUserPassword = new Input({
    id: 'newUserPassword_id', 
    name: 'userpassword',
    type: 'text',
    validType: ['REG_Password'],
    clsName: 'J_inputNewUserPassword',
    maxlength: 32,
    placeholder: 'Original password',
    errorMsg: 'Incorrect!',
    style: 'U_inputPrimary flex100'
  });
  new popAlert({
    id: 'popToAddUser_id',
    title: 'Add a new user as an Uploader',
    html: _TMPL.AddOneUser(),
    width: 550,
    style: 'nobg',
    btns: [
      {
        text: 'Add',
        handler: function(){
          addThisUser( U_createUserName, U_createUserPassword );
        },
        className: "btn-primary"
      },
      {
        text: 'Cancel',
        className: 'btn-blank'
      }
    ]
  }).Alert();
  U_createUserName.renderTo( $('.J_newUserName') );
  U_createUserPassword.renderTo( $('.J_newUserPsw') );
};

// Method to add a new user:
function addThisUser( _u, _p ) {
  if( !_u.value || !_p.value ){
    makePopAlert('Something wrong with your input!', 0, 'Damn');
  }else{
    var userName = _u.value, Password = _p.value;
    var level = 1;
    var radio2 = document.getElementById("J_popRadio_2");
    if( radio2.checked ){
      level = 2;
    }
    $.ajax({
      url: '/addUser',
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({name: userName, password: Password, Level: level}),
      timeout: 3000,
      success: function(data){
        makePopAlert( data.msg, data.code, 'OK');
      },
      error: function(r){
        makePopAlert('Server is dead!', 0, 'Damn');
      }
    });
  }
};

// Listening click to logout:
_ELE.logoutButton.addEventListener('click', function(){
  var _u = this.getAttribute('data');
  if(!_u){
    makePopAlert('This page is out of session!<br> Please reload!', 0, 'Damn');
    return false;
  };
  makePopAlert(_u + ', want to log out?', 0, 'Log out', function(){
    $.ajax({
      url: '/logout',
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({username: _u}),
      timeout: 3000,
      success: function(data){
        makePopAlert('Goodbye ' + _u + ' !', 1, 'Bye', function(){
          location.href = '/'; // Cleared cookie in server
        });
      },
      error: function(){
        makePopAlert('Failed to log out!<br>Server is dead!', 0, 'Damn');
      }
    });
  }, 'Stay');
});

// Listening click to change password:
_ELE.changePWButton.addEventListener('click', function(){
  var _u = this.getAttribute('data');
  if(!_u){
    makePopAlert('This page is out of session!<br> Please reload!', 0, 'Damn');
    return false;
  }else{
    popToChangePsw( _u );
  }
});

// Method to render a prompt for changing password:
function popToChangePsw( _u ) {
  var U_oldPassword = new Input({
    id: 'oldPassword_id', 
    name: 'password',
    type: 'password',
    validType: ['REG_Password'],
    clsName: 'J_inputOldPsw',
    maxlength: 32,
    placeholder: 'Your old password here',
    errorMsg: 'Incorrect!',
    style: 'U_inputPrimary flex100'
  });
  var U_newPassword = new Input({
    id: 'newPassword_id', 
    name: 'password',
    type: 'password',
    validType: ['REG_Password'],
    clsName: 'J_inputNewPsw',
    maxlength: 32,
    placeholder: 'Your new password, not less than 6 characters',
    errorMsg: 'Incorrect!',
    style: 'U_inputPrimary flex100'
  });
  var U_newPasswordConfirm = new Input({
    id: 'newPasswordConfirm_id', 
    name: 'password',
    type: 'password',
    validType: ['REG_Password'],
    clsName: 'J_inputNewPswConfirm',
    maxlength: 32,
    placeholder: 'Confirm your new password here',
    errorMsg: 'Incorrect!',
    style: 'U_inputPrimary flex100'
  });
  new popAlert({
    id: 'popToChangePW_id',
    title: 'Please change your password',
    html: _TMPL.ChangingPW(),
    width: 550,
    style: 'nobg',
    btns: [
      {
        text: 'Done',
        handler: function(){
          changePsw( _u, U_oldPassword, U_newPassword, U_newPasswordConfirm);
        },
        className: "btn-primary"
      },
      {
        text: 'Cancel',
        className: 'btn-blank'
      }
    ]
  }).Alert();
  U_oldPassword.renderTo( $(".J_oldPsw") );
  U_newPassword.renderTo( $(".J_newPsw") );
  U_newPasswordConfirm.renderTo( $(".J_newPswConfirm") );
};

// Method for changing password:
function changePsw( _u, _old, _new, _confirm ) {
  if( _old.validation && _new.validation && _confirm.validation ){
    if( _new.value == _confirm.value ){
      $.ajax({
        url: '/changePassword',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({username: _u, oldPassword: _old.value, newPassword: _new.value }),
        timeout: 3000,
        success: function(data){
          if( data.code ){
            makePopAlert(data.msg, 1, 'To Login', function(){
              location.href = '/'; // Server has been cleared the cookies
            });
          }else{
            makePopAlert(data.msg, 0, 'Damn');
          }
        },
        error: function(r){
          makePopAlert('Server is dead!', 0, 'Damn');
        }
      });
    }else{
      makePopAlert('Please confirm your new password again!', 0, 'Fine');
    }
  }else{
    makePopAlert('Something wrong with your input!<br>Please try again!', 0, 'My bad');
  }
};


// For uploading from local, we need to new a plupload:
// In filters 'mime_types' of plupload, adding an extension of 'js' cannot make js files acceptable.
// Use method below to overwrite window.mOxie.Mime.mimes, make the value of key 'js' is 'application/javascript'
window.mOxie.Mime.addMimeType("application/javascript,js");

var _Uploader = new plupload.Uploader({
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
      {title: 'Static files', extensions: 'css,js,ttf,otf'},
      {title: 'Zip files', extensions: 'zip'}
    ],
    prevent_duplicates: true
  },
  init: {

    // After the init event incase you need to perform actions there, fire this:
    PostInit: function() {
      _ELE.fileList.innerHTML = '';
      _ELE.fileRecentBox.innerHTML = '';
      $.ajax({
        url: '/recentfiles',
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        timeout: 3000,
        success: function( data ) {
          if( data.code != 0 ){
            var list = data.data;
            $.each( list, function(i, txt){
              var arr = txt.split("+");
              var _ip = arr[0],
                  _url = arr[1],
                  _time = arr[2];
              var _tmpl = _TMPL.RecentFile( _ip, _url, _time );
              $(_ELE.fileRecentBox).append(_tmpl);
            });
            _SCOPE.recentFilesMaxNum = data.num; // Server tells browser how many recent files to show!
          }else{
            _ELE.fileRecentBox.innerHTML = _TMPL.NoRecentFile( "No recent uploaded files yet!" );
          }
        },
        error: function(r) {
          _ELE.fileRecentBox.innerHTML = _TMPL.NoRecentFile( "Request for recent uploaded files has failed!" );
        }
      });
      $(_ELE.btnClearRecent).bind("click", function(){
        makePopAlert('Clear the history of all the uploads?', 0, 'Clear', function(){
          clearRecentFiles("recentItem", function(){
            _ELE.fileRecentBox.innerHTML = _TMPL.NoRecentFile( "No recent uploaded files yet!" );
          });
        }, 'Cancel');
      });
    },

    // After all files were filtered and added to the queue, fire this:
    FilesAdded: function(up, files) {
      _ELE.fileWarning.innerHTML = '';
      $(_ELE.fileListEmpty).hide();
      $(_ELE.fileList).show();
      plupload.each(files, function(file) { // Everytime adding one file, run this:
        $(_ELE.fileList).prepend( _TMPL.Uploading( file.name, file.id ) );
      });
      _Uploader.start();
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
          dirName = upInfos.FileDirName,
          awsInfo = upInfos.AWSInfo,
          qinInfo = upInfos.QiniuInfo,
          recInfo = upInfos.recentInfo;
      $("#uploading_" + file.id).remove();
      var file_type = nativeFile.type;
      var file_link = qinInfo.link;
      var img_src = qinInfo.link;
      if( file_type.indexOf("image") < 0 ) { // When file is NOT an image
        img_src = '/lib/file_ok.png';
      }
      $(_ELE.fileList).prepend(  _TMPL.Uploaded(file.id, img_src, file_link, file.name, file.size, qinInfo.hash) );
      var clsBtn = $("#close_" + file.id);
      $("#ed_" + file.id).hover(function(){
        var me = $(this);
        clsBtn.fadeIn(200).bind("click", function(){
          makePopAlert('Delete this item from the list?', 0, 'Delete', function(){
            me.remove();
            var leftDivs = $(_ELE.fileList).find("div");
            if( leftDivs.length < 1 ){
              $(_ELE.fileList).hide();
              $(_ELE.fileListEmpty).show();
            }
          }, 'Cancel');
        });
      }, function(){
        clsBtn.fadeOut(200).unbind("click");// Must unbind event when hover out.
      });
      prependToRecent( _ELE.fileRecentBox, recInfo );
      doAWSUpload( file.id, rename, dirName, nativeFile, awsInfo );
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
      _ELE.fileWarning.innerHTML = 'Upload failed! Please try again!';
    }
  }
});

_Uploader.init();


