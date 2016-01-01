'use strict';

var resource = require('aws-cfn-custom-resource');

exports.handler = resource.handler({
  'Custom::EC2ImageInfo': function () { return require('./lib/ec2-image-info'); }
});
