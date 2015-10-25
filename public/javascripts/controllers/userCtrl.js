// Controller for front page
app.controller('UserCtrl', ['$scope', '$stateParams', 'auth', function($scope, $stateParams, auth) {
	$scope.isLoggedIn = auth.isLoggedIn;

	
}]);