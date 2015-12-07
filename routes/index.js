var mongoose = require('mongoose');
var express = require('express');
var passport = require('passport');
var jwt = require('express-jwt');
var router = express.Router();

// Models, uncomment after schema has been set
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');
var Category = mongoose.model('Category');

// Authentication middleware
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

/*
	PARAMS
*/
// Fetches a single category
router.param('category', function(req, res, next, name) {
	Category.findOne({name: name}, function(err, category) {
		// Handle errors if any
		if(err) { return next(err); }

		// Check if the requested category exists
		if(!category) { return next(new Error("Can't find category")); }

		// Set the post
		req.category = category;

		return next();
	});
});

// Fetches a single post from the specified category
router.param('post', function(req, res, next, id) {
	Post.findOne({category: req.category, _id: id}, function(err, post) {
		// Handle errors if any
		if(err) { return next(err); }

		// Check if the requested post exists
		if(!post) { return next(new Error("Can't find post")); }

		// Set the post
		req.post = post;

		return next();
	});
});

// Fetches a single comment from the specified post
router.param('comment', function(req, res, next, id) {
	Comment.findOne({post: req.post, _id: id}, function(err, comment) {
		// Handle errors if any
		if(err) { return next(err); }

		// Check if the requested comment exists
		if(!comment) { return next(new Error("Can't find comment")); }

		// Set the post
		req.comment = comment;

		return next();
	});
});

// Fetches a single user
router.param('user', function(req, res, next, name) {
  	User.findOne({username: name}, function(err, user) {
		// Handle errors if any
		if(err) { return next(err); }

		// Check if the requested user exists
		if(!user) { return next(new Error("Can't find user")); }

		req.user = user;

		return next();
	});
});

/*
	POSTS
*/
// Filter posts based on search criteria (works across categories)
router.get('/posts/search/title/:title', function(req, res, next) {
	Post.find({title: new RegExp(req.params.title, "i")}, function(err, posts) {
		// Handle errors
		if(err) { return next(err); }

		// Return posts
		res.json(posts);
	});
});

// Get all posts
router.get('/posts', function(req, res, next) {
	Post.find().populate('category author').exec(function(err, posts) {
		// Handle errors
		if(err) { return next(err); }

		// Return posts
		res.json(posts);
	});
});

/*
	CATEGORIES
*/
// Get all categories based on search criteria
router.get('/categories', function(req, res, next) {
	Category.find(function(err, categories) {
		// Handle errors
		if(err) { return next(err); }

		// Return categories
		res.json(categories);
	});
});

// Make a new category
router.post('/categories', auth, function(req, res, next) {
	var category = new Category(req.body);

	// Register the creator/owner of the category
	category.owner_id = req.payload._id;

	category.save(function(err, category) {
		// Handle errors
		if(err) { return next(err); }

		// Return categories
		res.json(category);
	});
});

// Get a single category
router.get('/categories/:category', function(req, res, next) {
	req.category.deepPopulate('posts.author', function(err, category) {
		// Handle errors
		if(err) { return next(err); }

		res.json(category);
	});
});

// Update a category
router.put('/categories/:category', auth, function(req, res, next) {
	// Make sure the user has permission to update
	if(req.category.owner_id == req.payload._id) {
		req.category.description = req.body.description;

		req.category.save(function(err, category) {
			// Handle errors
			if(err) { return next(err); }

			// Return category
			res.json(category);
		});
	} else {
		// Handle error
		return next(new Error("Cannot update category: Permission denied."));
	}	
});

// Get posts related to a single category
router.get('/categories/:category/posts', function(req, res, next) {
	// Return posts
	Post.find({ category: req.category }).populate('author category').exec(function(err, posts) {
		// Handle errors
		if(err) { return next(err); }

		// Return posts
		res.json(posts);
	});
});

