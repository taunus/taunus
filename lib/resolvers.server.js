'use strict';

var path = require('path');
var rc = require('./rc');

function getControllerActionPath (action) {
  return path.resolve(rc.server_controllers, action);
}

module.exports = {
  getControllerActionPath: getControllerActionPath
};
