'use strict';

var templates = {
};

var controllers = {
};

var routes = [
  {
    route: '/bar',
    action: 'foo/bar',
    cache: true
  },
  {
    route: '/baz',
    action: 'foo/baz',
    cache: false
  },
  {
    route: '/bat',
    action: 'foo/bat',
    cache: 15
  },
  {
    route: '/baal',
    action: 'foo/baal',
    cache: 0
  },
  {
    route: '/baw',
    action: 'foo/baw'
  },
  {
    route: '/bam',
    action: 'foo/bam'
  },
  {
    route: '/bang',
    action: 'foo/bang'
  }
];

module.exports = {
  templates: templates,
  controllers: controllers,
  routes: routes
};
