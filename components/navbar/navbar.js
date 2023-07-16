'use client';
import React, { useContext, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './navbar.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function SignButton() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(user !== null);
  }, [user]);

  const handleLogOut = () => {
    setUser(null);
    setIsLoggedIn(false);
    const popup = document.createElement('div');
    popup.className = `${styles.popup}`;
    popup.innerHTML = `<span>You are logged off</span>`;
    document.body.appendChild(popup);
    setTimeout(() => {
      document.body.removeChild(popup);
      router.push('/');
    }, 1000);
  };

  const handleLogIn = () => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  };

  return (
    <>
    <div className={styles.item}>
      {isLoggedIn ? (
        <Link href="/home">
          <span href="logout" className={styles.link} onClick={handleLogOut}>
            Log Off
          </span>
        </Link>
      ) : null}
    </div>
    </>
  );
}

export default function NavBar() {
  const router = useRouter();
  const isLoginPage = router.pathname === '/login';

  const handleNavbarToggle = () => {
    const navbar = document.getElementById('navbarNav');
    navbar.classList.toggle('show');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-gradient fixed-top">
      <div className="container-fluid" style={{ backgroundColor: 'white', marginTop: '-10px' }}>
        <li className={styles.brand}>
          <Link href="/">
            <span className={styles.link}>
              Shopping List
            </span>
          </Link>
        </li>

        <button
          className="navbar-toggler"
          type="button"
          onClick={handleNavbarToggle}
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto" style={{ marginLeft: 0 }}>
            <li className={styles.item}>
              <Link href="/login">
                <span className={styles.link} style={{ whiteSpace: 'nowrap', color: 'white' }}>
                  Log In
                </span>
              </Link>
            </li>
            <li className={styles.item}>
              <Link href="/createaccount">
                <span className={styles.link} style={{ whiteSpace: 'nowrap', color: 'white' }}>
                  Create Account
                </span>
              </Link>
            </li>

       
          </ul>
        </div>
      </div>
    </nav>
  );
}
