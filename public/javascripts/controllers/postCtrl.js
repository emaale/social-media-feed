// Controller for posts
app.controller('PostCtrl', ['$scope', '$stateParams', 'post', 'fetchedPost', function($scope, $stateParams, post, fetchedPost) {
	$scope.post = fetchedPost;

	console.log($scope.post);
}]);