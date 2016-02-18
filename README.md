express-restify-mongoose-queryizer
==================================
Middleware for [express-restify-mongoose](https://florianholzapfel.github.io/express-restify-mongoose) which allows direct querying via GET without JSON structures.

The 2.0.0 release of ERM moved GET based querying into the `query` structure like this:

	http://myserver.com/api/widgets?query={"type":"foobar"}&sort=title

This middleware layer allows the old-style method of filtering directly within the GET request:

	http://myserver.com/api/widgets?type=foobar&sort=title

Meta fields and the existing `query` structure is still maintained allowing for compatibility with regular ERM query syntax.


Installation
------------
Install via NPM:

	npm --save install express-restify-mongoose-queryizer

Then somewhere in your express application install it as middleware:

	app.use(require('express-restify-mongoose-queryizer')({

		// Whether to rewrite queries (see above examples)
		rewriteQuery: true,

		// If we do rewrite should we also remove the key from req.query (not recommended if you have other middleware that relies on req.query)
		rewriteQueryDeleteKeys: false,

		// Rewrite 'POST' operations to 'PATCH'
		postToPatch: true,

		// ... but only if they match this URL format
		postToPatchUrl: /^\/api\/.+\/.+$/,
	}));
