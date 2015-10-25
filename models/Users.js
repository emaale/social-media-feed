var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var UserSchema = new mongoose.Schema({
	username: {type: String, lowercase: true, unique: true},
  	hash: String,
  	salt: String,
  	created_at: { type: Date, default: Date.now },
  	updated_at: { type: Date, default: Date.now },
  	comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  	posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  	savedCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  	upvotedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  	downvotedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
});

UserSchema.methods.setPassword = function(password){
	// Create salt
  	this.salt = crypto.randomBytes(16).toString('hex');

  	// Create hash
  	this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

UserSchema.methods.validPassword = function(password) {
	// Create hash
  	var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');

  	// Compare the hashes to confirm if password is correct
  	return this.hash === hash;
};

UserSchema.methods.generateJWT = function() {
  	// Set the expiration date in days
  	var today = new Date();
  	var exp = new Date(today);
  	exp.setDate(today.getDate() + 60);

  	// Return the signature
  	return jwt.sign({
    	_id: this._id,
    	username: this.username,
    	exp: parseInt(exp.getTime() / 1000),
  	}, 'SECRET');
};

mongoose.model('User', UserSchema);