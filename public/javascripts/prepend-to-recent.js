/*
  Browser client javascript for prepending files to recent list.
  Latest modified: 2016-01-21 19:22
*/

function prependToRecent( box, info ) {
  var container = $(box);
  var arr       = info.split("+");
  var _ip       = arr[0],
      _url      = arr[1],
      _time     = arr[2];
  $(".nofile").remove();
  container.prepend( _TMPL.RecentFile(_ip, _url, _time) );
};
