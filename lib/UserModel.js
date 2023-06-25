import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  shoppingList: [String], // Updated property name to "list"
});

let User;

try {
  // Try to fetch the existing model
  User =  mongoose.model('user');
} catch {
  // If the model doesn't exist, create it
  User =  mongoose.model('user', userSchema);
}

export default User;
