import React, { useContext, useEffect } from 'react';
import { connectToDatabase } from '../lib/mongodb';
import Login from './login';
import ShoppingList from './shoppingList';
require('dotenv').config();

export default function App({ users }) {

  return (
    <div className="root" style={{width: '100%'}}>
        <Login/>
        <ShoppingList/>
    </div>
  );
}

// export async function getStaticProps() {
//   try {
//     const { db } = await connectToDatabase();
//     const users = await db.collection('users').find().toArray();
//     const parsedUsers = JSON.parse(JSON.stringify(users));

//     return { 
//       props: { users: parsedUsers },
//       revalidate: 1, // In seconds
//     };
//   } catch (error) {
//     console.error(error);
//     return { 
//       props: { users: parsedUsers},
//       revalidate: 1,
//    };
//   }
// }

