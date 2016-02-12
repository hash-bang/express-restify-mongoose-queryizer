module.exports = function(req, res, next) {
	// Import existing query structure if its present
	var newQuery = req.query.query ? JSON.parse(req.query.query) : {};

	Object.keys(req.query).forEach(function(key) {
		if (key == 'query') return; // Ignore the existing query structure
		if (key == 'distinct' || key == 'limit' || key == 'populate' || key == 'select' || key == 'skip' || key== 'sort') return; // Ignore meta fields
		newQuery[key] = req.query[key];
		delete req.query[key];
	});

	// Encode back into req.query.query
	req.query.query = JSON.stringify(newQuery);

	next();
});
