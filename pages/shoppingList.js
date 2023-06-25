import { useState, useContext, useEffect } from 'react';
import styles from '../styles/ShoppingList.module.css';
import { UserContext } from '../lib/usercontext';
import { ArrowPathIcon } from '@heroicons/react/20/solid';
import { TrashIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

const ShoppingList = ({ items }) => {
  const { user, updateUser } = useContext(UserContext);
  const [shoppingList, setShoppingList] = useState([]);
  const [input, setInput] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [seconds, setSeconds] = useState(3);
  const [modalContent, setModalContent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchShoppingList = async () => {
    try {
      const userId = '6498404dfbccd7177539fab7';
      // const userId = user._id;
      if (!userId) {
        throw new Error('User ID not found');
      }

      const response = await fetch(`/api/users/${userId}`);  // fetch Mit's user._id
      if (response.ok) {
        const userData = await response.json();
        setShoppingList(userData.shoppingList || []);
        console.log(userData)
      } else {
        throw new Error('Failed to fetch shopping list');
      }
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    fetchShoppingList();
  }, []);


  const handleInputChange = (e) => {
    setInput(e.target.value);
  };



  const handleSubmit = async (e) => {
    e.preventDefault();


    const userId = '6498404dfbccd7177539fab7';  // replace with the correct user ID later

    try {
      const response = await fetch('/api/addItem', {
        method: 'POST',
        body: JSON.stringify({
          userId: userId,
          item: input,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setShoppingList(prevList => [...prevList, input]);

        updateUser({ ...user, shoppingList: user ? user.shoppingList.filter(i => i !== item) : [] });

        setInput("");
      } else {

        throw new Error('Failed to add item');
        setInput("");
      }
    } catch (error) {

      console.error(`An error occurred while adding the item: ${error.message}`);
      setInput("");
    }
  };

  const handleDeleteItem = async (item) => {
    try {
      const userId = '6498404dfbccd7177539fab7';  // replace with the correct user ID later

      const response = await fetch('/api/deleteItem', {
        method: 'POST',
        body: JSON.stringify({
          userId: userId,
          item: item,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setUploadStatus('Item deleted successfully!');

        setShoppingList(prevList => prevList.filter(i => i !== item));

        updateUser({ ...user, shoppingList: user ? user.shoppingList.filter(i => i !== item) : [] })

        console.log("shoppingList: " + JSON.stringify(shoppingList));

        // user.shoppingList = shoppingList;
        user.save;

        // Display the alert here instead of using modalContent state
        alert(`${item.charAt(0).toUpperCase() + item.slice(1)} has been removed`);

      } else {
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
    <div className={styles.container}>



      <div className={styles.mainContainer}>
        <div className={styles.list_container}>
          <ul className={styles.shoppingList}>
            {items.map((item) => (
              <li key={item._id} className={styles.shoppingItem}>
                {item.name}
                <div className={styles.cartControls}>
                  <div className={styles.removeItem} onClick={() => handleDeleteItem(item)}> <TrashIcon className={styles.trashcan}/> </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>




      <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.form_inner}>
       
       

          <input type="text" value={input} onChange={handleInputChange} className={styles.input} />
          <button type="submit" id={styles.enter}>Add</button>
        </div>
      </form>



    </div>
  );
}

export default ShoppingList;


{/* <button type="button" className={styles.refresh} onClick={() => fetchShoppingList()}>
<ArrowPathIcon className="h-10 w-10" style={{ fill: 'black', marginTop: '1em', marginBottom: '1em' }} />
</button> */}

export async function getServerSideProps() {
  try {
    // Fetch the items from the MongoDB database
    const response = await axios.get('/api/users');
    const users = response.data;
    const items = users.map((user) => user.shoppingList).flat();

    // Pass the items as props to the component
    return {
      props: {
        items,
      },
    };
  } catch (error) {
    console.error('Error fetching items:', error);

    // Return an empty items array if there's an error
    return {
      props: {
        items: [],
      },
    };
  }
}
