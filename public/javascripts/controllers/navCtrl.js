// Controller for the navigation
app.controller('NavCtrl', ['$scope', '$stateParams', '$state', 'auth', 'page', function($scope, $stateParams, $state, auth, page) {
	$scope.isLoggedIn = auth.isLoggedIn;
	$scope.currentUser = auth.currentUser;
	$scope.logOut = auth.logOut;

	$scope.page = page;

	$scope.search = function() {
		// Performs search based on searchQuery
		$state.go('searchPosts', { q: $scope.searchQuery });
	};
}]);