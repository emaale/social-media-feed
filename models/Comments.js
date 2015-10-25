var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
  body: { type: String, default: "" },
  author: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }
});

CommentSchema.methods.upvote = function(cb) {
  this.upvotes += 1;
  this.save(cb);
};

CommentSchema.methods.downvote = function(cb) {
  this.upvotes -= 1;
  this.save(cb);
};

CommentSchema.methods.upvote = function(user, removeUpvote, cb) {
  // Clear previous votes made by the user
  this.clearUserVotes(user);

  if(!removeUpvote) {
    this.upvotes.push({ _id: user._id });
  }
  
  this.save(cb);
};

CommentSchema.methods.downvote = function(user, removeDownvote, cb) {
  // Clear previous votes made by the user
  this.clearUserVotes(user);

  if(!removeDownvote) {
    this.downvotes.push({ _id: user._id });
  }
  
  this.save(cb);
};

CommentSchema.methods.clearUserVotes = function(user) {
  // Remove user from upvotes and downvotes
  this.upvotes.pull({ _id: user._id });
  this.downvotes.pull({ _id: user._id });
};

mongoose.model('Comment', CommentSchema);