/*
  AWS S3 Configurations
  Exports to app.js
  Latest modified 2016-01-19 14:58
  Have added the production conf.
*/

exports.myConfig = { // My Own account
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
  accessKeyId: ',
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
