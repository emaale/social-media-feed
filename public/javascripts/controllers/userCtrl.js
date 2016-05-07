// Controller for front page
app.controller('UserCtrl', ['$scope', 'user', 'page', 'information', 'post', 'auth', function($scope, user, page, information, post, auth) {
	$scope.information = information;
	$scope.currentUser = auth.currentUser;

	// Set the title of the page
	page.setTitle("/u/" + $scope.information.username);

	$scope.upvotePost = function(thePost, category) {
		post.upvote(category, thePost);
	};

	$scope.downvotePost = function(thePost, category) {
		post.downvote(category, thePost);
	};

	$scope.upvoteComment = function(comment, postId, category) {
		post.upvoteComment(category, postId, comment);
	};

	$scope.downvoteComment = function(comment, postId, category) {
		post.downvoteComment(category, postId, comment);
	};
}]);