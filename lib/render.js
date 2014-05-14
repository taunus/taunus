'use strict';

var _ = require('lodash');
var path = require('path');
var cwd = process.cwd();

module.exports = function (options) {
  var defaults = options.defaults;
  var views = options.views || 'views';
  var layout = options.layout || '__layout';

  return function (req, res, next) {
    var vm = res.viewModel;
    var accept = req.headers.accept || '';
    var data = _.extend({}, defaults, vm);
    var template;

    if (!data) {
      next();
    } else if (~accept.indexOf('html')) {
      template = path.join(cwd, views, res.partial);
      data.partial = require(template)(data.model);
      res.render(layout, data);
    } else if (~accept.indexOf('json')) {
      res.json(data);
    } else {
      next();
    }
  }
};
