var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);

var CategorySchema = mongoose.Schema({
	name: {type: String, unique: true, lowercase: true},
	description: {type: String, default: ""},
	owner_id: String,
	created_at: { type: Date, default: Date.now },
  	updated_at: { type: Date, default: Date.now },
	posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
	moderators: [String]
});

CategorySchema.plugin(deepPopulate, { 
	whitelist: [
		'posts.author',
		'posts'
	], 
});

mongoose.model('Category', CategorySchema);