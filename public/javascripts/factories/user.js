app.factory('user', ['$http', 'auth', function($http, auth) {
	var o = {
		savedCategories: []
	};

	o.getInformation = function(username) {
		return $http.get('/users/' + username + '/information').then(function(res){
    		return res.data;
  		});
	};

	o.getSavedCategories = function() {
		return $http.get('/user/savedCategories', {
			headers: { Authorization: 'Bearer ' + auth.getToken() }
		}).then(function(res) {
			angular.copy(res.data, o.savedCategories);
		});
	};

	o.addSavedCategory = function(category) {
		return $http.post('/user/savedCategories', category, {
			headers: { Authorization: 'Bearer ' + auth.getToken() }
		}).then(function(res) {
			angular.copy(res.data, o.savedCategories);
		});
	};

	o.removeSavedCategory = function(category) {
		return $http.delete('/user/savedCategories/' + category._id, {
			headers: { Authorization: 'Bearer ' + auth.getToken() }
		}).then(function(res) {
			angular.copy(res.data, o.savedCategories);
		});
	};

	return o;
}]);