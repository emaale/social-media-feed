app.factory('post', ['$http', 'auth', function($http, auth) {
	var o = {
		posts: []
	};

	o.get = function(categoryId, postId) {
		return $http.get('/categories/' + categoryId + '/posts/' + postId).then(function(res){
    		return res.data;
  		});
	};

	o.getAll = function() {
		return $http.get('/categories/' + categoryId + '/posts').then(function(res) {
			return res.data;
		});
	};

	o.create = function(categoryId, post) {
		return $http.post('/categories/' + categoryId + '/posts', post, {
			headers: { Authorization: 'Bearer ' + auth.getToken() }
		}).success(function(data){
			o.posts.push(data);
		});
	};

	o.update = function(categoryId, postId, post) {
		return $http.put('/categories/' + categoryId + '/posts/' + postId, post, {
			headers: { Authorization: 'Bearer ' + auth.getToken() }
		});
	};

	o.upvote = function(categoryId, post) {
	  	return $http.put('/categories/' + categoryId + '/posts/' + post._id + '/upvote', null, {
			headers: { Authorization: 'Bearer ' + auth.getToken() }
		}).success(function(data){
			angular.copy(data.upvotes, post.upvotes);
			angular.copy(data.downvotes, post.downvotes);
	    });
	};

	o.downvote = function(categoryId, post) {
	  	return $http.put('/categories/' + categoryId + '/posts/' + post._id + '/downvote', null, {
			headers: { Authorization: 'Bearer ' + auth.getToken() }
		}).success(function(data){
			angular.copy(data.upvotes, post.upvotes);
	    	angular.copy(data.downvotes, post.downvotes);
	    });
	};

	o.addComment = function(categoryId, postId, comment) {
		return $http.post('/categories/' + categoryId + '/posts/' + postId + '/comments', comment, {
			headers: { Authorization: 'Bearer ' + auth.getToken() }
		});
	};

	o.upvoteComment = function(categoryId, postId, comment) {
		return $http.put('/categories/' + categoryId + '/posts/' + postId + '/comments/' + comment._id + '/upvote', null, {
			headers: { Authorization: 'Bearer ' + auth.getToken() }
		}).success(function(data){
			angular.copy(data.upvotes, comment.upvotes);
			angular.copy(data.downvotes, comment.downvotes);
	    });
	};

	o.downvoteComment = function(categoryId, postId, comment) {
		return $http.put('/categories/' + categoryId + '/posts/' + postId + '/comments/' + comment._id + '/downvote', null, {
			headers: { Authorization: 'Bearer ' + auth.getToken() }
		}).success(function(data){
			angular.copy(data.upvotes, comment.upvotes);
			angular.copy(data.downvotes, comment.downvotes);
	    });
	};

	return o;
}]);