import React, { useState, useContext } from 'react';
import { UserContext } from '../lib/usercontext';
import styles from '../styles/Login.module.css';
require('dotenv').config();
import { useRouter } from 'next/router';
import { UserContextProvider } from '../lib/usercontext';

export default function Login() {
  const Router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { user, setUser } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!emailValid) {
      setMessage('Please enter a valid email.');
      setShowError(true);
      return;
    }

    if (!passwordValid) {
      setMessage('Password should be at least 8 characters.');
      setShowError(true);
      return;
    }

    setLoading(true);

    try {
      const { user } = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        
      }).then((res) => {
        if (res.status !== 200) {
          setShowError(true);
          throw new Error(res.statusText);
        }
        return res.json();
      });

      const capitalizeFirstLetter = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
      };

      setUser(user);

      setMessage(`Success! Welcome, ${capitalizeFirstLetter(user.name)}.`);
      setShowSuccess(true);
    } catch (error) {
      setMessage(`User Email and Password could not be verified`);
      setShowError(true);
    } finally {
      setLoading(false);
      setEmail(''); // Clear the email input
      setPassword(''); // Clear the password input
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailValid(validateEmail(e.target.value));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordValid(e.target.value.trim().length >= 8);
  };

  const handleCloseErrorPopup = () => {
    setShowError(false);
  };

  const handleCloseSuccessPopup = () => {
    Router.push('/shoppingList');
    setShowSuccess(false);
  };

  return (
    <UserContextProvider>
      <div className={styles.container}>
        <h1>Login</h1>

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            className={emailValid ? '' : 'invalid'}
          />
          <br />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            className={passwordValid ? '' : 'invalid'}
          />
          <br />
          <button type="submit">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {showError && (
          <div className={styles.popup}>
            <div className={styles.popup_body}>
              <h3>Error</h3>
              <p>{message}</p>
              <button
                className="btn btn-light"
                onClick={handleCloseErrorPopup}
              >
                Close
              </button>
            </div>
          </div>
        )}
        {showSuccess && (
          <div className={styles.popup}>
            <div className={styles.popup_body}>
              <h3>Success</h3>
              <p>{message}</p>
              <button
                className="btn btn-light"
                onClick={handleCloseSuccessPopup}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </UserContextProvider>
  );
}
