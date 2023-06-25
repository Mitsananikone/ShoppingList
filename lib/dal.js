import mongoose from 'mongoose';
require('dotenv').config();
import { UserContext } from './usercontext';
import { useContext } from 'react';
import User from './UserModel';

// Create a new user
export async function createUser({ name, email, password }) {
  try {
    const user = new User({
      name,
      email,
      password,
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
    console.log("DAL userid: " + userId);
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

    user.shoppingList = user.shoppingList.concat(shoppingList); // Concatenate the arrays

    await user.save();
    console.log('List updated successfully.');
  } catch (error) {
    console.error('Error updating shoppingList:', error);
    throw new Error('Failed to update shoppingList.');
  }
}
