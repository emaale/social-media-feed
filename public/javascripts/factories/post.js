app.factory('post', ['$http', function($http) {
	var o = {
		posts: []
	};

	o.get = function(category, postId) {
		return $http.get('/categories/' + category + '/posts/' + postId).then(function(res){
    		return res.data;
  		});
	};

	o.getAll = function(category) {
		return $http.get('/categories/' + category + '/posts').then(function(res) {
			return res.data;
		});
	};

	return o;
}]);