[![taunus.png][3]][1]

> Micro Isomorphic MVC. Progressive Enhancement. Content-First. Single-Page Applications (that are also server-side rendered). Predictive Caching. Bring Your Own View Engine.

Taunus aims to simplify the state of MVC and shared rendering using [convention over configuration][2]. Taunus will handle routing,  allow you to lay out controllers and view templates independently for each view.

# Documentation

The comprehensive documentation is available at [taunus.bevacqua.io][1].

#### In The Wild

For usage examples, please check out these sites.

- [ponyfoo.com][8], open-sourced at: [ponyfoo/ponyfoo][4],
- [taunus.bevacqua.io][1], open-sourced at: [taunus/taunus.bevacqua.io][5]

Alternatively walk through [getting-started][6] or use the [Yeoman generator][7]!

Enjoy!

# Development

Install dependencies.

```shell
npm install
```

You can analyze the bundle size using the command below.

```shell
npm run diagnose
```

# Tests

Taunus has unit tests for both the client-side and the server-side. Run them both with `npm`.

```shell
npm test
```

You can also run them individually.

```shell
npm run test-server
npm run test-client
```

<sub>Note that during CI a different test harness is used for the client-side _(the `test-client-ci` script)_, but the tests stay the same.</sub>

# Continuous Integration

The server-side test suite is [serviced by Travis CI][11].

[![travis.png][12]][11]

[Sauce Labs][10] provides CI for the client-side Taunus test suite.

[![taunus.png][9]][10]


# License

MIT

[1]: http://taunus.bevacqua.io "Taunus Documentation Mini-site"
[2]: http://en.wikipedia.org/wiki/Convention_over_configuration "Convention over configuration"
[3]: https://raw.github.com/bevacqua/taunus/master/resources/taunus.png
[4]: https://github.com/ponyfoo/ponyfoo
[5]: https://github.com/taunus/taunus.bevacqua.io
[6]: https://github.com/taunus/getting-started
[7]: https://github.com/taunus/generator-taunus
[8]: http://ponyfoo.com
[9]: https://saucelabs.com/browser-matrix/taunus.svg
[10]: https://saucelabs.com/u/taunus
[11]: https://travis-ci.org/taunus/taunus
[12]: https://secure.travis-ci.org/taunus/taunus.png?branch=master
