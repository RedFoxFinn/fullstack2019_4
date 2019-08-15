const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, minLength: 3, required: true },
  author: { type: String, minLength: 3 },
  url: { type: String, minLength: 10 },
  likes: { type: Number },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const BlogModel = mongoose.model('Blog', blogSchema);

module.exports = BlogModel;