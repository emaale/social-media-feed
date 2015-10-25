// Controller for the authentication
app.controller('AuthCtrl', ['$scope', '$state', 'auth', function($scope, $stateParams, auth) {
	$scope.user = {};

	$scope.register = function(){
	    auth.register($scope.user).error(function(error){
	      	$scope.error = error;
	    }).then(function(){
	      	$state.go('home');
	    });
	};

	$scope.logIn = function(){
		auth.logIn($scope.user).error(function(error){
	    	$scope.error = error;
	    }).then(function(){
	      	$state.go('home');
	    });
	};
}]);