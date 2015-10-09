var mongoose = require('mongoose');
var express = require('express');
var passport = require('passport');
var jwt = require('express-jwt');
var router = express.Router();

// Models, uncomment after schema has been set
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');

// Authentication middleware
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

/*
	PARAMS
*/
// Post parameter
router.param('post', function(req, res, next, id) {
	var query = Post.findById(id);

	query.exec(function(err, post) {
		// Handle errors if any
		if(err) { return next(err); }

		// Check if the requested post exists
		if(!post) { return next(new Error("Can't find post")); }

		// Set the post
		req.post = post;

		return next();
	});
});

// Comment parameter
router.param('comment', function(req, res, next, id) {
	var query = Comment.findById(id);

	query.exec(function(err, comment) {
		// Handle errors if any
		if(err) { return next(err); }

		// Check if the requested comment exists
		if(!comment) { return next(new Error("Can't find comment")); }

		// Set the comment
		req.comment = comment;

		return next();
	});
});

// User parameter
router.param('user', function(req, res, next, id) {
  	var query = User.findById(id);

	query.exec(function(err, user) {
		// Handle errors if any
		if(err) { return next(err); }

		// Check if the requested post exists
		if(!user) { return next(new Error("Can't find comment")); }

		// Set the post
		req.user = user;

		return next();
	});
});

/*
	POSTS
*/
// Get all post
router.get('/posts', function(req, res, next) {
	Post.find(function(err, posts) {
		// Handle errors
		if(err) { return next(err); }

		// Return posts
		res.json(posts);
	});
});

// Add post
router.post('/posts', function(req, res, next) {
	// Create a new post from the sent body
	var post = new Post(req.body);

	post.save(function(err, post){
		// Handle errors
		if(err){ return next(err); }
		
		// Return the post
	   	res.json(post);
	});
});

// Get single post
router.get('/posts/:post', function(req, res, next) {
	res.json(req.post);
});

// Update single posts body
router.put('/posts/:post/body', function(req, res, next) {
	req.post.body = req.body.body;

	req.post.save(function(err, post) {
		// Handle errors
		if(err){ return next(err); }

		// Return the post
	   	res.json(post);
	});
});

// Upvote a post
router.put('/posts/:post/upvote', function(req, res, next) {
	req.post.upvote(function(err, post) {
		// Handle errors
		if(err) { return next(err); }

		res.json(post);
	});
});

// Downvote a post
router.put('/posts/:post/downvote', function(req, res, next) {
	req.post.downvote(function(err, post) {
		// Handle errors
		if(err) { return next(err); }

		res.json(post);
	});
});

// Get all comments associated with a post
router.get('/posts/:post/comments', function(req, res, next) {
	res.json(req.post.comments);
});

// Add a new comment to a post
router.post('/posts/:post/comments', function(req, res, next) {
	var comment = new Comment(req.body);

	// Add the reference to the related post
	comment.post = req.post;

	comment.save(function(err, comment) {
		// Handle errors
		if(err){ return next(err); }

		// Add the comment to the related post
		req.post.comments.push(comment);

		req.post.save(function(err, post) {
			// Handle errors
			if(err){ return next(err); }

			// Return the comment
			res.json(comment);
		});
	});
});

// Update a comments body
router.put('/posts/:post/comments/:comment/body', function(req, res, next) {
	req.comment.body = req.body.body;

	req.comment.save(function(err, comment) {
		// Handle errors
		if(err){ return next(err); }

		// Return the comment
		res.json(comment);
	});
});

// Upvote a comment
router.put('/posts/:post/comments/:comment/upvote', function(req, res, next) {
	req.comment.upvote(function(err, comment) {
		// Handle errors
		if(err) { return next(err); }

		res.json(comment);
	});
});

// Downvote a comment
router.put('/posts/:post/comments/:comment/downvote', function(req, res, next) {
	req.comment.downvote(function(err, comment) {
		// Handle errors
		if(err) { return next(err); }

		res.json(comment);
	});
});

/*
	USERS
*/
// Register a user
router.post('/register', function(req, res, next) {

});

// Login a user
router.post('/login', function(req, res, next) {

});

module.exports = router;
