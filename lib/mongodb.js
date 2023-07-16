import mongoose from 'mongoose';
require('dotenv').config();

// Variable to track the connection status
let isConnected = false;

/**
 * Function to connect to the MongoDB database
 * If already connected, return the existing connection
 * If not connected, establish a new connection and store the connection status
 * @returns {Promise<object>} The MongoDB connection object
 */
export async function connectToDatabase() {
  try {
    if (isConnected) {
      return { db: mongoose.connection };
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 10000,
    });

    // Handle connection error
    mongoose.connection.on('error', (err) => {
      console.log(err);
      process.exit();
    });

    isConnected = true;
    return { db: mongoose.connection };
  } catch (error) {
    console.error(error);
    throw new Error('Failed to connect to the database');
  }
}

/**
 * Function to close the MongoDB database connection
 * If connected, disconnect from the database and update the connection status
 */
export async function closeDatabaseConnection() {
  try {
    if (isConnected) {
      await mongoose.disconnect();
      isConnected = false;
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to close the database connection');
  }
}

export default mongoose;
