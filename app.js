/*
  Server codes for Upload, app.js
  Get files from client and save in local server.
  Response to client with infos of Qiniu, AWS, etc.
  Latest modified 2017-07-14 16:11
*/

var express = require('express');
var fs = require('fs');
var path = require('path');
var cookieParser = require('cookie-parser');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var debug = require('debug')('express:server');
var http = require('http');
var port = normalizePort(process.env.PORT || '8082');
var app = express();
var server = http.createServer(app);
var index = require('./routes/index');

app.set('port', port);
server.on('error', serverOnError);
server.on('listening', serverOnListening);
server.on('connection', serverOnConnecting);
server.listen(port);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon(path.join(__dirname, 'public/lib', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './')));
app.use(cookieParser());

app.use('/', index);


/* ====================================================== */
/* ====================================================== */
// Catch 404 and forward to "Error Handler"
app.use(function(req, res, next) {
  var err = new Error('Nothing in Here ...');
  err.status = 404;
  next(err); /* next means the handler which was defined right after this function */
});
/* Error Handler */
/* Development error handler will print stacktrace */
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}
/* ====================================================== */
/* ====================================================== */
/* Normalize a port into a number, string, or false. */
function normalizePort(val) {
  var port = parseInt(val, 10);
  if( isNaN(port) ) { // When val is an unnumbered string, like 'abc', not '123'
    return val; //named pipe
  }
  if(port >= 0) {
    return port; // port number
  }
  return false;
};
/* Event listener for HTTP Server 'Connecting' event. */
function serverOnConnecting() {
  var addr = server.address();
  var bind = (typeof addr === 'string')?('Pipe ' + addr):('Port ' + addr.port);
};
/* Event listener for HTTP Server 'listening' event. */
function serverOnListening() {
  var addr = server.address();
  var bind = (typeof addr === 'string')?('pipe ' + addr):('port ' + addr.port);
  debug('Listening on ' + bind);
  console.log('Server on listening ' + bind);
};
/* Event listener for HTTP Server 'error' event. */
function serverOnError( error ) {
  if(error.syscall !== 'listen') {
    throw error;
  }
  var bind = (typeof port === 'string')?('Pipe ' + port):('Port ' + port);
  // Now handle specific listen errors with friendly messages:
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};
/* ====================================================== */
module.exports = app;
