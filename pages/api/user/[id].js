import User from '../../../lib/UserModel';

export default async (req, res) => {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const user = await User.findById(id);

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error fetching user data' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const result = await User.deleteOne({ _id: id });

      if (result.deletedCount === 0) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error deleting user' });
    }
  } else if (req.method === 'PUT') {
    const { id } = req.query;      
      try {
        const user = await User.findById(id);
  
        if (!user) {
          res.status(404).json({ error: 'User not found' });
          return;
        }
  
        // Update the user's shopping list
        const { shoppingList } = req.body;
        user.shoppingList = shoppingList;
        await user.save();
  
        res.status(200).json(user);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating user shopping list' });
      }
    } else {
      // Handle any other HTTP method
      res.setHeader('Allow', ['GET', 'DELETE', 'PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  };