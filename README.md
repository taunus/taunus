# Taunus

> Micro MVC engine

Taunus aims to simplify the state of MVC and shared rendering. Taunus will handle routing, and allow you to lay out controllers and view templates independently for each view. Each route will query the server, for a model, before rendering its view template.

# Server Side

## `.mount(app, routes)`

Taunus comes with a mount point for the server-side, as well.

- `app` should be a `connect` or `express` application
- `routes` is used to configure routing, see below

The mount point will register each route, and configure them to return HTML or JSON according to the `accept` header. If HTML is expected, then the template will be rendered server-side, and surrounded with a layout. If JSON is expected, the view model is passed to the response as-is, and no rendering occurs on the server-side.

### `routes`

The `routes` parameter expects an array of objects. These objects should specify a `route` property, exactly like the ones you'd give Connect. That's because [Taunus uses routes][1], Connect's internal route handler. The route should have an `action` property declaring a `{controller}/{action}` pair. This will tell Taunus what action should handle the request, and what view template should be rendered. This pair is also used on the client-side to determine which controller action should be invoked. You can also specify an optional `middleware` property, useful to do request authorization.

```js
[
  { route: '/', action: 'home/index' },
  { route: '/author/compose', action: 'author/compose', middleware: authorOnly }
];
```

In the end, this will generate a call similar to the following pseudo-code. The internal Taunus renderer will decide whether to render the view as JSON or HTML, based on the `accepts` request header.

```js
app.get('/author/compose', authorOnly, authorCompose, [internal].render);
```

These routes can also be used to generate the routes used by the client-side. The Taunus CLI makes this easy for you.

### Configuring `.taunusrc`

If you need to use values other than the defaults shown in the table below, then you should create a `.taunusrc` file. Note that the defaults need to be overwritten in a case-by-case basis.

Property             | Description                                                    | Default
---------------------|----------------------------------------------------------------|---------------
`viewModel`          | The view model will be extended off of this object             | `{}`
`views`              | Directory where your view templates live                       | `views`
`layout`             | The path to the view layout, relative to the views directory   | `__layout`
`server_controllers` | Directory where server-side controllers live                   | `controllers`
`client_controllers` | Directory where client-side controllers live                   | `client/js/controllers`
`server_routes`      | File path where server routes are located                      | `controllers/routes.js`
`client_routes`      | File path where client routes are dumped by the CLI            | `undefined`

Here is where things get [a little conventional][2]. Your views need to be functions, exported in Common.JS format, like the one shown below. Your views are expected to be functions in Common.JS, and placed in `{root}/{controller}/{action}`.

```js
module.exports = function (model) {
  return '<h1>' + model.title + '</h1>';
};
```

Views are used in both the server-side and the client-side. Of course, it is possible to re-use your views in the client-side. The Taunus CLI makes this easy for you. Both server-side and client-side controllers are expected to follow the `{root}/{controller}/{action}` pattern, as well.

# Client Side

## `.mount(root, routes)`

In Taunus, everything starts at `mount`.

- `root` Element where partials will get rendered. e.g: `document.getElementByID('main')`
- `routes` An array of route definitions, as explained below

```js
taunus.mount(root, routes);
```

The `root` element is expected to have a `data-taunus` attribute whose value is the model that was used by the server to render the partial view the first time around. This model will be parsed and passed to the view controller during the mounting process.

### Route Definitions

**Note that these should typically be generated using the CLI.** Route definitions have a few properties.

- `route` is passed to [`routes`][1] directly, and used to match the URL to a view controller
- `template` is expected to be a function, and it'll be passed a `model` object
- `controller` is invoked after the template is rendered, allowing you to bind event listeners and the like

Here's an example _client-side_ route definition.

```
{
  route: '/author/compose',
  template: function (model) {
    return '<h1>' + model.title + '</h1>';
  },
  controller: function (model) {
    // controller code
  }
}
```


When the application mounts for the first time, Taunus will find the route that matches `location.pathname`, and execute its controller. The first time around, the server-side is expected to render the partial view template. From that point on, Taunus will take over rendering templates in the client-side. You should've set the initial model properly as well, as explained in `taunus.mount`.

### Anchor Links

Anchor links are analyzed and matched to a route definition. If a route matches the link, when a link gets clicked, the link's URL will be queried for `application/json` data. When a response is received, the partial that matches the definition will be rendered, and its controller will be invoked.

# Taunus CLI

The `taunus` CLI uses the Taunus configuration to create the client-side routes. The `-o` flag will output the routes to the file indicated in the RC configuration property `client_routes`. When `-o` is omitted, the output is printed to standard out. You can also use the `-w` option to watch for changes.

```shell
taunus -o
```

Note that, since this will `require` both view templates and client-side controllers, views and routes don't need to be duplicated in code other than what the CLI generates. Below is an example of the output `taunus` generates, based on the routes presented earlier. The `require` statements will be relative to the `client_routes` path.

```js
module.exports = [{
  route: "/",
  template: require("../../views/home/index"),
  controller: require("../../../client/js/controllers/home/index")
}, {
  route: "/author/compose",
  template: require("../../views/author/compose"),
  controller: require("../../../client/js/controllers/author/compose")
}];
```

You should now be able to call `taunus.mount` on the client side, passing the auto-generated routes. Example shown below.

```js
var taunus = require('taunus');
var routes = require('./routes'); // point at the client-side routes!
var root = document.querySelector('.view-container');

taunus.mount(root, routes);
```

Enjoy!

# License

MIT

[1]: https://github.com/aaronblohowiak/routes.js "connect's minimalist routing module"
[2]: http://en.wikipedia.org/wiki/Convention_over_configuration "Convention over configuration"
