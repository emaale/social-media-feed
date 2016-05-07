// Controller for front page
app.controller('SavedCategoriesCtrl', ['$scope', 'page', 'savedCategories', 'user', function($scope, page, savedCategories, user) {
	$scope.savedCategories = savedCategories;

	// Set the title of the page
	page.setTitle("Saved Categories");

	$scope.removeSavedCategory = function(category) {
		user.removeSavedCategory(category).then(function(res) {
			angular.copy(res, user.savedCategories);
			$scope.savedCategories = user.savedCategories;
		});
	};
}]);