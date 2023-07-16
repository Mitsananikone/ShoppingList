import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/ShoppingList.module.css';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useDispatch } from 'react-redux';
import { updateUser } from '../redux/slices/userSlice';
require('dotenv').config();

const ShoppingList = ({ user, items, color, id }) => {
  const [shoppingList, setShoppingList] = useState(items || []);
  const [input, setInput] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const dispatch = useDispatch();

  const router = useRouter();

  const fetchShoppingList = async () => {
    try {
      if(!id) {
        throw new Error('ID is undefined');
      }
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/${id}`);

      if (response.ok) {
        const { shoppingList } = await response.json();
        setShoppingList(shoppingList || []);
      } else {
        throw new Error('Failed to fetch shopping list');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAllItems = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getItems`);

      if (response.ok) {
        const { items } = await response.json();
        setShoppingList(items || []);
      } else {
        throw new Error('Failed to fetch all items');
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (router.pathname === '/shoppingList') {
      fetchAllItems();
    }
  }, [router.pathname]); 


  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/addItem`, {
        method: 'POST',
        body: JSON.stringify({
          item: {
            name: input,
            userId: id,
          },
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();

      if (response.ok) {
        setShoppingList(prevList => [...prevList, {name: input, userId: id}]);
        setInput("");
      } else {
        throw new Error('Failed to add item', data);
      }
    } catch (error) {
      console.error(`An error occurred while adding the item: ${error.message}`);
      setInput("");
    }
  };
  

  const handleDeleteItem = async (item) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/deleteItem`, {
        method: 'POST',
        body: JSON.stringify({
           item: {
            name: item.name,
            userId: id,
          },
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        setUploadStatus('Item deleted successfully!');
        setShoppingList(prevList => prevList.filter(i => i.name !== item.name));  // filter based on name
        dispatch(updateUser({ ...user, shoppingList: shoppingList.filter((i) => i.name !== item.name) }));
  
        // Display the alert here instead of using modalContent state
        alert(`${item.name.charAt(0).toUpperCase() + item.name.slice(1)} has been removed`);
      } else {
        alert(`${item.name.charAt(0).toUpperCase() + item.name.slice(1)} was added by another user.  Cannot Delete  `);
        throw new Error('Failed to delete item');
      }
    } catch (error) {
      setUploadStatus(`An error occurred while deleting the item: ${error.message}`);
      console.error(error);
      setTimeout(() => {
        setUploadStatus("");
      }, 3000);  // 3000ms = 3 seconds
    }
  };
  

  

  return (

    <div className={styles.container} style={{ backgroundColor: color || 'blue' }}>
      <div className={styles.mainContainer}>
        <div className={styles.list_container}>
          <ul className={styles.shoppingList}>
            {/* {console.log(shoppingList.map(item => [typeof item, item]))} */}
            {shoppingList.map((item, index) => (
  <li key={index} className={styles.shoppingItem}>
    {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
    <div className={styles.cartControls}>
      <div className={styles.removeItem} onClick={() => handleDeleteItem(item)}>
        <TrashIcon className={styles.trashcan} />
      </div>
    </div>
  </li>
))}
          </ul>
        </div>
      </div>

      {/* {items && ( */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.form_inner}>
          <input type="text" value={input} onChange={handleInputChange} className={styles.input} />
          <button type="submit" id={styles.enter}>Add</button>
        </div>
      </form>
      {/* )} */}
    </div>
  );
}


export default ShoppingList;


export async function getServerSideProps(context) {
  try {
    // Fetch the user ID from the query parameters
    const { id } = context.query;

    // Fetch the user data from the API using the user ID
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/${id}`);
    const user = await response.json();

    // Extract the shopping list from the user data
    const items = user.shoppingList || [];

    // Extract the color from the user object
    const color = user ? user.color : 'gray';

    // Pass the shoppingList, user, and color as props to the component
    return {
      props: {
        items,
        user,
        color,
        id,
      },
    };
  } catch (error) {
    console.error('Error fetching user data:', error);

    // Return an empty shoppingList, user, and color if there's an error
    return {
      props: {
        items: [],
        user: null,
        color: 'blue',
        id: null,
      },
    };
  }
}
