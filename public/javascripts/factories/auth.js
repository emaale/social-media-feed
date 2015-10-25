app.factory('auth', ['$http', '$window', function($http, $window) {
	var auth = {};

	auth.saveToken = function(token) {
		$window.localStorage['news-feed-token'] = token;
	};

	auth.getToken = function() {
		return $window.localStorage['news-feed-token'];
	};

	auth.isLoggedIn = function() {
		var token = auth.getToken();

		// Make sure token hasn't expired
		if(token) {
			var payload = JSON.parse($window.atob(token.split('.')[1]));

			 return payload.exp > Date.now() / 1000;
		} else {
			return false;
		}
	};

	auth.currentUser = function(){
		// Make sure the user is logged in
		if(auth.isLoggedIn()){
			var token = auth.getToken();
			var payload = JSON.parse($window.atob(token.split('.')[1]));

			return payload.username;
		}
	};

	auth.register = function(user) {
		return $http.post('/register', user).success(function(data){
    		auth.saveToken(data.token);
  		});
	};

	auth.logIn = function(user) {
		return $http.post('/login', user).success(function(data){
			auth.saveToken(data.token);
		});
	};

	return auth;
}]);