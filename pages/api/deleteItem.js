import { connectToDatabase } from '../../lib/mongodb';
import User from '../../lib/UserModel';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ msg: 'Method not allowed' });
  }

  const {  item } = req.body;

  if (!item || !item.userId || !item.name) {
    return res.status(400).json({ message: 'User ID and item name are required' });
  }

  // Extract userId and itemName from item
  const { name, userId} = item;

  // Convert userId to ObjectId
  const userIdObj = new mongoose.Types.ObjectId(userId);

  try {
    await connectToDatabase();

    // Find the user by ID
    let user = await User.findById(userIdObj);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the index of the item in the shopping list
    let itemIndex = user.shoppingList.findIndex(i => i.name === name && i.userId.toString() === userId);

    // Check if the item exists in the user's shopping list
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in the user\'s shopping list' });
    }

    // Remove the item from the user's shopping list
    user.shoppingList.splice(itemIndex, 1);

    // Save the updated user
    await user.save();

    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}
