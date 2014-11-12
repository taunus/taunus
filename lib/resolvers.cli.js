'use strict';

var path = require('path');
var rc = require('./rc');

function getClientController (action) {
  return path.resolve(rc.client_controllers, action);
}

module.exports = {
  getClientController: getClientController
};
