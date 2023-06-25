import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { createUser, getAllUsers, getUserById, loginUser, updateUserList } from '../../lib/dal';
import { getConnectedDatabase } from '@/lib/db';
require('dotenv').config();
import { ObjectID } from 'mongodb';

// Initialize the cors middleware
const cors = initMiddleware(
  Cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);

export default async function handler(req, res) {
  await cors(req, res);

  const userId = req.query.userId || req.query.id;
  console.log("api/users, userId: " + userId);


  switch (req.method) {
    case 'POST':
      if (req.body.action === 'login') {
        try {
          const user = await loginUser(req.body.email, req.body.password);
          if (user) {
            res.status(200).json({ message: 'Login successful' });
          } else {
            res.status(401).json({ message: 'Invalid email or password' });
          }
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Error logging in' });
        }
      } else {
        try {
          const newUser = await createUser({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
          });
          res.status(200).json(newUser);
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Error creating user' });
        }
      }
      break;
    case 'GET':
      if (req.query.action === 'users') {
        try {
          const user = await getUserById(ObjectID(userId));
          res.status(200).json(user);
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Error getting user' });
        }
      } else {
        try {
          const { db } = await getConnectedDatabase();
          const allUsers = await getAllUsers(db);
          res.status(200).json(allUsers);
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Error getting users' });
        }
      }
      break;
      case 'PUT':
        if (req.query.action === 'shoppingList') {
          try {
            // Check that shoppingList is not null
            if (!req.body.shoppingList) {
              res.status(400).json({ message: 'shoppingList property missing in request' });
              return;
            }
            const updatedUser = await updateUserList(ObjectID(userId), req.body.shoppingList);
            // Check that updateUserList does not return null
            if (!updatedUser) {
              res.status(500).json({ message: 'User update failed' });
              return;
            }
            if (updatedUser) {
              res.status(200).json(updatedUser);
            } else {
              res.status(404).json({ message: 'User not found' });
            }
          } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error updating user shoppingList' });
          }
      } else {
        try {
          const updateResult = await updateUserBalance(userId, req.body.amount);
          if (updateResult.success) {
            res.status(200).json({ message: 'User balance updated successfully' });
          } else {
            res.status(404).json({ message: updateResult.message });
          }
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Error updating user balance' });
        }
      }
      break;
    case 'DELETE':
      res.status(405).json({ message: 'Method not allowed' });
      break;
    default:
      res.status(400).json({ message: 'Bad request' });
  }
}
