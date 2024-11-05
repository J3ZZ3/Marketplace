

import React, { useEffect, useState } from 'react';
import './styles/Footer.css';

function Footer() {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Retrieve user data from localStorage
    const userData = JSON.parse(localStorage.getItem('loggedInUser'));
    if (userData && userData.name) {
      setUserName(userData.name);
    }
  }, []);

  return (
    <footer className="footer">
      {userName ? (
        <p>Welcome, {userName}</p>
      ) : (
        <p>No user logged in</p>
      )}
    </footer>
  );
}

export default Footer;
