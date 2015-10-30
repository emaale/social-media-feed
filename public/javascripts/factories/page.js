app.factory('page', ['$http', function($http) {
	var title = 'default';
	
	return {
	    title: function() { return title; },
	    setTitle: function(newTitle) { title = newTitle }
	};
}]);