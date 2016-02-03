/*
  Format time to readable format
  Exports to ./routes/index.js
  Latest modified 2016-01-21 15:43
*/

var beautiNum = function(num) {
  if( num < 10 ){
    return "0" + num;
  }else{
    return num;
  }
};

function time(d) {
  var year = d.getFullYear(),
      month = beautiNum( d.getMonth() + 1 ),
      date = beautiNum( d.getDate() ),
      hour = beautiNum( d.getHours() ),
      minute = beautiNum( d.getMinutes() ),
      second = beautiNum( d.getSeconds() );
  var wholeTime = year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second;
  return wholeTime;
}

exports.formattedTime = time;
