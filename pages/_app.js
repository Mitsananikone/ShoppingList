import '@/styles/globals.css';
import React, { useState, useEffect } from 'react';
import NavBar from '../components/navbar/navbar';
import { Provider } from 'react-redux';
import store from '../redux/store';


export default function App({ Component, pageProps }) {
  const [user, setUser] = useState(null);

  return (
    <Provider store={store}>
      <NavBar />
      {/* <div className='AppEntry' style={{width: '100%', display: 'flex', alignItems: 'center', justifyItems: 'center'}}> */}
      <div > 
        <Component {...pageProps} />
      </div>
    </Provider>
  );
}

