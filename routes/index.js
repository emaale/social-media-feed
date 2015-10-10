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
// Fetches a single category
router.param('category', function(req, res, next, id) {
	
});

// Fetches a single post
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

// Fetches a single comment
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

// Fetches a single user
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
// Filter posts based on search criteria (works across categories)
router.get('/posts/search/title', function(req, res, next) {
	Post.find(function(err, posts) {
		// Handle errors
		if(err) { return next(err); }

		// Return posts
		res.json(posts);
	});
});

/*
	CATEGORIES
*/
// Get all categories
router.get('/categories', function(req, res, next) {
	
});

// Make a new category
router.post('/categories', auth, function(req, res, next) {
	
});

// Get a single category
router.get('/categories/:category', function(req, res, next) {
	
});

// Update a category
router.put('/categories/:category', auth, function(req, res, next) {
	
});

// Get posts related to a single category
router.get('/categories/:category/posts', function(req, res, next) {
	
});

// Filter all posts based on search criteria
router.get('/categories/:category/posts/search/title', function(req, res, next) {
	
});

// Make a new post in a category
router.post('/categories/:category/posts', auth, function(req, res, next) {
	
});

// Get a single post from a category
router.get('/categories/:category/posts/:post', function(req, res, next) {
	
});

// Update a post in a category
router.put('/categories/:category/posts/:post', auth, function(req, res, next) {
	
});

// Upvote a post
router.put('/categories/:category/posts/:post/upvote', auth, function(req, res, next) {
	req.post.upvote(function(err, post) {
		// Handle errors
		if(err) { return next(err); }

		res.json(post);
	});
});

// Downvote a post
router.put('/categories/:category/posts/:post/downvote', auth, function(req, res, next) {
	req.post.downvote(function(err, post) {
		// Handle errors
		if(err) { return next(err); }

		res.json(post);
	});
});

// Get all comments associated with a post
router.get('/categories/:category/posts/:post/comments', function(req, res, next) {
	res.json(req.post.comments);
});

// Make a comment on a post in a category
router.post('/categories/:category/posts/:post/comments', auth, function(req, res, next) {
	
});

// Update a comments body
router.put('/categories/:category/posts/:post/comments/:comment/body', auth, function(req, res, next) {
	req.comment.body = req.body.body;

	req.comment.save(function(err, comment) {
		// Handle errors
		if(err){ return next(err); }

		// Return the comment
		res.json(comment);
	});
});

// Upvote a comment
router.put('/categories/:category/posts/:post/comments/:comment/upvote', auth, function(req, res, next) {
	req.comment.upvote(function(err, comment) {
		// Handle errors
		if(err) { return next(err); }

		res.json(comment);
	});
});

// Downvote a comment
router.put('/categories/:category/posts/:post/comments/:comment/downvote', auth, function(req, res, next) {
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
	// Validation
	if(!req.body.username || !req.body.password){
		return res.status(400).json({message: 'Please fill out all fields'});
	}

	// Create a new user and set the fields
	var user = new User();
	user.username = req.body.username;
	user.setPassword(req.body.password)

	user.save(function (err){
		if(err){ return next(err); }

		// Return the generated JWT
		return res.json({token: user.generateJWT()})
	});
});

// Login a user
router.post('/login', function(req, res, next) {
	// Validation
	if(!req.body.username || !req.body.password){
		return res.status(400).json({message: 'Please fill out all fields'});
	}

	// Authenticate the user with passport
	passport.authenticate('local', function(err, user, info){
		// Handle errors
	    if(err){ return next(err); }

	    // Make sure the user exists
	    if(user){
	    	// Return the generated JWT
	      	return res.json({token: user.generateJWT()});
	    } else {
	    	// Handle the error and send info with the response
	      	return res.status(401).json(info);
	    }
  	})(req, res, next);
});

// Fetch a users information (comments, posts, upvoted and downvoted posts)
router.get('/users/:user/information', function(req, res, next) {
	
});

// Get the users categories, if not logged in, return a list of defaults
router.get('/users/:user/categories', function(req, res, next) {
	
});

// Add a category to the users categories
router.post('/users/:user/categories', auth, function(req, res, next) {
	
});

// Delete a category from the users categories
router.delete('/users/:user/categories/:category', auth, function(req, res, next) {
	
});



module.exports = router;
