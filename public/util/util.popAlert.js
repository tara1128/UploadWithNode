/*
  util.popAlert.js.
  Latest modified 2016-02-02 11:25
*/

var popAlert = function( options ) {
  var defaults = {
    id: '', //Id can be a string or a number.
    title: '', // Title will be shown on top of this pop. If you do not need a title, leave it.
    text: '', // Simple text without HTML tags, just some sentences you need to warn.
    textAlign: '', // Want to define text-align? Value it with 'center' or 'right', default value is 'left', just for the simple text above.
    html: '', // Define an HTML structure, better not to be shown with the simple text above at the same time. The styles of this HTML structure would be defined in your own CSS.
    clsName: '', // Add some classNames for this pop if you need.
    width: '', // Default width is defined in CSS, overwrite it if you need. Do not use 'px', make it as a number.
    style: 'warning', // The other two options are 'congrates' and 'nobg'. Each of these values represents a different background image, while 'nobg' represents no background in pop.
    btns: [{
        text: 'Confirm', // There should be at least one button.
        className: '', // If you want to rewrite the style, add class for button.
        handler: '' // The callback function, which would be called when button is clicked.
      }, {
        text: '', // If you do not need a second button, do not write the second element in Array of btns
        handler: '',
        className: ''
      }]
  };
  for( var p in defaults ){
    this[p] = options[p] || defaults[p];
  }
};

popAlert.prototype.Alert = function() {
  var imAlert = this;
  var tmpl = '<div class="U_warningContainer" id="U_WnCon_id_'+ this.id +'">\
                <div class="U_Warning '+ this.style +' '+ this.clsName +'" id="U_Warning_'+ this.id +'">\
                  <div class="U_warningBtns clearfix">\
                    <a class="U_btnConfirm btn-primary '+ this.btns[0].className +'">'+ this.btns[0].text +'</a>\
                  </div>\
                </div>\
              </div>';
  var existedPopAlert = $("body").find(".U_Warning"); // Searching if there is an existed popAlert
  if( existedPopAlert.length ){
    existedPopAlert.remove(); // If have existed pops, remove them all first.
  }
  $("body").prepend( $(tmpl) );
  if(this.id){
    var U_warnContainer = $("#U_WnCon_id_" + this.id);
  }else{
    var U_warnContainer = $(".U_warningContainer");
  }
  var U_Warn = $(".U_Warning");
  if( this.width ){
    U_Warn.css({
      "width": this.width + "px",
      "margin-left": "-" + (this.width/2) + "px"
    });
  }
  if( this.html ){
    U_Warn.prepend( '<div class="U_warningHTMLBox" id="U_warningHTMLBox_'+ this.id +'">'+ this.html +'</div>' );
  }
  if( this.text ){
    U_Warn.prepend( '<div class="U_warningSimpleText '+ this.textAlign +'">'+ this.text +'</div>' );
  }
  if( this.title ){
    U_Warn.prepend( '<h1 class="U_warningTitle"><span>'+ this.title +'</span></h1>' );
  }
  var confirmBtn = $(".U_btnConfirm");
  confirmBtn.click(function(){
    if( imAlert.btns[0].handler ){
      imAlert.btns[0].handler();
    };
    U_warnContainer.remove();
  });
  if( this.btns[1] && this.btns[1].text ){ // If you need a second button
    $(".U_warningBtns").append( '<a class="U_btnCancel btn-primary btn-blank '+ this.btns[1].className +'">'+ this.btns[1].text +'</a>' );
    $(".U_btnCancel").click(function(){
      if( imAlert.btns[1].handler ){
        imAlert.btns[1].handler();
      }
      U_warnContainer.remove();
    });
    $(".U_btnConfirm").addClass("fl");
    $(".U_btnCancel").addClass("fr");
  }else{ // If there is only one button, then place it in the center.
    confirmBtn.css("margin", "0 auto");
  }
};

/*
  When you need a popAlert in your page,
  you may just need a similar one for every event that calls the pop,
  so, to avoid writing the same settings every time you call, 
  here provides you a function that makes a simple setting of the pop.
  But if you need a complex one, define it yourself in your specific page.
*/
/*
  When you use this function, the first three parameters are required!
*/
function makePopAlert( txt, type, btnText, callback, secondBtnText, secBtnCallback ) {
  var alertObj = {
    text: txt,
    textAlign: 'center',
    style: (type==1)?'congrates':'warning',
    btns: [{
        text: btnText,
        className: 'U_J_SUC',
        handler: (callback)?callback:''
      }]
  };
  if( secondBtnText ){
    var secBtn = (secBtnCallback) ? {text: secondBtnText, handler: secBtnCallback} : {text: secondBtnText};
    alertObj['btns'].push(secBtn);
  }
  new popAlert( alertObj ).Alert();
};

