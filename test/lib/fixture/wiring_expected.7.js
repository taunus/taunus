'use strict';

var templates = {
};

var controllers = {
  'foo/bar': require('../test/lib/fixture/controllers_7/foo/bar.js'),
  'sample/sample': require('../test/lib/fixture/controllers_7/sample/sample.js')
};

var routes = [
  {
    route: '/bar',
    action: 'foo/bar'
  },
  {
    route: '/baz',
    action: 'foo/baz'
  },
  {
    route: '/bat',
    action: 'foo/bat'
  },
  {
    route: '/baal',
    action: 'foo/baal'
  },
  {
    route: '/baw',
    action: 'bar/baw'
  },
  {
    route: '/bam',
    action: 'bar/bam'
  },
  {
    route: '/bang',
    action: 'bar/bang'
  }
];

var deferrals = [
  'bar/?'
];

module.exports = {
  templates: templates,
  controllers: controllers,
  routes: routes,
  deferrals: deferrals
};
