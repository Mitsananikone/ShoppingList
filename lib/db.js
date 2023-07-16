import { connectToDatabase } from './mongodb';

let connectedDatabase = null;  // Variable to store the connected database instance

export async function getConnectedDatabase() {
  if (!connectedDatabase) {
    connectedDatabase = await connectToDatabase();
  }
  return connectedDatabase;
}
