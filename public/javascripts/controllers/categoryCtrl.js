// Controller for the categories
app.controller('CategoryCtrl', ['$scope', 'fetchedCategories', 'page', 'user', function($scope, fetchedCategories, page, user) {
	$scope.user = {};
	$scope.categories = fetchedCategories;
	$scope.savedCategories = user.savedCategories;

	page.setTitle('Categories');
}]);