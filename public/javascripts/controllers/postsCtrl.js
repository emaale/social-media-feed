// Controller for the categories
app.controller('PostsCtrl', ['$scope', '$stateParams', 'fetchedCategory', 'auth', 'post', 'page', '$state', 'category', 'user', function($scope, $stateParams, fetchedCategory, auth, post, page, $state, category, user) {
	$scope.category = fetchedCategory;
	$scope.posts = $scope.category.posts;
	$scope.currentUser = auth.currentUser;
	$scope.isLoggedIn = auth.isLoggedIn();

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