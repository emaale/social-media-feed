app.factory('page', ['$http', function($http) {
	var title = 'Front Page';
	
	return {
	    title: function() { return title; },
	    setTitle: function(newTitle) { title = newTitle }
	};
}]);