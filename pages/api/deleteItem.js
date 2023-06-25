import { connectToDatabase } from '../../lib/mongodb';
import User from '../../lib/UserModel';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ msg: 'Method not allowed' });
  }

  const { userId, item } = req.body;

  if (!userId || !item) {
    return res.status(400).json({ message: 'User ID and item are required' });
  }

  // Convert userId to ObjectId
  const userIdObj = new mongoose.Types.ObjectId('6498404dfbccd7177539fab7');

  try {
    await connectToDatabase();

    // Find the user by ID
    let user = await User.findById(userIdObj);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove the item from the user's shopping list
    user.shoppingList = user.shoppingList.filter(i => i !== item);

    // Save the updated user
    await user.save();

    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}
