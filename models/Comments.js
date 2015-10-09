var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
  body: { type: String, default: "" },
  author: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  upvotes: {type: Number, default: 0},
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

mongoose.model('Comment', CommentSchema);