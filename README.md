# Taunus

> Micro MVC engine

Taunus aims to simplify the state of MVC and shared rendering. Taunus will handle routing, and allow you to lay out controllers and view templates independently for each view. Each route will query the server, for a model, before rendering its view template.

# `.mount(elem, routes)`

In Taunus, everything starts at `mount`.

- `root` Element where partials will get rendered. e.g: `document.getElementByID('main')`
- `routes` An array of route definitions, as explained below

```js
taunus.mount(root, routes);
```

The `root` element is expected to have a `data-taunus` attribute whose value is the model that was used by the server to render the partial view the first time around. This model will be parsed and passed to the view controller during the mounting process.

# Route Definitions

Route definitions have a few properties.

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

- `route` is passed to [`routes`][1] directly, and used to match the URL to a view controller
- `template` is expected to be a function, and it'll be passed a `model` object
- `controller` is invoked after the template is rendered, allowing you to bind event listeners and the like

When the application mounts for the first time, Taunus will find the route that matches `location.pathname`, and execute its controller. The first time around, the server-side is expected to render the partial view template. From that point on, Taunus will take over rendering templates in the client-side. You should've set the initial model properly as well, as explained in `taunus.mount`.

# Anchor Links

Anchor links are analyzed and matched to a route definition. When a link gets clicked, the link's URL will be queried for `application/json` data. When a response is received, the partial that matches the definition will be rendered, and its controller will be invoked.

# License

MIT

[1]: https://github.com/aaronblohowiak/routes.js "connect's minimalist routing module"
