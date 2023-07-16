import mongoose from 'mongoose';
require('dotenv').config();
import User from './UserModel';

// Create a new user
export async function createUser({ name, email, password, color }) {
  try {
    const user = new User({
      name,
      email,
      password,
      color,
      shoppingList: [],
    });
    await user.save();
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user');
  }
}

// Get a user by ID
export async function getUserById(userId) {
  try {
    const user = await User.findById(userId); // Use UserModel.findById instead of User.findById
    return user;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    throw new Error('Failed to get user by ID');
  }
}

// Get all users
export async function getAllUsers() {
  try {
    const users = await User.find();
    return users.map(user => ({
      ...user.toObject(),
      _id: user._id.toString(),
    }));
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw new Error('Failed to fetch all users');
  }
}

// Login a user
export async function loginUser(email, password) {
  try {
    const user = await User.findOne({ email, password });
    return user;
  } catch (error) {
    console.error('Error logging in user:', error);
    throw new Error('Failed to log in user');
  }
}

export async function updateUserList(userId, shoppingList) {
  try {
    const user = await getUserById(userId);

    if (!user) {
      console.error('User not found');
      throw new Error('User not found');
    }

    shoppingList = shoppingList.map(item => ({ name: item, userId: userId }));

    user.shoppingList = user.shoppingList.concat(shoppingList); // Concatenate the arrays

    await user.save();
    console.log('List updated successfully.');
  } catch (error) {
    console.error('Error updating shoppingList:', error);
    throw new Error('Failed to update shoppingList.');
  }
}
