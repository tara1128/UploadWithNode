/*
  Qiniu Upload Configurations for account
  Exports to ./routes/index.js
  Latest modified 2017-07-13 17:31

exports.QiniuConfig = {
  'ACCESS_KEY': '',
  'SECRET_KEY': '',
  'Bucket_Name': '',
  // 'Port': 19110,
  'Uptoken_Url': '/uptoken', // Generate uptoken in Qiniu SDK
  'Domain': ''
};

exports.myConfig = {
  bucket: 'test-alex-com',
  accessKeyId: '',
  secretAccessKey: '',
  region: 'us-east-1',
  IdentityPoolId: '',
  ServerSideEncryption: 'AES256',
  acl: 'public-read',
  endPoint: '',
  maxFileSize: 10585760 // 10MB
};

exports.JideTestConfig = { // Jide test account
  bucket: '',
  accessKeyId: '',
  secretAccessKey: '',
  region: 'us-west-2', // This region cannot make cognito, which is needed in browser of AWS.CognitoIdentityCredentials ...
  IdentityPoolId: '',
  ServerSideEncryption: 'AES256',
  acl: 'public-read',
  endPoint: '',
  // endPoint: '',
  // endPoint: '',
  maxFileSize: 10585760
};

exports.JideProdConfig = { // Jide production account
  bucket: '',
  accessKeyId: '',
  secretAccessKey: '',
  region: 'us-west-2',
  IdentityPoolId: '',
  ServerSideEncryption: '',
  acl: 'private', // Users would visit cdn, which has the permissions to request for S3, no need to public here.
  endPoint: '',
  maxFileSize: 10585760
};





*/
