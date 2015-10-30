// Controller for the categories
app.controller('PostsCtrl', ['$scope', '$stateParams', 'fetchedCategory', 'auth', 'post', 'page', '$state', 'category', function($scope, $stateParams, fetchedCategory, auth, post, page, $state, category) {
	$scope.category = fetchedCategory;
	$scope.posts = $scope.category.posts;
	$scope.currentUser = auth.currentUser;
	$scope.isLoggedIn = auth.isLoggedIn;

	page.setTitle($scope.category.name);

	$scope.editCategory = function() {
		if(!$scope.category.description || $scope.category.description === '') { return; }

		category.update({
			description: $scope.category.description,
			name: $scope.category.name
		}).success(function(data) {
			$state.go('posts', { category: $stateParams.category });
		});
	};

	$scope.newPost = function() {
		if(!$scope.title || $scope.title === '') { return; }
		
		post.create($stateParams.category, {
			title: $scope.title,
		    link: $scope.link,
		    body: $scope.body
		}).then(function(res) {
			$state.go('post', { category: $stateParams.category, postId: res.data._id });
		});
	};

	$scope.upvotePost = function(thePost) {
		post.upvote($stateParams.category, thePost);
	};

	$scope.downvotePost = function(thePost) {
		post.downvote($stateParams.category, thePost);
	};
}]);