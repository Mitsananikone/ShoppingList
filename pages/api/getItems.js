import { connectToDatabase } from '../../lib/mongodb';
import User from '../../lib/UserModel';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ msg: 'Method not allowed' });
  }

  try {
    await connectToDatabase();

    // Find all users
    let users = await User.find();

    // Concatenate all users' shopping lists into one list
    let allItems = users.reduce((items, user) => items.concat(user.shoppingList), []);

    res.status(200).json({ items: allItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}
