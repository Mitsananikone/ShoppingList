import React from 'react';
import { useDispatch } from 'react-redux';
import { updateUser } from '../redux/slices/userSlice';
import styles from '../styles/Login.module.css';
import { useRouter } from 'next/router';

const Login = () => {
  const dispatch = useDispatch();
  const Router = useRouter();

  const userCredentials = [
    {
      _id: '64b4205d63c7ac46f8fed8e3',
      name: 'Dad',
      email: 'dad@dad.com',
      password: 'dddddddd',
      shoppingList: [],
      color: 'orangered' // Add color property to each user
    },
    {
      _id: '64b4206763c7ac46f8fed8e5',
      name: 'Mom',
      email: 'mom@mom.com',
      password: 'mmmmmmmm',
      shoppingList: [],
      color: 'limegreen' // Add color property to each user
    },
    {
      _id: '64b4207263c7ac46f8fed8e7',
      name: 'Tim',
      email: 'tim@tim.com',
      password: 'tttttttt',
      shoppingList: [],
      color: 'cornflowerblue' // Add color property to each user
    },
    {
      _id: '64b4207b63c7ac46f8fed8e9',
      name: 'Mit',
      email: 'mit@mit.com',
      password: 'mmmmmmmm',
      shoppingList: [],
      color: 'gold' // Add color property to each user
    }
  ];

  const handleLogin = (event) => {
    const clickedUser = userCredentials.find(
      (user) => user.name.toLowerCase() === event.currentTarget.id
    );
    if (clickedUser) {
      dispatch(updateUser(clickedUser));
      Router.push({
        pathname: '/shoppingList',
        query: { id: clickedUser._id },
      });
    }
  };

  return (
    <div className={styles.profile_container}>
      <h1>LOGIN</h1>
      <div className={styles.profileDad} id="dad" onClick={handleLogin}>
        <img src="/images/dad.jpg" alt="Dad's profile picture" />
        <span>Dad</span>
      </div>
      <div className={styles.profileMom} id="mom" onClick={handleLogin}>
        <img src="/images/mom.jpg" alt="Mom's profile picture" />
        <span>Mom</span>
      </div>
      <div className={styles.profileTim} id="tim" onClick={handleLogin}>
        <img src="/images/tim.jpg" alt="Tim's profile picture" />
        <span>Tim</span>
      </div>
      <div className={styles.profileMit} id="mit" onClick={handleLogin}>
        <img src="/images/mit.jpg" alt="Mit's profile picture" />
        <span>Mit</span>
      </div>
    </div>
  );
};

export default Login;
