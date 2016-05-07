// Controller for searching posts
app.controller('SearchCtrl', ['$scope', 'page', 'fetchedPosts', function($scope, page, fetchedPosts) {
	$scope.posts = fetchedPosts;

	page.setTitle("Search results:");
}]);