// Controller for the categories
app.controller('FrontPageCtrl', ['$scope', '$stateParams', 'auth', 'category', 'page', '$state', function($scope, $stateParams, auth, category, page, $state) {
	$scope.currentUser = auth.currentUser;
	$scope.isLoggedIn = auth.isLoggedIn;

	page.setTitle('Front Page');

	$scope.newCategory = function() {
		if((!$scope.name || $scope.name === '') && (!$scope.description || $scope.description === '')) { return; }

		category.create({
			name: $scope.name,
			description: $scope.description
		}).success(function(data) {
			$state.go('posts', { category: $scope.name });
		}).error(function(err) {
			$scope.error = err;
		});
	};
}]);