// Make a new post in a category
router.post('/categories/:category/posts', auth, function(req, res, next) {
	var post = new Post(req.body);

	// Associate this post with the category it was added in
	post.category = req.category;
	post.author = req.payload._id;

	post.save(function(err, post) {
		// Handle errors
		if(err) { return next(err); }

		// Add this post to the posts array in this category
		req.category.posts.push(post);
		req.category.save(function(err, category) {
			// Handle errors
			if(err) { return next(err); }
		});

		// Add this post to the users posts
		User.findOne({ _id: req.payload._id }, function(err, user) {
			// Handle errors
			if(err) { return next(err); }

			// Check if the requested user exists
			if(!user) { return next(new Error("Can't find user")); }

			user.posts.push({ _id: post._id });

			user.save(function(err, user) {
				// Handle errors
				if(err) { return next(err); }

				// Return post
				res.json(post);
			});
		});
	});
});

// Filter all posts based on search criteria
router.get('/categories/:category/posts/search/title/:title', function(req, res, next) {
	Post.find({title: new RegExp(req.params.title, "i"), category: req.category}, function(err, posts) {
		// Handle errors
		if(err) { return next(err); }

		// Return posts
		res.json(posts);
	});
});

// Get a single post from a category
router.get('/categories/:category/posts/:post', function(req, res, next) {
	Post.findOne({ _id: req.post._id }).populate('author comments category').exec(function(err, post) {
		// Handle errors
		if(err) { return next(err) };

		res.json(post);
	});
});

// Update a post in a category
router.put('/categories/:category/posts/:post', auth, function(req, res, next) {
	// Make sure the user has permission to update
	if(req.post.author == req.payload._id) {
		// Update the body and update_at fields
		req.post.body = req.body.body;
		req.post.updated_at = new Date();
		req.post.title = req.body.title;
		req.post.link = req.body.link;

		req.post.save(function(err, post) {
			// Handle errors
			if(err) { return next(err); }

			// Return post
			res.json(post);
		});
	} else {
		return next(new Error("Cannot update post: Permission denied."));
	}
});

// Upvote a post
router.put('/categories/:category/posts/:post/upvote', auth, function(req, res, next) {
	req.post.toggleUpvote(req.payload, function(err, post) {
		// Handle errors
		if(err) { return next(err); }

		// Add post to the users upvoted posts
		User.findOne({ _id: req.payload._id }, function(err, user) {
			// Toggle the users upvote
			if(user.upvotedPosts.indexOf(post._id) !== -1) {
				// Remove post reference from array
				user.upvotedPosts.pull({ _id: post._id });
			} else {
				// Add post reference to array
				user.downvotedPosts.pull({ _id: post._id });
				user.upvotedPosts.push({ _id: post._id });
			}

			user.save(function(err, user) {
				// Handle errors
				if(err) { return next(err); }

				res.json(post);
			});
		});
	});
});

// Downvote a post
router.put('/categories/:category/posts/:post/downvote', auth, function(req, res, next) {
	req.post.toggleDownvote(req.payload, function(err, post) {
		// Handle errors
		if(err) { return next(err); }

		// Add post to the users downvoted posts
		User.findOne({ _id: req.payload._id }, function(err, user) {
			// Toggle the users downvote
			if(user.downvotedPosts.indexOf(post._id) !== -1) {
				// Remove post reference from array
				user.downvotedPosts.pull({ _id: post._id });
			} else {
				// Add post reference to array
				user.upvotedPosts.pull({ _id: post._id });
				user.downvotedPosts.push({ _id: post._id });
			}

			user.save(function(err, user) {
				// Handle errors
				if(err) { return next(err); }

				res.json(post);
			});
		});
	});
});

// Get all comments associated with a post
router.get('/categories/:category/posts/:post/comments', function(req, res, next) {
	// Return comments
	Comment.find({post: req.post}, function(err, comments) {
		// Handle errors
		if(err) { return next(err); }

		// Return comments
		res.json(comments);
	});
});

