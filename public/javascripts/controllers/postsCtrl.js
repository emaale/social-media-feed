// Controller for the categories
app.controller('PostsCtrl', ['$scope', '$stateParams', 'fetchedPosts', function($scope, $stateParams, fetchedPosts) {
	$scope.posts = fetchedPosts;
	console.log($scope.posts);
}]);