var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
	title: {type: String, required: true},
	link: String,
	body: {type: String, default: ""},
	author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now },
	upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
	category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
});

PostSchema.methods.upvote = function(user, removeUpvote, cb) {
	// Clear previous votes made by the user
	this.clearUserVotes(user);

	if(!removeUpvote) {
		this.upvotes.push({ _id: user._id });
	}
	
	this.save(cb);
};

PostSchema.methods.downvote = function(user, removeDownvote, cb) {
	// Clear previous votes made by the user
	this.clearUserVotes(user);

	if(!removeDownvote) {
		this.downvotes.push({ _id: user._id });
	}
	
	this.save(cb);
};

PostSchema.methods.clearUserVotes = function(user) {
	// Remove user from upvotes and downvotes
	this.upvotes.pull({ _id: user._id });
	this.downvotes.pull({ _id: user._id });
};

mongoose.model('Post', PostSchema);