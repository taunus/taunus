'use strict';

var l = require('./global/location');
var origin = l.origin || (l.protocol + '//' + l.hostname + (l.port ? ':' + l.port: ''));

module.exports = origin;
