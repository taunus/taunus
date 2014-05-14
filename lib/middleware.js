'use strict';

var _ = require('lodash');
var path = require('path');
var defaults = {...};
var views = '../.bin/views';
var layout = '__layout';

module.exports = function () {
  return function (req, res, next) {
    var vm = res.viewModel;
    var accept = req.headers.accept || '';
    var data = _.extend({}, defaults, vm);
    var template;

    if (!data) {
      next();
    } else if (~accept.indexOf('html')) {
      template = path.join(views, data.partial);
      data.partial = require(template)(data.model);
      res.render(layout, data);
    } else if (~accept.indexOf('json')) {
      res.json(data);
    } else {
      next();
    }
  }
};
