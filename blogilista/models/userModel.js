const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  userName: {type: String, unique: true},
  name: {type: String},
  pw: {type: String},
  blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }]
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.pw;
  }
});

userSchema.plugin(uniqueValidator);

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;