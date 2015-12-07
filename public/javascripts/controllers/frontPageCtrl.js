// Controller for the categories
app.controller('FrontPageCtrl', ['$scope', 'auth', 'category', 'post', 'page', '$state', 'fetchedPosts', function($scope, auth, category, post, page, $state, fetchedPosts) {
	$scope.currentUser = auth.currentUser;
	$scope.isLoggedIn = auth.isLoggedIn;
	$scope.posts = fetchedPosts;

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

	$scope.upvotePost = function(thePost) {
		console.log(thePost);
		post.upvote(thePost.category.name, thePost);
	};

	$scope.downvotePost = function(thePost) {
		post.downvote(thePost.category.name, thePost);
	};
}]);