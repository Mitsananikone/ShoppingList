import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { createUser, getAllUsers } from '../../lib/dal';
import { getConnectedDatabase } from '../../lib/db';
require('dotenv').config();

// Initialize the cors middleware
const cors = initMiddleware(
  Cors({
    methods: ['GET', 'POST', 'OPTIONS'], // Allowed methods
  })
);

export default async function handler(req, res) {
  await cors(req, res);

  if (req.method === 'POST') {
    try {
      const { name, email, password } = req.body;

      // Create a new user
      const newUser = await createUser({ name, email, password });

      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.status(201).json(newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: 'Error creating user', error: error.message });
    }
  } else if (req.method === 'GET') {
    try {
      const { db } = await getConnectedDatabase();

      // Get all users
      const allUsers = await getAllUsers(db);

      res.setHeader('Access-Control-Allow-Origin', '*');
      res.status(200).json({ users: allUsers });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
  } else {
    // Handle invalid HTTP methods
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
