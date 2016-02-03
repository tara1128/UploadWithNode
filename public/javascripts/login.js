/*
  Browser client javascript for Upload.
  For login process.
  Latest modified: 2016-02-03 11:25
*/

var _SCOPE = {
  wholeWrapperId:     'J_Wrapper',
  loginWrapId:        'J_loginWrapper',
  usernameDivId:      'J_usernameDiv',
  passwordDivId:      'J_passwordDiv',
  signInBtnId:        'J_signIn'
};

var _ELE = {
  wholeWrapper:       document.getElementById( _SCOPE.wholeWrapperId ),
  loginWrapper:       document.getElementById( _SCOPE.loginWrapId ),
  usernameDiv:        document.getElementById( _SCOPE.usernameDivId ),
  passwordDiv:        document.getElementById( _SCOPE.passwordDivId ),
  signInButton:       document.getElementById( _SCOPE.signInBtnId )
};

var Uploader_username = new Input({
  id: 'lgUsername_id',
  name: 'username',
  type: 'text',
  validType: [],
  clsName: 'J_username',
  placeholder: 'Please enter your username',
  maxlength: 50,
  errorMsg: 'Invalid username!',
  style: 'U_inputPrimary flex100'
});

var Uploader_password = new Input({
  id: 'lgPassword_id',
  name: 'password',
  type: 'password',
  validType: [],
  clsName: 'J_password',
  maxlength: 20,
  placeholder: 'Your password here',
  errorMsg: 'Incorrect password!',
  style: 'U_inputPrimary flex100'
});

Uploader_username.renderTo( $(_ELE.usernameDiv) );
Uploader_password.renderTo( $(_ELE.passwordDiv) );

// Click to login:
_ELE.signInButton.addEventListener('click', function(){
  if( Uploader_username.validation && Uploader_password.validation ){
    var _u = Uploader_username.value, _p = Uploader_password.value;
    $.ajax({
      url: '/login',
      type: 'POST',
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify({username: _u, password: _p}),
      timeout: 3000,
      success: function( data ) {
        makePopAlert('Welcome, ' + _u + ' !', 1, 'OK', function(){
          location.href = '/'; // Wrote cookie in server
        });
      },
      error: function(r) {
        makePopAlert('You are not an uploader yet, or your password is incorrect! <br>Contact administrator!', 0, 'Damn', function(){
          $(_ELE.usernameDiv).find('input[type=text]').focus();
        });
      }
    });
  }else{
    makePopAlert('Please enter your username and password correctly!', 0, 'Damn');
  }
}, false);


