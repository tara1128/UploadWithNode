/*
  util.input.js
  Author: Alex Wang
  Latest modified: 2015-08-13 19:01
*/

var Input = function( options ) {
  var defaults = {
    id: 'id', 
    type: 'text',
    validType: [],
    name: 'name',
    clsName: '',
    maxlength: 50,
    placeholder: 'Please enter your contents',
    errorMsg: 'Error',
    width: '',
    style: 'input-primary'
  };
  for( var p in defaults ){
    this[p] = options[p] || defaults[p];
  }
};

Input.prototype.renderTo = function( container, callback ) {
  var tmpl = '<div class="U_inputbox" id="U_inputbox_' + this.id + '">\
                <input id="U_input_' + this.id + '" type="' + this.type + '" autocomplete="off" name="' + this.name + '" class="' + this.style + ' ' + this.clsName + '" maxlength="' + this.maxlength + '" placeholder="' + this.placeholder + '" style="width:' + this.width + '">\
                <span class="U_inputErrorMsg" id="U_err_' + this.id + '">' + this.errorMsg + '</span>\
                <span class="U_inputPlder" id="U_pld_' + this.id + '">' + this.placeholder + '</span>\
              </div>';
  container.html( tmpl );
  this.validate();
  this.fakePlaceholder( this.id );
  if( callback ){ callback; }
};

Input.prototype.validate = function() {
  var me = this;
  var id = me.id;
  var inp = $("#U_input_" + id),
      err = $("#U_err_" + id);
  var validRule = {
    "REG_Phone": /^1\d{10}$/,
    "REG_Email": /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/,
    "REG_Password": /^[a-zA-Z0-9@#$%^&*_-]{6,}$/
  };
  var validRes = false;
  inp.focus(function(){
    validRes = false;
    inp.removeClass("error");
    err.hide();
  });
  inp.blur(function(){
    var val = inp.val();
    if( val ){
      if( me.validType.length > 0 ){
        $.each( me.validType, function( index, value ){
          var rule = validRule[value];
          if( rule && rule.test(val) ){
            validRes = true;
          }else if( !rule && value.test ){ // self definition of valid rule
            if( value.test(val) ){
              validRes = true;
            }
          }
        });
        if( !validRes ){
          inp.addClass("error");
          err.show();
          me.validation = false;
        }else{
          me.validation = true;
          me.value = val;
        }
      }else{ // the Array of valid is empty, no need to validate
        me.validation = true;
        me.value = val;
      }
    }else{
      me.validation = false;
    }
  });
};

Input.prototype.confirmPsw = function( psw ) {
  var pswText = psw.value;
  var confirmPswText = this.value;
  if( pswText === confirmPswText ){
    return true;
  }else{
    return false;  
  }
};

Input.prototype.fillExistData = function( vld, val ) {
  this.validation = vld;
  this.value = val;
};

Input.prototype.fakePlaceholder = function( id ) {
  var box = $("#U_inputbox_" + id),
      inp = $("#U_input_" + id),
      pld = inp.attr("placeholder");
  if( !pld ){
    var fakePld = $("#U_pld_" + id);
    fakePld.show().bind("click", function(){ inp.focus(); });
    inp.focus(function(){
      fakePld.hide();
    });
    inp.blur(function(){
      if( inp.val() == "" ){
        fakePld.show();
      }
    });
  }
};

