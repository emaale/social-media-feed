// Controller for posts
app.controller('PostCtrl', ['$scope', '$stateParams', 'auth', 'post', 'fetchedPost', 'page', '$state', 'user', function($scope, $stateParams, auth, post, fetchedPost, page, $state, user) {
	$scope.post = fetchedPost;
	$scope.isLoggedIn = auth.isLoggedIn();
	$scope.category = $scope.post.category;
	$scope.currentUser = auth.currentUser;

	page.setTitle('/c/' + $scope.category.name);

	var isCategorySaved = function() {
		var saved = false;

		// Iterate through the savedCategories and check if this category has been saved to that list
		for (var i = 0; i < $scope.savedCategories.length; i++) {
			// Check for matches
			if($scope.savedCategories[i]._id == $scope.category._id) saved = true;
		}

		$scope.savedCategory = saved;
	};

	if($scope.isLoggedIn) {
		$scope.savedCategories = user.savedCategories;
		
		isCategorySaved();
	}

	$scope.addSavedCategory = function(category) {
		user.addSavedCategory(category).then(function(res) {
			$scope.savedCategory = true;
		});
	};

	$scope.removeSavedCategory = function(category) {
		user.removeSavedCategory(category).then(function(res) {
			$scope.savedCategory = false;
		});
	};

	$scope.editPost = function() {
		if(!$scope.post.title || $scope.post.title === '') { return; }
		
		post.update($stateParams.category, $stateParams.postId, {
			title: $scope.post.title,
		    link: $scope.post.link,
		    body: $scope.post.body
		}).success(function(data) {
			$state.go('post', { category: $stateParams.category, postId: data._id });
		});
	};

	$scope.newComment = function() {
		if($scope.body === '') { return; }
		
		post.addComment($stateParams.category, $scope.post._id, {
		    body: $scope.body
		}).success(function(comment) {
		    $scope.post.comments.push(comment);
		});
		
		$scope.body = '';
	};

	$scope.upvotePost = function(thePost) {
		post.upvote($stateParams.category, thePost);
	};

	$scope.downvotePost = function(thePost) {
		post.downvote($stateParams.category, thePost);
	};
	
	$scope.upvoteComment = function(comment) {
		post.upvoteComment($stateParams.category, $stateParams.postId, comment);
	};

	$scope.downvoteComment = function(comment) {
		post.downvoteComment($stateParams.category, $stateParams.postId, comment);
	};
}]);