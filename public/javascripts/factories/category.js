app.factory('category', ['$http', 'auth', function($http, auth) {
	var o = {

	};

	o.get = function(id) {
		return $http.get('/categories/' + id).then(function(res){
    		return res.data;
  		});
	};

	o.create = function(category) {
		return $http.post('/categories', category, {
			headers: { Authorization: 'Bearer ' + auth.getToken() }
		});
	};

	o.update = function(category) {
		return $http.put('/categories/' + category.name, category, {
			headers: { Authorization: 'Bearer ' + auth.getToken() }
		});
	};

	return o;
}]);