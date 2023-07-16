import mongoose from 'mongoose';
import { connectToDatabase } from './mongodb';

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  color: String,
  shoppingList: [{
    item: {
      name: String,
      userId: mongoose.Schema.Types.ObjectId,
    },
  }]
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export async function initializeDatabaseConnection() {
  await connectToDatabase();
}

export default User;
