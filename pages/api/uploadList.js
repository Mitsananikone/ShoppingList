import { getUserById, updateUserList } from '../../lib/dal';
import { ObjectId } from 'mongodb';
import { useContext } from 'react';
import { UserContext } from '../../lib/usercontext';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { userId, shoppingList } = req.body;

  const UserID = new ObjectId('6498404dfbccd7177539fab7');

  try {
    const user = await getUserById(UserID);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updatedShoppingList = user.shoppingList.concat(shoppingList);
    user.shoppingList = updatedShoppingList;
    await user.save();

    // Update UserContext with the updated shoppingList
    const { updateUser } = useContext(UserContext);
    updateUser({ ...user.toObject(), shoppingList: updatedShoppingList });

    return res.status(200).json({ message: 'List updated successfully' });
  } catch (error) {
    console.error('Error updating shoppingList:', error);
    return res.status(500).json({ message: 'Failed to update shoppingList' });
  }
}
