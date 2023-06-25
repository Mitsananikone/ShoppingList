import React, { useState, useEffect, useMemo, createContext } from 'react';
import PropTypes from 'prop-types';

export const UserContext = React.createContext();

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('/api/users')
      .then(response => response.json())
      .then(data => setUser(data))
      .catch(error => console.log(error));
  }, []);

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };



  return (
    <>
      <UserContext.Provider value={{ user, updateUser }}>
        {children}
      </UserContext.Provider>
      </>
  );
}

UserContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};


