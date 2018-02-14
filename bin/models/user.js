// Importing needed modules
import mongoose from 'mongoose'

// Setting needed constants
const Schema = mongoose.Schema

const UserSchema = new Schema({
  username: String,
  password: String,
  email: String,
  firstName: String,
  lastName: String,
  role: {
    type: String,
    enum: ['user', 'admin', 'superadmin', 'kicked', 'banned'],
    default: 'user'
  },

  facebook : {
    id: String,
    token: String,
    name: String
  },
  twitter: {
    id: String,
    token: String
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;