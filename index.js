var _ = require('lodash');

module.exports = function(settings) {
	_.defaults(settings, {
		rewriteQuery: true,
		rewriteQueryDeleteKeys: false,
		postToPatch: true,
		postToPatchUrl: /^\/api\/.+\/.+$/,
	});

	return function(req, res, next) {
		if (settings.rewriteQuery) {
			// Import existing query structure if its present
			var newQuery = req.query.query ? JSON.parse(req.query.query) : {};

			Object.keys(req.query).forEach(function(key) {
				if (key == 'query') return; // Ignore the existing query structure
				if (key == 'distinct' || key == 'limit' || key == 'populate' || key == 'select' || key == 'skip' || key== 'sort') return; // Ignore meta fields
				newQuery[key] = req.query[key];

				if (settings.rewriteQueryDeleteKeys) delete req.query[key];
			});

			// Encode back into req.query.query
			req.query.query = JSON.stringify(newQuery);
		}

		if (
			settings.postToPatch &&
			req.method == 'POST' &&
			( !settings.postToPatchUrl || settings.postToPatchUrl.test(req.originalUrl) )
		) {
			req.method = 'PATCH';
			console.log('BODY', req.body);
		}

		next();
	};

};
