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

CommentSchema.methods.toggleUpvote = function(user, cb) {
  // Make sure we remove potential downvotes
  this.downvotes.pull({ _id: user._id });
  
  // Check whether we want to add or remove the upvote
  if(this.upvotes.indexOf(user._id) !== -1) {
    // Remove user reference from array
    this.upvotes.pull({ _id: user._id });
  } else {
    // Add user reference to array
    this.upvotes.push({ _id: user._id });
  }

  this.save(cb);
};

CommentSchema.methods.toggleDownvote = function(user, cb) {
  // Make sure we remove potential upvotes
  this.upvotes.pull({ _id: user._id });

  // Check whether we want to add or remove the downvote
  if(this.downvotes.indexOf(user._id) !== -1) {
    // Remove user reference from array
    this.downvotes.pull({ _id: user._id });
  } else {
    // Add user reference to array
    this.downvotes.push({ _id: user._id });
  }
  
  this.save(cb);
};

mongoose.model('Comment', CommentSchema);