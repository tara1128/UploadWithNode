/*
  AWS S3 Configurations
  Exports to app.js
  Latest modified 2016-01-13 10:41
*/

exports.myConfig = { // My Own account
  bucket: '',
  accessKeyId: '',
  secretAccessKey:'',
  region: 'us-west-2',
  ServerSideEncryption: 'AES256',
  acl: 'public-read',
  endPoint: '',
  maxFileSize: 10585760 // 10MB
};

exports.JideTestConfig = { // Jide test account
  bucket: '',
  accessKeyId: '',
  secretAccessKey: '',
  region: 'us-west-2',
  ServerSideEncryption: 'AES256',
  acl: 'public-read',
  endPoint: 's3-us-west-2.amazonaws.com',
  maxFileSize: 10585760
}

exports.JideProdConfig = { // Jide production account
  bucket: '',
  accessKeyId: '',
  secretAccessKey: '',
  region: 'us-west-2',
  ServerSideEncryption: 'AES256',
  acl: 'public-read',
  endPoint: '',
  maxFileSize: 10585760
}
