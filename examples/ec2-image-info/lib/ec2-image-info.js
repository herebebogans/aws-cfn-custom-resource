'use strict';

var _ = require('lodash');
var util = require('util');
var resource = require('aws-cfn-custom-resource');

exports.handleUpdate = function (event) {
  var imageName = event.ResourceProperties.ImageName;

  if (!imageName || !_.isString(imageName)) {
    throw resource.newError('InvalidProperty', 'ImageName string is required.');
  }

  var unknownProps = Object.keys(_.omit(event.ResourceProperties, ['ImageName', 'ServiceToken']));
  if (unknownProps.length > 0) {
    throw resource.newError('InvalidProperty', util.format('Unknown properties: %s', unknownProps.join(', ')));
  }

  var session = new resource.aws.Session();
  var ec2 = session.client('EC2');

  return ec2.describeImages({ Filters: [{ Name: 'name', Values: [imageName] }] })
  .then(function (imageData) {
    if (imageData.Images.length === 0) {
      throw resource.newError('ResourceNotFoundException', util.format('Image not found: %s', imageName));
    }

    return {
      // When modifying this list, don't forget to update the readme
      data: _.pick(imageData.Images[0], [
        'ImageId',
        'ImageLocation',
        'State',
        'OwnerId',
        'CreationDate',
        'Public',
        'Architecture',
        'ImageType',
        'KernelId',
        'RamdiskId',
        'Platform',
        'SriovNetSupport',
        'ImageOwnerAlias',
        'Description',
        'RootDeviceType',
        'RootDeviceName',
        'VirtualizationType',
        'Hypervisor'
      ])
    };
  });
};

// Create is same implementation as update.
exports.handleCreate = exports.handleUpdate;

// This resource does not create any actual resources so there is nothing to
// do on delete.
exports.handleDelete = _.noop;
