'use strict';

var mountable = require('./mount');

module.exports = mountable({
  render: require('./render')
});