// Make a comment on a post in a category
router.post('/categories/:category/posts/:post/comments', auth, function(req, res, next) {
	var comment = new Comment(req.body);

	comment.post = req.post;
	comment.author = req.payload.username;

	comment.save(function(err, comment) {
		// Handle errors
		if(err){ return next(err); }

		// Add comment to the post and save it
		req.post.comments.push(comment);
		req.post.save(function(err, post) {
			// Handle errors
			if(err){ return next(err); }

			// Return comment
			res.json(comment);
		});
	});
});

// Update a comments body
router.put('/categories/:category/posts/:post/comments/:comment/body', auth, function(req, res, next) {
	req.comment.body = req.body.body;

	req.comment.updated_at = new Date();

	req.comment.save(function(err, comment) {
		// Handle errors
		if(err){ return next(err); }

		// Return the comment
		res.json(comment);
	});
});

// Upvote a comment
router.put('/categories/:category/posts/:post/comments/:comment/upvote', auth, function(req, res, next) {
	req.comment.toggleUpvote(req.payload, function(err, comment) {
		// Handle errors
		if(err) { return next(err); }

		res.json(comment);
	});
});

// Downvote a comment
router.put('/categories/:category/posts/:post/comments/:comment/downvote', auth, function(req, res, next) {
	req.comment.toggleDownvote(req.payload, function(err, comment) {
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

// Fetch a users information (comments, posts, upvoted and downvoted posts) # TODO, add upvotedPosts and downvotedPosts arrays in the User model
router.get('/users/:user/information', function(req, res, next) {
	req.user.populate('posts comments', function(err) {
		// Handle errors
		if(err){ return next(err); }

		res.json({ 
			_id: req.user._id,
			username: req.user.username,
			posts: req.user.posts,
			comments: req.user.comments,
			created_at: req.user.created_at
		});
	});
});

// Get information belonging to the user in the payload
router.get('/user/information', auth, function(req, res, next) {
	User.findOne({ _id: req.payload._id }, 'username created_at comments posts upvotedPosts downvotedPosts').populate('posts comments upvotedPosts downvotedPosts').exec(function(err, user) {
		// Handle errors
		if(err){ return next(err); }

		res.json(user);
	});
});

// Get the users saved categories, if not logged in, return a list of defaults
router.get('/user/savedCategories', auth, function(req, res, next) {
	// Return all the categories the user has saved, otherwise a few defaults
	User.findOne({ _id: req.payload._id }).populate('savedCategories').exec(function(err, user) {
		// Handle errors
		if(err){ return next(err); }

		// Return the users saved categories
		res.json(user.savedCategories);
	});
});

// Add a category to the users saved categories
router.post('/user/savedCategories', auth, function(req, res, next) {
	User.findOne({ _id: req.payload._id }, function(err, user) {
		// Handle errors
		if(err){ return next(err); }

		// Add the category to the saved categories
		user.savedCategories.push({ _id: req.body.category_id });

		user.save(function(err, user) {
			// Handle errors
			if(err){ return next(err); }

			// Populate users saved categories
			user.populate('savedCategories', function(err) {
				// Handle errors
				if(err){ return next(err); }

				// Return the users saved categories
				res.json(user.savedCategories);
			});
		});
	});
});

// Delete a category from the users saved categories
router.delete('/user/savedCategories/:savedCategory', auth, function(req, res, next) {
	// Remove the category from the users list of saved categories
	User.findOne({ _id: req.payload._id }, function(err, user) {
		// Handle errors
		if(err){ return next(err); }

		// Add the category to the saved categories
		user.savedCategories.pull({ _id: req.params.savedCategory });

		user.save(function(err, user) {
			// Handle errors
			if(err){ return next(err); }

			// Populate users saved categories
			user.populate('savedCategories', function(err) {
				// Handle errors
				if(err){ return next(err); }

				// Return the users saved categories
				res.json(user.savedCategories);
			});
		});
	});
});

module.exports = router;
