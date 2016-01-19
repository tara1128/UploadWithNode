/*
  AWS S3 Configurations
  Exports to app.js
  Latest modified 2016-01-19 14:58
  Have added the production conf.
*/

exports.myConfig = { // My Own account
  bucket: 'test-alex-com',
  accessKeyId: 'AKIAIRLXAJLRKSW7WOOQ',
  secretAccessKey:'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',
  region: 'us-east-1',
  IdentityPoolId: 'us-east-1:aa0d7c30-ec9a-4820-bf98-73b20fc7f21c',
  ServerSideEncryption: 'AES256',
  acl: 'public-read',
  endPoint: '',
  maxFileSize: 10585760 // 10MB
};

exports.JideTestConfig = { // Jide test account
  bucket: 'test-jide-com',
  accessKeyId: 'AKIAJM36ZXMHGHJNHNSQ',
  secretAccessKey: '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',
  region: 'us-west-2', // This region cannot make cognito, which is needed in browser of AWS.CognitoIdentityCredentials ...
  IdentityPoolId: '',
  ServerSideEncryption: 'AES256',
  acl: 'public-read',
  endPoint: '',
  // endPoint: 's3-us-west-2.amazonaws.com',
  // endPoint: 'test-jide-com.s3.amazonaws.com',
  maxFileSize: 10585760
};

exports.JideProdConfig = { // Jide production account
  bucket: 'webcdn-jide-com',
  accessKeyId: 'AKIAI5PQBHPGERNTXX5A',
  secretAccessKey: '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',
  region: 'us-west-2',
  IdentityPoolId: '',
  ServerSideEncryption: '',
  acl: 'private', // Users would visit cdn, which has the permissions to request for S3, no need to public here.
  endPoint: '',
  maxFileSize: 10585760
};
