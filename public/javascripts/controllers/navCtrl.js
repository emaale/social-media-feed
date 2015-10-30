// Controller for front page
app.controller('NavCtrl', ['$scope', '$stateParams', 'auth', function($scope, $stateParams, auth) {
	$scope.isLoggedIn = auth.isLoggedIn;
	$scope.currentUser = auth.currentUser;
	$scope.logOut = auth.logOut;
}]);