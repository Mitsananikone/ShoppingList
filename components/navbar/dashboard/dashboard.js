import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../../lib/dal';

export const DashBoard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const users = await getAllUsers();
        setUsers(users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }

    fetchUsers();
  }, []);

  return (
    <div className="dashboard">
      <h2>Users</h2>
      {users.map((user) => (
        <div key={user._id}>
          <p>ID: {user._id}</p>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Password: {user.password}</p>
          <p>Shopping List: {user.shoppingList.join(', ')}</p>
          <hr />
        </div>
      ))}
    </div>
  );
};
