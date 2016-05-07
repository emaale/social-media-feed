// Controller for the navigation
app.controller('NavCtrl', ['$scope', '$stateParams', '$state', 'auth', 'page', 'user', function($scope, $stateParams, $state, auth, page, user) {
	$scope.isLoggedIn = auth.isLoggedIn();
	$scope.currentUser = auth.currentUser;
	$scope.logOut = auth.logOut;
	$scope.page = page;

	if($scope.isLoggedIn) {
		user.getSavedCategories().then(function(res) {
			$scope.savedCategories = user.savedCategories;
		});
	}

	$scope.search = function() {
		// Make sure the search bar isn't empty
		if($scope.searchQuery != '') {
			// Performs search based on searchQuery
			$state.go('searchPosts', { q: $scope.searchQuery });
		} else {
			$state.go('home');
		}
	};
}]);